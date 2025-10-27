'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function DirectSupabaseTest() {
  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testDirectConnection = async () => {
    setIsLoading(true);
    setResults(null);
    
    try {
      const testResults: any = {
        timestamp: new Date().toISOString(),
        tests: {}
      };

      // Test 1: Verifica configurazione Supabase
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      testResults.tests.config = {
        success: !!(supabaseUrl && supabaseKey),
        message: supabaseUrl && supabaseKey ? 'Configurazione OK' : 'Configurazione mancante',
        url: supabaseUrl ? 'Presente' : 'Mancante',
        key: supabaseKey ? 'Presente' : 'Mancante'
      };

      // Test 2: Test connessione diretta
      try {
        const { data, error } = await supabase.auth.getSession();
        testResults.tests.auth = {
          success: !error,
          message: error ? `Errore auth: ${error.message}` : 'Auth OK',
          session: data?.session ? 'Sessione attiva' : 'Nessuna sessione'
        };
      } catch (err) {
        testResults.tests.auth = {
          success: false,
          message: `Exception auth: ${err instanceof Error ? err.message : 'Unknown'}`
        };
      }

      // Test 3: Test query semplice
      try {
        const { data, error } = await supabase
          .from('campaigns')
          .select('id')
          .limit(1);

        if (error) {
          testResults.tests.campaignsQuery = {
            success: false,
            message: `Errore query campaigns: ${error.message}`,
            code: error.code,
            details: error.details,
            hint: error.hint
          };
        } else {
          testResults.tests.campaignsQuery = {
            success: true,
            message: 'Query campaigns OK',
            data: data
          };
        }
      } catch (err) {
        testResults.tests.campaignsQuery = {
          success: false,
          message: `Exception query campaigns: ${err instanceof Error ? err.message : 'Unknown'}`
        };
      }

      // Test 4: Test query leads
      try {
        const { data, error } = await supabase
          .from('leads')
          .select('id')
          .limit(1);

        if (error) {
          testResults.tests.leadsQuery = {
            success: false,
            message: `Errore query leads: ${error.message}`,
            code: error.code,
            details: error.details,
            hint: error.hint
          };
        } else {
          testResults.tests.leadsQuery = {
            success: true,
            message: 'Query leads OK',
            data: data
          };
        }
      } catch (err) {
        testResults.tests.leadsQuery = {
          success: false,
          message: `Exception query leads: ${err instanceof Error ? err.message : 'Unknown'}`
        };
      }

      // Test 5: Test inserimento di prova
      try {
        const testCampaign = {
          user_id: 'test-user-direct',
          name: 'Test Campaign Direct',
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
          testResults.tests.insertCampaign = {
            success: false,
            message: `Errore inserimento: ${error.message}`,
            code: error.code,
            details: error.details
          };
        } else {
          testResults.tests.insertCampaign = {
            success: true,
            message: 'Inserimento OK',
            insertedId: data?.[0]?.id
          };

          // Prova a cancellare il record di test
          if (data?.[0]?.id) {
            await supabase.from('campaigns').delete().eq('id', data[0].id);
          }
        }
      } catch (err) {
        testResults.tests.insertCampaign = {
          success: false,
          message: `Exception inserimento: ${err instanceof Error ? err.message : 'Unknown'}`
        };
      }

      setResults(testResults);
    } catch (error) {
      setResults({
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
          <div className="p-2 bg-blue-100 rounded-lg mr-3">
            <span className="text-xl">⚡</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900">Test Connessione Diretta</h3>
        </div>
        <button
          onClick={testDirectConnection}
          disabled={isLoading}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center">
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
              Test in corso...
            </span>
          ) : (
            '⚡ Test Diretto'
          )}
        </button>
      </div>

      {results && (
        <div className="space-y-4">
          <div className="p-4 bg-white/30rounded-lg border">
            <h4 className="font-semibold text-gray-800 mb-2">Timestamp: {results.timestamp}</h4>
            {results.error && (
              <div className="p-3 bg-red-100 border border-red-200 rounded text-red-800">
                <strong>Errore Generale:</strong> {results.error}
              </div>
            )}
          </div>

          {results.tests && (
            <div className="space-y-3">
              {Object.entries(results.tests).map(([testName, testResult]: [string, any]) => (
                <div key={testName} className={`p-4 rounded-lg border ${
                  testResult.success 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  <h4 className={`font-semibold mb-2 ${
                    testResult.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {testName === 'config' && '⚙️ Configurazione'}
                    {testName === 'auth' && '🔐 Autenticazione'}
                    {testName === 'campaignsQuery' && '📊 Query Campaigns'}
                    {testName === 'leadsQuery' && '👥 Query Leads'}
                    {testName === 'insertCampaign' && '➕ Inserimento Test'}
                    {testResult.success ? ' ✅' : ' ❌'}
                  </h4>
                  <p className={`text-sm mb-2 ${
                    testResult.success ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {testResult.message}
                  </p>
                  
                  {testResult.url && (
                    <p className="text-xs text-gray-600">URL: {testResult.url}</p>
                  )}
                  {testResult.key && (
                    <p className="text-xs text-gray-600">Key: {testResult.key}</p>
                  )}
                  {testResult.session && (
                    <p className="text-xs text-gray-600">Sessione: {testResult.session}</p>
                  )}
                  {testResult.code && (
                    <p className="text-xs text-red-600">
                      <strong>Codice:</strong> {testResult.code}
                    </p>
                  )}
                  {testResult.details && (
                    <p className="text-xs text-red-600">
                      <strong>Dettagli:</strong> {testResult.details}
                    </p>
                  )}
                  {testResult.hint && (
                    <p className="text-xs text-red-600">
                      <strong>Hint:</strong> {testResult.hint}
                    </p>
                  )}
                  {testResult.insertedId && (
                    <p className="text-xs text-green-600">
                      <strong>ID Inserito:</strong> {testResult.insertedId}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
        <h4 className="font-semibold text-purple-800 mb-2">ℹ️ Test Diretto</h4>
        <ul className="text-sm text-purple-700 space-y-1">
          <li>• <strong>Configurazione:</strong> Verifica variabili d'ambiente</li>
          <li>• <strong>Autenticazione:</strong> Testa la connessione auth</li>
          <li>• <strong>Query:</strong> Testa query dirette alle tabelle</li>
          <li>• <strong>Inserimento:</strong> Prova inserimento e cancellazione</li>
        </ul>
      </div>
    </div>
  );
}
