'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function DatabaseTableTest() {
  const [testResults, setTestResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testTables = async () => {
    setIsLoading(true);
    try {
      const results: any = {
        timestamp: new Date().toISOString(),
        tables: {}
      };

      // Test 1: Verifica se la tabella campaigns esiste
      try {
        const { data, error } = await supabase
          .from('campaigns')
          .select('count')
          .limit(1);

        results.tables.campaigns = {
          exists: !error,
          error: error ? {
            message: error.message,
            code: error.code,
            details: error.details
          } : null,
          canRead: !error
        };
      } catch (err) {
        results.tables.campaigns = {
          exists: false,
          error: {
            message: err instanceof Error ? err.message : 'Unknown error',
            type: 'exception'
          },
          canRead: false
        };
      }

      // Test 2: Verifica se la tabella leads esiste
      try {
        const { data, error } = await supabase
          .from('leads')
          .select('count')
          .limit(1);

        results.tables.leads = {
          exists: !error,
          error: error ? {
            message: error.message,
            code: error.code,
            details: error.details
          } : null,
          canRead: !error
        };
      } catch (err) {
        results.tables.leads = {
          exists: false,
          error: {
            message: err instanceof Error ? err.message : 'Unknown error',
            type: 'exception'
          },
          canRead: false
        };
      }

      // Test 3: Prova a leggere la struttura delle tabelle
      try {
        const { data: campaignsData, error: campaignsError } = await supabase
          .from('campaigns')
          .select('*')
          .limit(1);

        results.tables.campaigns.structure = {
          canSelect: !campaignsError,
          sampleData: campaignsData?.[0] || null,
          error: campaignsError ? {
            message: campaignsError.message,
            code: campaignsError.code
          } : null
        };
      } catch (err) {
        results.tables.campaigns.structure = {
          canSelect: false,
          error: {
            message: err instanceof Error ? err.message : 'Unknown error'
          }
        };
      }

      try {
        const { data: leadsData, error: leadsError } = await supabase
          .from('leads')
          .select('*')
          .limit(1);

        results.tables.leads.structure = {
          canSelect: !leadsError,
          sampleData: leadsData?.[0] || null,
          error: leadsError ? {
            message: leadsError.message,
            code: leadsError.code
          } : null
        };
      } catch (err) {
        results.tables.leads.structure = {
          canSelect: false,
          error: {
            message: err instanceof Error ? err.message : 'Unknown error'
          }
        };
      }

      setTestResults(results);
    } catch (error) {
      setTestResults({
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="p-2 bg-purple-100 rounded-lg mr-3">
            <span className="text-xl">🗄️</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900">Test Struttura Database</h3>
        </div>
        <button
          onClick={testTables}
          disabled={isLoading}
          className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center">
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
              Test in corso...
            </span>
          ) : (
            '🔍 Testa Tabelle'
          )}
        </button>
      </div>

      {testResults && (
        <div className="space-y-4">
          <div className="p-4 bg-blue-500/20 rounded-lg border">
            <h4 className="font-semibold text-gray-800 mb-2">Timestamp: {testResults.timestamp}</h4>
            {testResults.error && (
              <div className="p-3 bg-red-100 border border-red-200 rounded text-red-800">
                <strong>Errore Generale:</strong> {testResults.error}
              </div>
            )}
          </div>

          {testResults.tables && (
            <div className="space-y-4">
              {/* Campaigns Table */}
              <div className={`p-4 rounded-lg border ${
                testResults.tables.campaigns?.exists 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <h4 className={`font-semibold mb-2 ${
                  testResults.tables.campaigns?.exists ? 'text-green-800' : 'text-red-800'
                }`}>
                  📊 Tabella 'campaigns' {testResults.tables.campaigns?.exists ? '✅' : '❌'}
                </h4>
                <div className="space-y-2">
                  <div className="text-sm">
                    <strong>Esiste:</strong> {testResults.tables.campaigns?.exists ? 'Sì' : 'No'}
                  </div>
                  <div className="text-sm">
                    <strong>Leggibile:</strong> {testResults.tables.campaigns?.canRead ? 'Sì' : 'No'}
                  </div>
                  {testResults.tables.campaigns?.error && (
                    <div className="p-2 bg-red-100 rounded text-red-700 text-sm">
                      <strong>Errore:</strong> {testResults.tables.campaigns.error.message}
                      {testResults.tables.campaigns.error.code && (
                        <div><strong>Codice:</strong> {testResults.tables.campaigns.error.code}</div>
                      )}
                    </div>
                  )}
                  {testResults.tables.campaigns?.structure && (
                    <div className="p-2 bg-blue-100 rounded text-blue-700 text-sm">
                      <strong>Struttura:</strong> {testResults.tables.campaigns.structure.canSelect ? 'OK' : 'Errore'}
                      {testResults.tables.campaigns.structure.sampleData && (
                        <div className="mt-1">
                          <strong>Dati di esempio:</strong>
                          <pre className="text-xs mt-1 bg-white/30 backdrop-blur/30 backdrop-blurp-1 rounded border overflow-auto">
                            {JSON.stringify(testResults.tables.campaigns.structure.sampleData, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Leads Table */}
              <div className={`p-4 rounded-lg border ${
                testResults.tables.leads?.exists 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <h4 className={`font-semibold mb-2 ${
                  testResults.tables.leads?.exists ? 'text-green-800' : 'text-red-800'
                }`}>
                  👥 Tabella 'leads' {testResults.tables.leads?.exists ? '✅' : '❌'}
                </h4>
                <div className="space-y-2">
                  <div className="text-sm">
                    <strong>Esiste:</strong> {testResults.tables.leads?.exists ? 'Sì' : 'No'}
                  </div>
                  <div className="text-sm">
                    <strong>Leggibile:</strong> {testResults.tables.leads?.canRead ? 'Sì' : 'No'}
                  </div>
                  {testResults.tables.leads?.error && (
                    <div className="p-2 bg-red-100 rounded text-red-700 text-sm">
                      <strong>Errore:</strong> {testResults.tables.leads.error.message}
                      {testResults.tables.leads.error.code && (
                        <div><strong>Codice:</strong> {testResults.tables.leads.error.code}</div>
                      )}
                    </div>
                  )}
                  {testResults.tables.leads?.structure && (
                    <div className="p-2 bg-blue-100 rounded text-blue-700 text-sm">
                      <strong>Struttura:</strong> {testResults.tables.leads.structure.canSelect ? 'OK' : 'Errore'}
                      {testResults.tables.leads.structure.sampleData && (
                        <div className="mt-1">
                          <strong>Dati di esempio:</strong>
                          <pre className="text-xs mt-1 bg-white/30 backdrop-blur/30 backdrop-blurp-1 rounded border overflow-auto">
                            {JSON.stringify(testResults.tables.leads.structure.sampleData, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-2">ℹ️ Informazioni Test</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Verifica se le tabelle <code className="bg-blue-100 px-1 rounded">campaigns</code> e <code className="bg-blue-100 px-1 rounded">leads</code> esistono</li>
          <li>• Testa i permessi di lettura per ogni tabella</li>
          <li>• Mostra la struttura e i dati di esempio</li>
          <li>• Identifica errori specifici di configurazione</li>
        </ul>
      </div>
    </div>
  );
}
