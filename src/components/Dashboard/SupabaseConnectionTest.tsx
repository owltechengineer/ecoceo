'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function SupabaseConnectionTest() {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testBasicConnection = async () => {
    setIsLoading(true);
    setTestResult('Testing basic Supabase connection...');
    
    try {
      // Test 1: Verifica variabili d'ambiente
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!url || !key) {
        setTestResult('❌ Variabili d\'ambiente mancanti!');
        return;
      }
      
      setTestResult(`✅ Variabili d'ambiente OK\nURL: ${url}\nKey: ${key.substring(0, 20)}...`);
      
      // Test 2: Verifica connessione base
      const { data, error } = await supabase
        .from('business_plan_executive_summary')
        .select('count')
        .limit(1);
      
      if (error) {
        setTestResult(prev => prev + `\n❌ Errore connessione: ${JSON.stringify(error, null, 2)}`);
        return;
      }
      
      setTestResult(prev => prev + '\n✅ Connessione Supabase OK');
      
    } catch (error: any) {
      setTestResult(prev => prev + `\n❌ Errore: ${error.message}`);
      console.error('Errore dettagliato:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const testTableCreation = async () => {
    setIsLoading(true);
    setTestResult('Testing table creation...');
    
    try {
      // Prova a creare una tabella di test
      const { data, error } = await supabase
        .from('business_plan_executive_summary')
        .insert({
          user_id: 'test-connection',
          content: 'Test content',
          pitch: 'Test pitch',
          documents: []
        })
        .select();
      
      if (error) {
        setTestResult(prev => prev + `\n❌ Errore inserimento: ${JSON.stringify(error, null, 2)}`);
        
        // Se l'errore è "relation does not exist", le tabelle non sono state create
        if (error.message.includes('relation') && error.message.includes('does not exist')) {
          setTestResult(prev => prev + '\n🔧 SOLUZIONE: Esegui lo schema SQL su Supabase!');
        }
        
        return;
      }
      
      setTestResult(prev => prev + '\n✅ Inserimento test OK');
      
      // Pulisci il test
      await supabase
        .from('business_plan_executive_summary')
        .delete()
        .eq('user_id', 'test-connection');
      
      setTestResult(prev => prev + '\n✅ Test completato con successo!');
      
    } catch (error: any) {
      setTestResult(prev => prev + `\n❌ Errore: ${error.message}`);
      console.error('Errore dettagliato:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const testAllTables = async () => {
    setIsLoading(true);
    setTestResult('Testing all Business Plan tables...');
    
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
    
    try {
      for (const table of tables) {
        try {
          const { data, error } = await supabase
            .from(table)
            .select('count')
            .limit(1);
          
          if (error) {
            setTestResult(prev => prev + `\n❌ ${table}: ${error.message}`);
          } else {
            setTestResult(prev => prev + `\n✅ ${table}: OK`);
          }
        } catch (err: any) {
          setTestResult(prev => prev + `\n❌ ${table}: ${err.message}`);
        }
      }
      
    } catch (error: any) {
      setTestResult(prev => prev + `\n❌ Errore generale: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/30 backdrop-blurrounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">🔧 Test Connessione Supabase Dettagliato</h3>
      
      <div className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <button
            onClick={testBasicConnection}
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Testing...' : 'Test Connessione Base'}
          </button>
          
          <button
            onClick={testTableCreation}
            disabled={isLoading}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading ? 'Testing...' : 'Test Creazione Tabelle'}
          </button>
          
          <button
            onClick={testAllTables}
            disabled={isLoading}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {isLoading ? 'Testing...' : 'Test Tutte le Tabelle'}
          </button>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-lg">
          <h4 className="font-semibold mb-2 text-gray-900">Risultati Test:</h4>
          <pre className="text-sm whitespace-pre-wrap max-h-96 overflow-y-auto text-gray-900 bg-white/30 backdrop-blurp-3 rounded border">{testResult || 'Nessun test eseguito'}</pre>
        </div>
        
        <div className="text-sm text-gray-600 bg-yellow-50 p-4 rounded-lg">
          <p><strong>🔧 Istruzioni per la Risoluzione:</strong></p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Se vedi "relation does not exist" → Esegui lo schema SQL su Supabase</li>
            <li>Se vedi "permission denied" → Verifica le policy RLS</li>
            <li>Se vedi "connection failed" → Controlla le variabili d'ambiente</li>
            <li>Se tutto è OK → Il problema è nel codice di salvataggio</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
