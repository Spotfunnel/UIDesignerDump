import { useEffect } from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/button';
import { SpotFunnelLogo } from '../components/brand/SpotFunnelLogo';
import { Home, ListChecks, LogOut, Download, Settings as SettingsIcon, Phone } from 'lucide-react';
import { NotificationPrompt } from '../components/NotificationPrompt';
import { useInstallPrompt } from '../hooks/useInstallPrompt';
import { PullToRefresh } from '../components/PullToRefresh';
import { useData } from '../contexts/DataContext';

export default function Dashboard() {
  const { user, signOut, loading } = useAuth();
  const { fetchData } = useData();
  const location = useLocation();
  const navigate = useNavigate();
  const { promptInstall, isInstalled } = useInstallPrompt();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  const navItems = [
    { label: 'Overview', path: '/dashboard', icon: Home },
    { label: 'Action', path: '/dashboard/action-required', icon: ListChecks },
    { label: 'Calls', path: '/dashboard/call-logs', icon: Phone },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Desktop & Mobile Header */}
      <header className="border-b border-border bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4 relative">
          {/* Left: Logo Area */}
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <SpotFunnelLogo size={32} color="var(--primary)" />
            <span className="font-extrabold text-xl tracking-tight text-foreground">SpotFunnel</span>
          </Link>

          {/* Center: Desktop Navigation - Centered Pill */}
          <nav className="hidden md:flex items-center gap-1 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-muted/30 p-1 rounded-xl border border-border/40 backdrop-blur-md">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${isActive
                    ? 'bg-white text-primary shadow-sm'
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
            <span className="text-sm font-medium text-muted-foreground hidden lg:block mr-2">{user.email}</span>

            <Button
              variant="outline"
              size="icon"
              asChild
              className="rounded-xl border-muted-foreground/10 hover:border-primary hover:text-primary shadow-sm active:scale-95 transition-all h-10 w-10"
            >
              <Link to="/dashboard/settings">
                <SettingsIcon className="w-4 h-4" />
              </Link>
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={async () => { await signOut(); navigate('/auth'); }}
              className="rounded-xl border-muted-foreground/10 hover:border-destructive hover:text-destructive shadow-sm active:scale-95 transition-all h-10 w-10"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden relative">
        <PullToRefresh onRefresh={fetchData}>
          <div className="container mx-auto px-4 py-6 sm:py-10 pb-20 md:pb-10 h-full overflow-y-auto">
            <Outlet />
          </div>
        </PullToRefresh>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50 safe-bottom">
        <div className="grid grid-cols-3 gap-0.5 p-1.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex flex-col items-center justify-center gap-0.5 py-2 px-2 rounded-xl transition-all duration-300 ${isActive
                  ? 'bg-primary/10 text-primary scale-105'
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

      {/* Notification Permission Prompt */}
      <NotificationPrompt />
    </div>
  );
}
