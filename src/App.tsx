
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { AuthForm } from "@/components/AuthForm";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import CreateGoal from "./pages/CreateGoal";
import ContractCeremony from "./pages/ContractCeremony";
import Coaching from "./pages/Coaching";
import Rewards from "./pages/Rewards";
import Premium from "./pages/Premium";
import PremiumContent from "./pages/PremiumContent";
import Analytics from "./pages/Analytics";
import Reflect from "./pages/Reflect";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="brutalist-container">
        <div className="flex items-center justify-center h-screen">
          <div className="text-2xl font-bold">LOADING...</div>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="brutalist-container">
        <div className="flex items-center justify-center h-screen">
          <div className="text-2xl font-bold">LOADING...</div>
        </div>
      </div>
    );
  }
  
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/auth" element={
                <PublicRoute>
                  <AuthForm />
                </PublicRoute>
              } />
              
              {/* Protected routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/create-goal" element={
                <ProtectedRoute>
                  <CreateGoal />
                </ProtectedRoute>
              } />
              
              <Route path="/contract" element={
                <ProtectedRoute>
                  <ContractCeremony />
                </ProtectedRoute>
              } />
              
              <Route path="/coaching" element={
                <ProtectedRoute>
                  <Coaching />
                </ProtectedRoute>
              } />
              
              <Route path="/analytics" element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              } />
              
              <Route path="/reflect" element={
                <ProtectedRoute>
                  <Reflect />
                </ProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              
              <Route path="/rewards" element={
                <ProtectedRoute>
                  <Rewards />
                </ProtectedRoute>
              } />
              
              <Route path="/premium" element={
                <ProtectedRoute>
                  <Premium />
                </ProtectedRoute>
              } />
              
              <Route path="/premium-content" element={
                <ProtectedRoute>
                  <PremiumContent />
                </ProtectedRoute>
              } />

              {/* Legacy route redirect */}
              <Route path="/index" element={<Navigate to="/auth" replace />} />
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
