-- =====================================================
-- 🔧 FIX TABELLE BUSINESS PLAN - ESEGUI SU SUPABASE
-- =====================================================
--
-- ISTRUZIONI:
-- 1. Copia tutto questo contenuto
-- 2. Vai su Supabase.com > Il tuo progetto
-- 3. SQL Editor > New Query
-- 4. Incolla e clicca RUN
--
-- =====================================================

-- Tabella Business Plan Principale
CREATE TABLE IF NOT EXISTS business_plan (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    name TEXT NOT NULL DEFAULT 'Business Plan',
    description TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'approved', 'active', 'archived')),
    version TEXT DEFAULT '1.0',
    
    -- Company Info
    company_name TEXT,
    industry TEXT,
    company_size TEXT CHECK (company_size IN ('startup', 'small', 'medium', 'large', 'enterprise')),
    
    -- Dates
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    review_date TIMESTAMP WITH TIME ZONE,
    
    -- Team
    author TEXT,
    reviewer TEXT,
    approver TEXT,
    
    -- Metadata
    notes TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella Executive Summary
CREATE TABLE IF NOT EXISTS business_plan_executive_summary (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    business_plan_id UUID,
    
    -- Company Overview
    company_overview TEXT,
    mission_statement TEXT,
    vision_statement TEXT,
    values TEXT[] DEFAULT '{}',
    
    -- Key Highlights
    key_highlights TEXT[] DEFAULT '{}',
    unique_selling_proposition TEXT,
    competitive_advantages TEXT[] DEFAULT '{}',
    
    -- Financial Summary
    funding_requirements DECIMAL(12,2) DEFAULT 0,
    expected_revenue_year1 DECIMAL(12,2) DEFAULT 0,
    expected_revenue_year3 DECIMAL(12,2) DEFAULT 0,
    break_even_month INTEGER DEFAULT 0,
    
    -- Team Summary
    key_team_members TEXT[] DEFAULT '{}',
    advisory_board TEXT[] DEFAULT '{}',
    
    -- Next Steps
    immediate_next_steps TEXT[] DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraint per user unico
    UNIQUE(user_id)
);

-- Tabella Market Analysis
CREATE TABLE IF NOT EXISTS business_plan_market_analysis (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    business_plan_id UUID,
    
    -- Market Size
    total_addressable_market DECIMAL(15,2) DEFAULT 0,
    serviceable_addressable_market DECIMAL(15,2) DEFAULT 0,
    serviceable_obtainable_market DECIMAL(15,2) DEFAULT 0,
    market_growth_rate DECIMAL(5,2) DEFAULT 0,
    
    -- Target Market
    target_customers TEXT[] DEFAULT '{}',
    customer_segments JSONB DEFAULT '{}',
    customer_personas JSONB DEFAULT '{}',
    
    -- Market Trends
    market_trends TEXT[] DEFAULT '{}',
    industry_trends TEXT[] DEFAULT '{}',
    technology_trends TEXT[] DEFAULT '{}',
    
    -- Competition
    direct_competitors TEXT[] DEFAULT '{}',
    indirect_competitors TEXT[] DEFAULT '{}',
    competitive_analysis JSONB DEFAULT '{}',
    
    -- Market Entry
    market_entry_strategy TEXT[] DEFAULT '{}',
    barriers_to_entry TEXT[] DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id)
);

-- Tabella Marketing Strategy
CREATE TABLE IF NOT EXISTS business_plan_marketing_strategy (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    business_plan_id UUID,
    
    -- Marketing Objectives
    marketing_objectives TEXT[] DEFAULT '{}',
    target_audience JSONB DEFAULT '{}',
    positioning_statement TEXT,
    
    -- Pricing Strategy
    pricing_model TEXT,
    price_points JSONB DEFAULT '{}',
    pricing_justification TEXT,
    
    -- Marketing Mix (4P)
    product_strategy TEXT,
    price_strategy TEXT,
    place_strategy TEXT,
    promotion_strategy TEXT,
    
    -- Digital Marketing
    digital_channels TEXT[] DEFAULT '{}',
    content_strategy TEXT,
    social_media_strategy TEXT,
    
    -- Budget & Metrics
    marketing_budget DECIMAL(12,2) DEFAULT 0,
    customer_acquisition_cost DECIMAL(8,2) DEFAULT 0,
    customer_lifetime_value DECIMAL(10,2) DEFAULT 0,
    conversion_rates JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id)
);

-- Tabella Operational Plan
CREATE TABLE IF NOT EXISTS business_plan_operational_plan (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    business_plan_id UUID,
    
    -- Operations Overview
    operations_overview TEXT,
    business_processes JSONB DEFAULT '{}',
    
    -- Technology & Systems
    technology_requirements TEXT[] DEFAULT '{}',
    software_systems TEXT[] DEFAULT '{}',
    hardware_requirements TEXT[] DEFAULT '{}',
    
    -- Human Resources
    organizational_structure JSONB DEFAULT '{}',
    staffing_plan JSONB DEFAULT '{}',
    key_personnel JSONB DEFAULT '{}',
    hiring_timeline JSONB DEFAULT '{}',
    
    -- Facilities & Equipment
    facility_requirements TEXT[] DEFAULT '{}',
    equipment_needs TEXT[] DEFAULT '{}',
    location_strategy TEXT,
    
    -- Supply Chain
    suppliers JSONB DEFAULT '{}',
    vendor_relationships TEXT[] DEFAULT '{}',
    inventory_management TEXT,
    
    -- Quality Control
    quality_standards TEXT[] DEFAULT '{}',
    quality_processes TEXT[] DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id)
);

-- Tabella Financial Plan
CREATE TABLE IF NOT EXISTS business_plan_financial_plan (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    business_plan_id UUID,
    
    -- Revenue Model
    revenue_streams JSONB DEFAULT '{}',
    revenue_projections JSONB DEFAULT '{}',
    pricing_assumptions JSONB DEFAULT '{}',
    
    -- Cost Structure
    cost_categories JSONB DEFAULT '{}',
    fixed_costs JSONB DEFAULT '{}',
    variable_costs JSONB DEFAULT '{}',
    
    -- Financial Projections (3-5 years)
    revenue_forecast JSONB DEFAULT '{}',
    expense_forecast JSONB DEFAULT '{}',
    cash_flow_projections JSONB DEFAULT '{}',
    
    -- Key Financial Metrics
    gross_margin DECIMAL(5,2) DEFAULT 0,
    net_margin DECIMAL(5,2) DEFAULT 0,
    break_even_point INTEGER DEFAULT 0,
    payback_period INTEGER DEFAULT 0,
    
    -- Funding Requirements
    startup_costs DECIMAL(12,2) DEFAULT 0,
    working_capital DECIMAL(12,2) DEFAULT 0,
    total_funding_needed DECIMAL(12,2) DEFAULT 0,
    funding_sources JSONB DEFAULT '{}',
    
    -- Financial Ratios
    financial_ratios JSONB DEFAULT '{}',
    sensitivity_analysis JSONB DEFAULT '{}',
    scenario_analysis JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id)
);

-- Tabella Business Model
CREATE TABLE IF NOT EXISTS business_plan_business_model (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    business_plan_id UUID,
    
    -- Business Model Canvas
    key_partners TEXT[] DEFAULT '{}',
    key_activities TEXT[] DEFAULT '{}',
    key_resources TEXT[] DEFAULT '{}',
    value_propositions TEXT[] DEFAULT '{}',
    customer_relationships TEXT[] DEFAULT '{}',
    channels TEXT[] DEFAULT '{}',
    customer_segments TEXT[] DEFAULT '{}',
    cost_structure TEXT[] DEFAULT '{}',
    revenue_streams TEXT[] DEFAULT '{}',
    
    -- Canvas as JSONB for flexibility
    canvas_data JSONB DEFAULT '{}',
    
    -- Business Model Type
    business_model_type TEXT,
    business_model_description TEXT,
    
    -- Value Creation
    value_creation_process TEXT,
    value_delivery_mechanism TEXT,
    value_capture_method TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id)
);

-- Tabella Roadmap
CREATE TABLE IF NOT EXISTS business_plan_roadmap (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    business_plan_id UUID,
    
    -- Strategic Goals
    short_term_goals TEXT[] DEFAULT '{}',
    medium_term_goals TEXT[] DEFAULT '{}',
    long_term_goals TEXT[] DEFAULT '{}',
    
    -- Milestones & Timeline
    milestones JSONB DEFAULT '{}',
    timeline_phases JSONB DEFAULT '{}',
    
    -- Key Performance Indicators
    kpis JSONB DEFAULT '{}',
    success_metrics TEXT[] DEFAULT '{}',
    
    -- Risk Management
    potential_risks JSONB DEFAULT '{}',
    mitigation_strategies JSONB DEFAULT '{}',
    contingency_plans JSONB DEFAULT '{}',
    
    -- Resource Planning
    resource_requirements JSONB DEFAULT '{}',
    budget_allocation JSONB DEFAULT '{}',
    team_expansion_plan JSONB DEFAULT '{}',
    
    -- Market Expansion
    expansion_strategies TEXT[] DEFAULT '{}',
    growth_opportunities TEXT[] DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id)
);

-- Tabella Documentation
CREATE TABLE IF NOT EXISTS business_plan_documentation (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    business_plan_id UUID,
    
    -- Document Management
    documents JSONB DEFAULT '{}',
    document_versions JSONB DEFAULT '{}',
    
    -- External Links & References
    external_links JSONB DEFAULT '{}',
    references TEXT[] DEFAULT '{}',
    
    -- Supporting Materials
    financial_models TEXT[] DEFAULT '{}',
    market_research_reports TEXT[] DEFAULT '{}',
    legal_documents TEXT[] DEFAULT '{}',
    technical_specifications TEXT[] DEFAULT '{}',
    
    -- Appendices
    appendices JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id)
);

-- =====================================================
-- INDICI PER PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_business_plan_user_id ON business_plan(user_id);
CREATE INDEX IF NOT EXISTS idx_bp_executive_summary_user_id ON business_plan_executive_summary(user_id);
CREATE INDEX IF NOT EXISTS idx_bp_market_analysis_user_id ON business_plan_market_analysis(user_id);
CREATE INDEX IF NOT EXISTS idx_bp_marketing_strategy_user_id ON business_plan_marketing_strategy(user_id);
CREATE INDEX IF NOT EXISTS idx_bp_operational_plan_user_id ON business_plan_operational_plan(user_id);
CREATE INDEX IF NOT EXISTS idx_bp_financial_plan_user_id ON business_plan_financial_plan(user_id);
CREATE INDEX IF NOT EXISTS idx_bp_business_model_user_id ON business_plan_business_model(user_id);
CREATE INDEX IF NOT EXISTS idx_bp_roadmap_user_id ON business_plan_roadmap(user_id);
CREATE INDEX IF NOT EXISTS idx_bp_documentation_user_id ON business_plan_documentation(user_id);

-- =====================================================
-- TRIGGER PER UPDATED_AT
-- =====================================================

-- Funzione per aggiornare updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger per tutte le tabelle
CREATE TRIGGER IF NOT EXISTS update_business_plan_updated_at 
    BEFORE UPDATE ON business_plan 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_bp_executive_summary_updated_at 
    BEFORE UPDATE ON business_plan_executive_summary 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_bp_market_analysis_updated_at 
    BEFORE UPDATE ON business_plan_market_analysis 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_bp_marketing_strategy_updated_at 
    BEFORE UPDATE ON business_plan_marketing_strategy 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_bp_operational_plan_updated_at 
    BEFORE UPDATE ON business_plan_operational_plan 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_bp_financial_plan_updated_at 
    BEFORE UPDATE ON business_plan_financial_plan 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_bp_business_model_updated_at 
    BEFORE UPDATE ON business_plan_business_model 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_bp_roadmap_updated_at 
    BEFORE UPDATE ON business_plan_roadmap 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_bp_documentation_updated_at 
    BEFORE UPDATE ON business_plan_documentation 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE business_plan ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_executive_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_market_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_marketing_strategy ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_operational_plan ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_financial_plan ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_business_model ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_roadmap ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_documentation ENABLE ROW LEVEL SECURITY;

-- Policy permissive per sviluppo (ATTENZIONE: in produzione usa policy più restrittive)
CREATE POLICY IF NOT EXISTS "Tutti possono gestire business plan" ON business_plan FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Tutti possono gestire executive summary" ON business_plan_executive_summary FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Tutti possono gestire market analysis" ON business_plan_market_analysis FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Tutti possono gestire marketing strategy" ON business_plan_marketing_strategy FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Tutti possono gestire operational plan" ON business_plan_operational_plan FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Tutti possono gestire financial plan" ON business_plan_financial_plan FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Tutti possono gestire business model" ON business_plan_business_model FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Tutti possono gestire roadmap" ON business_plan_roadmap FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Tutti possono gestire documentation" ON business_plan_documentation FOR ALL USING (true);

-- =====================================================
-- VERIFICA INSTALLAZIONE
-- =====================================================

-- Controlla che tutte le tabelle siano state create
SELECT 
    'Tabelle Business Plan create:' as status,
    COUNT(*) as total_tables
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'business_plan%';

-- Lista delle tabelle create
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'business_plan%'
ORDER BY table_name;

-- =====================================================
-- 🎉 INSTALLAZIONE COMPLETATA!
-- =====================================================
-- 
-- Ora il Business Plan dovrebbe funzionare correttamente.
-- Vai nella dashboard e prova il componente diagnostico.
--
-- =====================================================
