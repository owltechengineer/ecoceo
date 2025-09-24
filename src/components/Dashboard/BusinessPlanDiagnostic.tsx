'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function BusinessPlanDiagnostic() {
  const [diagnosis, setDiagnosis] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const runDiagnosis = async () => {
    setIsLoading(true);
    setDiagnosis('🔍 Diagnosi Business Plan in corso...\n\n');

    try {
      // 1. Test connessione Supabase
      setDiagnosis(prev => prev + '1️⃣ Test connessione Supabase...\n');
      const { data: connectionTest, error: connectionError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .limit(1);

      if (connectionError) {
        setDiagnosis(prev => prev + `❌ Connessione fallita: ${connectionError.message}\n\n`);
        return;
      }
      setDiagnosis(prev => prev + '✅ Connessione Supabase OK\n\n');

      // 2. Controlla tabelle Business Plan
      setDiagnosis(prev => prev + '2️⃣ Controllo tabelle Business Plan...\n');
      
      const businessPlanTables = [
        'business_plan',
        'business_plan_executive_summary',
        'business_plan_market_analysis', 
        'business_plan_marketing_strategy',
        'business_plan_operational_plan',
        'business_plan_financial_plan',
        'business_plan_business_model',
        'business_plan_roadmap',
        'business_plan_documentation'
      ];

      const { data: tables, error: tablesError } = await supabase
        .rpc('exec_sql', { 
          query: `
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name LIKE 'business_plan%'
            ORDER BY table_name;
          `
        });

      if (tablesError) {
        // Fallback method
        setDiagnosis(prev => prev + '⚠️ Usando metodo alternativo...\n');
        
        for (const tableName of businessPlanTables) {
          try {
            const { data, error } = await supabase
              .from(tableName)
              .select('id')
              .limit(1);
            
            if (error) {
              setDiagnosis(prev => prev + `❌ ${tableName}: MANCANTE (${error.message})\n`);
            } else {
              setDiagnosis(prev => prev + `✅ ${tableName}: OK\n`);
            }
          } catch (e) {
            setDiagnosis(prev => prev + `❌ ${tableName}: MANCANTE\n`);
          }
        }
      } else {
        const existingTables = tables || [];
        for (const requiredTable of businessPlanTables) {
          const exists = existingTables.some((t: any) => t.table_name === requiredTable);
          if (exists) {
            setDiagnosis(prev => prev + `✅ ${requiredTable}: OK\n`);
          } else {
            setDiagnosis(prev => prev + `❌ ${requiredTable}: MANCANTE\n`);
          }
        }
      }

      // 3. Test salvataggio Executive Summary
      setDiagnosis(prev => prev + '\n3️⃣ Test salvataggio Executive Summary...\n');
      try {
        const { data, error } = await supabase
          .from('business_plan_executive_summary')
          .upsert({
            user_id: 'test-user',
            company_overview: 'Test diagnostic',
            mission_statement: 'Test mission',
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          })
          .select();

        if (error) {
          setDiagnosis(prev => prev + `❌ Salvataggio fallito: ${error.message}\n`);
        } else {
          setDiagnosis(prev => prev + '✅ Salvataggio Executive Summary OK\n');
          
          // Cleanup test data
          await supabase
            .from('business_plan_executive_summary')
            .delete()
            .eq('user_id', 'test-user');
        }
      } catch (e: any) {
        setDiagnosis(prev => prev + `❌ Errore salvataggio: ${e.message}\n`);
      }

      // 4. Conclusioni
      setDiagnosis(prev => prev + '\n🎯 CONCLUSIONI:\n');
      setDiagnosis(prev => prev + '- Se vedi tabelle MANCANTI, devi eseguire lo schema SQL\n');
      setDiagnosis(prev => prev + '- Vai su Supabase > SQL Editor > Esegui 05_BUSINESS_PLAN_TABLES.sql\n');
      setDiagnosis(prev => prev + '- Dopo il setup, riprova il diagnostic\n');

    } catch (error: any) {
      setDiagnosis(prev => prev + `❌ Errore generale: ${error.message}\n`);
    } finally {
      setIsLoading(false);
    }
  };

  const createTables = async () => {
    setIsLoading(true);
    setDiagnosis('🔧 Tentativo di creare le tabelle...\n\n');

    try {
      // Crea le tabelle principali
      const createTableSQL = `
        -- Tabella Business Plan Principale
        CREATE TABLE IF NOT EXISTS business_plan (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id TEXT DEFAULT 'default-user' NOT NULL,
          name TEXT NOT NULL DEFAULT 'Business Plan',
          description TEXT,
          status TEXT DEFAULT 'draft',
          version TEXT DEFAULT '1.0',
          company_name TEXT,
          industry TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Tabella Executive Summary
        CREATE TABLE IF NOT EXISTS business_plan_executive_summary (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id TEXT DEFAULT 'default-user' NOT NULL,
          company_overview TEXT,
          mission_statement TEXT,
          vision_statement TEXT,
          funding_requirements DECIMAL(12,2) DEFAULT 0,
          expected_revenue_year1 DECIMAL(12,2) DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(user_id)
        );

        -- Tabella Market Analysis
        CREATE TABLE IF NOT EXISTS business_plan_market_analysis (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id TEXT DEFAULT 'default-user' NOT NULL,
          total_addressable_market DECIMAL(15,2) DEFAULT 0,
          target_customers TEXT[] DEFAULT '{}',
          market_trends TEXT[] DEFAULT '{}',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(user_id)
        );

        -- Abilita RLS
        ALTER TABLE business_plan ENABLE ROW LEVEL SECURITY;
        ALTER TABLE business_plan_executive_summary ENABLE ROW LEVEL SECURITY;
        ALTER TABLE business_plan_market_analysis ENABLE ROW LEVEL SECURITY;

        -- Policy permissive per test
        CREATE POLICY IF NOT EXISTS "Tutti possono gestire business plan" ON business_plan FOR ALL USING (true);
        CREATE POLICY IF NOT EXISTS "Tutti possono gestire executive summary" ON business_plan_executive_summary FOR ALL USING (true);
        CREATE POLICY IF NOT EXISTS "Tutti possono gestire market analysis" ON business_plan_market_analysis FOR ALL USING (true);
      `;

      const { data, error } = await supabase.rpc('exec_sql', { query: createTableSQL });

      if (error) {
        setDiagnosis(prev => prev + `❌ Errore creazione tabelle: ${error.message}\n`);
        setDiagnosis(prev => prev + '\n🔧 SOLUZIONE MANUALE:\n');
        setDiagnosis(prev => prev + '1. Vai su Supabase.com > Il tuo progetto\n');
        setDiagnosis(prev => prev + '2. SQL Editor > New Query\n');
        setDiagnosis(prev => prev + '3. Copia il file docs/database/05_BUSINESS_PLAN_TABLES.sql\n');
        setDiagnosis(prev => prev + '4. Esegui lo script\n');
      } else {
        setDiagnosis(prev => prev + '✅ Tabelle create con successo!\n');
        setDiagnosis(prev => prev + '🔄 Riprova ora il diagnostic per verificare...\n');
      }

    } catch (error: any) {
      setDiagnosis(prev => prev + `❌ Errore: ${error.message}\n`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">🔍</span>
        <h2 className="text-xl font-bold text-gray-900">Business Plan Diagnostic</h2>
      </div>

      <div className="space-y-4">
        <div className="flex gap-3">
          <button
            onClick={runDiagnosis}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '🔄 Eseguendo...' : '🔍 Esegui Diagnosi'}
          </button>
          
          <button
            onClick={createTables}
            disabled={isLoading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '🔄 Creando...' : '🔧 Crea Tabelle'}
          </button>
        </div>

        {diagnosis && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 max-h-96 overflow-y-auto">
              {diagnosis}
            </pre>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start gap-3">
          <span className="text-yellow-600 text-xl">⚠️</span>
          <div>
            <h3 className="font-semibold text-yellow-800 mb-2">Come risolvere il problema Business Plan</h3>
            <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
              <li>Clicca "🔍 Esegui Diagnosi" per vedere cosa manca</li>
              <li>Se le tabelle sono mancanti, clicca "🔧 Crea Tabelle"</li>
              <li>Se il passo 2 fallisce, vai manualmente su Supabase</li>
              <li>SQL Editor > Esegui docs/database/05_BUSINESS_PLAN_TABLES.sql</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
