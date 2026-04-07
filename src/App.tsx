import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { useUserRole, useProfile } from "./hooks/useSupabaseData";
import AppLayout from "./components/layout/AppLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminBuildingDetail from "./pages/AdminBuildingDetail";
import ClientDashboard from "./pages/ClientDashboard";
import DevicesPage from "./pages/Devices";
import AnalyticsPage from "./pages/Analytics";
import AIPage from "./pages/AI";
import AlertsPage from "./pages/Alerts";
import SettingsPage from "./pages/Settings";
import Login from "./pages/Login";
import SelectBuilding from "./pages/SelectBuilding";
import NotFound from "./pages/NotFound";
import Landing from "./pages/Landing";
import ThemeSwitcher from "./components/ThemeSwitcher";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const RoleRouter = () => {
  const { data: roleData, isLoading: loadingRole } = useUserRole();
  const { data: profile, isLoading: loadingProfile } = useProfile();

  if (loadingRole || loadingProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Admin goes to admin dashboard
  if (roleData?.isAdmin) {
    return <AdminDashboard />;
  }

  // Client without building selected → go to select building
  if (!profile?.building_id) {
    return <Navigate to="/select-building" replace />;
  }

  // Client with building → client dashboard
  return <ClientDashboard />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ThemeSwitcher />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/select-building" element={
              <ProtectedRoute><SelectBuilding /></ProtectedRoute>
            } />
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<RoleRouter />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/building/:buildingId" element={<AdminBuildingDetail />} />
              <Route path="/devices" element={<DevicesPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/ai" element={<AIPage />} />
              <Route path="/alerts" element={<AlertsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
