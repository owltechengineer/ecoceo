'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface TestResult {
  table: string;
  exists: boolean;
  count: number;
  error?: string;
  data?: any[];
}

export default function DashboardDataTest() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [error, setError] = useState<string>('');

  const tablesToTest = [
    'task_calendar_appointments',
    'task_calendar_tasks', 
    'task_calendar_projects',
    'recurring_activities',
    'quick_tasks',
    'campaigns',
    'leads',
    'projects',
    'project_objectives',
    'project_budget',
    'project_team',
    'project_milestones',
    'project_risks'
  ];

  const testTable = async (tableName: string): Promise<TestResult> => {
    try {
      // Test se la tabella esiste e conta i record
      const { data, error, count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact' })
        .eq('user_id', 'default-user')
        .limit(5);

      if (error) {
        if (error.message.includes('relation') && error.message.includes('does not exist')) {
          return {
            table: tableName,
            exists: false,
            count: 0,
            error: 'Tabella non esiste'
          };
        } else {
          return {
            table: tableName,
            exists: true,
            count: 0,
            error: error.message
          };
        }
      }

      return {
        table: tableName,
        exists: true,
        count: count || 0,
        data: data || []
      };

    } catch (err: any) {
      return {
        table: tableName,
        exists: false,
        count: 0,
        error: err.message
      };
    }
  };

  const runTests = async () => {
    setIsLoading(true);
    setError('');
    setResults([]);

    try {
      const testResults: TestResult[] = [];

      for (const table of tablesToTest) {
        console.log(`Testando ${table}...`);
        const result = await testTable(table);
        testResults.push(result);
      }

      setResults(testResults);

      // Verifica se ci sono problemi
      const missingTables = testResults.filter(r => !r.exists);
      const emptyTables = testResults.filter(r => r.exists && r.count === 0);

      if (missingTables.length > 0) {
        setError(`Tabelle mancanti: ${missingTables.map(t => t.table).join(', ')}`);
      } else if (emptyTables.length > 0) {
        setError(`Tabelle vuote: ${emptyTables.map(t => t.table).join(', ')}`);
      }

    } catch (err: any) {
      setError(`Errore durante i test: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (result: TestResult) => {
    if (!result.exists) return '❌';
    if (result.count === 0) return '⚠️';
    return '✅';
  };

  const getStatusText = (result: TestResult) => {
    if (!result.exists) return 'Non esiste';
    if (result.count === 0) return 'Vuota';
    return `${result.count} record`;
  };

  return (
    <div className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">🔍 Test Dati Dashboard</h3>
        <button
          onClick={runTests}
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Test in corso...' : 'Testa Dati'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">
            <strong>Problema rilevato:</strong> {error}
          </p>
          <div className="mt-2 text-sm text-red-700">
            <p><strong>Soluzioni:</strong></p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Esegui lo script di creazione database</li>
              <li>Inserisci i dati di test</li>
              <li>Verifica le variabili d'ambiente</li>
            </ul>
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Risultati Test:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {results.map((result, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
              >
                <span className="text-sm font-medium text-gray-700">
                  {result.table}
                </span>
                <div className="flex items-center space-x-2">
                  <span>{getStatusIcon(result)}</span>
                  <span className="text-sm">
                    {getStatusText(result)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <h5 className="font-medium text-blue-900 mb-2">Dettagli Dati:</h5>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {results
              .filter(r => r.exists && r.data && r.data.length > 0)
              .map((result, index) => (
                <div key={index} className="text-sm">
                  <strong>{result.table}:</strong>
                  <ul className="ml-4 mt-1">
                    {result.data?.slice(0, 3).map((item: any, i: number) => (
                      <li key={i} className="text-gray-600">
                        {item.title || item.name || item.id}
                      </li>
                    ))}
                    {result.data && result.data.length > 3 && (
                      <li className="text-gray-500">... e altri {result.data.length - 3}</li>
                    )}
                  </ul>
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        <p><strong>Note:</strong></p>
        <ul className="list-disc list-inside mt-1 space-y-1">
          <li>✅ = Tabella esiste con dati</li>
          <li>⚠️ = Tabella esiste ma vuota</li>
          <li>❌ = Tabella non esiste</li>
        </ul>
      </div>
    </div>
  );
}
