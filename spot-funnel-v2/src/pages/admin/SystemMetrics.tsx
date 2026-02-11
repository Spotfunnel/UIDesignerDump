import { useAdminData } from '@/contexts/AdminDataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Phone, Calendar, TrendingUp, Activity, Users } from 'lucide-react';

export default function SystemMetrics() {
    const { systemMetrics, isLoading } = useAdminData();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!systemMetrics) {
        return (
            <Card>
                <CardContent className="py-20 text-center">
                    <p className="text-muted-foreground">No metrics available</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">System Metrics</h1>
                <p className="text-muted-foreground mt-1">Platform-wide analytics and performance</p>
            </div>

            {/* Business Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            Total Businesses
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold text-blue-900 dark:text-blue-100">
                            {systemMetrics.total_businesses}
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 border-emerald-200 dark:border-emerald-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                            <Activity className="w-4 h-4" />
                            Active Businesses
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold text-emerald-900 dark:text-emerald-100">
                            {systemMetrics.active_businesses}
                        </p>
                        <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                            {systemMetrics.total_businesses > 0
                                ? `${((systemMetrics.active_businesses / systemMetrics.total_businesses) * 100).toFixed(1)}% active`
                                : '0% active'}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Weekly Metrics */}
            <div>
                <h2 className="text-xl font-bold text-foreground mb-3">This Week</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-2 hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Phone className="w-4 h-4 text-blue-500" />
                                Total Calls
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-foreground">{systemMetrics.total_calls_week}</p>
                        </CardContent>
                    </Card>

                    <Card className="border-2 hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-emerald-500" />
                                Bookings
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-foreground">{systemMetrics.total_bookings_week}</p>
                        </CardContent>
                    </Card>

                    <Card className="border-2 hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-violet-500" />
                                Conversion
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-foreground">
                                {systemMetrics.total_calls_week > 0
                                    ? `${((systemMetrics.total_bookings_week / systemMetrics.total_calls_week) * 100).toFixed(1)}%`
                                    : '0%'}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Monthly Metrics */}
            <div>
                <h2 className="text-xl font-bold text-foreground mb-3">This Month</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-2 hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Phone className="w-4 h-4 text-blue-500" />
                                Total Calls
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-foreground">{systemMetrics.total_calls_month}</p>
                        </CardContent>
                    </Card>

                    <Card className="border-2 hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-emerald-500" />
                                Bookings
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-foreground">{systemMetrics.total_bookings_month}</p>
                        </CardContent>
                    </Card>

                    <Card className="border-2 hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-violet-500" />
                                Conversion
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-foreground">
                                {systemMetrics.total_calls_month > 0
                                    ? `${((systemMetrics.total_bookings_month / systemMetrics.total_calls_month) * 100).toFixed(1)}%`
                                    : '0%'}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Overall Performance */}
            <Card className="bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-950 dark:to-violet-900 border-violet-200 dark:border-violet-800">
                <CardHeader>
                    <CardTitle className="text-violet-700 dark:text-violet-300 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Average Platform Conversion Rate
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-5xl font-bold text-violet-900 dark:text-violet-100">
                        {systemMetrics.avg_conversion_rate.toFixed(1)}%
                    </p>
                    <p className="text-sm text-violet-700 dark:text-violet-300 mt-2">
                        Across all businesses and time periods
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
