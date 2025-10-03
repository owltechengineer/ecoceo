'use client';

import { useState } from 'react';
import { useClientDate } from '../../hooks/useClientDate';
import { supabase } from '@/lib/supabase';

interface TestResult {
  id: string;
  name: string;
  status: 'pending' | 'success' | 'error' | 'warning';
  message: string;
  details?: any;
}

interface SectionTestProps {
  sectionName: string;
  sectionIcon: string;
  tables: string[];
  testFunctions: {
    [key: string]: () => Promise<any>;
  };
}

export default function SectionTests({ sectionName, sectionIcon, tables, testFunctions }: SectionTestProps) {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [overallStatus, setOverallStatus] = useState<'idle' | 'success' | 'warning' | 'error'>('idle');
  const { getCurrentTime } = useClientDate();

  const runAllTests = async () => {
    setIsLoading(true);
    setResults([]);
    const newResults: TestResult[] = [];
    let currentOverallStatus: 'success' | 'warning' | 'error' = 'success';

    try {
      // Test 1: Connessione Database
      newResults.push({
        id: 'connection',
        name: 'Connessione Database',
        status: 'pending',
        message: 'Testando connessione...'
      });
      setResults([...newResults]);

      try {
        const { data, error } = await supabase.from('campaigns').select('count', { count: 'exact' });
        if (error) throw error;
        
        newResults[0] = {
          id: 'connection',
          name: 'Connessione Database',
          status: 'success',
          message: 'Connessione database riuscita',
          details: { connection: 'OK' }
        };
      } catch (error) {
        newResults[0] = {
          id: 'connection',
          name: 'Connessione Database',
          status: 'error',
          message: `Errore connessione: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`,
          details: { error }
        };
        currentOverallStatus = 'error';
      }
      setResults([...newResults]);

      // Test 2: Verifica Tabelle
      for (let i = 0; i < tables.length; i++) {
        const table = tables[i];
        newResults.push({
          id: `table-${table}`,
          name: `Tabella ${table}`,
          status: 'pending',
          message: 'Verificando esistenza...'
        });
        setResults([...newResults]);

        try {
          const { data, error } = await supabase.from(table).select('count', { count: 'exact' });
          if (error) throw error;
          
          newResults[i + 1] = {
            id: `table-${table}`,
            name: `Tabella ${table}`,
            status: 'success',
            message: `Tabella ${table} accessibile (${data?.length || 0} record)`,
            details: { recordCount: data?.length || 0 }
          };
        } catch (error) {
          newResults[i + 1] = {
            id: `table-${table}`,
            name: `Tabella ${table}`,
            status: 'error',
            message: `Tabella ${table} non accessibile: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`,
            details: { error }
          };
          currentOverallStatus = 'error';
        }
        setResults([...newResults]);
      }

      // Test 3: Caricamento Dati
      newResults.push({
        id: 'load-data',
        name: 'Caricamento Dati',
        status: 'pending',
        message: 'Testando caricamento...'
      });
      setResults([...newResults]);

      try {
        const loadResults: any = {};
        for (const [testName, testFunction] of Object.entries(testFunctions)) {
          if (testName.includes('load') || testName.includes('Load')) {
            try {
              const result = await testFunction();
              loadResults[testName] = { success: true, data: result };
            } catch (error) {
              loadResults[testName] = { success: false, error: error instanceof Error ? error.message : 'Errore sconosciuto' };
            }
          }
        }

        const hasErrors = Object.values(loadResults).some((result: any) => !result.success);
        newResults[newResults.length - 1] = {
          id: 'load-data',
          name: 'Caricamento Dati',
          status: hasErrors ? 'warning' : 'success',
          message: hasErrors ? 'Alcuni dati non caricabili' : 'Caricamento dati riuscito',
          details: loadResults
        };
        
        if (hasErrors && currentOverallStatus === 'success') {
          currentOverallStatus = 'warning';
        }
      } catch (error) {
        newResults[newResults.length - 1] = {
          id: 'load-data',
          name: 'Caricamento Dati',
          status: 'error',
          message: `Errore caricamento: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`,
          details: { error }
        };
        currentOverallStatus = 'error';
      }
      setResults([...newResults]);

      // Test 4: Salvataggio Dati
      newResults.push({
        id: 'save-data',
        name: 'Salvataggio Dati',
        status: 'pending',
        message: 'Testando salvataggio...'
      });
      setResults([...newResults]);

      try {
        const saveResults: any = {};
        for (const [testName, testFunction] of Object.entries(testFunctions)) {
          if (testName.includes('save') || testName.includes('Save') || testName.includes('create') || testName.includes('Create')) {
            try {
              const result = await testFunction();
              saveResults[testName] = { success: true, data: result };
            } catch (error) {
              saveResults[testName] = { success: false, error: error instanceof Error ? error.message : 'Errore sconosciuto' };
            }
          }
        }

        const hasErrors = Object.values(saveResults).some((result: any) => !result.success);
        newResults[newResults.length - 1] = {
          id: 'save-data',
          name: 'Salvataggio Dati',
          status: hasErrors ? 'warning' : 'success',
          message: hasErrors ? 'Alcuni salvataggi non riusciti' : 'Salvataggio dati riuscito',
          details: saveResults
        };
        
        if (hasErrors && currentOverallStatus === 'success') {
          currentOverallStatus = 'warning';
        }
      } catch (error) {
        newResults[newResults.length - 1] = {
          id: 'save-data',
          name: 'Salvataggio Dati',
          status: 'error',
          message: `Errore salvataggio: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`,
          details: { error }
        };
        currentOverallStatus = 'error';
      }
      setResults([...newResults]);

    } catch (error) {
      console.error('Errore generale test:', error);
    } finally {
      setIsLoading(false);
      setOverallStatus(currentOverallStatus);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'pending': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'pending': return '⏳';
      default: return '❓';
    }
  };

  const getOverallStatusColor = () => {
    switch (overallStatus) {
      case 'success': return 'from-green-500 to-green-600';
      case 'warning': return 'from-yellow-500 to-yellow-600';
      case 'error': return 'from-red-500 to-red-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-xl shadow-lg border border-gray-100">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`p-2 bg-gradient-to-r ${getOverallStatusColor()} rounded-lg mr-3`}>
              <span className="text-xl text-white">{sectionIcon}</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Test {sectionName}</h2>
              <p className="text-gray-600">Controlli completi per {sectionName.toLowerCase()}</p>
            </div>
          </div>
          <button
            onClick={runAllTests}
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                Test in Corso
              </span>
            ) : (
              '🧪 Esegui Test'
            )}
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="p-6">
        {results.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-2">🧪</div>
            <p className="text-gray-500">Clicca "Esegui Test" per iniziare i controlli</p>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((result) => (
              <div
                key={result.id}
                className={`p-4 rounded-lg border ${getStatusColor(result.status)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="mr-3 text-lg">{getStatusIcon(result.status)}</span>
                    <div>
                      <h3 className="font-semibold">{result.name}</h3>
                      <p className="text-sm opacity-75">{result.message}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(result.status)}`}>
                    {result.status.toUpperCase()}
                  </span>
                </div>
                
                {result.details && (
                  <div className="mt-3 p-3 bg-white/30 backdrop-blur/30 backdrop-blurbg-opacity-50 rounded text-xs">
                    <pre className="whitespace-pre-wrap">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-blue-500/20 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div>
            {results.length > 0 && (
              <>
                {results.filter(r => r.status === 'success').length} successi, {' '}
                {results.filter(r => r.status === 'error').length} errori, {' '}
                {results.filter(r => r.status === 'warning').length} avvisi
              </>
            )}
          </div>
          <div>
            Ultimo test: {getCurrentTime()}
          </div>
        </div>
      </div>
    </div>
  );
}
