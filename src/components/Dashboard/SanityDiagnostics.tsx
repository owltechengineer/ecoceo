'use client';

import { useState, useEffect } from 'react';
import { checkSanityConnection } from '@/sanity/lib/client';

interface SanityStatus {
  connected: boolean;
  error: string | null;
  envVars: {
    projectId: string;
    dataset: string;
    apiVersion: string;
  };
  timestamp: string;
}

export default function SanityDiagnostics() {
  const [status, setStatus] = useState<SanityStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSanityStatus();
  }, []);

  const checkSanityStatus = async () => {
    setLoading(true);
    try {
      const connectionStatus = await checkSanityConnection();
      
      const envVars = {
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'NON CONFIGURATO',
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'NON CONFIGURATO',
        apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || 'NON CONFIGURATO',
      };

      setStatus({
        ...connectionStatus,
        envVars,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      setStatus({
        connected: false,
        error: error.message,
        envVars: {
          projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'NON CONFIGURATO',
          dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'NON CONFIGURATO',
          apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || 'NON CONFIGURATO',
        },
        timestamp: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Controllo stato Sanity...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Diagnostica Sanity</h3>
        <button
          onClick={checkSanityStatus}
          className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Ricontrolla
        </button>
      </div>

      {/* Status */}
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${status?.connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className={`font-medium ${status?.connected ? 'text-green-700' : 'text-red-700'}`}>
            {status?.connected ? 'Connesso' : 'Disconnesso'}
          </span>
        </div>
        {status?.error && (
          <p className="text-red-600 text-sm mt-1">{status.error}</p>
        )}
      </div>

      {/* Environment Variables */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-900 mb-2">Variabili d'Ambiente</h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Project ID:</span>
            <span className={`text-sm font-mono ${status?.envVars.projectId === 'NON CONFIGURATO' ? 'text-red-600' : 'text-green-600'}`}>
              {status?.envVars.projectId}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Dataset:</span>
            <span className={`text-sm font-mono ${status?.envVars.dataset === 'NON CONFIGURATO' ? 'text-red-600' : 'text-green-600'}`}>
              {status?.envVars.dataset}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">API Version:</span>
            <span className={`text-sm font-mono ${status?.envVars.apiVersion === 'NON CONFIGURATO' ? 'text-red-600' : 'text-green-600'}`}>
              {status?.envVars.apiVersion}
            </span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      {!status?.connected && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-medium text-yellow-800 mb-2">Come risolvere:</h4>
          <ol className="text-sm text-yellow-700 space-y-1">
            <li>1. Configura le variabili d'ambiente nel tuo provider di hosting</li>
            <li>2. Assicurati che NEXT_PUBLIC_SANITY_PROJECT_ID sia corretto</li>
            <li>3. Verifica che NEXT_PUBLIC_SANITY_DATASET sia impostato</li>
            <li>4. Controlla che il progetto Sanity sia pubblicato</li>
            <li>5. Riavvia l'applicazione dopo aver configurato le variabili</li>
          </ol>
        </div>
      )}

      {/* Timestamp */}
      <div className="text-xs text-gray-500 mt-4">
        Ultimo controllo: {status?.timestamp ? new Date(status.timestamp).toLocaleString('it-IT') : 'N/A'}
      </div>
    </div>
  );
}
