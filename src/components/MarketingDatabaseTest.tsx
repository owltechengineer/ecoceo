'use client';

import { useState } from 'react';
import { testMarketingDashboardConnection } from '@/lib/supabase';

export default function MarketingDatabaseTest() {
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    data?: any;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runTest = async () => {
    setIsLoading(true);
    try {
      const result = await testMarketingDashboardConnection();
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        message: `Errore durante il test: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg mr-3">
            <span className="text-xl">🔧</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900">Test Connessione Database Marketing</h3>
        </div>
        <button
          onClick={runTest}
          disabled={isLoading}
          className="bg-gradient-to-r from-gray-900 to-black text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center">
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
              Test in corso...
            </span>
          ) : (
            '🧪 Esegui Test'
          )}
        </button>
      </div>

      {testResult && (
        <div className={`p-4 rounded-lg border ${
          testResult.success 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-start">
            <span className={`text-2xl mr-3 ${
              testResult.success ? 'text-green-500' : 'text-red-500'
            }`}>
              {testResult.success ? '✅' : '❌'}
            </span>
            <div className="flex-1">
              <h4 className={`font-semibold mb-2 ${
                testResult.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {testResult.success ? 'Test Completato con Successo' : 'Test Fallito'}
              </h4>
              <p className={`text-sm ${
                testResult.success ? 'text-green-700' : 'text-red-700'
              }`}>
                {testResult.message}
              </p>
              
              {testResult.data && (
                <div className="mt-3 p-3 bg-white/30 backdrop-blur/30 backdrop-blurrounded border">
                  <h5 className="font-medium text-gray-800 mb-2">Dettagli:</h5>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Campagne:</span>
                      <span className="ml-2 text-gray-800">{testResult.data.campaigns}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Lead:</span>
                      <span className="ml-2 text-gray-800">{testResult.data.leads}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-2">ℹ️ Informazioni Test</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Verifica la connessione alle tabelle <code className="bg-blue-100 px-1 rounded">campaigns</code> e <code className="bg-blue-100 px-1 rounded">leads</code></li>
          <li>• Conta i record esistenti per ogni tabella</li>
          <li>• Testa i permessi di lettura del database</li>
          <li>• Verifica la configurazione di Supabase</li>
        </ul>
      </div>
    </div>
  );
}
