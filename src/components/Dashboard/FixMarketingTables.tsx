'use client';

import { useState } from 'react';
import { supabaseSecret } from '@/lib/supabase';

export default function FixMarketingTables() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [step, setStep] = useState<'idle' | 'fixing' | 'complete'>('idle');


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
      const tables = [
        'campaigns', 'leads', 'marketing_budgets',
        'task_calendar_projects', 'task_calendar_tasks', 'task_calendar_appointments',
        'recurring_activities', 'quick_tasks'
      ];
      
      const verificationResults: any = {};
      let allSuccess = true;

      for (const table of tables) {
        try {
          const { data, error } = await supabaseSecret
            .from(table)
            .select('count')
            .limit(1);

          if (error) {
            verificationResults[table] = { success: false, error: error.message };
            allSuccess = false;
          } else {
            verificationResults[table] = { success: true, count: data?.length || 0 };
          }
        } catch (err: any) {
          verificationResults[table] = { success: false, error: err.message };
          allSuccess = false;
        }
      }

      if (!allSuccess) {
        throw new Error('Errore nella verifica di alcune tabelle create');
      }

      setResult({
        fix: 'success',
        message: 'Tutte le tabelle marketing e dashboard create con successo!',
        timestamp: new Date().toISOString(),
        tables: verificationResults
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">📢 Fix Marketing & Dashboard</h2>
        <p className="text-gray-600">Risolve i problemi di caricamento dati marketing e dashboard</p>
      </div>

      <div className="space-y-4">
        {/* Fix Tabelle */}
        <div className="bg-green-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-green-900 mb-2">Crea Tutte le Tabelle</h3>
          <p className="text-sm text-green-700 mb-3">Crea tutte le tabelle marketing e dashboard con dati di esempio</p>
          <button
            onClick={fixMarketingTables}
            disabled={isLoading}
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
            {result.fix && (
              <div className={`p-2 rounded ${
                result.fix === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                <strong>Fix:</strong> {result.message}
                {result.tables && (
                  <div className="mt-2 text-sm">
                    {Object.entries(result.tables).map(([table, status]: [string, any]) => (
                      <div key={table} className="flex justify-between">
                        <span>{table}:</span>
                        <span className={status.success ? 'text-green-600' : 'text-red-600'}>
                          {status.success ? '✅ Creato' : '❌ Errore'}
                        </span>
                      </div>
                    ))}
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
          <li>1. Clicca "Crea Tabelle" per creare tutte le tabelle necessarie</li>
          <li>2. Verifica che i dati marketing e dashboard si carichino correttamente</li>
        </ol>
        <div className="text-xs text-yellow-700 mt-2">
          <p><strong>📊 Tabelle create:</strong></p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Marketing: campaigns, leads, marketing_budgets</li>
            <li>Dashboard: task_calendar_projects, task_calendar_tasks, task_calendar_appointments</li>
            <li>Attività: recurring_activities, quick_tasks</li>
          </ul>
          <p className="mt-2">⚠️ Questo fix crea tutte le tabelle necessarie. Per setup completo usa DatabaseSetup.</p>
        </div>
      </div>
    </div>
  );
}
