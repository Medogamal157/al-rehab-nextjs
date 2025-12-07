'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AdminAuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      // First check localStorage
      const storedToken = localStorage.getItem('admin-token');
      const storedUser = localStorage.getItem('admin-user');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setIsLoading(false);
        return;
      }

      // If not in localStorage, check cookie via API
      try {
        const response = await fetch('/api/admin/session', {
          credentials: 'include',
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.authenticated && data.user) {
            setUser(data.user);
            setToken(data.token);
            // Store in localStorage for future use
            localStorage.setItem('admin-token', data.token);
            localStorage.setItem('admin-user', JSON.stringify(data.user));
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
      }
      
      setIsLoading(false);
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }

      if (data.success) {
        // Store token and user
        if (data.token) {
          localStorage.setItem('admin-token', data.token);
          setToken(data.token);
        }
        if (data.user) {
          localStorage.setItem('admin-user', JSON.stringify(data.user));
          setUser(data.user);
        }
        return { success: true };
      }

      return { success: false, error: 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An error occurred' };
    }
  };

  const logout = () => {
    localStorage.removeItem('admin-token');
    localStorage.removeItem('admin-user');
    setToken(null);
    setUser(null);
    // Also clear the cookie by calling logout API
    fetch('/api/admin/logout', { method: 'POST', credentials: 'include' });
    router.push('/login');
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token && !!user,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
