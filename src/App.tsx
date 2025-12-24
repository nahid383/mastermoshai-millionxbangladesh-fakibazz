import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { StudentProvider, useStudent } from "./context/StudentContext";
import { useAuth } from "./hooks/useAuth";
import { PWAInstallBanner } from "./components/PWAInstallBanner";
import { Onboarding } from "./pages/Onboarding";
import { Dashboard } from "./pages/Dashboard";
import { Subjects } from "./pages/Subjects";
import { Quiz } from "./pages/Quiz";
import { Progress } from "./pages/Progress";
import { Profile } from "./pages/Profile";
import { Team } from "./pages/Team";
import { Auth } from "./pages/Auth";
import { Install } from "./pages/Install";
import { Learn } from "./pages/Learn";
import { NoteReader } from "./pages/NoteReader";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, loading } = useAuth();
  const { isOnboarded } = useStudent();

  const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (loading) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
      );
    }
    
    if (!user) {
      return <Navigate to="/auth" replace />;
    }
    
    if (!isOnboarded) {
      return <Navigate to="/" replace />;
    }
    
    return <>{children}</>;
  };

  const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (loading) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
      );
    }
    
    if (user && isOnboarded) {
      return <Navigate to="/dashboard" replace />;
    }
    
    return <>{children}</>;
  };

  const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (loading) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
      );
    }
    
    if (user) {
      if (isOnboarded) {
        return <Navigate to="/dashboard" replace />;
      }
      return <Navigate to="/" replace />;
    }
    
    return <>{children}</>;
  };

  return (
    <Routes>
      <Route path="/" element={<PublicRoute><Onboarding /></PublicRoute>} />
      <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/subjects" element={<ProtectedRoute><Subjects /></ProtectedRoute>} />
      <Route path="/quiz/:subjectId" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
      <Route path="/learn" element={<ProtectedRoute><Learn /></ProtectedRoute>} />
      <Route path="/learn/:noteId" element={<ProtectedRoute><NoteReader /></ProtectedRoute>} />
      <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/team" element={<Team />} />
      <Route path="/install" element={<Install />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <StudentProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <PWAInstallBanner />
            <AppContent />
          </BrowserRouter>
        </StudentProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
