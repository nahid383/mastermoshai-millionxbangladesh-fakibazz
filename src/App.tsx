import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { StudentProvider, useStudent } from "@/context/StudentContext";
import { PWAProvider } from "@/context/PWAContext";
import { useAuth } from "@/hooks/useAuth";
import { Onboarding } from "@/pages/Onboarding";
import { Dashboard } from "@/pages/Dashboard";
import { Subjects } from "@/pages/Subjects";
import { Quiz } from "@/pages/Quiz";
import { Progress } from "@/pages/Progress";
import { Profile } from "@/pages/Profile";
import { Team } from "@/pages/Team";
import { Auth } from "@/pages/Auth";
import { Install } from "@/pages/Install";
import { Learn } from "@/pages/Learn";
import { NoteReader } from "@/pages/NoteReader";
import { AIChat } from "@/pages/AIChat";
import { QuestionBank } from "@/pages/QuestionBank";
import { Leaderboard } from "@/pages/Leaderboard";
import { SubjectChapters } from "@/pages/SubjectChapters";
import { ChapterLearning } from "@/pages/ChapterLearning";
import { SelfStudy } from "@/pages/SelfStudy";
import { AITutor } from "@/pages/AITutor";
import { BoardQuestions } from "@/pages/BoardQuestions";
import { WeaknessHeatmap } from "@/pages/WeaknessHeatmap";
import { StudyPlanner } from "@/pages/StudyPlanner";
import { MentalSupport } from "@/pages/MentalSupport";
import { UniversityPrep } from "@/pages/UniversityPrep";
import { TimePressure } from "@/pages/TimePressure";
import { DoubtResolver } from "@/pages/DoubtResolver";
import { AnswerChecker } from "@/pages/AnswerChecker";
import { GuardianDashboard } from "@/pages/GuardianDashboard";
import { Calendar } from "@/pages/Calendar";
import { TodoList } from "@/pages/TodoList";
import { Analytics } from "@/pages/Analytics";
import { CQExam } from "@/pages/CQExam";
import { CQHistory } from "@/pages/CQHistory";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

// Separate component that uses useStudent - must be inside StudentProvider
const LoadingScreen = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
  </div>
);

type RouteWrapperProps = {
  children: React.ReactNode;
  user: unknown;
  loading: boolean;
  isOnboarded: boolean;
};

const ProtectedRoute: React.FC<RouteWrapperProps> = ({
  children,
  user,
  loading,
  isOnboarded,
}) => {
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/auth" replace />;
  if (!isOnboarded) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const PublicRoute: React.FC<RouteWrapperProps> = ({
  children,
  user,
  loading,
  isOnboarded,
}) => {
  if (loading) return <LoadingScreen />;
  if (user && isOnboarded) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

const AuthRoute: React.FC<RouteWrapperProps> = ({
  children,
  user,
  loading,
  isOnboarded,
}) => {
  if (loading) return <LoadingScreen />;
  if (user) return <Navigate to={isOnboarded ? "/dashboard" : "/"} replace />;
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user, loading } = useAuth();
  const { isOnboarded } = useStudent();

  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicRoute user={user} loading={loading} isOnboarded={isOnboarded}>
            <Onboarding />
          </PublicRoute>
        }
      />
      <Route
        path="/auth"
        element={
          <AuthRoute user={user} loading={loading} isOnboarded={isOnboarded}>
            <Auth />
          </AuthRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute user={user} loading={loading} isOnboarded={isOnboarded}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/subjects"
        element={
          <ProtectedRoute user={user} loading={loading} isOnboarded={isOnboarded}>
            <Subjects />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quiz/:subjectId"
        element={
          <ProtectedRoute user={user} loading={loading} isOnboarded={isOnboarded}>
            <Quiz />
          </ProtectedRoute>
        }
      />
      <Route
        path="/learn"
        element={
          <ProtectedRoute user={user} loading={loading} isOnboarded={isOnboarded}>
            <Learn />
          </ProtectedRoute>
        }
      />
      <Route
        path="/learn/subject/:subjectId"
        element={
          <ProtectedRoute user={user} loading={loading} isOnboarded={isOnboarded}>
            <SubjectChapters />
          </ProtectedRoute>
        }
      />
      <Route
        path="/learn/chapter/:subjectId/:topicId"
        element={
          <ProtectedRoute user={user} loading={loading} isOnboarded={isOnboarded}>
            <ChapterLearning />
          </ProtectedRoute>
        }
      />
      <Route
        path="/learn/self-study/:subjectId/:topicId"
        element={
          <ProtectedRoute user={user} loading={loading} isOnboarded={isOnboarded}>
            <SelfStudy />
          </ProtectedRoute>
        }
      />
      <Route
        path="/learn/ai-master/:subjectId/:topicId"
        element={
          <ProtectedRoute user={user} loading={loading} isOnboarded={isOnboarded}>
            <AITutor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/learn/board-questions/:subjectId/:topicId"
        element={
          <ProtectedRoute user={user} loading={loading} isOnboarded={isOnboarded}>
            <BoardQuestions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/learn/:noteId"
        element={
          <ProtectedRoute user={user} loading={loading} isOnboarded={isOnboarded}>
            <NoteReader />
          </ProtectedRoute>
        }
      />
      <Route
        path="/progress"
        element={
          <ProtectedRoute user={user} loading={loading} isOnboarded={isOnboarded}>
            <Progress />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute user={user} loading={loading} isOnboarded={isOnboarded}>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai-chat"
        element={
          <ProtectedRoute user={user} loading={loading} isOnboarded={isOnboarded}>
            <AIChat />
          </ProtectedRoute>
        }
      />
      <Route
        path="/question-bank"
        element={
          <ProtectedRoute user={user} loading={loading} isOnboarded={isOnboarded}>
            <QuestionBank />
          </ProtectedRoute>
        }
      />
      <Route
        path="/leaderboard"
        element={
          <ProtectedRoute user={user} loading={loading} isOnboarded={isOnboarded}>
            <Leaderboard />
          </ProtectedRoute>
        }
      />
      {/* New Feature Routes */}
      <Route
        path="/weakness-heatmap"
        element={
          <ProtectedRoute user={user} loading={loading} isOnboarded={isOnboarded}>
            <WeaknessHeatmap />
          </ProtectedRoute>
        }
      />
      <Route
        path="/study-planner"
        element={
          <ProtectedRoute user={user} loading={loading} isOnboarded={isOnboarded}>
            <StudyPlanner />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mental-support"
        element={
          <ProtectedRoute user={user} loading={loading} isOnboarded={isOnboarded}>
            <MentalSupport />
          </ProtectedRoute>
        }
      />
      <Route
        path="/university-prep"
        element={
          <ProtectedRoute user={user} loading={loading} isOnboarded={isOnboarded}>
            <UniversityPrep />
          </ProtectedRoute>
        }
      />
      <Route
        path="/time-pressure"
        element={
          <ProtectedRoute user={user} loading={loading} isOnboarded={isOnboarded}>
            <TimePressure />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doubt-resolver"
        element={
          <ProtectedRoute user={user} loading={loading} isOnboarded={isOnboarded}>
            <DoubtResolver />
          </ProtectedRoute>
        }
      />
      <Route
        path="/answer-checker"
        element={
          <ProtectedRoute user={user} loading={loading} isOnboarded={isOnboarded}>
            <AnswerChecker />
          </ProtectedRoute>
        }
      />
      <Route
        path="/guardian-dashboard"
        element={
          <ProtectedRoute user={user} loading={loading} isOnboarded={isOnboarded}>
            <GuardianDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/calendar"
        element={
          <ProtectedRoute user={user} loading={loading} isOnboarded={isOnboarded}>
            <Calendar />
          </ProtectedRoute>
        }
      />
      <Route
        path="/todo"
        element={
          <ProtectedRoute user={user} loading={loading} isOnboarded={isOnboarded}>
            <TodoList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute user={user} loading={loading} isOnboarded={isOnboarded}>
            <Analytics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cq-exam"
        element={
          <ProtectedRoute user={user} loading={loading} isOnboarded={isOnboarded}>
            <CQExam />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cq-history"
        element={
          <ProtectedRoute user={user} loading={loading} isOnboarded={isOnboarded}>
            <CQHistory />
          </ProtectedRoute>
        }
      />
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
        <BrowserRouter>
          <StudentProvider>
            <PWAProvider>
              <Toaster />
              <Sonner />
              <AppRoutes />
            </PWAProvider>
          </StudentProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
