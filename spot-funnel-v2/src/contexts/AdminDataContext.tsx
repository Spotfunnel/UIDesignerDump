import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
    BusinessAccount,
    SystemMetrics,
    FailedCall,
    ErrorLog,
    ActivityEvent,
    generateBusinessAccounts,
    calculateSystemMetrics,
    generateFailedCalls,
    generateErrorLogs,
    generateActivityStream
} from '@/lib/adminSimulation';

interface AdminDataContextType {
    businesses: BusinessAccount[];
    systemMetrics: SystemMetrics;
    failedCalls: FailedCall[];
    errorLogs: ErrorLog[];
    activityStream: ActivityEvent[];
    isLoading: boolean;
    refreshData: () => void;
    getBusinessById: (id: string) => BusinessAccount | undefined;
    filterBusinesses: (status?: string, searchQuery?: string) => BusinessAccount[];
}

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined);

export function AdminDataProvider({ children }: { children: ReactNode }) {
    const [businesses, setBusinesses] = useState<BusinessAccount[]>([]);
    const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
    const [failedCalls, setFailedCalls] = useState<FailedCall[]>([]);
    const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);
    const [activityStream, setActivityStream] = useState<ActivityEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadData = () => {
        setIsLoading(true);

        // Generate simulated data
        const bizData = generateBusinessAccounts();
        const metrics = calculateSystemMetrics(bizData);
        const failed = generateFailedCalls(bizData);
        const logs = generateErrorLogs();
        const activity = generateActivityStream(bizData);

        setBusinesses(bizData);
        setSystemMetrics(metrics);
        setFailedCalls(failed);
        setErrorLogs(logs);
        setActivityStream(activity);
        setIsLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const refreshData = () => {
        loadData();
    };

    const getBusinessById = (id: string): BusinessAccount | undefined => {
        return businesses.find(b => b.id === id);
    };

    const filterBusinesses = (status?: string, searchQuery?: string): BusinessAccount[] => {
        let filtered = businesses;

        if (status && status !== 'all') {
            filtered = filtered.filter(b => b.status === status);
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(b =>
                b.name.toLowerCase().includes(query) ||
                b.type.toLowerCase().includes(query) ||
                b.id.toLowerCase().includes(query)
            );
        }

        return filtered;
    };

    if (!systemMetrics) {
        return null;
    }

    return (
        <AdminDataContext.Provider
            value={{
                businesses,
                systemMetrics,
                failedCalls,
                errorLogs,
                activityStream,
                isLoading,
                refreshData,
                getBusinessById,
                filterBusinesses
            }}
        >
            {children}
        </AdminDataContext.Provider>
    );
}

export function useAdminData() {
    const context = useContext(AdminDataContext);
    if (context === undefined) {
        throw new Error('useAdminData must be used within an AdminDataProvider');
    }
    return context;
}
