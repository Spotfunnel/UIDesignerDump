import { useEffect } from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { SpotFunnelLogo } from '@/components/brand/SpotFunnelLogo';
import { LayoutGrid, BarChart3, Settings as SettingsIcon, LogOut, Shield } from 'lucide-react';
import { useAdminData } from '@/contexts/AdminDataContext';

export default function AdminDashboard() {
    const { user, signOut, loading, isAdmin } = useAuth();
    const { fetchAdminData } = useAdminData();
    const location = useLocation();
    const navigate = useNavigate();

    // TEMPORARY: Auth check disabled for UI inspection
    // useEffect(() => {
    //   if (!loading && !user) {
    //     navigate('/auth');
    //   } else if (!loading && user && !isAdmin) {
    //     // Non-admin trying to access admin area
    //     navigate('/dashboard');
    //   }
    // }, [user, loading, isAdmin, navigate]);

    // TEMPORARY: Skip loading and auth checks for UI inspection
    // if (loading) {
    //   return (
    //     <div className="min-h-screen flex items-center justify-center bg-background">
    //       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    //     </div>
    //   );
    // }

    // if (!user || !isAdmin) return null;

    const navItems = [
        { label: 'All Businesses', path: '/admin', icon: LayoutGrid },
        { label: 'Metrics', path: '/admin/system-metrics', icon: BarChart3 },
        { label: 'Settings', path: '/admin/settings', icon: SettingsIcon },
    ];

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="border-b border-border bg-card/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
                    {/* Left: Logo Area */}
                    <Link to="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
                        <SpotFunnelLogo size={32} color="var(--primary)" />
                        <span className="font-extrabold text-xl tracking-tight text-foreground">SpotFunnel</span>
                    </Link>

                    {/* Center: Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-muted/40 p-1 rounded-full border border-border/40 backdrop-blur-md">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.label}
                                    to={item.path}
                                    className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${isActive
                                        ? 'bg-white text-primary shadow-sm scale-105'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-white/50'
                                        }`}
                                >
                                    <item.icon className="w-4 h-4" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right: User Actions */}
                    <div className="flex items-center gap-2">
                        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-lg">
                            <Shield className="w-4 h-4 text-primary" />
                            <span className="text-sm font-semibold text-primary">Admin</span>
                        </div>
                        <span className="text-sm font-medium text-muted-foreground hidden lg:block">{user?.email || 'admin@spotfunnel.com'}</span>

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={async () => {
                                await signOut();
                                navigate('/auth');
                            }}
                            className="rounded-xl border-muted-foreground/10 hover:border-destructive hover:text-destructive shadow-sm active:scale-95 transition-all"
                        >
                            <LogOut className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-hidden relative">
                <div className="container mx-auto px-4 py-6 sm:py-10 pb-20 md:pb-10 h-full">
                    <Outlet />
                </div>
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border backdrop-blur-xl z-50 safe-bottom">
                <div className="grid grid-cols-3 gap-0.5 p-1.5">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.label}
                                to={item.path}
                                className={`flex flex-col items-center justify-center gap-0.5 py-2 px-2 rounded-xl transition-all duration-300 ${isActive
                                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-105'
                                    : 'text-muted-foreground active:bg-muted/50'
                                    }`}
                            >
                                <Icon className={`w-4 h-4 ${isActive ? 'animate-pulse' : ''}`} />
                                <span className="text-[9px] font-bold uppercase tracking-wider">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}
