'use client';

import { useState } from 'react';
import { supabaseHelpers, supabase } from '@/lib/supabase';

export default function BusinessPlanDataTest() {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [testData, setTestData] = useState({
    content: 'Test content per Executive Summary',
    pitch: 'Test pitch per il business plan',
    documents: []
  });

  const testSaveAndLoad = async () => {
    setIsLoading(true);
    setTestResult('Testing save and load...');
    
    try {
      const userId = 'default-user';
      
      // Test salvataggio Executive Summary
      setTestResult(prev => prev + '\n💾 Salvando Executive Summary...');
      await supabaseHelpers.saveExecutiveSummary(userId, testData);
      setTestResult(prev => prev + '\n✅ Executive Summary salvato');
      
      // Test caricamento Executive Summary
      setTestResult(prev => prev + '\n📥 Caricando Executive Summary...');
      const loadedData = await supabaseHelpers.loadExecutiveSummary(userId);
      setTestResult(prev => prev + '\n✅ Executive Summary caricato');
      setTestResult(prev => prev + `\n📄 Dati caricati: ${JSON.stringify(loadedData, null, 2)}`);
      
      // Test salvataggio Market Analysis
      const marketData = {
        demographics: [
          { segment: 'Test Segment', size: 1000, percentage: 50, growth: 5 }
        ],
        competitors: [
          { name: 'Test Competitor', marketShare: 30, strength: 'high' }
        ],
        swot: {
          strengths: ['Test Strength'],
          weaknesses: ['Test Weakness'],
          opportunities: ['Test Opportunity'],
          threats: ['Test Threat']
        }
      };
      
      setTestResult(prev => prev + '\n💾 Salvando Market Analysis...');
      await supabaseHelpers.saveMarketAnalysis(userId, marketData);
      setTestResult(prev => prev + '\n✅ Market Analysis salvato');
      
      // Test caricamento Market Analysis
      setTestResult(prev => prev + '\n📥 Caricando Market Analysis...');
      const loadedMarketData = await supabaseHelpers.loadMarketAnalysis(userId);
      setTestResult(prev => prev + '\n✅ Market Analysis caricato');
      setTestResult(prev => prev + `\n📄 Dati caricati: ${JSON.stringify(loadedMarketData, null, 2)}`);
      
      setTestResult(prev => prev + '\n🎉 Test completato con successo!');
      
    } catch (error: any) {
      setTestResult(prev => prev + `\n❌ Errore: ${error.message}`);
      console.error('Errore nel test:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearTestData = async () => {
    setIsLoading(true);
    setTestResult('Clearing test data...');
    
    try {
      const userId = 'default-user';
      
      // Pulisci i dati di test
      await supabase
        .from('business_plan_executive_summary')
        .delete()
        .eq('user_id', userId);
        
      await supabase
        .from('business_plan_market_analysis')
        .delete()
        .eq('user_id', userId);
      
      setTestResult('✅ Dati di test puliti');
      
    } catch (error: any) {
      setTestResult(`❌ Errore nella pulizia: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">🧪 Test Salvataggio e Caricamento Dati</h3>
      
      <div className="space-y-4">
        <div className="flex space-x-4">
          <button
            onClick={testSaveAndLoad}
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Testing...' : 'Test Salva e Carica'}
          </button>
          
          <button
            onClick={clearTestData}
            disabled={isLoading}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? 'Clearing...' : 'Pulisci Dati Test'}
          </button>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-lg">
          <h4 className="font-semibold mb-2 text-gray-900">Risultati Test:</h4>
          <pre className="text-sm whitespace-pre-wrap max-h-96 overflow-y-auto text-gray-900 bg-white/30 backdrop-blur/30 backdrop-blurp-3 rounded border">{testResult || 'Nessun test eseguito'}</pre>
        </div>
        
        <div className="text-sm text-gray-600">
          <p><strong>Dati di Test:</strong></p>
          <pre className="bg-white/30p-2 rounded text-xs text-gray-900">{JSON.stringify(testData, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}
