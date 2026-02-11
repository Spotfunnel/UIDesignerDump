import { Outlet, useLocation, Link } from 'react-router-dom';
import { Home, DollarSign, TrendingUp, AlertCircle, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AdminDataProvider } from '@/contexts/AdminDataContext';

const navItems = [
    { label: 'Overview', path: '/admin', icon: Home },
    { label: 'Usage', path: '/admin/usage', icon: DollarSign },
    { label: 'Quality', path: '/admin/quality', icon: TrendingUp },
    { label: 'Issues', path: '/admin/issues', icon: AlertCircle },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
];

export default function AdminDashboard() {
    const location = useLocation();

    return (
        <AdminDataProvider>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
                {/* Header */}
                <div className="bg-white border-b border-slate-200 sticky top-0 z-40 backdrop-blur-xl bg-white/90">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg" />
                                <div>
                                    <h1 className="text-lg font-extrabold text-foreground">SpotFunnel Admin</h1>
                                    <p className="text-xs text-muted-foreground">System Monitor & Control</p>
                                </div>
                            </div>

                            {/* Desktop Navigation */}
                            <nav className="hidden md:flex items-center gap-1">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = location.pathname === item.path ||
                                        (item.path !== '/admin' && location.pathname.startsWith(item.path));

                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            className={cn(
                                                "flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all",
                                                isActive
                                                    ? "bg-primary text-primary-foreground shadow-sm"
                                                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                            )}
                                        >
                                            <Icon className="w-4 h-4" />
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
                    <Outlet />
                </div>

                {/* Mobile Bottom Navigation */}
                <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border backdrop-blur-xl z-50">
                    <div className="grid grid-cols-5 gap-0.5 p-1.5">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path ||
                                (item.path !== '/admin' && location.pathname.startsWith(item.path));

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={cn(
                                        "flex flex-col items-center gap-1 py-2 rounded-lg transition-all",
                                        isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "text-muted-foreground"
                                    )}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="text-xs font-medium">{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </nav>
            </div>
        </AdminDataProvider>
    );
}
