'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function SimpleDatabaseTest() {
  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testConnection = async () => {
    setIsLoading(true);
    setResults(null);
    
    try {
      const testResults: any = {
        timestamp: new Date().toISOString(),
        tests: {}
      };

      // Test 1: Connessione base
      try {
        const { data, error } = await supabase.from('_supabase_migrations').select('count').limit(1);
        testResults.tests.connection = {
          success: true,
          message: 'Connessione Supabase OK'
        };
      } catch (err) {
        testResults.tests.connection = {
          success: false,
          message: `Errore connessione: ${err instanceof Error ? err.message : 'Unknown'}`
        };
      }

      // Test 2: Verifica tabella campaigns
      try {
        const { data, error } = await supabase
          .from('campaigns')
          .select('count')
          .limit(1);

        if (error) {
          testResults.tests.campaigns = {
            success: false,
            message: `Errore campaigns: ${error.message}`,
            code: error.code,
            details: error.details
          };
        } else {
          testResults.tests.campaigns = {
            success: true,
            message: 'Tabella campaigns accessibile'
          };
        }
      } catch (err) {
        testResults.tests.campaigns = {
          success: false,
          message: `Exception campaigns: ${err instanceof Error ? err.message : 'Unknown'}`
        };
      }

      // Test 3: Verifica tabella leads
      try {
        const { data, error } = await supabase
          .from('leads')
          .select('count')
          .limit(1);

        if (error) {
          testResults.tests.leads = {
            success: false,
            message: `Errore leads: ${error.message}`,
            code: error.code,
            details: error.details
          };
        } else {
          testResults.tests.leads = {
            success: true,
            message: 'Tabella leads accessibile'
          };
        }
      } catch (err) {
        testResults.tests.leads = {
          success: false,
          message: `Exception leads: ${err instanceof Error ? err.message : 'Unknown'}`
        };
      }

      // Test 4: Prova a leggere dati esistenti
      try {
        const { data: campaignsData, error: campaignsError } = await supabase
          .from('campaigns')
          .select('*')
          .limit(5);

        if (campaignsError) {
          testResults.tests.campaignsData = {
            success: false,
            message: `Errore lettura campaigns: ${campaignsError.message}`,
            code: campaignsError.code
          };
        } else {
          testResults.tests.campaignsData = {
            success: true,
            message: `Letti ${campaignsData?.length || 0} campaigns`,
            count: campaignsData?.length || 0
          };
        }
      } catch (err) {
        testResults.tests.campaignsData = {
          success: false,
          message: `Exception lettura campaigns: ${err instanceof Error ? err.message : 'Unknown'}`
        };
      }

      try {
        const { data: leadsData, error: leadsError } = await supabase
          .from('leads')
          .select('*')
          .limit(5);

        if (leadsError) {
          testResults.tests.leadsData = {
            success: false,
            message: `Errore lettura leads: ${leadsError.message}`,
            code: leadsError.code
          };
        } else {
          testResults.tests.leadsData = {
            success: true,
            message: `Letti ${leadsData?.length || 0} leads`,
            count: leadsData?.length || 0
          };
        }
      } catch (err) {
        testResults.tests.leadsData = {
          success: false,
          message: `Exception lettura leads: ${err instanceof Error ? err.message : 'Unknown'}`
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
    <div className="bg-white/30 backdrop-blurrounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="p-2 bg-green-100 rounded-lg mr-3">
            <span className="text-xl">🔍</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900">Test Connessione Semplice</h3>
        </div>
        <button
          onClick={testConnection}
          disabled={isLoading}
          className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center">
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
              Test in corso...
            </span>
          ) : (
            '🚀 Test Connessione'
          )}
        </button>
      </div>

      {results && (
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg border">
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
                  <div className="flex items-center justify-between">
                    <h4 className={`font-semibold ${
                      testResult.success ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {testName === 'connection' && '🔗 Connessione'}
                      {testName === 'campaigns' && '📊 Tabella Campaigns'}
                      {testName === 'leads' && '👥 Tabella Leads'}
                      {testName === 'campaignsData' && '📈 Dati Campaigns'}
                      {testName === 'leadsData' && '📊 Dati Leads'}
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
                  {testResult.code && (
                    <p className="text-xs text-red-600 mt-1">
                      <strong>Codice:</strong> {testResult.code}
                    </p>
                  )}
                  {testResult.details && (
                    <p className="text-xs text-red-600 mt-1">
                      <strong>Dettagli:</strong> {testResult.details}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-2">ℹ️ Informazioni Test</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>Connessione:</strong> Verifica la connessione base a Supabase</li>
          <li>• <strong>Campaigns:</strong> Testa l'accesso alla tabella campaigns</li>
          <li>• <strong>Leads:</strong> Testa l'accesso alla tabella leads</li>
          <li>• <strong>Dati:</strong> Prova a leggere i dati esistenti</li>
        </ul>
      </div>
    </div>
  );
}