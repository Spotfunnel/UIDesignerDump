import { Link } from 'react-router-dom';
import { useAdminData } from '@/contexts/AdminDataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Phone, Calendar, TrendingUp, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function AllBusinesses() {
    const { businessMetrics, isLoading } = useAdminData();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">All Businesses</h1>
                    <p className="text-muted-foreground mt-1">Manage and monitor all customer accounts</p>
                </div>
            </div>

            {businessMetrics.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-20">
                        <Building2 className="w-12 h-12 text-muted-foreground mb-4" />
                        <p className="text-lg font-medium text-muted-foreground">No businesses found</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {businessMetrics.map((business) => (
                        <Link
                            key={business.business_id}
                            to={`/admin/business/${business.business_id}`}
                            className="group"
                        >
                            <Card className="hover:shadow-lg hover:border-primary/50 transition-all duration-300 group-hover:scale-[1.02] h-full">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
                                                {business.company_name}
                                            </CardTitle>
                                            <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wide">
                                                {business.trade_type}
                                            </p>
                                        </div>
                                        <Building2 className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="flex items-center gap-2 bg-muted/40 rounded-lg p-2.5">
                                            <Phone className="w-4 h-4 text-primary" />
                                            <div>
                                                <p className="text-xs text-muted-foreground">Calls</p>
                                                <p className="text-lg font-bold text-foreground">{business.total_calls}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 bg-muted/40 rounded-lg p-2.5">
                                            <Calendar className="w-4 h-4 text-emerald-500" />
                                            <div>
                                                <p className="text-xs text-muted-foreground">Booked</p>
                                                <p className="text-lg font-bold text-foreground">{business.total_bookings}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 bg-muted/40 rounded-lg p-2.5">
                                        <TrendingUp className="w-4 h-4 text-blue-500" />
                                        <div className="flex-1">
                                            <p className="text-xs text-muted-foreground">Conversion Rate</p>
                                            <p className="text-lg font-bold text-foreground">
                                                {business.conversion_rate.toFixed(1)}%
                                            </p>
                                        </div>
                                    </div>

                                    {business.last_activity && (
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border">
                                            <Clock className="w-3 h-3" />
                                            <span>Last activity {formatDistanceToNow(new Date(business.last_activity), { addSuffix: true })}</span>
                                        </div>
                                    )}

                                    {!business.last_activity && (
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border">
                                            <Clock className="w-3 h-3" />
                                            <span>No activity yet</span>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
