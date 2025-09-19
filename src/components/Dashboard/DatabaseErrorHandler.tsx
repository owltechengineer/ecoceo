'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface DatabaseErrorHandlerProps {
  children: React.ReactNode;
  onError?: (error: Error) => void;
}

export default function DatabaseErrorHandler({ children, onError }: DatabaseErrorHandlerProps) {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    checkDatabaseConnection();
  }, []);

  const checkDatabaseConnection = async () => {
    try {
      setConnectionStatus('checking');
      
      // Testa la connessione con una query semplice
      const { data, error } = await supabase
        .from('dashboard_data')
        .select('id')
        .limit(1);

      if (error) {
        throw error;
      }

      setConnectionStatus('connected');
      setError(null);
    } catch (err) {
      const error = err as Error;
      setConnectionStatus('error');
      setError(error);
      onError?.(error);
    }
  };

  const retryConnection = () => {
    checkDatabaseConnection();
  };

  if (connectionStatus === 'checking') {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifica connessione database...</p>
        </div>
      </div>
    );
  }

  if (connectionStatus === 'error') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 m-4">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Errore di connessione al database
            </h3>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-red-700 mb-2">
            <strong>Errore:</strong> {error?.message || 'Connessione fallita'}
          </p>
          
          {error?.message.includes('relation') && error.message.includes('does not exist') && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-3">
              <p className="text-sm text-yellow-800">
                <strong>Soluzione:</strong> Le tabelle del database non esistono. 
                Vai alla sezione "Setup Database" per crearle.
              </p>
            </div>
          )}
          
          {error?.message.includes('permission denied') && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-3">
              <p className="text-sm text-yellow-800">
                <strong>Soluzione:</strong> Permessi insufficienti. 
                Verifica le policy RLS (Row Level Security) nel database.
              </p>
            </div>
          )}
          
          {error?.message.includes('Invalid API key') && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-3">
              <p className="text-sm text-yellow-800">
                <strong>Soluzione:</strong> Chiave API Supabase non valida. 
                Verifica le variabili d'ambiente NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.
              </p>
            </div>
          )}
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={retryConnection}
            className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Riprova connessione
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Ricarica pagina
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
