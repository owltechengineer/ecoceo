-- =====================================================
-- 🚀 BUSINESS PLAN QUICK FIX - VERSIONE SEMPLIFICATA
-- Solo le tabelle essenziali per far funzionare subito
-- =====================================================

-- Tabella Business Plan Principale
CREATE TABLE IF NOT EXISTS business_plan (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    name TEXT NOT NULL DEFAULT 'Business Plan',
    description TEXT,
    status TEXT DEFAULT 'draft',
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
    competitive_analysis JSONB DEFAULT '{}',
    customer_segments JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Tabelle per le altre sezioni (struttura minima)
CREATE TABLE IF NOT EXISTS business_plan_marketing_strategy (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    marketing_objectives TEXT[] DEFAULT '{}',
    target_audience JSONB DEFAULT '{}',
    pricing_strategy TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS business_plan_operational_plan (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    operations_overview TEXT,
    staffing_plan JSONB DEFAULT '{}',
    technology_requirements TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS business_plan_financial_plan (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    revenue_projections JSONB DEFAULT '{}',
    cost_structure JSONB DEFAULT '{}',
    funding_requirements DECIMAL(12,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

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

CREATE TABLE IF NOT EXISTS business_plan_roadmap (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    short_term_goals TEXT[] DEFAULT '{}',
    long_term_goals TEXT[] DEFAULT '{}',
    milestones JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS business_plan_documentation (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    documents JSONB DEFAULT '{}',
    external_links JSONB DEFAULT '{}',
    document_references TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Trigger per updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Applica trigger a tutte le tabelle
DROP TRIGGER IF EXISTS update_business_plan_updated_at ON business_plan;
CREATE TRIGGER update_business_plan_updated_at 
    BEFORE UPDATE ON business_plan 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bp_executive_summary_updated_at ON business_plan_executive_summary;
CREATE TRIGGER update_bp_executive_summary_updated_at 
    BEFORE UPDATE ON business_plan_executive_summary 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bp_market_analysis_updated_at ON business_plan_market_analysis;
CREATE TRIGGER update_bp_market_analysis_updated_at 
    BEFORE UPDATE ON business_plan_market_analysis 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bp_marketing_strategy_updated_at ON business_plan_marketing_strategy;
CREATE TRIGGER update_bp_marketing_strategy_updated_at 
    BEFORE UPDATE ON business_plan_marketing_strategy 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bp_operational_plan_updated_at ON business_plan_operational_plan;
CREATE TRIGGER update_bp_operational_plan_updated_at 
    BEFORE UPDATE ON business_plan_operational_plan 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bp_financial_plan_updated_at ON business_plan_financial_plan;
CREATE TRIGGER update_bp_financial_plan_updated_at 
    BEFORE UPDATE ON business_plan_financial_plan 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bp_business_model_updated_at ON business_plan_business_model;
CREATE TRIGGER update_bp_business_model_updated_at 
    BEFORE UPDATE ON business_plan_business_model 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bp_roadmap_updated_at ON business_plan_roadmap;
CREATE TRIGGER update_bp_roadmap_updated_at 
    BEFORE UPDATE ON business_plan_roadmap 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bp_documentation_updated_at ON business_plan_documentation;
CREATE TRIGGER update_bp_documentation_updated_at 
    BEFORE UPDATE ON business_plan_documentation 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ROW LEVEL SECURITY (Policy permissive per sviluppo)
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
SELECT 'Setup completato! Tabelle Business Plan create:' as status;

SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'business_plan%'
ORDER BY table_name;

-- =====================================================
-- 🎉 SETUP COMPLETATO!
-- Ora vai nella dashboard e usa "🧪 Test Connessione Reale"
-- =====================================================
