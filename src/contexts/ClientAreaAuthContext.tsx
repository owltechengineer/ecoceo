"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ClientAreaAuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const ClientAreaAuthContext = createContext<ClientAreaAuthContextType | undefined>(undefined);

interface ClientAreaAuthProviderProps {
  children: ReactNode;
}

export const ClientAreaAuthProvider: React.FC<ClientAreaAuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const authStatus = localStorage.getItem('clientAreaAuth');
        const authTimestamp = localStorage.getItem('clientAreaAuthTimestamp');
        
        if (authStatus === 'true' && authTimestamp) {
          // Check if auth is still valid (24 hours)
          const now = new Date().getTime();
          const authTime = parseInt(authTimestamp);
          const hoursDiff = (now - authTime) / (1000 * 60 * 60);
          
          if (hoursDiff < 24) {
            setIsAuthenticated(true);
          } else {
            // Auth expired, clear storage
            localStorage.removeItem('clientAreaAuth');
            localStorage.removeItem('clientAreaAuthTimestamp');
          }
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // In a real app, you would verify the password on the server
      // For now, we'll check it against the environment variable
      const response = await fetch('/api/client-area/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        const authData = await response.json();
        if (authData.success) {
          setIsAuthenticated(true);
          localStorage.setItem('clientAreaAuth', 'true');
          localStorage.setItem('clientAreaAuthTimestamp', new Date().getTime().toString());
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('clientAreaAuth');
    localStorage.removeItem('clientAreaAuthTimestamp');
  };

  return (
    <ClientAreaAuthContext.Provider value={{
      isAuthenticated,
      login,
      logout,
      isLoading
    }}>
      {children}
    </ClientAreaAuthContext.Provider>
  );
};

export const useClientAreaAuth = (): ClientAreaAuthContextType => {
  const context = useContext(ClientAreaAuthContext);
  if (context === undefined) {
    throw new Error('useClientAreaAuth must be used within a ClientAreaAuthProvider');
  }
  return context;
};
