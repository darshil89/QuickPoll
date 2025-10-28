"use client"

import React, { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
  requireAuth?: boolean;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, requireAuth = false }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const hasRedirected = useRef(false);

  const isAuthenticated = !!user;

  // Check for existing token on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      console.log("token", token);
      
      if (token) {
        try {
          // Verify token is still valid by checking if it's not expired
          const tokenData = JSON.parse(atob(token.split('.')[1]));
          const currentTime = Date.now() / 1000;
          console.log("tokenData", tokenData);
          
          if (tokenData.exp && tokenData.exp > currentTime) {
            // Token is valid, set user data from token
            setUser({
              id: tokenData.sub,
              email: tokenData.email,
              name: tokenData.name || ''
            });
          } else {
            // Token expired, clear it
            localStorage.removeItem('access_token');
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          localStorage.removeItem('access_token');
        }
      }
      else {
        setUser(null);
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Authentication guard for protected routes
  useEffect(() => {
    if (requireAuth && !isLoading && !isAuthenticated && !hasRedirected.current) {
      hasRedirected.current = true;
      router.push('/');
    }
  }, [requireAuth, isLoading, isAuthenticated, router]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || 'Login failed');
        return false;
      }

      const data = await response.json();
      
      // Store token
      localStorage.setItem('access_token', data.access_token);
      
      // Set user data from token or response
      setUser({
        id: data.user.id,
        email: data.user.email,
        name: data.user.name || ''
      });

      // Reset redirect flag on successful login
      hasRedirected.current = false;

      toast.success('Login successful');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
      return false;
    }
  };

  const logout = () => {
    // Clear token and user data
    localStorage.removeItem('access_token');
    setUser(null);
    
    // Redirect to login
    router.push('/');
    toast.info('Logged out successfully');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  // Show loading spinner while checking authentication for protected routes
  if (requireAuth && isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't render children if authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
