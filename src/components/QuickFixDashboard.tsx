'use client';

import { useState } from 'react';
import { supabaseSecret } from '@/lib/supabase';

export default function QuickFixDashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const fixDashboardData = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      // SQL per creare la tabella dashboard_data
      const sqlScript = `
        -- Crea tabella dashboard_data
        CREATE TABLE IF NOT EXISTS dashboard_data (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id TEXT NOT NULL,
            data_type TEXT NOT NULL,
            data JSONB NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(user_id, data_type)
        );

        -- Crea trigger per updated_at
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ language 'plpgsql';

        CREATE TRIGGER update_dashboard_data_updated_at 
        BEFORE UPDATE ON dashboard_data 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

        -- Abilita RLS
        ALTER TABLE dashboard_data ENABLE ROW LEVEL SECURITY;

        -- Crea policy
        CREATE POLICY "Allow all operations for now" ON dashboard_data FOR ALL USING (true);

        -- Inserisci dati di esempio
        INSERT INTO dashboard_data (user_id, data_type, data) VALUES
        ('default-user', 'dashboard_overview', '{"total_revenue": 0, "total_costs": 0, "active_projects": 0}'),
        ('default-user', 'financial_summary', '{"revenues": [], "costs": [], "budgets": []}'),
        ('default-user', 'marketing_summary', '{"campaigns": [], "leads": [], "conversions": 0}'),
        ('default-user', 'projects_summary', '{"active": [], "completed": [], "pending": []}')
        ON CONFLICT (user_id, data_type) DO NOTHING;
      `;

      // Esegui lo script
      const { data, error } = await supabaseSecret.rpc('exec_sql', {
        sql: sqlScript
      });

      if (error) {
        throw error;
      }

      // Verifica che la tabella sia stata creata
      const { data: testData, error: testError } = await supabaseSecret
        .from('dashboard_data')
        .select('count')
        .limit(1);

      if (testError) {
        throw testError;
      }

      setResult({
        status: 'success',
        message: 'Tabella dashboard_data creata con successo!',
        timestamp: new Date().toISOString(),
        data: testData
      });

    } catch (error: any) {
      setResult({
        status: 'error',
        message: `Errore: ${error.message}`,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testConnection = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabaseSecret
        .from('dashboard_data')
        .select('*')
        .limit(1);

      if (error) {
        throw error;
      }

      setResult({
        status: 'success',
        message: 'Connessione a dashboard_data OK!',
        timestamp: new Date().toISOString(),
        data: data
      });

    } catch (error: any) {
      setResult({
        status: 'error',
        message: `Errore connessione: ${error.message}`,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/30 backdrop-blur/30 backdrop-blur rounded-xl p-6 shadow-lg border border-gray-200">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">🔧 Quick Fix Dashboard</h2>
        <p className="text-gray-600">Risolve l'errore: Could not find the table 'public.dashboard_data'</p>
      </div>

      <div className="space-y-4">
        {/* Test Connessione */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">1. Test Connessione</h3>
          <p className="text-sm text-blue-700 mb-3">Verifica se la tabella dashboard_data esiste</p>
          <button
            onClick={testConnection}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? '🔄 Testando...' : '🔍 Test Connessione'}
          </button>
        </div>

        {/* Fix Tabella */}
        <div className="bg-green-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-green-900 mb-2">2. Crea Tabella</h3>
          <p className="text-sm text-green-700 mb-3">Crea la tabella dashboard_data con trigger e RLS</p>
          <button
            onClick={fixDashboardData}
            disabled={isLoading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? '🔄 Creando...' : '🚀 Crea Tabella'}
          </button>
        </div>
      </div>

      {/* Risultati */}
      {result && (
        <div className="mt-6 p-4 bg-blue-500/20 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">📊 Risultato:</h4>
          <div className={`p-3 rounded ${
            result.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            <strong>Status:</strong> {result.message}
            <div className="text-xs text-gray-500 mt-1">
              Timestamp: {result.timestamp}
            </div>
          </div>
        </div>
      )}

      {/* Istruzioni */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
        <h4 className="font-semibold text-yellow-900 mb-2">📋 Istruzioni:</h4>
        <ol className="text-sm text-yellow-800 space-y-1">
          <li>1. Clicca "Test Connessione" per verificare lo stato</li>
          <li>2. Se fallisce, clicca "Crea Tabella" per risolvere</li>
          <li>3. Riprova il test per confermare la risoluzione</li>
        </ol>
        <p className="text-xs text-yellow-700 mt-2">
          ⚠️ Questo fix crea solo la tabella dashboard_data. Per setup completo usa DatabaseSetup.
        </p>
      </div>
    </div>
  );
}
