'use client';

import { useState } from 'react';
import { supabaseHelpers, supabase } from '@/lib/supabase';

export default function BusinessPlanTest() {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testConnection = async () => {
    setIsLoading(true);
    setTestResult('Testing connection...');
    
    try {
      // Test 1: Verifica connessione base
      const { data, error } = await supabase
        .from('business_plan_executive_summary')
        .select('count')
        .limit(1);
      
      if (error) {
        setTestResult(`❌ Errore connessione: ${error.message}`);
        return;
      }
      
      setTestResult('✅ Connessione Supabase OK');
      
      // Test 2: Prova salvataggio
      const testData = {
        content: 'Test content',
        pitch: 'Test pitch',
        documents: []
      };
      
      await supabaseHelpers.saveExecutiveSummary('test-user', testData);
      setTestResult(prev => prev + '\n✅ Salvataggio OK');
      
      // Test 3: Prova caricamento
      const loadedData = await supabaseHelpers.loadExecutiveSummary('test-user');
      setTestResult(prev => prev + '\n✅ Caricamento OK');
      
      // Test 4: Pulisci dati di test
      await supabase
        .from('business_plan_executive_summary')
        .delete()
        .eq('user_id', 'test-user');
      
      setTestResult(prev => prev + '\n✅ Test completato con successo!');
      
    } catch (error: any) {
      setTestResult(`❌ Errore: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testAllTables = async () => {
    setIsLoading(true);
    setTestResult('Testing all tables...');
    
    try {
      const tables = [
        'business_plan_executive_summary',
        'business_plan_market_analysis',
        'business_plan_marketing_strategy',
        'business_plan_operational_plan',
        'business_plan_financial_plan',
        'business_plan_business_model',
        'business_plan_roadmap',
        'business_plan_documentation'
      ];
      
      let results = '';
      
      for (const table of tables) {
        try {
          const { data, error } = await supabase
            .from(table)
            .select('count')
            .limit(1);
          
          if (error) {
            results += `❌ ${table}: ${error.message}\n`;
          } else {
            results += `✅ ${table}: OK\n`;
          }
        } catch (err: any) {
          results += `❌ ${table}: ${err.message}\n`;
        }
      }
      
      setTestResult(results);
      
    } catch (error: any) {
      setTestResult(`❌ Errore generale: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">🧪 Test Business Plan Database</h3>
      
      <div className="space-y-4">
        <div className="flex space-x-4">
          <button
            onClick={testConnection}
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Testing...' : 'Test Connessione'}
          </button>
          
          <button
            onClick={testAllTables}
            disabled={isLoading}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading ? 'Testing...' : 'Test Tutte le Tabelle'}
          </button>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-lg">
          <h4 className="font-semibold mb-2 text-gray-900">Risultati Test:</h4>
          <pre className="text-sm whitespace-pre-wrap text-gray-900 bg-white/30 backdrop-blur/30 backdrop-blurp-3 rounded border">{testResult || 'Nessun test eseguito'}</pre>
        </div>
        
        <div className="text-sm text-gray-600">
          <p><strong>Istruzioni:</strong></p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Clicca "Test Connessione" per verificare la connessione base</li>
            <li>Clicca "Test Tutte le Tabelle" per verificare che tutte le tabelle esistano</li>
            <li>Se ci sono errori, esegui lo schema SQL su Supabase</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
