import { useParams, Link } from 'react-router-dom';
import { useAdminData } from '@/contexts/AdminDataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Phone, Calendar, Clock, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function BusinessDetails() {
    const { businessId } = useParams<{ businessId: string }>();
    const { businesses, businessMetrics, getBusinessCalls, isLoading } = useAdminData();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    const business = businesses.find(b => b.id === businessId);
    const metrics = businessMetrics.find(m => m.business_id === businessId);
    const calls = businessId ? getBusinessCalls(businessId) : [];

    if (!business || !metrics) {
        return (
            <div className="space-y-6">
                <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="w-4 h-4" />
                    Back to All Businesses
                </Link>
                <Card>
                    <CardContent className="py-20 text-center">
                        <p className="text-muted-foreground">Business not found</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4" />
                Back to All Businesses
            </Link>

            <div>
                <h1 className="text-3xl font-bold text-foreground">{business.company_name}</h1>
                <p className="text-muted-foreground mt-1 uppercase tracking-wide text-sm">{business.trade_type}</p>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            Total Calls
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{metrics.total_calls}</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 border-emerald-200 dark:border-emerald-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Bookings
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">{metrics.total_bookings}</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-950 dark:to-violet-900 border-violet-200 dark:border-violet-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-violet-700 dark:text-violet-300 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Conversion
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-violet-900 dark:text-violet-100">
                            {metrics.conversion_rate.toFixed(1)}%
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Calls */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Calls</CardTitle>
                </CardHeader>
                <CardContent>
                    {calls.length === 0 ? (
                        <p className="text-center py-10 text-muted-foreground">No calls yet</p>
                    ) : (
                        <div className="space-y-3">
                            {calls.slice(0, 10).map((call) => (
                                <div
                                    key={call.id}
                                    className="flex items-center justify-between p-3 bg-muted/40 rounded-lg border border-border hover:border-primary/50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Phone className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">{call.caller_number}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatDistanceToNow(new Date(call.timestamp), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span
                                            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${call.outcome === 'appointment_booked'
                                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                                                    : call.outcome === 'answered'
                                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                                                        : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                                                }`}
                                        >
                                            {call.outcome.replace(/_/g, ' ')}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
