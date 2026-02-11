"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { toast } from "sonner"

// types.ts
export type SimEvent = {
    id: string
    type: "CALL_INCOMING" | "CALL_COMPLETED" | "JOB_BOOKED" | "REVENUE_UP"
    title: string
    details: string
    timestamp: Date
}

type SimulationContextType = {
    revenue: number
    activeCalls: number
    pendingJobs: number
    events: SimEvent[]
    simulateCall: () => void
    simulateBooking: () => void
    reset: () => void
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined)

export function SimulationProvider({ children }: { children: React.ReactNode }) {
    const [revenue, setRevenue] = useState(5125.40)
    const [activeCalls, setActiveCalls] = useState(0)
    const [pendingJobs, setPendingJobs] = useState(3)
    const [events, setEvents] = useState<SimEvent[]>([
        {
            id: 'init-1',
            type: "JOB_BOOKED",
            title: "Job Confirmed",
            details: "Value: $482 • Tech Dispatched",
            timestamp: new Date(Date.now() - 1000 * 60 * 45) // 45 mins ago
        },
        {
            id: 'init-2',
            type: "CALL_INCOMING",
            title: "Incoming Call",
            details: "+61 400 123 456 (Gold Coast)",
            timestamp: new Date(Date.now() - 1000 * 60 * 60) // 1 hour ago
        },
        {
            id: 'init-3',
            type: "JOB_BOOKED",
            title: "Job Confirmed",
            details: "Value: $395 • Tech Dispatched",
            timestamp: new Date(Date.now() - 1000 * 60 * 120) // 2 hours ago
        }
    ])



    const simulateCall = () => {
        setActiveCalls(prev => prev + 1)
        const newEvent: SimEvent = {
            id: Math.random().toString(36).substr(2, 9),
            type: "CALL_INCOMING",
            title: "Incoming Call",
            details: "+61 400 123 456 (Gold Coast)",
            timestamp: new Date()
        }
        setEvents(prev => [newEvent, ...prev].slice(0, 10))
        toast.info("Incoming Call", { description: "+61 400 123 456 (Gold Coast)" })

        // Auto-resolve call after random time
        setTimeout(() => {
            setActiveCalls(prev => Math.max(0, prev - 1))
            // Sometimes it converts to a job
            if (Math.random() > 0.5) simulateBooking()
        }, 5000 + Math.random() * 5000)
    }

    const simulateBooking = () => {
        const value = 150 + Math.floor(Math.random() * 500)
        setRevenue(prev => prev + value)
        setPendingJobs(prev => prev + 1)
        const newEvent: SimEvent = {
            id: Math.random().toString(36).substr(2, 9),
            type: "JOB_BOOKED",
            title: "Job Confirmed",
            details: `Value: $${value} • Tech Dispatched`,
            timestamp: new Date()
        }
        setEvents(prev => [newEvent, ...prev].slice(0, 10))
        toast.success("Job Confirmed", { description: `Value: $${value} • Tech Dispatched` })
    }

    const reset = () => {
        setRevenue(4250)
        setActiveCalls(0)
        setPendingJobs(8)
        setEvents([])
    }




    return (
        <SimulationContext.Provider value={{ revenue, activeCalls, pendingJobs, events, simulateCall, simulateBooking, reset }}>
            {children}
        </SimulationContext.Provider>
    )
}

export function useSimulation() {
    const context = useContext(SimulationContext)
    if (context === undefined) {
        throw new Error("useSimulation must be used within a SimulationProvider")
    }
    return context
}
