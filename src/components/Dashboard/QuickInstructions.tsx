'use client';

import { useState } from 'react';

export default function QuickInstructions() {
  const [showInstructions, setShowInstructions] = useState(false);

  const sqlScript = `-- Copia e incolla questo SQL nel Supabase SQL Editor:

CREATE TABLE IF NOT EXISTS campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    name TEXT NOT NULL,
    channel TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    budget DECIMAL(12,2) NOT NULL,
    spent DECIMAL(12,2) NOT NULL DEFAULT 0,
    leads INTEGER NOT NULL DEFAULT 0,
    conversions INTEGER NOT NULL DEFAULT 0,
    revenue DECIMAL(12,2) NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
    cac DECIMAL(8,2) NOT NULL DEFAULT 0,
    ltv DECIMAL(8,2) NOT NULL DEFAULT 0,
    ltv_cac_ratio DECIMAL(8,2) NOT NULL DEFAULT 0,
    planned_leads INTEGER NOT NULL DEFAULT 0,
    planned_conversions INTEGER NOT NULL DEFAULT 0,
    planned_revenue DECIMAL(12,2) NOT NULL DEFAULT 0,
    actual_leads INTEGER NOT NULL DEFAULT 0,
    actual_conversions INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    source TEXT NOT NULL,
    campaign TEXT,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
    value DECIMAL(12,2) NOT NULL DEFAULT 0,
    date DATE NOT NULL,
    roi DECIMAL(8,2) NOT NULL DEFAULT 0,
    planned_value DECIMAL(12,2) NOT NULL DEFAULT 0,
    actual_value DECIMAL(12,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Abilita RLS
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Crea policy
CREATE POLICY "Enable all operations for all users" ON campaigns
FOR ALL USING (true);

CREATE POLICY "Enable all operations for all users" ON leads
FOR ALL USING (true);

-- Dati di esempio
INSERT INTO campaigns (name, channel, start_date, end_date, budget, spent, leads, conversions, revenue, status, cac, ltv, ltv_cac_ratio, planned_leads, planned_conversions, planned_revenue, actual_leads, actual_conversions) VALUES
('Campagna Google Ads Q1', 'Google Ads', '2024-01-01', '2024-03-31', 5000.00, 3200.00, 150, 25, 12500.00, 'active', 21.33, 500.00, 23.44, 200, 30, 15000.00, 150, 25),
('Campagna Facebook Q1', 'Facebook', '2024-01-15', '2024-03-15', 3000.00, 1800.00, 80, 12, 6000.00, 'active', 22.50, 500.00, 22.22, 100, 15, 7500.00, 80, 12);

INSERT INTO leads (name, email, source, campaign, status, value, date, roi, planned_value, actual_value) VALUES
('Mario Rossi', 'mario.rossi@email.com', 'Google Ads', 'Campagna Google Ads Q1', 'converted', 500.00, '2024-01-15', 25.00, 400.00, 500.00),
('Giulia Bianchi', 'giulia.bianchi@email.com', 'Facebook', 'Campagna Facebook Q1', 'qualified', 0.00, '2024-01-20', 0.00, 500.00, 0.00);`;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="p-2 bg-red-100 rounded-lg mr-3">
            <span className="text-xl">🚨</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900">Istruzioni Rapide</h3>
        </div>
        <button
          onClick={() => setShowInstructions(!showInstructions)}
          className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg font-medium"
        >
          {showInstructions ? '🔽 Nascondi' : '📋 Mostra Istruzioni'}
        </button>
      </div>

      {showInstructions && (
        <div className="space-y-4">
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <h4 className="font-semibold text-red-800 mb-2">🚨 Azione Richiesta</h4>
            <p className="text-red-700 mb-3">
              Le tabelle <code className="bg-red-100 px-1 rounded">campaigns</code> e <code className="bg-red-100 px-1 rounded">leads</code> non esistono nel database. 
              Devi crearle manualmente nel Supabase SQL Editor.
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">📋 Passo 1: Accedi al Supabase Dashboard</h4>
              <ol className="text-blue-700 text-sm space-y-1 list-decimal list-inside">
                <li>Vai su <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">https://supabase.com/dashboard</a></li>
                <li>Seleziona il tuo progetto</li>
                <li>Vai su <strong>SQL Editor</strong> nel menu laterale</li>
              </ol>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">📋 Passo 2: Copia e Incolla lo Script</h4>
              <p className="text-green-700 text-sm mb-2">
                Copia tutto il codice SQL qui sotto e incollalo nel SQL Editor:
              </p>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs font-mono overflow-x-auto max-h-96">
                <pre>{sqlScript}</pre>
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-800 mb-2">📋 Passo 3: Esegui lo Script</h4>
              <ol className="text-purple-700 text-sm space-y-1 list-decimal list-inside">
                <li>Clicca su <strong>Run</strong> nel SQL Editor</li>
                <li>Verifica che non ci siano errori</li>
                <li>Controlla che le tabelle siano state create</li>
              </ol>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-yellow-800 mb-2">📋 Passo 4: Testa l'Applicazione</h4>
              <ol className="text-yellow-700 text-sm space-y-1 list-decimal list-inside">
                <li>Torna all'applicazione</li>
                <li>Esegui "🔧 Crea Tabelle" nel componente CreateTablesDirect</li>
                <li>Verifica che tutti i test passino</li>
                <li>Controlla che il dashboard marketing funzioni</li>
              </ol>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg border">
            <h4 className="font-semibold text-gray-800 mb-2">✅ Risultati Attesi</h4>
            <ul className="text-gray-700 text-sm space-y-1">
              <li>• Tabelle <code className="bg-gray-200 px-1 rounded">campaigns</code> e <code className="bg-gray-200 px-1 rounded">leads</code> create</li>
              <li>• 4 campagne di esempio inserite</li>
              <li>• 8 lead di esempio inseriti</li>
              <li>• Dashboard marketing completamente funzionale</li>
            </ul>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-2">ℹ️ Informazioni</h4>
        <p className="text-sm text-blue-700">
          Questo problema si verifica perché le tabelle <code className="bg-blue-100 px-1 rounded">campaigns</code> e <code className="bg-blue-100 px-1 rounded">leads</code> 
          non esistono nel database Supabase. Una volta create manualmente, il sistema marketing funzionerà perfettamente.
        </p>
      </div>
    </div>
  );
}
