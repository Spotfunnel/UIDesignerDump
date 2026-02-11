import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DataProvider } from "@/contexts/DataContext";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import Welcome from "./pages/Welcome";
import Consultation from "./pages/Consultation";
import { PushSync } from "./components/PushSync";
import Dashboard from "./pages/Dashboard";
import Overview from "./pages/dashboard/Overview";
import ActionRequired from "./pages/dashboard/ActionRequired";
import CallLogs from "./pages/dashboard/CallLogs";
import Configuration from "./pages/dashboard/Configuration";
import Settings from "./pages/dashboard/Settings";
import InstallGuide from "./pages/InstallGuide";
import Privacy from "./pages/landing/Privacy";
import Terms from "./pages/landing/Terms";
import Contact from "./pages/landing/Contact";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import AllBusinesses from "./pages/admin/AllBusinesses";
import BusinessDetails from "./pages/admin/BusinessDetails";
import SystemMetrics from "./pages/admin/SystemMetrics";
import AdminSettings from "./pages/admin/AdminSettings";
import { AdminDataProvider } from "./contexts/AdminDataContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <PushSync />
        <DataProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/update-password" element={<UpdatePassword />} />
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/consultation" element={<Consultation />} />
              <Route path="/dashboard" element={<Dashboard />}>
                <Route index element={<Overview />} />
                <Route path="action-required" element={<ActionRequired />} />
                <Route path="call-logs" element={<CallLogs />} />
                <Route path="configuration" element={<Configuration />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              <Route
                path="/admin"
                element={
                  <AdminDataProvider>
                    <AdminDashboard />
                  </AdminDataProvider>
                }
              >
                <Route index element={<AllBusinesses />} />
                <Route path="business/:businessId" element={<BusinessDetails />} />
                <Route path="system-metrics" element={<SystemMetrics />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
              <Route path="/install-guide" element={<InstallGuide />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </DataProvider>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
