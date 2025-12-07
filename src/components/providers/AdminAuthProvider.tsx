'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface LoginResult {
  success: boolean;
  error?: string;
  lockedOut?: boolean;
  remainingMinutes?: number;
  remainingAttempts?: number;
}

interface AdminAuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// Generate a simple device fingerprint
function getDeviceId(): string {
  // Check if we already have a device ID stored
  const existingId = localStorage.getItem('device-id');
  if (existingId) {
    return existingId;
  }

  // Generate a new device ID based on browser characteristics
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  let fingerprint = '';
  
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('device-fingerprint', 2, 2);
    fingerprint = canvas.toDataURL();
  }

  const deviceData = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    fingerprint,
  ].join('|');

  // Create a simple hash
  let hash = 0;
  for (let i = 0; i < deviceData.length; i++) {
    const char = deviceData.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }

  const deviceId = 'dev_' + Math.abs(hash).toString(36) + '_' + Date.now().toString(36);
  localStorage.setItem('device-id', deviceId);
  return deviceId;
}

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

  const login = useCallback(async (email: string, password: string): Promise<LoginResult> => {
    try {
      const deviceId = getDeviceId();
      
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, deviceId }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle lockout
        if (response.status === 429 && data.lockedOut) {
          return { 
            success: false, 
            error: data.error,
            lockedOut: true,
            remainingMinutes: data.remainingMinutes,
          };
        }
        
        // Handle failed attempt with remaining attempts info
        if (data.remainingAttempts !== undefined) {
          const attemptsMsg = data.remainingAttempts > 0 
            ? ` (${data.remainingAttempts} attempt${data.remainingAttempts !== 1 ? 's' : ''} remaining)`
            : ' (Account locked)';
          return { 
            success: false, 
            error: (data.error || 'Login failed') + attemptsMsg,
            remainingAttempts: data.remainingAttempts,
          };
        }
        
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
  }, []);

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
