'use client';

import { useState, useEffect } from 'react';

interface DatabaseErrorNotificationProps {
  error: Error | null;
  onDismiss: () => void;
}

export default function DatabaseErrorNotification({ error, onDismiss }: DatabaseErrorNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (error) {
      setIsVisible(true);
      // Auto-dismiss after 10 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        onDismiss();
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [error, onDismiss]);

  if (!error || !isVisible) return null;

  const getErrorType = (error: Error) => {
    if (error.message.includes('relation') && error.message.includes('does not exist')) {
      return {
        type: 'missing-tables',
        title: 'Tabelle Database Mancanti',
        message: 'Le tabelle per le attività ricorrenti non esistono ancora.',
        action: 'Esegui lo script SQL per crearle',
        color: 'bg-red-50 border-red-200 text-red-800'
      };
    } else if (error.message.includes('permission denied')) {
      return {
        type: 'permissions',
        title: 'Permessi Insufficienti',
        message: 'Non hai i permessi per accedere alle tabelle.',
        action: 'Verifica le policy RLS in Supabase',
        color: 'bg-yellow-50 border-yellow-200 text-yellow-800'
      };
    } else if (error.message.includes('connection')) {
      return {
        type: 'connection',
        title: 'Errore di Connessione',
        message: 'Impossibile connettersi al database.',
        action: 'Verifica la configurazione Supabase',
        color: 'bg-red-50 border-red-200 text-red-800'
      };
    } else {
      return {
        type: 'unknown',
        title: 'Errore Database',
        message: 'Si è verificato un errore imprevisto.',
        action: 'Controlla la console per dettagli',
        color: 'bg-white/30border-gray-200 text-gray-800'
      };
    }
  };

  const errorInfo = getErrorType(error);

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <div className={`rounded-lg border p-4 shadow-lg ${errorInfo.color}`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {errorInfo.type === 'missing-tables' && <span className="text-2xl">🗄️</span>}
            {errorInfo.type === 'permissions' && <span className="text-2xl">🔒</span>}
            {errorInfo.type === 'connection' && <span className="text-2xl">🔌</span>}
            {errorInfo.type === 'unknown' && <span className="text-2xl">⚠️</span>}
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium">{errorInfo.title}</h3>
            <p className="text-sm mt-1">{errorInfo.message}</p>
            <p className="text-xs mt-2 font-medium">{errorInfo.action}</p>
            {errorInfo.type === 'missing-tables' && (
              <div className="mt-3">
                <button
                  onClick={() => {
                    // Scroll to setup instructions
                    const setupElement = document.querySelector('[data-setup-instructions]');
                    if (setupElement) {
                      setupElement.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="text-xs bg-red-100 hover:bg-red-200 px-2 py-1 rounded transition-colors"
                >
                  📖 Vai alle Istruzioni
                </button>
              </div>
            )}
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={() => {
                setIsVisible(false);
                onDismiss();
              }}
              className="text-lg hover:opacity-70 transition-opacity"
            >
              ×
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
