import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPost, setOnUnauthorized } from '@/api/client';
import type { StudentProfile, LoginResponse } from '@/types';

interface AuthContextType {
  user: StudentProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string, otp?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const logout = useCallback(async () => {
    setUser(null);
    await queryClient.cancelQueries();
    queryClient.clear();
    try {
      await apiPost('/auth/logout');
    } catch {
      // ignore
    }
    setUser(null);
    navigate('/login');
  }, [navigate, queryClient]);

  useEffect(() => {
    setOnUnauthorized(() => {
      setUser(null);
      void queryClient.cancelQueries().then(() => queryClient.clear());
      navigate('/login', { replace: true });
    });
  }, [navigate, queryClient]);

  useEffect(() => {
    apiGet<{ loggedIn: boolean }>('/auth/status')
      .then((data) => {
        if (!data.loggedIn) {
          setIsLoading(false);
          return;
        }
        return apiGet<StudentProfile>('/student/profile').then((profile) => {
          setUser(profile);
          setIsLoading(false);
        });
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  const login = useCallback(async (username: string, password: string, otp?: string) => {
    const body: Record<string, string> = { username, password };
    if (otp) body.otp = otp;
    await apiPost<LoginResponse>('/auth/login', body);
    await queryClient.cancelQueries();
    queryClient.clear();

    const profile = await apiGet<StudentProfile>('/student/profile');
    setUser(profile);

    navigate('/');
  }, [navigate, queryClient]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
