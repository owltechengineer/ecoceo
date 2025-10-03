'use client';

import { useState } from 'react';

export default function SchemaSetupHelper() {
  const [showInstructions, setShowInstructions] = useState(false);

  const schemaSQL = `-- Schema sicuro per Business Plan Tables
-- Gestisce correttamente le creazioni esistenti

-- 1. Tabella dashboard_data
CREATE TABLE IF NOT EXISTS dashboard_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  data_type TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, data_type)
);

-- 2. Executive Summary
CREATE TABLE IF NOT EXISTS business_plan_executive_summary (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  content TEXT,
  pitch TEXT,
  documents JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 2. Market Analysis
CREATE TABLE IF NOT EXISTS business_plan_market_analysis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  demographics JSONB DEFAULT '[]',
  competitors JSONB DEFAULT '[]',
  swot JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 3. Marketing Strategy
CREATE TABLE IF NOT EXISTS business_plan_marketing_strategy (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  strategies JSONB DEFAULT '[]',
  timeline JSONB DEFAULT '[]',
  customer_journey JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 4. Operational Plan
CREATE TABLE IF NOT EXISTS business_plan_operational_plan (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  roles JSONB DEFAULT '[]',
  milestones JSONB DEFAULT '[]',
  flow_diagram JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 5. Financial Plan
CREATE TABLE IF NOT EXISTS business_plan_financial_plan (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  revenues JSONB DEFAULT '[]',
  expenses JSONB DEFAULT '[]',
  forecasts JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 6. Business Model
CREATE TABLE IF NOT EXISTS business_plan_business_model (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  canvas JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 7. Roadmap
CREATE TABLE IF NOT EXISTS business_plan_roadmap (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  goals JSONB DEFAULT '[]',
  kpis JSONB DEFAULT '[]',
  timeline JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 8. Documentation
CREATE TABLE IF NOT EXISTS business_plan_documentation (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  files JSONB DEFAULT '[]',
  links JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Indici per performance (solo se non esistono)
CREATE INDEX IF NOT EXISTS idx_dashboard_data_user_id ON dashboard_data(user_id);
CREATE INDEX IF NOT EXISTS idx_dashboard_data_type ON dashboard_data(data_type);
CREATE INDEX IF NOT EXISTS idx_bp_executive_summary_user_id ON business_plan_executive_summary(user_id);
CREATE INDEX IF NOT EXISTS idx_bp_market_analysis_user_id ON business_plan_market_analysis(user_id);
CREATE INDEX IF NOT EXISTS idx_bp_marketing_strategy_user_id ON business_plan_marketing_strategy(user_id);
CREATE INDEX IF NOT EXISTS idx_bp_operational_plan_user_id ON business_plan_operational_plan(user_id);
CREATE INDEX IF NOT EXISTS idx_bp_financial_plan_user_id ON business_plan_financial_plan(user_id);
CREATE INDEX IF NOT EXISTS idx_bp_business_model_user_id ON business_plan_business_model(user_id);
CREATE INDEX IF NOT EXISTS idx_bp_roadmap_user_id ON business_plan_roadmap(user_id);
CREATE INDEX IF NOT EXISTS idx_bp_documentation_user_id ON business_plan_documentation(user_id);

-- Funzione per updated_at (solo se non esiste)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger per updated_at (con gestione errori)
DO $$
BEGIN
    -- Dashboard Data
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_dashboard_data_updated_at') THEN
        CREATE TRIGGER update_dashboard_data_updated_at BEFORE UPDATE ON dashboard_data FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Executive Summary
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_bp_executive_summary_updated_at') THEN
        CREATE TRIGGER update_bp_executive_summary_updated_at BEFORE UPDATE ON business_plan_executive_summary FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Market Analysis
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_bp_market_analysis_updated_at') THEN
        CREATE TRIGGER update_bp_market_analysis_updated_at BEFORE UPDATE ON business_plan_market_analysis FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Marketing Strategy
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_bp_marketing_strategy_updated_at') THEN
        CREATE TRIGGER update_bp_marketing_strategy_updated_at BEFORE UPDATE ON business_plan_marketing_strategy FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Operational Plan
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_bp_operational_plan_updated_at') THEN
        CREATE TRIGGER update_bp_operational_plan_updated_at BEFORE UPDATE ON business_plan_operational_plan FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Financial Plan
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_bp_financial_plan_updated_at') THEN
        CREATE TRIGGER update_bp_financial_plan_updated_at BEFORE UPDATE ON business_plan_financial_plan FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Business Model
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_bp_business_model_updated_at') THEN
        CREATE TRIGGER update_bp_business_model_updated_at BEFORE UPDATE ON business_plan_business_model FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Roadmap
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_bp_roadmap_updated_at') THEN
        CREATE TRIGGER update_bp_roadmap_updated_at BEFORE UPDATE ON business_plan_roadmap FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Documentation
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_bp_documentation_updated_at') THEN
        CREATE TRIGGER update_bp_documentation_updated_at BEFORE UPDATE ON business_plan_documentation FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Abilita RLS (solo se non già abilitato)
ALTER TABLE dashboard_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_executive_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_market_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_marketing_strategy ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_operational_plan ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_financial_plan ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_business_model ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_roadmap ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_documentation ENABLE ROW LEVEL SECURITY;

-- Policy per permettere tutte le operazioni (con gestione errori)
DO $$
BEGIN
    -- Dashboard Data
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'dashboard_data' AND policyname = 'Allow all operations for now') THEN
        CREATE POLICY "Allow all operations for now" ON dashboard_data FOR ALL USING (true);
    END IF;
    
    -- Executive Summary
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'business_plan_executive_summary' AND policyname = 'Allow all operations for now') THEN
        CREATE POLICY "Allow all operations for now" ON business_plan_executive_summary FOR ALL USING (true);
    END IF;
    
    -- Market Analysis
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'business_plan_market_analysis' AND policyname = 'Allow all operations for now') THEN
        CREATE POLICY "Allow all operations for now" ON business_plan_market_analysis FOR ALL USING (true);
    END IF;
    
    -- Marketing Strategy
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'business_plan_marketing_strategy' AND policyname = 'Allow all operations for now') THEN
        CREATE POLICY "Allow all operations for now" ON business_plan_marketing_strategy FOR ALL USING (true);
    END IF;
    
    -- Operational Plan
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'business_plan_operational_plan' AND policyname = 'Allow all operations for now') THEN
        CREATE POLICY "Allow all operations for now" ON business_plan_operational_plan FOR ALL USING (true);
    END IF;
    
    -- Financial Plan
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'business_plan_financial_plan' AND policyname = 'Allow all operations for now') THEN
        CREATE POLICY "Allow all operations for now" ON business_plan_financial_plan FOR ALL USING (true);
    END IF;
    
    -- Business Model
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'business_plan_business_model' AND policyname = 'Allow all operations for now') THEN
        CREATE POLICY "Allow all operations for now" ON business_plan_business_model FOR ALL USING (true);
    END IF;
    
    -- Roadmap
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'business_plan_roadmap' AND policyname = 'Allow all operations for now') THEN
        CREATE POLICY "Allow all operations for now" ON business_plan_roadmap FOR ALL USING (true);
    END IF;
    
    -- Documentation
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'business_plan_documentation' AND policyname = 'Allow all operations for now') THEN
        CREATE POLICY "Allow all operations for now" ON business_plan_documentation FOR ALL USING (true);
    END IF;
END $$;

-- Verifica finale delle tabelle create
SELECT 
    table_name,
    CASE 
        WHEN table_name IS NOT NULL THEN '✅ Creata'
        ELSE '❌ Mancante'
    END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND (table_name LIKE 'business_plan%' OR table_name = 'dashboard_data')
ORDER BY table_name;`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(schemaSQL);
    alert('Schema SQL copiato negli appunti! Ora incollalo su Supabase SQL Editor.');
  };

  return (
    <div className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">🔧 Setup Schema Database</h3>
      
      <div className="space-y-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-800 mb-2">⚠️ ATTENZIONE: Schema Parzialmente Configurato</h4>
          <p className="text-yellow-700 text-sm">
            L'errore "trigger already exists" indica che alcune parti dello schema sono già state create, ma non tutte.
            Usa lo schema sicuro qui sotto per completare la configurazione senza errori.
          </p>
        </div>
        
        <div className="flex space-x-4">
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {showInstructions ? 'Nascondi Istruzioni' : 'Mostra Istruzioni'}
          </button>
          
          <button
            onClick={copyToClipboard}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            📋 Copia Schema SQL
          </button>
        </div>
        
        {showInstructions && (
          <div className="bg-blue-500/20 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">📋 Istruzioni Setup:</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Vai su <a href="https://supabase.com" target="_blank" className="text-blue-600 hover:underline">supabase.com</a></li>
              <li>Accedi al tuo account e seleziona il progetto</li>
              <li>Clicca su <strong>"SQL Editor"</strong> nel menu laterale</li>
              <li>Clicca su <strong>"New query"</strong></li>
              <li>Clicca <strong>"📋 Copia Schema SQL"</strong> qui sopra</li>
              <li>Incolla lo schema nell'editor SQL</li>
              <li>Clicca su <strong>"Run"</strong> per eseguire lo script</li>
              <li>Torna qui e testa la connessione</li>
            </ol>
          </div>
        )}
        
        <div className="text-sm text-gray-600">
          <p><strong>🎯 Risultato Atteso:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>8 tabelle Business Plan create</li>
            <li>Indici per performance</li>
            <li>Trigger per updated_at</li>
            <li>Policy RLS configurate</li>
            <li>Salvataggio e caricamento funzionanti</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
