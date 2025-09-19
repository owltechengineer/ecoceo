'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function DatabaseStatusCheck() {
  const [status, setStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const checkDatabaseStatus = async () => {
    setIsLoading(true);
    setStatus('🔍 Controllando lo stato del database...\n');
    
    try {
      // 1. Verifica connessione base
      setStatus(prev => prev + '1. Verifica connessione Supabase...\n');
      const { data: connectionTest, error: connectionError } = await supabase
        .from('business_plan_executive_summary')
        .select('count')
        .limit(1);
      
      if (connectionError) {
        setStatus(prev => prev + `❌ Errore connessione: ${connectionError.message}\n`);
        return;
      }
      setStatus(prev => prev + '✅ Connessione Supabase OK\n\n');
      
      // 2. Verifica tutte le tabelle
      setStatus(prev => prev + '2. Verifica tabelle Business Plan...\n');
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
      
      let allTablesExist = true;
      for (const table of tables) {
        try {
          const { data, error } = await supabase
            .from(table)
            .select('count')
            .limit(1);
          
          if (error) {
            setStatus(prev => prev + `❌ ${table}: ${error.message}\n`);
            allTablesExist = false;
          } else {
            setStatus(prev => prev + `✅ ${table}: OK\n`);
          }
        } catch (err: any) {
          setStatus(prev => prev + `❌ ${table}: ${err.message}\n`);
          allTablesExist = false;
        }
      }
      
      if (!allTablesExist) {
        setStatus(prev => prev + '\n🔧 SOLUZIONE: Esegui lo schema SQL su Supabase!\n');
        return;
      }
      
      setStatus(prev => prev + '\n✅ Tutte le tabelle esistono!\n\n');
      
      // 3. Test salvataggio
      setStatus(prev => prev + '3. Test salvataggio dati...\n');
      const testData = {
        content: 'Test content per verifica salvataggio',
        pitch: 'Test pitch per verifica salvataggio',
        documents: []
      };
      
      const { data: saveResult, error: saveError } = await supabase
        .from('business_plan_executive_summary')
        .upsert({
          user_id: 'test-save-load',
          content: testData.content,
          pitch: testData.pitch,
          documents: testData.documents,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })
        .select();
      
      if (saveError) {
        setStatus(prev => prev + `❌ Errore salvataggio: ${saveError.message}\n`);
        return;
      }
      
      setStatus(prev => prev + '✅ Salvataggio OK\n\n');
      
      // 4. Test caricamento
      setStatus(prev => prev + '4. Test caricamento dati...\n');
      const { data: loadResult, error: loadError } = await supabase
        .from('business_plan_executive_summary')
        .select('*')
        .eq('user_id', 'test-save-load')
        .single();
      
      if (loadError) {
        setStatus(prev => prev + `❌ Errore caricamento: ${loadError.message}\n`);
        return;
      }
      
      setStatus(prev => prev + '✅ Caricamento OK\n');
      setStatus(prev => prev + `📄 Dati caricati: ${JSON.stringify(loadResult, null, 2)}\n\n`);
      
      // 5. Pulisci dati di test
      setStatus(prev => prev + '5. Pulizia dati di test...\n');
      await supabase
        .from('business_plan_executive_summary')
        .delete()
        .eq('user_id', 'test-save-load');
      
      setStatus(prev => prev + '✅ Pulizia OK\n\n');
      setStatus(prev => prev + '🎉 TUTTO FUNZIONA CORRETTAMENTE!\n');
      setStatus(prev => prev + 'Il database è configurato e funzionante.\n');
      
    } catch (error: any) {
      setStatus(prev => prev + `❌ Errore generale: ${error.message}\n`);
      console.error('Errore dettagliato:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const testBusinessPlanSave = async () => {
    setIsLoading(true);
    setStatus('🧪 Test salvataggio Business Plan...\n');
    
    try {
      // Test con i dati reali del Business Plan
      const executiveSummaryData = {
        content: 'Executive Summary di test',
        pitch: 'Pitch di test per il business plan',
        documents: []
      };
      
      const { data, error } = await supabase
        .from('business_plan_executive_summary')
        .upsert({
          user_id: 'default-user',
          content: executiveSummaryData.content,
          pitch: executiveSummaryData.pitch,
          documents: executiveSummaryData.documents,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })
        .select();
      
      if (error) {
        setStatus(prev => prev + `❌ Errore salvataggio Business Plan: ${error.message}\n`);
        return;
      }
      
      setStatus(prev => prev + '✅ Salvataggio Business Plan OK\n');
      setStatus(prev => prev + `📄 Dati salvati: ${JSON.stringify(data, null, 2)}\n\n`);
      
      // Test caricamento
      const { data: loadedData, error: loadError } = await supabase
        .from('business_plan_executive_summary')
        .select('*')
        .eq('user_id', 'default-user')
        .single();
      
      if (loadError) {
        setStatus(prev => prev + `❌ Errore caricamento Business Plan: ${loadError.message}\n`);
        return;
      }
      
      setStatus(prev => prev + '✅ Caricamento Business Plan OK\n');
      setStatus(prev => prev + `📄 Dati caricati: ${JSON.stringify(loadedData, null, 2)}\n\n`);
      setStatus(prev => prev + '🎉 BUSINESS PLAN FUNZIONA CORRETTAMENTE!\n');
      
    } catch (error: any) {
      setStatus(prev => prev + `❌ Errore: ${error.message}\n`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">🔍 Controllo Stato Database</h3>
      
      <div className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <button
            onClick={checkDatabaseStatus}
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Controllando...' : '🔍 Controlla Database'}
          </button>
          
          <button
            onClick={testBusinessPlanSave}
            disabled={isLoading}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading ? 'Testando...' : '🧪 Test Business Plan'}
          </button>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-lg">
          <h4 className="font-semibold mb-2 text-gray-900">Risultati Controllo:</h4>
          <pre className="text-sm whitespace-pre-wrap max-h-96 overflow-y-auto text-gray-900 bg-white p-3 rounded border">{status || 'Nessun controllo eseguito'}</pre>
        </div>
        
        <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
          <p><strong>🔧 Istruzioni:</strong></p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Clicca "Controlla Database" per verificare lo stato completo</li>
            <li>Clicca "Test Business Plan" per testare il salvataggio/caricamento</li>
            <li>Se ci sono errori, segui le istruzioni mostrate</li>
            <li>Se tutto è OK, il problema è nel codice dell'applicazione</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
