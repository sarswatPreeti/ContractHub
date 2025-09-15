import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ContractDetail from "./pages/ContractDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            } />
            <Route path="/contracts/:id" element={
              <DashboardLayout>
                <ContractDetail />
              </DashboardLayout>
            } />
            <Route path="/insights" element={
              <DashboardLayout>
                <div className="p-6">
                  <h1 className="text-3xl font-bold">Insights</h1>
                  <p className="text-muted-foreground mt-2">Coming soon...</p>
                </div>
              </DashboardLayout>
            } />
            <Route path="/reports" element={
              <DashboardLayout>
                <div className="p-6">
                  <h1 className="text-3xl font-bold">Reports</h1>
                  <p className="text-muted-foreground mt-2">Coming soon...</p>
                </div>
              </DashboardLayout>
            } />
            <Route path="/settings" element={
              <DashboardLayout>
                <div className="p-6">
                  <h1 className="text-3xl font-bold">Settings</h1>
                  <p className="text-muted-foreground mt-2">Coming soon...</p>
                </div>
              </DashboardLayout>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
