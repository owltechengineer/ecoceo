'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function SimpleMarketingTest() {
  const [isTesting, setIsTesting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const runCompleteTest = async () => {
    setIsTesting(true);
    setResult(null);
    
    try {
      const results: any = {
        timestamp: new Date().toISOString(),
        tests: {}
      };

      // Test 1: Verifica configurazione Supabase
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      results.tests.config = {
        success: !!(supabaseUrl && supabaseKey),
        message: supabaseUrl && supabaseKey ? 'Configurazione OK' : 'Configurazione mancante',
        url: supabaseUrl ? 'Presente' : 'Mancante',
        key: supabaseKey ? 'Presente' : 'Mancante'
      };

      // Test 2: Verifica tabella campaigns
      try {
        const { data, error } = await supabase
          .from('campaigns')
          .select('count')
          .limit(1);

        if (error) {
          results.tests.campaigns = {
            success: false,
            message: `Tabella campaigns: ${error.message}`,
            exists: false,
            error: error.message,
            code: error.code
          };
        } else {
          results.tests.campaigns = {
            success: true,
            message: 'Tabella campaigns: OK',
            exists: true
          };
        }
      } catch (err) {
        results.tests.campaigns = {
          success: false,
          message: `Tabella campaigns: ${err instanceof Error ? err.message : 'Unknown error'}`,
          exists: false,
          error: err instanceof Error ? err.message : 'Unknown error'
        };
      }

      // Test 3: Verifica tabella leads
      try {
        const { data, error } = await supabase
          .from('leads')
          .select('count')
          .limit(1);

        if (error) {
          results.tests.leads = {
            success: false,
            message: `Tabella leads: ${error.message}`,
            exists: false,
            error: error.message,
            code: error.code
          };
        } else {
          results.tests.leads = {
            success: true,
            message: 'Tabella leads: OK',
            exists: true
          };
        }
      } catch (err) {
        results.tests.leads = {
          success: false,
          message: `Tabella leads: ${err instanceof Error ? err.message : 'Unknown error'}`,
          exists: false,
          error: err instanceof Error ? err.message : 'Unknown error'
        };
      }

      // Test 4: Prova a leggere dati esistenti
      try {
        const { data: campaignsData, error: campaignsError } = await supabase
          .from('campaigns')
          .select('*')
          .limit(5);

        if (campaignsError) {
          results.tests.campaignsData = {
            success: false,
            message: `Lettura campaigns: ${campaignsError.message}`,
            error: campaignsError.message,
            code: campaignsError.code
          };
        } else {
          results.tests.campaignsData = {
            success: true,
            message: `Lettura campaigns: OK (${campaignsData?.length || 0} record)`,
            count: campaignsData?.length || 0
          };
        }
      } catch (err) {
        results.tests.campaignsData = {
          success: false,
          message: `Lettura campaigns: ${err instanceof Error ? err.message : 'Unknown error'}`,
          error: err instanceof Error ? err.message : 'Unknown error'
        };
      }

      try {
        const { data: leadsData, error: leadsError } = await supabase
          .from('leads')
          .select('*')
          .limit(5);

        if (leadsError) {
          results.tests.leadsData = {
            success: false,
            message: `Lettura leads: ${leadsError.message}`,
            error: leadsError.message,
            code: leadsError.code
          };
        } else {
          results.tests.leadsData = {
            success: true,
            message: `Lettura leads: OK (${leadsData?.length || 0} record)`,
            count: leadsData?.length || 0
          };
        }
      } catch (err) {
        results.tests.leadsData = {
          success: false,
          message: `Lettura leads: ${err instanceof Error ? err.message : 'Unknown error'}`,
          error: err instanceof Error ? err.message : 'Unknown error'
        };
      }

      // Test 5: Test inserimento di prova
      try {
        const testCampaign = {
          user_id: 'test-user',
          name: 'Test Campaign',
          channel: 'Test',
          start_date: '2024-01-01',
          budget: 1000,
          spent: 0,
          leads: 0,
          conversions: 0,
          revenue: 0,
          status: 'active',
          cac: 0,
          ltv: 0,
          ltv_cac_ratio: 0,
          planned_leads: 0,
          planned_conversions: 0,
          planned_revenue: 0,
          actual_leads: 0,
          actual_conversions: 0
        };

        const { data, error } = await supabase
          .from('campaigns')
          .insert(testCampaign)
          .select();

        if (error) {
          results.tests.insertTest = {
            success: false,
            message: `Inserimento test: ${error.message}`,
            error: error.message,
            code: error.code
          };
        } else {
          results.tests.insertTest = {
            success: true,
            message: 'Inserimento test: OK',
            insertedId: data?.[0]?.id
          };

          // Prova a cancellare il record di test
          if (data?.[0]?.id) {
            await supabase.from('campaigns').delete().eq('id', data[0].id);
          }
        }
      } catch (err) {
        results.tests.insertTest = {
          success: false,
          message: `Inserimento test: ${err instanceof Error ? err.message : 'Unknown error'}`,
          error: err instanceof Error ? err.message : 'Unknown error'
        };
      }

      setResult(results);
    } catch (error) {
      setResult({
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsTesting(false);
    }
  };

  const getOverallStatus = () => {
    if (!result?.tests) return 'unknown';
    
    const tests = Object.values(result.tests) as any[];
    const allSuccess = tests.every(test => test.success);
    const anySuccess = tests.some(test => test.success);
    
    if (allSuccess) return 'success';
    if (anySuccess) return 'partial';
    return 'error';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'from-green-600 to-green-700';
      case 'partial': return 'from-yellow-600 to-yellow-700';
      case 'error': return 'from-red-600 to-red-700';
      default: return 'from-gray-600 to-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅';
      case 'partial': return '⚠️';
      case 'error': return '❌';
      default: return '❓';
    }
  };

  const overallStatus = getOverallStatus();

  return (
    <div className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg mr-3">
            <span className="text-xl">🧪</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900">Test Marketing Completo</h3>
        </div>
        <button
          onClick={runCompleteTest}
          disabled={isTesting}
          className={`bg-gradient-to-r ${getStatusColor(overallStatus)} text-white px-8 py-4 rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed text-lg`}
        >
          {isTesting ? (
            <span className="flex items-center">
              <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></span>
              Test in corso...
            </span>
          ) : (
            <span className="flex items-center">
              {getStatusIcon(overallStatus)}
              <span className="ml-2">Test Marketing</span>
            </span>
          )}
        </button>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="p-4 bg-blue-500/20 rounded-lg border">
            <h4 className="font-semibold text-gray-800 mb-2">Timestamp: {result.timestamp}</h4>
            {result.error && (
              <div className="p-3 bg-red-100 border border-red-200 rounded text-red-800">
                <strong>Errore Generale:</strong> {result.error}
              </div>
            )}
          </div>

          {result.tests && (
            <div className="space-y-3">
              {Object.entries(result.tests).map(([testName, testResult]: [string, any]) => (
                <div key={testName} className={`p-4 rounded-lg border ${
                  testResult.success 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <h4 className={`font-semibold ${
                      testResult.success ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {testName === 'config' && '⚙️ Configurazione'}
                      {testName === 'campaigns' && '📊 Tabella Campaigns'}
                      {testName === 'leads' && '👥 Tabella Leads'}
                      {testName === 'campaignsData' && '📈 Dati Campaigns'}
                      {testName === 'leadsData' && '📊 Dati Leads'}
                      {testName === 'insertTest' && '➕ Test Inserimento'}
                      {testResult.success ? ' ✅' : ' ❌'}
                    </h4>
                    {testResult.count !== undefined && (
                      <span className="text-sm text-gray-600">
                        {testResult.count} record
                      </span>
                    )}
                  </div>
                  <p className={`text-sm mt-1 ${
                    testResult.success ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {testResult.message}
                  </p>
                  {testResult.error && (
                    <p className="text-xs text-red-600 mt-1">
                      <strong>Errore:</strong> {testResult.error}
                    </p>
                  )}
                  {testResult.code && (
                    <p className="text-xs text-red-600 mt-1">
                      <strong>Codice:</strong> {testResult.code}
                    </p>
                  )}
                  {testResult.insertedId && (
                    <p className="text-xs text-green-600 mt-1">
                      <strong>ID Inserito:</strong> {testResult.insertedId}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Risultato finale */}
          <div className={`p-4 rounded-lg border ${
            overallStatus === 'success' 
              ? 'bg-green-50 border-green-200' 
              : overallStatus === 'partial'
              ? 'bg-yellow-50 border-yellow-200'
              : 'bg-red-50 border-red-200'
          }`}>
            <h4 className={`font-semibold mb-2 ${
              overallStatus === 'success' 
                ? 'text-green-800' 
                : overallStatus === 'partial'
                ? 'text-yellow-800'
                : 'text-red-800'
            }`}>
              {getStatusIcon(overallStatus)} Risultato Finale
            </h4>
            <p className={`text-sm ${
              overallStatus === 'success' 
                ? 'text-green-700' 
                : overallStatus === 'partial'
                ? 'text-yellow-700'
                : 'text-red-700'
            }`}>
              {overallStatus === 'success' && 'Tutti i test sono passati! Il sistema marketing è completamente funzionale.'}
              {overallStatus === 'partial' && 'Alcuni test sono passati, ma ci sono problemi da risolvere.'}
              {overallStatus === 'error' && 'I test sono falliti. È necessario creare le tabelle nel database.'}
            </p>
            {overallStatus === 'error' && (
              <div className="mt-3 p-3 bg-red-100 rounded text-red-800 text-sm">
                <strong>Soluzione:</strong> Esegui lo script SQL nel file <code className="bg-red-200 px-1 rounded">MARKETING_SCHEMA.sql</code> nel Supabase SQL Editor.
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-2">ℹ️ Test Completo</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>Configurazione:</strong> Verifica variabili d'ambiente</li>
          <li>• <strong>Campaigns:</strong> Testa esistenza e accesso alla tabella</li>
          <li>• <strong>Leads:</strong> Testa esistenza e accesso alla tabella</li>
          <li>• <strong>Dati:</strong> Prova a leggere i dati esistenti</li>
          <li>• <strong>Inserimento:</strong> Testa inserimento e cancellazione</li>
        </ul>
      </div>
    </div>
  );
}
