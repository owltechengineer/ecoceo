'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function FinancialTablesDiagnostic() {
  const [diagnosis, setDiagnosis] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const runDiagnosis = async () => {
    setIsLoading(true);
    setDiagnosis('🔍 Verifica tabelle finanziarie...\n\n');

    const tables = [
      'financial_fixed_costs',
      'financial_variable_costs', 
      'financial_budgets',
      'financial_revenues',
      'financial_departments',
      'financial_cost_distributions'
    ];

    let allTablesExist = true;

    for (const table of tables) {
      try {
        setDiagnosis(prev => prev + `📋 Controllo tabella ${table}...`);
        
        const { data, error } = await supabase
          .from(table as any)
          .select('count(*)')
          .limit(1);

        if (error) {
          setDiagnosis(prev => prev + ` ❌ MANCANTE\n`);
          allTablesExist = false;
        } else {
          setDiagnosis(prev => prev + ` ✅ ESISTE\n`);
        }
      } catch (err) {
        setDiagnosis(prev => prev + ` ❌ ERRORE\n`);
        allTablesExist = false;
      }
    }

    setDiagnosis(prev => prev + '\n');

    if (allTablesExist) {
      setDiagnosis(prev => prev + '🎉 TUTTE LE TABELLE FINANZIARIE ESISTONO!\n');
      setDiagnosis(prev => prev + 'I salvataggi dovrebbero funzionare correttamente.\n');
    } else {
      setDiagnosis(prev => prev + '❌ ALCUNE TABELLE MANCANO!\n');
      setDiagnosis(prev => prev + 'Questo è il motivo per cui i salvataggi non funzionano.\n\n');
      setDiagnosis(prev => prev + '📋 COME RISOLVERE:\n');
      setDiagnosis(prev => prev + '1. Vai su Supabase → SQL Editor\n');
      setDiagnosis(prev => prev + '2. Esegui il file docs/database/01_FINANCIAL_TABLES.sql\n');
      setDiagnosis(prev => prev + '3. Oppure clicca "🔧 Crea Tabelle" qui sotto\n');
    }

    setIsLoading(false);
  };

  const createTables = async () => {
    setIsLoading(true);
    setDiagnosis('🔧 Creazione tabelle finanziarie...\n\n');

    try {
      // SQL script semplificato per creare le tabelle essenziali
      const sql = `
        -- Funzione per aggiornare updated_at
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ language 'plpgsql';

        -- Tabella Settori Aziendali
        CREATE TABLE IF NOT EXISTS financial_departments (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id TEXT DEFAULT 'default-user' NOT NULL,
            name TEXT NOT NULL,
            description TEXT,
            budget_limit DECIMAL(12,2),
            manager TEXT,
            color TEXT DEFAULT '#3B82F6',
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Tabella Costi Fissi
        CREATE TABLE IF NOT EXISTS financial_fixed_costs (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id TEXT DEFAULT 'default-user' NOT NULL,
            name TEXT NOT NULL,
            description TEXT,
            amount DECIMAL(12,2) NOT NULL,
            frequency TEXT DEFAULT 'monthly' CHECK (frequency IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')),
            category TEXT DEFAULT 'general' CHECK (category IN ('office', 'software', 'marketing', 'personnel', 'utilities', 'insurance', 'legal', 'other')),
            start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            end_date TIMESTAMP WITH TIME ZONE,
            next_payment_date TIMESTAMP WITH TIME ZONE,
            payment_day INTEGER CHECK (payment_day >= 1 AND payment_day <= 31),
            is_active BOOLEAN DEFAULT TRUE,
            auto_generate BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Tabella Costi Variabili
        CREATE TABLE IF NOT EXISTS financial_variable_costs (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id TEXT DEFAULT 'default-user' NOT NULL,
            name TEXT NOT NULL,
            description TEXT,
            amount DECIMAL(12,2) NOT NULL,
            category TEXT DEFAULT 'general' CHECK (category IN ('marketing', 'travel', 'materials', 'services', 'equipment', 'training', 'other')),
            date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            vendor TEXT,
            payment_method TEXT CHECK (payment_method IN ('cash', 'card', 'transfer', 'check', 'other')),
            is_paid BOOLEAN DEFAULT FALSE,
            payment_date TIMESTAMP WITH TIME ZONE,
            receipt_url TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Tabella Budget
        CREATE TABLE IF NOT EXISTS financial_budgets (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id TEXT DEFAULT 'default-user' NOT NULL,
            name TEXT NOT NULL,
            description TEXT,
            amount DECIMAL(12,2) NOT NULL,
            period_start TIMESTAMP WITH TIME ZONE NOT NULL,
            period_end TIMESTAMP WITH TIME ZONE NOT NULL,
            category TEXT DEFAULT 'general' CHECK (category IN ('revenue', 'expense', 'investment', 'operational', 'marketing', 'personnel', 'other')),
            department_id UUID REFERENCES financial_departments(id) ON DELETE SET NULL,
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Tabella Ricavi
        CREATE TABLE IF NOT EXISTS financial_revenues (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id TEXT DEFAULT 'default-user' NOT NULL,
            name TEXT NOT NULL,
            description TEXT,
            amount DECIMAL(12,2) NOT NULL,
            source TEXT DEFAULT 'sales' CHECK (source IN ('sales', 'services', 'subscriptions', 'investments', 'grants', 'other')),
            date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            client TEXT,
            payment_method TEXT CHECK (payment_method IN ('cash', 'card', 'transfer', 'check', 'other')),
            is_received BOOLEAN DEFAULT FALSE,
            received_date TIMESTAMP WITH TIME ZONE,
            invoice_number TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Tabella distribuzione costi
        CREATE TABLE IF NOT EXISTS financial_cost_distributions (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id TEXT DEFAULT 'default-user' NOT NULL,
            cost_id UUID NOT NULL,
            cost_type TEXT NOT NULL CHECK (cost_type IN ('fixed', 'variable')),
            department_id UUID REFERENCES financial_departments(id) ON DELETE CASCADE,
            amount DECIMAL(12,2) NOT NULL,
            percentage DECIMAL(5,2) NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
            description TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(cost_id, cost_type, department_id)
        );

        -- RLS
        ALTER TABLE financial_departments ENABLE ROW LEVEL SECURITY;
        ALTER TABLE financial_cost_distributions ENABLE ROW LEVEL SECURITY;
        ALTER TABLE financial_fixed_costs ENABLE ROW LEVEL SECURITY;
        ALTER TABLE financial_variable_costs ENABLE ROW LEVEL SECURITY;
        ALTER TABLE financial_budgets ENABLE ROW LEVEL SECURITY;
        ALTER TABLE financial_revenues ENABLE ROW LEVEL SECURITY;

        -- Policy permissive per sviluppo
        DROP POLICY IF EXISTS "Allow all operations for now" ON financial_departments;
        CREATE POLICY "Allow all operations for now" ON financial_departments FOR ALL USING (true);

        DROP POLICY IF EXISTS "Allow all operations for now" ON financial_cost_distributions;
        CREATE POLICY "Allow all operations for now" ON financial_cost_distributions FOR ALL USING (true);

        DROP POLICY IF EXISTS "Allow all operations for now" ON financial_fixed_costs;
        CREATE POLICY "Allow all operations for now" ON financial_fixed_costs FOR ALL USING (true);

        DROP POLICY IF EXISTS "Allow all operations for now" ON financial_variable_costs;
        CREATE POLICY "Allow all operations for now" ON financial_variable_costs FOR ALL USING (true);

        DROP POLICY IF EXISTS "Allow all operations for now" ON financial_budgets;
        CREATE POLICY "Allow all operations for now" ON financial_budgets FOR ALL USING (true);

        DROP POLICY IF EXISTS "Allow all operations for now" ON financial_revenues;
        CREATE POLICY "Allow all operations for now" ON financial_revenues FOR ALL USING (true);
      `;

      // Esegui lo script SQL
      const { data, error } = await supabase.rpc('exec_sql', { sql });

      if (error) {
        setDiagnosis(prev => prev + `❌ Errore creazione tabelle: ${error.message}\n`);
        setDiagnosis(prev => prev + '💡 Prova a eseguire manualmente lo script su Supabase SQL Editor\n');
      } else {
        setDiagnosis(prev => prev + '✅ Tabelle create con successo!\n');
        setDiagnosis(prev => prev + '🎉 I salvataggi dovrebbero ora funzionare!\n\n');
        setDiagnosis(prev => prev + '🧪 Prova a creare un costo fisso, budget o entrata per verificare.\n');
      }

    } catch (error: any) {
      setDiagnosis(prev => prev + `❌ Errore: ${error.message}\n`);
      setDiagnosis(prev => prev + '💡 Vai su Supabase → SQL Editor e esegui docs/database/01_FINANCIAL_TABLES.sql\n');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center mb-4">
        <span className="text-2xl mr-3">🔧</span>
        <h2 className="text-xl font-bold text-gray-900">Diagnostica Tabelle Finanziarie</h2>
      </div>
      
      <div className="space-y-4">
        <p className="text-gray-600">
          Se i salvataggi di costi, budget e entrate non funzionano, probabilmente le tabelle del database non esistono.
        </p>

        <div className="flex space-x-3">
          <button
            onClick={runDiagnosis}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isLoading ? '🔍 Controllo...' : '🔍 Esegui Diagnosi'}
          </button>
          
          <button
            onClick={createTables}
            disabled={isLoading}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
          >
            {isLoading ? '🔧 Creando...' : '🔧 Crea Tabelle'}
          </button>
        </div>

        {diagnosis && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">
              {diagnosis}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
