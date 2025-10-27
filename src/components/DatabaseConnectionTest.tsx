'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function DatabaseConnectionTest() {
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<{
    connection: 'success' | 'error' | null;
    tables: { [key: string]: 'success' | 'error' | 'missing' };
    error?: string;
  }>({
    connection: null,
    tables: {}
  });

  const testConnection = async () => {
    setIsLoading(true);
    setTestResults({ connection: null, tables: {} });

    try {
      // Test 1: Connessione base
      const { data, error } = await supabase
        .from('dashboard_data')
        .select('id')
        .limit(1);

      if (error) {
        throw error;
      }

      setTestResults(prev => ({ ...prev, connection: 'success' }));

      // Test 2: Verifica tabelle
      const tablesToTest = [
        'dashboard_data',
        'financial_fixed_costs',
        'financial_variable_costs',
        'financial_revenues',
        'financial_budgets',
        'marketing_campaigns',
        'marketing_leads',
        'task_calendar_projects',
        'task_calendar_tasks',
        'recurring_activities'
      ];

      const tableResults: { [key: string]: 'success' | 'error' | 'missing' } = {};

      for (const table of tablesToTest) {
        try {
          const { error: tableError } = await supabase
            .from(table)
            .select('id')
            .limit(1);

          if (tableError) {
            if (tableError.message.includes('relation') && tableError.message.includes('does not exist')) {
              tableResults[table] = 'missing';
            } else {
              tableResults[table] = 'error';
            }
          } else {
            tableResults[table] = 'success';
          }
        } catch (err) {
          tableResults[table] = 'error';
        }
      }

      setTestResults(prev => ({ ...prev, tables: tableResults }));

    } catch (error) {
      setTestResults({
        connection: 'error',
        tables: {},
        error: (error as Error).message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: 'success' | 'error' | 'missing' | null) => {
    switch (status) {
      case 'success':
        return <span className="text-green-500">✅</span>;
      case 'error':
        return <span className="text-red-500">❌</span>;
      case 'missing':
        return <span className="text-yellow-500">⚠️</span>;
      default:
        return <span className="text-gray-400">⏳</span>;
    }
  };

  const getStatusText = (status: 'success' | 'error' | 'missing' | null) => {
    switch (status) {
      case 'success':
        return 'OK';
      case 'error':
        return 'Errore';
      case 'missing':
        return 'Mancante';
      default:
        return 'Non testato';
    }
  };

  return (
    <div className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">🔧 Test Connessione Database</h3>
        <button
          onClick={testConnection}
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Test in corso...' : 'Testa Connessione'}
        </button>
      </div>

      {testResults.connection !== null && (
        <div className="space-y-4">
          {/* Test Connessione */}
          <div className="flex items-center justify-between p-3 bg-white/30rounded-md">
            <span className="font-medium text-gray-900">Connessione Supabase</span>
            <div className="flex items-center space-x-2">
              {getStatusIcon(testResults.connection)}
              <span className="text-sm font-medium">
                {getStatusText(testResults.connection)}
              </span>
            </div>
          </div>

          {/* Errore di connessione */}
          {testResults.connection === 'error' && testResults.error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">
                <strong>Errore:</strong> {testResults.error}
              </p>
              <div className="mt-2 text-sm text-red-700">
                <p><strong>Possibili soluzioni:</strong></p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Verifica le variabili d'ambiente NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
                  <li>Controlla che il progetto Supabase sia attivo</li>
                  <li>Verifica la connessione internet</li>
                </ul>
              </div>
            </div>
          )}

          {/* Test Tabelle */}
          {Object.keys(testResults.tables).length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Stato Tabelle</h4>
              <div className="space-y-2">
                {Object.entries(testResults.tables).map(([table, status]) => (
                  <div key={table} className="flex items-center justify-between p-2 bg-white/30rounded">
                    <span className="text-sm font-mono text-gray-700">{table}</span>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(status)}
                      <span className="text-sm font-medium">
                        {getStatusText(status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Istruzioni per tabelle mancanti */}
          {Object.values(testResults.tables).includes('missing') && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                <strong>⚠️ Tabelle mancanti rilevate</strong>
              </p>
              <p className="text-sm text-yellow-700 mt-1">
                Alcune tabelle non esistono nel database. Vai alla sezione "Setup Database" 
                per creare le tabelle necessarie.
              </p>
            </div>
          )}

          {/* Tutto OK */}
          {testResults.connection === 'success' && 
           Object.values(testResults.tables).every(status => status === 'success') && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800">
                <strong>✅ Tutto OK!</strong> La connessione al database funziona correttamente 
                e tutte le tabelle sono presenti.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
