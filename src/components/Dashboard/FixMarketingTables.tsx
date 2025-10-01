'use client';

import { useState } from 'react';
import { supabaseSecret } from '@/lib/supabase';

export default function FixMarketingTables() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [step, setStep] = useState<'idle' | 'testing' | 'fixing' | 'complete'>('idle');

  const testMarketingTables = async () => {
    setIsLoading(true);
    setStep('testing');
    setResult(null);

    try {
      // Test tutte le tabelle marketing
      const tables = ['marketing_campaigns', 'marketing_leads', 'marketing_budgets'];
      const results: any = {};

      for (const table of tables) {
        try {
          const { data, error } = await supabaseSecret
            .from(table)
            .select('count')
            .limit(1);

          if (error) {
            results[table] = { status: 'missing', error: error.message };
          } else {
            results[table] = { status: 'exists', count: data?.length || 0 };
          }
        } catch (err: any) {
          results[table] = { status: 'error', error: err.message };
        }
      }

      setResult({
        test: 'completed',
        tables: results,
        message: 'Test tabelle marketing completato'
      });

    } catch (error: any) {
      setResult({
        test: 'error',
        message: `Errore test: ${error.message}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fixMarketingTables = async () => {
    setIsLoading(true);
    setStep('fixing');
    setResult(null);

    try {
      // SQL per creare le tabelle marketing
      const sqlScript = `
        -- Campagne Marketing
        CREATE TABLE IF NOT EXISTS marketing_campaigns (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR(255) NOT NULL,
            description TEXT,
            start_date DATE NOT NULL,
            end_date DATE,
            budget DECIMAL(15,2),
            status VARCHAR(50) DEFAULT 'active',
            channel VARCHAR(100),
            target_audience TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Lead
        CREATE TABLE IF NOT EXISTS marketing_leads (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255),
            phone VARCHAR(50),
            company VARCHAR(255),
            source VARCHAR(100),
            status VARCHAR(50) DEFAULT 'new',
            priority VARCHAR(20) DEFAULT 'medium',
            notes TEXT,
            campaign_id UUID REFERENCES marketing_campaigns(id),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Budget Marketing
        CREATE TABLE IF NOT EXISTS marketing_budgets (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            campaign_id UUID REFERENCES marketing_campaigns(id),
            amount DECIMAL(15,2) NOT NULL,
            spent DECIMAL(15,2) DEFAULT 0,
            category VARCHAR(100),
            description TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Trigger per updated_at
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ language 'plpgsql';

        CREATE TRIGGER update_marketing_campaigns_updated_at 
        BEFORE UPDATE ON marketing_campaigns 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

        CREATE TRIGGER update_marketing_leads_updated_at 
        BEFORE UPDATE ON marketing_leads 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

        CREATE TRIGGER update_marketing_budgets_updated_at 
        BEFORE UPDATE ON marketing_budgets 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

        -- Abilita RLS
        ALTER TABLE marketing_campaigns ENABLE ROW LEVEL SECURITY;
        ALTER TABLE marketing_leads ENABLE ROW LEVEL SECURITY;
        ALTER TABLE marketing_budgets ENABLE ROW LEVEL SECURITY;

        -- Crea policy
        CREATE POLICY "Allow all operations for now" ON marketing_campaigns FOR ALL USING (true);
        CREATE POLICY "Allow all operations for now" ON marketing_leads FOR ALL USING (true);
        CREATE POLICY "Allow all operations for now" ON marketing_budgets FOR ALL USING (true);

        -- Inserisci dati di esempio
        INSERT INTO marketing_campaigns (name, description, start_date, end_date, budget, status, channel, target_audience) VALUES
        ('Campagna Social Media Q1', 'Campagna promozionale sui social media per il primo trimestre', '2024-01-01', '2024-03-31', 15000.00, 'active', 'Social Media', 'Giovani 18-35 anni'),
        ('Email Marketing Newsletter', 'Newsletter mensile per clienti esistenti', '2024-01-01', '2024-12-31', 5000.00, 'active', 'Email', 'Clienti esistenti'),
        ('Google Ads Search', 'Campagna Google Ads per parole chiave specifiche', '2024-02-01', '2024-06-30', 25000.00, 'active', 'Google Ads', 'Professionisti 25-50 anni')
        ON CONFLICT DO NOTHING;

        INSERT INTO marketing_leads (name, email, phone, company, source, status, priority, notes) VALUES
        ('Mario Rossi', 'mario.rossi@email.com', '+39 123 456 7890', 'Azienda ABC', 'Google Ads', 'new', 'high', 'Interessato al prodotto premium'),
        ('Giulia Bianchi', 'giulia.bianchi@email.com', '+39 098 765 4321', 'Startup XYZ', 'Social Media', 'contacted', 'medium', 'Richiesta informazioni via LinkedIn'),
        ('Luca Verdi', 'luca.verdi@email.com', '+39 555 123 4567', 'Freelancer', 'Newsletter', 'qualified', 'high', 'Cliente potenziale per servizi B2B')
        ON CONFLICT DO NOTHING;
      `;

      // Esegui lo script
      const { data, error } = await supabaseSecret.rpc('exec_sql', {
        sql: sqlScript
      });

      if (error) {
        throw error;
      }

      // Verifica che le tabelle siano state create
      const { data: campaigns, error: campaignsError } = await supabaseSecret
        .from('marketing_campaigns')
        .select('count')
        .limit(1);

      const { data: leads, error: leadsError } = await supabaseSecret
        .from('marketing_leads')
        .select('count')
        .limit(1);

      const { data: budgets, error: budgetsError } = await supabaseSecret
        .from('marketing_budgets')
        .select('count')
        .limit(1);

      if (campaignsError || leadsError || budgetsError) {
        throw new Error('Errore nella verifica delle tabelle create');
      }

      setResult({
        fix: 'success',
        message: 'Tabelle marketing create con successo!',
        timestamp: new Date().toISOString(),
        tables: {
          campaigns: campaigns?.length || 0,
          leads: leads?.length || 0,
          budgets: budgets?.length || 0
        }
      });

      setStep('complete');

    } catch (error: any) {
      setResult({
        fix: 'error',
        message: `Errore fix: ${error.message}`,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/30 backdrop-blur rounded-xl p-6 shadow-lg border border-gray-200">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">📢 Fix Sezione Marketing</h2>
        <p className="text-gray-600">Risolve il problema di caricamento dati marketing</p>
      </div>

      <div className="space-y-4">
        {/* Test Tabelle */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">1. Test Tabelle Marketing</h3>
          <p className="text-sm text-blue-700 mb-3">Verifica se le tabelle marketing esistono</p>
          <button
            onClick={testMarketingTables}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isLoading && step === 'testing' ? '🔄 Testando...' : '🔍 Test Tabelle'}
          </button>
        </div>

        {/* Fix Tabelle */}
        <div className="bg-green-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-green-900 mb-2">2. Crea Tabelle Marketing</h3>
          <p className="text-sm text-green-700 mb-3">Crea tutte le tabelle marketing con dati di esempio</p>
          <button
            onClick={fixMarketingTables}
            disabled={isLoading || step === 'testing'}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {isLoading && step === 'fixing' ? '🔄 Creando...' : '🚀 Crea Tabelle'}
          </button>
        </div>
      </div>

      {/* Risultati */}
      {result && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">📊 Risultati:</h4>
          <div className="space-y-2">
            {result.test && (
              <div className="p-2 rounded bg-blue-100 text-blue-800">
                <strong>Test:</strong> {result.message}
                {result.tables && (
                  <div className="mt-2 text-sm">
                    {Object.entries(result.tables).map(([table, status]: [string, any]) => (
                      <div key={table} className="flex justify-between">
                        <span>{table}:</span>
                        <span className={status.status === 'exists' ? 'text-green-600' : 'text-red-600'}>
                          {status.status === 'exists' ? '✅ Esiste' : '❌ Mancante'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {result.fix && (
              <div className={`p-2 rounded ${
                result.fix === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                <strong>Fix:</strong> {result.message}
                {result.tables && (
                  <div className="mt-2 text-sm">
                    <div>Campagne: {result.tables.campaigns}</div>
                    <div>Lead: {result.tables.leads}</div>
                    <div>Budget: {result.tables.budgets}</div>
                  </div>
                )}
              </div>
            )}
            <div className="text-xs text-gray-500 mt-2">
              Timestamp: {result.timestamp}
            </div>
          </div>
        </div>
      )}

      {/* Istruzioni */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
        <h4 className="font-semibold text-yellow-900 mb-2">📋 Istruzioni:</h4>
        <ol className="text-sm text-yellow-800 space-y-1">
          <li>1. Clicca "Test Tabelle" per verificare lo stato</li>
          <li>2. Se mancano tabelle, clicca "Crea Tabelle"</li>
          <li>3. Verifica che i dati marketing si carichino correttamente</li>
        </ol>
        <p className="text-xs text-yellow-700 mt-2">
          ⚠️ Questo fix crea solo le tabelle marketing. Per setup completo usa DatabaseSetup.
        </p>
      </div>
    </div>
  );
}
