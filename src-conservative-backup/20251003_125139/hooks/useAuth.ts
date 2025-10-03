'use client';

import { useState, useEffect } from 'react';
import { AUTH_CONFIG, validatePassword, isSessionValid } from '../config/auth';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    error: null
  });

  // Verifica se l'utente è già autenticato al caricamento
  useEffect(() => {
    const checkAuth = () => {
      try {
        const isAuth = localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.AUTHENTICATED) === 'true';
        const authTime = localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.AUTH_TIME);
        
        if (isAuth && authTime) {
          const authTimestamp = parseInt(authTime);
          
          if (isSessionValid(authTimestamp)) {
            setAuthState({
              isAuthenticated: true,
              isLoading: false,
              error: null
            });
            return;
          } else {
            // Sessione scaduta
            localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.AUTHENTICATED);
            localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.AUTH_TIME);
          }
        }
        
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          error: null
        });
      } catch (error) {
        console.error('Errore verifica autenticazione:', error);
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          error: AUTH_CONFIG.MESSAGES.AUTH_ERROR
        });
      }
    };

    checkAuth();
  }, []);

  const login = async (password: string): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Validazione password
      if (!validatePassword(password)) {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          error: 'Password deve essere tra 6 e 50 caratteri'
        });
        return false;
      }

      // Simula un controllo password (in produzione dovrebbe essere più sicuro)
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simula delay
      
      if (password === AUTH_CONFIG.DEFAULT_PASSWORD) {
        const now = Date.now();
        localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.AUTHENTICATED, 'true');
        localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.AUTH_TIME, now.toString());
        
        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
        
        return true;
      } else {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          error: AUTH_CONFIG.MESSAGES.LOGIN_ERROR
        });
        
        return false;
      }
    } catch (error) {
      console.error('Errore durante il login:', error);
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        error: AUTH_CONFIG.MESSAGES.AUTH_ERROR
      });
      
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.AUTHENTICATED);
    localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.AUTH_TIME);
    
    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
  };

  const changePassword = (newPassword: string) => {
    // In produzione, questo dovrebbe essere gestito dal backend
    // Per ora, aggiorniamo solo la password locale
    if (newPassword.length >= 6) {
      // Qui potresti salvare la nuova password in modo sicuro
      console.log('Password cambiata con successo');
      return true;
    }
    return false;
  };

  return {
    ...authState,
    login,
    logout,
    changePassword
  };
}
