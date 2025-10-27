'use client';

import { useState } from 'react';
import { marketingService } from '@/services/marketingService';
import { checkEnvironmentVariables, getSupabaseConfig } from '@/utils/envCheck';

export default function MarketingDebug() {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runDebug = async () => {
    setIsLoading(true);
    try {
      const debugData: any = {
        timestamp: new Date().toISOString(),
        tests: {}
      };

      // Test 1: Verifica configurazione
      const envCheck = checkEnvironmentVariables();
      const supabaseConfig = getSupabaseConfig();
      
      debugData.tests.config = {
        userId: marketingService['userId'],
        hasInstance: !!marketingService,
        environment: {
          isValid: envCheck.isValid,
          message: envCheck.message,
          missingVars: envCheck.missingVars,
          presentVars: envCheck.presentVars
        },
        supabase: {
          isConfigured: supabaseConfig.isConfigured,
          urlValid: supabaseConfig.urlValid,
          url: supabaseConfig.url
        }
      };

      // Test 2: Prova a caricare campagne
      try {
        const campaigns = await marketingService.getCampaigns();
        debugData.tests.campaigns = {
          success: true,
          count: campaigns.length,
          sample: campaigns[0] || null
        };
      } catch (error) {
        debugData.tests.campaigns = {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }

      // Test 3: Prova a caricare lead
      try {
        const leads = await marketingService.getLeads();
        debugData.tests.leads = {
          success: true,
          count: leads.length,
          sample: leads[0] || null
        };
      } catch (error) {
        debugData.tests.leads = {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }

      // Test 4: Prova a caricare statistiche
      try {
        const stats = await marketingService.getMarketingStats();
        debugData.tests.stats = {
          success: true,
          data: stats
        };
      } catch (error) {
        debugData.tests.stats = {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }

      setDebugInfo(debugData);
    } catch (error) {
      setDebugInfo({
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
          <div className="p-2 bg-red-100 rounded-lg mr-3">
            <span className="text-xl">🐛</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900">Debug Marketing Service</h3>
        </div>
        <button
          onClick={runDebug}
          disabled={isLoading}
          className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center">
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
              Debug in corso...
            </span>
          ) : (
            '🔍 Esegui Debug'
          )}
        </button>
      </div>

      {debugInfo && (
        <div className="space-y-4">
          <div className="p-4 bg-white/30rounded-lg border">
            <h4 className="font-semibold text-gray-800 mb-2">Timestamp: {debugInfo.timestamp}</h4>
            {debugInfo.error && (
              <div className="p-3 bg-red-100 border border-red-200 rounded text-red-800">
                <strong>Errore Generale:</strong> {debugInfo.error}
              </div>
            )}
          </div>

          {debugInfo.tests && (
            <div className="space-y-4">
              {/* Config Test */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">🔧 Configurazione</h4>
                <pre className="text-sm text-blue-700 bg-white/30 backdrop-blur/30 backdrop-blurp-2 rounded border overflow-auto">
                  {JSON.stringify(debugInfo.tests.config, null, 2)}
                </pre>
              </div>

              {/* Campaigns Test */}
              <div className={`p-4 rounded-lg border ${
                debugInfo.tests.campaigns?.success 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <h4 className={`font-semibold mb-2 ${
                  debugInfo.tests.campaigns?.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  🎯 Campagne {debugInfo.tests.campaigns?.success ? '✅' : '❌'}
                </h4>
                <pre className={`text-sm p-2 rounded border overflow-auto ${
                  debugInfo.tests.campaigns?.success ? 'text-green-700 bg-white/30 backdrop-blur/30 backdrop-blur' : 'text-red-700 bg-white/30 backdrop-blur/30 backdrop-blur'
                }`}>
                  {JSON.stringify(debugInfo.tests.campaigns, null, 2)}
                </pre>
              </div>

              {/* Leads Test */}
              <div className={`p-4 rounded-lg border ${
                debugInfo.tests.leads?.success 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <h4 className={`font-semibold mb-2 ${
                  debugInfo.tests.leads?.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  👥 Lead {debugInfo.tests.leads?.success ? '✅' : '❌'}
                </h4>
                <pre className={`text-sm p-2 rounded border overflow-auto ${
                  debugInfo.tests.leads?.success ? 'text-green-700 bg-white/30 backdrop-blur/30 backdrop-blur' : 'text-red-700 bg-white/30 backdrop-blur/30 backdrop-blur'
                }`}>
                  {JSON.stringify(debugInfo.tests.leads, null, 2)}
                </pre>
              </div>

              {/* Stats Test */}
              <div className={`p-4 rounded-lg border ${
                debugInfo.tests.stats?.success 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <h4 className={`font-semibold mb-2 ${
                  debugInfo.tests.stats?.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  📊 Statistiche {debugInfo.tests.stats?.success ? '✅' : '❌'}
                </h4>
                <pre className={`text-sm p-2 rounded border overflow-auto ${
                  debugInfo.tests.stats?.success ? 'text-green-700 bg-white/30 backdrop-blur/30 backdrop-blur' : 'text-red-700 bg-white/30 backdrop-blur/30 backdrop-blur'
                }`}>
                  {JSON.stringify(debugInfo.tests.stats, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Informazioni Debug</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Questo componente testa tutte le funzioni del MarketingService</li>
          <li>• Verifica la connessione al database e la mappatura dei dati</li>
          <li>• Mostra errori dettagliati per il troubleshooting</li>
          <li>• Controlla la console del browser per log aggiuntivi</li>
        </ul>
      </div>
    </div>
  );
}
