'use client';

import { useState } from 'react';
import { supabaseHelpers, supabase } from '@/lib/supabase';

export default function BusinessPlanDebug() {
  const [debugResult, setDebugResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testSaveAndLoad = async () => {
    setIsLoading(true);
    setDebugResult('🧪 Test completo salvataggio e caricamento...\n\n');
    
    try {
      const userId = 'default-user';
      
      // 1. Test salvataggio Executive Summary
      setDebugResult(prev => prev + '1. Test salvataggio Executive Summary...\n');
      const executiveData = {
        content: 'Contenuto di test per Executive Summary',
        pitch: 'Pitch di test per il business plan',
        documents: []
      };
      
      await supabaseHelpers.saveExecutiveSummary(userId, executiveData);
      setDebugResult(prev => prev + '✅ Salvataggio Executive Summary OK\n\n');
      
      // 2. Test caricamento Executive Summary
      setDebugResult(prev => prev + '2. Test caricamento Executive Summary...\n');
      const loadedExecutive = await supabaseHelpers.loadExecutiveSummary(userId);
      setDebugResult(prev => prev + '✅ Caricamento Executive Summary OK\n');
      setDebugResult(prev => prev + `📄 Dati caricati: ${JSON.stringify(loadedExecutive, null, 2)}\n\n`);
      
      // 3. Test salvataggio Market Analysis
      setDebugResult(prev => prev + '3. Test salvataggio Market Analysis...\n');
      const marketData = {
        demographics: [
          { segment: 'Segmento Test', size: 1000, percentage: 50, growth: 5 }
        ],
        competitors: [
          { name: 'Competitor Test', marketShare: 30, strength: 'high' }
        ],
        swot: {
          strengths: ['Forza Test'],
          weaknesses: ['Debolezza Test'],
          opportunities: ['Opportunità Test'],
          threats: ['Minaccia Test']
        }
      };
      
      await supabaseHelpers.saveMarketAnalysis(userId, marketData);
      setDebugResult(prev => prev + '✅ Salvataggio Market Analysis OK\n\n');
      
      // 4. Test caricamento Market Analysis
      setDebugResult(prev => prev + '4. Test caricamento Market Analysis...\n');
      const loadedMarket = await supabaseHelpers.loadMarketAnalysis(userId);
      setDebugResult(prev => prev + '✅ Caricamento Market Analysis OK\n');
      setDebugResult(prev => prev + `📄 Dati caricati: ${JSON.stringify(loadedMarket, null, 2)}\n\n`);
      
      // 5. Test salvataggio Marketing Strategy
      setDebugResult(prev => prev + '5. Test salvataggio Marketing Strategy...\n');
      const marketingData = {
        description: 'Strategia di marketing di test',
        strategies: [
          { name: 'Strategia Test', description: 'Descrizione test', budget: 1000, timeline: '3 mesi' }
        ],
        timeline: [
          { task: 'Task Test', startDate: '2024-01-01', endDate: '2024-03-31', status: 'planned' }
        ],
        customerJourney: {
          awareness: 'Awareness test',
          consideration: 'Consideration test',
          decision: 'Decision test',
          retention: 'Retention test'
        }
      };
      
      await supabaseHelpers.saveMarketingStrategy(userId, marketingData);
      setDebugResult(prev => prev + '✅ Salvataggio Marketing Strategy OK\n\n');
      
      // 6. Test caricamento Marketing Strategy
      setDebugResult(prev => prev + '6. Test caricamento Marketing Strategy...\n');
      const loadedMarketing = await supabaseHelpers.loadMarketingStrategy(userId);
      setDebugResult(prev => prev + '✅ Caricamento Marketing Strategy OK\n');
      setDebugResult(prev => prev + `📄 Dati caricati: ${JSON.stringify(loadedMarketing, null, 2)}\n\n`);
      
      setDebugResult(prev => prev + '🎉 TUTTI I TEST COMPLETATI CON SUCCESSO!\n');
      setDebugResult(prev => prev + 'Le funzioni di salvataggio e caricamento funzionano correttamente.\n');
      setDebugResult(prev => prev + 'Il problema potrebbe essere nel codice dell\'applicazione.\n');
      
    } catch (error: any) {
      setDebugResult(prev => prev + `❌ Errore: ${error.message}\n`);
      console.error('Errore dettagliato:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const testBusinessPlanComponent = async () => {
    setIsLoading(true);
    setDebugResult('🧪 Test componente Business Plan...\n\n');
    
    try {
      const userId = 'default-user';
      
      // Simula il salvataggio come fa il componente
      setDebugResult(prev => prev + '1. Simulazione salvataggio Executive Summary...\n');
      const executiveData = {
        content: 'Contenuto simulato dal componente',
        pitch: 'Pitch simulato dal componente',
        documents: []
      };
      
      await supabaseHelpers.saveExecutiveSummary(userId, executiveData);
      setDebugResult(prev => prev + '✅ Salvataggio simulato OK\n\n');
      
      // Simula il caricamento come fa il componente
      setDebugResult(prev => prev + '2. Simulazione caricamento Executive Summary...\n');
      const loadedData = await supabaseHelpers.loadExecutiveSummary(userId);
      setDebugResult(prev => prev + '✅ Caricamento simulato OK\n');
      setDebugResult(prev => prev + `📄 Dati caricati: ${JSON.stringify(loadedData, null, 2)}\n\n`);
      
      // Verifica se i dati sono compatibili con il componente
      setDebugResult(prev => prev + '3. Verifica compatibilità dati...\n');
      if (loadedData && loadedData.content && loadedData.pitch) {
        setDebugResult(prev => prev + '✅ Dati compatibili con il componente\n');
        setDebugResult(prev => prev + 'Il problema potrebbe essere nel rendering o negli stati.\n');
      } else {
        setDebugResult(prev => prev + '❌ Dati non compatibili con il componente\n');
        setDebugResult(prev => prev + 'I dati caricati non hanno la struttura corretta.\n');
      }
      
    } catch (error: any) {
      setDebugResult(prev => prev + `❌ Errore: ${error.message}\n`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearTestData = async () => {
    setIsLoading(true);
    setDebugResult('🧹 Pulizia dati di test...\n\n');
    
    try {
      const userId = 'default-user';
      
      // Pulisci tutti i dati di test
      await supabase
        .from('business_plan_executive_summary')
        .delete()
        .eq('user_id', userId);
        
      await supabase
        .from('business_plan_market_analysis')
        .delete()
        .eq('user_id', userId);
        
      await supabase
        .from('business_plan_marketing_strategy')
        .delete()
        .eq('user_id', userId);
      
      setDebugResult(prev => prev + '✅ Dati di test puliti\n');
      setDebugResult(prev => prev + 'Ora puoi testare il Business Plan con dati puliti.\n');
      
    } catch (error: any) {
      setDebugResult(prev => prev + `❌ Errore nella pulizia: ${error.message}\n`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">🐛 Debug Business Plan</h3>
      
      <div className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <button
            onClick={testSaveAndLoad}
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Testando...' : '🧪 Test Completo'}
          </button>
          
          <button
            onClick={testBusinessPlanComponent}
            disabled={isLoading}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading ? 'Testando...' : '🧪 Test Componente'}
          </button>
          
          <button
            onClick={clearTestData}
            disabled={isLoading}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? 'Pulendo...' : '🧹 Pulisci Dati'}
          </button>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-lg">
          <h4 className="font-semibold mb-2 text-gray-900">Risultati Debug:</h4>
          <pre className="text-sm whitespace-pre-wrap max-h-96 overflow-y-auto text-gray-900 bg-white p-3 rounded border">{debugResult || 'Nessun test eseguito'}</pre>
        </div>
        
        <div className="text-sm text-gray-600 bg-yellow-50 p-4 rounded-lg">
          <p><strong>🔧 Istruzioni Debug:</strong></p>
          <ol className="list-decimal list-inside space-y-1">
            <li><strong>Test Completo:</strong> Verifica se le funzioni di salvataggio/caricamento funzionano</li>
            <li><strong>Test Componente:</strong> Simula il comportamento del componente Business Plan</li>
            <li><strong>Pulisci Dati:</strong> Rimuove tutti i dati di test per iniziare pulito</li>
            <li>Se i test passano, il problema è nel codice dell'applicazione</li>
            <li>Se i test falliscono, il problema è nel database o nelle funzioni</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
