import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Phone, TrendingUp, DollarSign, Users, Activity } from 'lucide-react';
import { useAdminData } from '@/contexts/AdminDataContext';
import { formatDistanceToNow } from date - fns';

export default function AdminOverview() {
    const { systemMetrics, activityStream, businesses } = useAdminData();

    // Calculate alerts
    const minuteUsagePercent = (systemMetrics.total_minutes_used / systemMetrics.total_minutes_limit) * 100;
    const warningBusinesses = businesses.filter(b => b.status === 'warning' || b.status === 'critical');
    const recentFailures = activityStream.filter(e => e.type === 'failed').length;

    const hasAlerts = minuteUsagePercent >= 80 || warningBusinesses.length > 0 || recentFailures > 5;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* System Status Banner */}
            <Card className={hasAlerts ? "bg-amber-50 border-amber-200" : "bg-green-50 border-green-200"}>
                <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${hasAlerts ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`} />
                        <span className="font-semibold">
                            {hasAlerts ? '⚠️ System Alerts Active' : '✅ All Systems Operational'}
                        </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                        Last updated: {formatDistanceToNow(new Date())} ago
                    </span>
                </CardContent>
            </Card>

            {/* Alert Banners */}
            {hasAlerts && (
                <div className="space-y-2">
                    {minuteUsagePercent >= 80 && (
                        <Card className="bg-amber-50 border-amber-200">
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                    <Clock className="w-5 h-5 text-amber-600 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-amber-900">
                                            ⚠️ Approaching minute limit ({minuteUsagePercent.toFixed(1)}%)
                                        </p>
                                        <p className="text-sm text-amber-700 mt-1">
                                            {systemMetrics.total_minutes_limit - systemMetrics.total_minutes_used} minutes remaining
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {warningBusinesses.length > 0 && (
                        <Card className="bg-amber-50 border-amber-200">
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                    <Users className="w-5 h-5 text-amber-600 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-amber-900">
                                            ⚠️ {warningBusinesses.length} accounts approaching limits
                                        </p>
                                        <p className="text-sm text-amber-700 mt-1">
                                            View Usage page for details
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {recentFailures > 5 && (
                        <Card className="bg-red-50 border-red-200">
                            <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                    <Activity className="w-5 h-5 text-red-600 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-red-900">
                                            🔴 {recentFailures} failed calls in recent activity
                                        </p>
                                        <p className="text-sm text-red-700 mt-1">
                                            View Quality page to investigate
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}

            {/* Critical Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Minutes Used */}
                <Card className="bg-gradient-to-br from-card to-card/90 border-slate-200 shadow-md">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`p-3 rounded-xl ${minuteUsagePercent >= 90 ? 'bg-red-100' : minuteUsagePercent >= 80 ? 'bg-amber-100' : 'bg-primary/10'
                                }`}>
                                <Clock className={`w-5 h-5 ${minuteUsagePercent >= 90 ? 'text-red-600' : minuteUsagePercent >= 80 ? 'text-amber-600' : 'text-primary'
                                    }`} />
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground font-semibold mb-1">Minutes Used</p>
                            <p className="text-2xl font-bold">
                                {(systemMetrics.total_minutes_used / 1000).toFixed(1)}K/{(systemMetrics.total_minutes_limit / 1000).toFixed(0)}K
                            </p>
                            <div className="mt-2">
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all ${minuteUsagePercent >= 90 ? 'bg-red-500' : minuteUsagePercent >= 80 ? 'bg-amber-500' : 'bg-primary'
                                                }`}
                                            style={{ width: `${Math.min(minuteUsagePercent, 100)}%` }}
                                        />
                                    </div>
                                    <span className="text-xs font-bold">{minuteUsagePercent.toFixed(0)}%</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Call Volume */}
                <Card className="bg-gradient-to-br from-card to-card/90 border-slate-200 shadow-md">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-3 bg-blue-100 rounded-xl">
                                <Phone className="w-5 h-5 text-blue-600" />
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground font-semibold mb-1">Call Volume</p>
                            <p className="text-2xl font-bold">{systemMetrics.total_calls_today}</p>
                            <p className="text-xs text-green-600 font-semibold mt-1">+12% vs yesterday</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Success Rate */}
                <Card className="bg-gradient-to-br from-card to-card/90 border-slate-200 shadow-md">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`p-3 rounded-xl ${systemMetrics.overall_success_rate >= 90 ? 'bg-green-100' : 'bg-amber-100'
                                }`}>
                                <TrendingUp className={`w-5 h-5 ${systemMetrics.overall_success_rate >= 90 ? 'text-green-600' : 'text-amber-600'
                                    }`} />
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground font-semibold mb-1">Success Rate</p>
                            <p className="text-2xl font-bold">{systemMetrics.overall_success_rate.toFixed(1)}%</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {systemMetrics.overall_success_rate >= 90 ? '✅ Good' : '⚠️ Monitor'}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Total Costs */}
                <Card className="bg-gradient-to-br from-card to-card/90 border-slate-200 shadow-md">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-3 bg-purple-100 rounded-xl">
                                <DollarSign className="w-5 h-5 text-purple-600" />
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground font-semibold mb-1">Costs Today</p>
                            <p className="text-2xl font-bold">${systemMetrics.total_cost_today.toFixed(2)}</p>
                            <p className="text-xs text-muted-foreground mt-1">+$23 vs yesterday</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Activity Stream & Quick Stats */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <Card className="lg:col-span-2 bg-card border-slate-200 shadow-md">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {activityStream.slice(0, 10).map((event) => (
                                <div key={event.id} className="flex items-start gap-3 text-sm">
                                    <div className="mt-0.5">
                                        {event.type === 'completed' && <div className="w-2 h-2 rounded-full bg-green-500" />}
                                        {event.type === 'incomplete' && <div className="w-2 h-2 rounded-full bg-amber-500" />}
                                        {event.type === 'failed' && <div className="w-2 h-2 rounded-full bg-red-500" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text- foreground">{event.message}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(event.timestamp)} ago
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card className="bg-card border-slate-200 shadow-md">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Quick Stats</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Active Users</p>
                                <p className="text-2xl font-bold">{systemMetrics.active_users}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Avg Duration</p>
                                <p className="text-2xl font-bold">
                                    {Math.floor(systemMetrics.avg_call_duration / 60)}m{systemMetrics.avg_call_duration % 60}s
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Peak Time</p>
                                <p className="text-2xl font-bold">{systemMetrics.peak_hour}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Most Used Model</p>
                                <p className="text-xl font-bold">GPT-4</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
