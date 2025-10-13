'use client';

import { useAuth } from '../../hooks/useAuth';
import LoginForm from './LoginForm';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, error, login } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen r from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <span className="animate-spin text-white text-2xl">⏳</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Verifica Accesso</h2>
          <p className="text-gray-600">Controllo delle credenziali in corso...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <LoginForm 
        onLogin={login}
        isLoading={false}
        error={error || undefined}
      />
    );
  }

  return <>{children}</>;
}
