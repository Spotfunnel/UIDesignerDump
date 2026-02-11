import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'
import { MOCK_CALLS } from '@/lib/temp-mock-data';

// Re-export Call type from lib/supabase for backward compatibility
export type Call = {
    id: string
    created_at: string
    squad_id?: string
    customer_phone: string
    call_id?: string
    caller_name?: string
    booking_status?: string
    summary?: string
    transcript?: string
    intent?: string
    resolution_status?: string
    verified?: string
    date?: string
    called_at?: string
    customer_address?: string
    customer_email?: string
    archived?: boolean
    transfer_status?: string
    request_status?: string
    status?: 'incoming' | 'completed' | 'booked'
    duration?: number
    recording_url?: string
    analysis?: string
    labels?: string[]
    cost?: number
    business_id?: string
    outcome?: string
    timestamp?: string
    appointment_date?: string  // When the appointment is scheduled for
    appointment_time?: string  // Time of the appointment
}


export type DashboardEvent = {
    id: string
    type: string // Allow any string from DB
    title: string
    details: string
    timestamp: Date
}

type DataContextType = {
    calls: Call[]
    events: DashboardEvent[]
    isLoading: boolean
    error: string | null
    refreshData: () => Promise<void>
    pendingJobs: number
    revenue: number
    updateCall: (id: string, updates: Partial<Call>) => Promise<void>
    archiveCalls: (ids: string[]) => Promise<void>
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: React.ReactNode }) {
    const [calls, setCalls] = useState<Call[]>([])
    const [events, setEvents] = useState<DashboardEvent[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const convertCallsToEvents = (callsData: Call[]): DashboardEvent[] => {
        return callsData.map(call => {
            // Use ACTUAL database values, no fictional labels
            const type = call.booking_status || 'unknown';
            const title = call.intent ?
                call.intent.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') :
                'New Interaction';

            return {
                id: call.id,
                type,
                title,
                details: `${call.customer_phone}${call.caller_name ? ' • ' + call.caller_name : ''}`,
                timestamp: new Date(call.created_at)
            }
        }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    }

    const fetchData = async () => {
        try {
            setIsLoading(true)
            setError(null)

            // Fetch calls from last 7 days
            const sevenDaysAgo = new Date()
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

            const { data: callsData, error: callsError } = await supabase
                .from('calls')
                .select('*')
                .gte('created_at', sevenDaysAgo.toISOString())
                .order('created_at', { ascending: false })

            if (callsError) throw callsError

            // MERGE & NORMALIZE: Combine real database calls with Mock data
            // Map inconsistent DB fields to UI-expected fields
            const normalizedDBItems = (callsData || []).map((c: any) => ({
                customer_phone: c.customer_phone || c.caller_number || 'Unknown',
                caller_name: c.caller_name || 'Inbound Call',
                intent: c.intent || c.outcome || 'Review Needed',
                booking_status: c.booking_status || c.outcome || 'Callback Required',
                date: c.date || (c.created_at ? new Date(c.created_at).toLocaleDateString() : 'N/A'),
                called_at: c.called_at || (c.created_at ? new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'),
                summary: c.summary || 'Database record',
                transcript: c.transcript || 'No transcript available.',
                ...c
            }));

            const combinedCalls = ([...normalizedDBItems, ...MOCK_CALLS] as Call[]).sort((a, b) => {
                const dateA = new Date(a.created_at).getTime();
                const dateB = new Date(b.created_at).getTime();
                return dateB - dateA; // Descending order (newest first)
            });

            setCalls(combinedCalls)
            setEvents(convertCallsToEvents(combinedCalls))
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data'
            setError(errorMessage)
            toast.error('Error loading data', { description: errorMessage })
            console.error('Error fetching data:', err)
            // Fallback to mock data on error
            setCalls(MOCK_CALLS)
            setEvents(convertCallsToEvents(MOCK_CALLS))
        } finally {
            setIsLoading(false)
        }
    }

    const updateCall = async (id: string, updates: Partial<Call>) => {
        try {
            // Map UI updates back to DB fields if necessary (especially handling the outcome/intent field type mismatch)
            const dbUpdates: any = { ...updates };
            if (updates.intent) dbUpdates.outcome = updates.intent;
            if (updates.booking_status) dbUpdates.booking_status = updates.booking_status;

            const { error: updateError } = await supabase
                .from('calls')
                .update(dbUpdates)
                .eq('id', id)

            if (updateError) throw updateError

            // Optimistic update
            setCalls(current => current.map(c => c.id === id ? { ...c, ...updates } : c))
            toast.success('Call updated')
        } catch (err) {
            console.error('Error updating call:', err)
            // toast.error('Failed to update call')
            // Optimistic update anyway for demo purposes if backend fails
            setCalls(current => current.map(c => c.id === id ? { ...c, ...updates } : c))
        }
    }

    const archiveCalls = async (ids: string[]) => {
        try {
            // Check if user has archive column, if not just local update
            const { error } = await supabase
                .from('calls')
                .update({ archived: true } as any)
                .in('id', ids)

            if (error) console.warn('Backend archive failed (column might be missing), doing local only')

            // Optimistic update - filter them out or mark as archived
            // We'll mark as archived in local state
            setCalls(current => current.map(c => ids.includes(c.id) ? { ...c, archived: true } : c))
            toast.success(`${ids.length} calls archived`)
        } catch (err) {
            console.error('Error archiving calls:', err)
            setCalls(current => current.map(c => ids.includes(c.id) ? { ...c, archived: true } : c))
            toast.success(`${ids.length} calls archived (local)`)
        }
    }

    useEffect(() => {
        fetchData()

        // Set up real-time subscription
        const channel = supabase
            .channel('calls-changes')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'calls' },
                (payload) => {
                    console.log('Real-time update:', payload)
                    fetchData() // Refresh data on any change

                    if (payload.eventType === 'INSERT') {
                        const newCall = payload.new as Call
                        toast.info('New Call', {
                            description: `${newCall.customer_phone}${newCall.caller_name ? ' • ' + newCall.caller_name : ''}`
                        })
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    // Calculated values
    const pendingJobs = calls.filter(c => c.booking_status === 'booked').length
    const revenue = calls.reduce((sum, call) => {
        // Extract revenue from summary or use default calculation
        const match = call.summary?.match(/\$(\d+(?:,\d{3})*(?:\.\d{2})?)/);
        if (match) {
            return sum + parseFloat(match[1].replace(/,/g, ''));
        }
        return sum;
    }, 0);

    return (
        <DataContext.Provider value={{
            calls,
            events,
            isLoading,
            error,
            refreshData: fetchData,
            pendingJobs,
            revenue,
            updateCall,
            archiveCalls
        }}>
            {children}
        </DataContext.Provider>
    )
}

export function useData() {
    const context = useContext(DataContext)
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider')
    }
    return context
}
