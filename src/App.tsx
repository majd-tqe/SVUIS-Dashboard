import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/hooks/use-theme';
import { AuthProvider, useAuth } from '@/hooks/use-auth';
import { AppLayout } from '@/components/layout/AppLayout';
import { LoginPage } from '@/pages/LoginPage';
import { Dashboard } from '@/pages/Dashboard';
import { ProfilePage } from '@/pages/ProfilePage';
import { GradesPage } from '@/pages/GradesPage';
import { AveragePage } from '@/pages/AveragePage';
import { ExamsPage } from '@/pages/ExamsPage';
import { PaymentsPage } from '@/pages/PaymentsPage';
import { AssessmentsPage } from '@/pages/AssessmentsPage';
import { ClassesPage } from '@/pages/ClassesPage';
import { TutorsPage } from '@/pages/TutorsPage';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '@/i18n';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function LanguageDirection() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const lang = i18n.language || 'en';
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  return null;
}

function AppContent() {
  return (
    <ThemeProvider>
      <LanguageDirection />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Dashboard />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/studies" element={<AveragePage />} />
              <Route path="/grades" element={<GradesPage />} />
              <Route path="/exams" element={<ExamsPage />} />
              <Route path="/payments" element={<PaymentsPage />} />
              <Route path="/assessments" element={<AssessmentsPage />} />
              <Route path="/classes" element={<ClassesPage />} />
              <Route path="/tutors" element={<TutorsPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
      <Toaster position="top-center" />
    </ThemeProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
