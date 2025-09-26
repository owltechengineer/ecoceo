"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

const BusinessPlanTablesDiagnostic = () => {
  const [diagnostic, setDiagnostic] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkBusinessPlanTables = async () => {
    setLoading(true);
    try {
      const tables = [
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

      const results = await Promise.all(
        tables.map(async (table) => {
          try {
            const { data, error } = await supabase
              .from(table)
              .select('*')
              .limit(1);
            
            return {
              table,
              exists: !error,
              error: error?.message || null,
              columns: data ? Object.keys(data[0] || {}) : []
            };
          } catch (err) {
            return {
              table,
              exists: false,
              error: err instanceof Error ? err.message : 'Errore sconosciuto',
              columns: []
            };
          }
        })
      );

      setDiagnostic({
        tables: results,
        missingTables: results.filter(r => !r.exists),
        existingTables: results.filter(r => r.exists)
      });

    } catch (error) {
      console.error('Errore diagnostica Business Plan:', error);
      setDiagnostic({ error: error instanceof Error ? error.message : 'Errore sconosciuto' });
    } finally {
      setLoading(false);
    }
  };

  const generateBusinessPlanSQL = () => {
    const sql = `-- BUSINESS PLAN TABLES QUICK FIX
-- Esegui questo script in Supabase SQL Editor

-- 1. BUSINESS PLAN PRINCIPALE
CREATE TABLE IF NOT EXISTS business_plan (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    title TEXT,
    description TEXT,
    status TEXT DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- 2. EXECUTIVE SUMMARY
CREATE TABLE IF NOT EXISTS business_plan_executive_summary (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    company_overview TEXT,
    mission_statement TEXT,
    vision_statement TEXT,
    business_objectives TEXT[] DEFAULT '{}',
    key_metrics JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- 3. MARKET ANALYSIS
CREATE TABLE IF NOT EXISTS business_plan_market_analysis (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    market_size JSONB DEFAULT '{}',
    target_market TEXT,
    competitive_analysis JSONB DEFAULT '{}',
    market_trends TEXT[] DEFAULT '{}',
    swot_analysis JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- 4. MARKETING STRATEGY (CON COLONNE CORRETTE)
CREATE TABLE IF NOT EXISTS business_plan_marketing_strategy (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    marketing_objectives TEXT[] DEFAULT '{}',
    target_audience JSONB DEFAULT '{}',
    pricing_strategy TEXT,
    distribution_channels TEXT[] DEFAULT '{}',
    promotion_strategy TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- 5. OPERATIONAL PLAN
CREATE TABLE IF NOT EXISTS business_plan_operational_plan (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    roles TEXT[] DEFAULT '{}',
    milestones TEXT[] DEFAULT '{}',
    flow_diagram JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- 6. FINANCIAL PLAN
CREATE TABLE IF NOT EXISTS business_plan_financial_plan (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    revenue_projections JSONB DEFAULT '{}',
    expense_forecasts JSONB DEFAULT '{}',
    cash_flow JSONB DEFAULT '{}',
    break_even_analysis JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- 7. BUSINESS MODEL (CON COLONNE CORRETTE)
CREATE TABLE IF NOT EXISTS business_plan_business_model (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    key_partners TEXT[] DEFAULT '{}',
    key_activities TEXT[] DEFAULT '{}',
    value_propositions TEXT[] DEFAULT '{}',
    customer_segments TEXT[] DEFAULT '{}',
    revenue_streams TEXT[] DEFAULT '{}',
    canvas_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- 8. ROADMAP
CREATE TABLE IF NOT EXISTS business_plan_roadmap (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    phases TEXT[] DEFAULT '{}',
    timeline JSONB DEFAULT '{}',
    milestones TEXT[] DEFAULT '{}',
    dependencies JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- 9. DOCUMENTATION
CREATE TABLE IF NOT EXISTS business_plan_documentation (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    document_references TEXT[] DEFAULT '{}',
    attachments JSONB DEFAULT '{}',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- TRIGGER PER UPDATED_AT
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- TRIGGERS
DROP TRIGGER IF EXISTS update_bp_updated_at ON business_plan;
CREATE TRIGGER update_bp_updated_at 
    BEFORE UPDATE ON business_plan 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bp_executive_summary_updated_at ON business_plan_executive_summary;
CREATE TRIGGER update_bp_executive_summary_updated_at 
    BEFORE UPDATE ON business_plan_executive_summary 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bp_market_analysis_updated_at ON business_plan_market_analysis;
CREATE TRIGGER update_bp_market_analysis_updated_at 
    BEFORE UPDATE ON business_plan_market_analysis 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bp_marketing_strategy_updated_at ON business_plan_marketing_strategy;
CREATE TRIGGER update_bp_marketing_strategy_updated_at 
    BEFORE UPDATE ON business_plan_marketing_strategy 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bp_operational_plan_updated_at ON business_plan_operational_plan;
CREATE TRIGGER update_bp_operational_plan_updated_at 
    BEFORE UPDATE ON business_plan_operational_plan 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bp_financial_plan_updated_at ON business_plan_financial_plan;
CREATE TRIGGER update_bp_financial_plan_updated_at 
    BEFORE UPDATE ON business_plan_financial_plan 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bp_business_model_updated_at ON business_plan_business_model;
CREATE TRIGGER update_bp_business_model_updated_at 
    BEFORE UPDATE ON business_plan_business_model 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bp_roadmap_updated_at ON business_plan_roadmap;
CREATE TRIGGER update_bp_roadmap_updated_at 
    BEFORE UPDATE ON business_plan_roadmap 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bp_documentation_updated_at ON business_plan_documentation;
CREATE TRIGGER update_bp_documentation_updated_at 
    BEFORE UPDATE ON business_plan_documentation 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS POLICIES
ALTER TABLE business_plan ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_executive_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_market_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_marketing_strategy ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_operational_plan ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_financial_plan ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_business_model ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_roadmap ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_documentation ENABLE ROW LEVEL SECURITY;

-- Policy temporanee per permettere accesso completo
DROP POLICY IF EXISTS "Tutti possono gestire business plan" ON business_plan;
CREATE POLICY "Tutti possono gestire business plan" ON business_plan FOR ALL USING (true);

DROP POLICY IF EXISTS "Tutti possono gestire executive summary" ON business_plan_executive_summary;
CREATE POLICY "Tutti possono gestire executive summary" ON business_plan_executive_summary FOR ALL USING (true);

DROP POLICY IF EXISTS "Tutti possono gestire market analysis" ON business_plan_market_analysis;
CREATE POLICY "Tutti possono gestire market analysis" ON business_plan_market_analysis FOR ALL USING (true);

DROP POLICY IF EXISTS "Tutti possono gestire marketing strategy" ON business_plan_marketing_strategy;
CREATE POLICY "Tutti possono gestire marketing strategy" ON business_plan_marketing_strategy FOR ALL USING (true);

DROP POLICY IF EXISTS "Tutti possono gestire operational plan" ON business_plan_operational_plan;
CREATE POLICY "Tutti possono gestire operational plan" ON business_plan_operational_plan FOR ALL USING (true);

DROP POLICY IF EXISTS "Tutti possono gestire financial plan" ON business_plan_financial_plan;
CREATE POLICY "Tutti possono gestire financial plan" ON business_plan_financial_plan FOR ALL USING (true);

DROP POLICY IF EXISTS "Tutti possono gestire business model" ON business_plan_business_model;
CREATE POLICY "Tutti possono gestire business model" ON business_plan_business_model FOR ALL USING (true);

DROP POLICY IF EXISTS "Tutti possono gestire roadmap" ON business_plan_roadmap;
CREATE POLICY "Tutti possono gestire roadmap" ON business_plan_roadmap FOR ALL USING (true);

DROP POLICY IF EXISTS "Tutti possono gestire documentation" ON business_plan_documentation;
CREATE POLICY "Tutti possono gestire documentation" ON business_plan_documentation FOR ALL USING (true);

-- Verifica finale
SELECT 'Setup completato! Tabelle Business Plan create con colonne corrette' as status;`;

    navigator.clipboard.writeText(sql);
    alert('✅ Script SQL copiato negli appunti!\n\n📋 ISTRUZIONI:\n1. Vai su Supabase → SQL Editor\n2. Incolla lo script\n3. Clicca "Run"\n4. Torna qui e clicca "Verifica di nuovo"');
  };

  return (
    <div className="bg-white/30 backdrop-blur p-6 rounded-lg shadow-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        🔍 Diagnostica Tabelle Business Plan
      </h3>
      
      <div className="space-y-4">
        <button
          onClick={checkBusinessPlanTables}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? '🔍 Controllando...' : '🔍 Esegui Diagnosi'}
        </button>

        {diagnostic && (
          <div className="mt-4">
            <h4 className="font-semibold text-gray-900 mb-2">📊 Risultati Diagnosi:</h4>
            
            {diagnostic.error ? (
              <div className="bg-red-50 border border-red-200 rounded p-3">
                <p className="text-red-800">❌ Errore: {diagnostic.error}</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-green-50 border border-green-200 rounded p-3">
                  <p className="text-green-800">
                    ✅ Tabelle esistenti: {diagnostic.existingTables?.length || 0}/9
                  </p>
                </div>
                
                {diagnostic.missingTables && diagnostic.missingTables.length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                    <p className="text-yellow-800">
                      ⚠️ Tabelle mancanti: {diagnostic.missingTables.length}
                    </p>
                    <ul className="mt-2 text-sm">
                      {diagnostic.missingTables.map((table: any) => (
                        <li key={table.table} className="text-yellow-700">
                          • {table.table}: {table.error}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {diagnostic.missingTables && diagnostic.missingTables.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded p-3">
                    <button
                      onClick={generateBusinessPlanSQL}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      🔧 Genera Script SQL
                    </button>
                    <p className="text-blue-800 text-sm mt-2">
                      Clicca per generare lo script SQL con le colonne corrette
                    </p>
                  </div>
                )}

                <div className="bg-gray-50 border border-gray-200 rounded p-3">
                  <h5 className="font-semibold text-gray-900 mb-2">📋 Colonne Trovate:</h5>
                  {diagnostic.tables?.map((table: any) => (
                    <div key={table.table} className="mb-2">
                      <p className="text-sm font-medium text-gray-700">
                        {table.exists ? '✅' : '❌'} {table.table}
                      </p>
                      {table.columns.length > 0 && (
                        <p className="text-xs text-gray-600 ml-4">
                          Colonne: {table.columns.join(', ')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessPlanTablesDiagnostic;
