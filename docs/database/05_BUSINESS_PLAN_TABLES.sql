-- =====================================================
-- BUSINESS PLAN MANAGEMENT TABLES
-- Tabelle per gestione business plan completo
-- =====================================================

-- ===== TABELLE BUSINESS PLAN =====

-- Tabella Business Plan Principale
CREATE TABLE IF NOT EXISTS business_plan (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    name TEXT NOT NULL,
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
    business_plan_id UUID REFERENCES business_plan(id) ON DELETE CASCADE,
    
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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella Market Analysis
CREATE TABLE IF NOT EXISTS business_plan_market_analysis (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    business_plan_id UUID REFERENCES business_plan(id) ON DELETE CASCADE,
    
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
    market_entry_strategy TEXT,
    barriers_to_entry TEXT[] DEFAULT '{}',
    market_timing TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella Marketing Strategy
CREATE TABLE IF NOT EXISTS business_plan_marketing_strategy (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    business_plan_id UUID REFERENCES business_plan(id) ON DELETE CASCADE,
    
    -- Marketing Objectives
    marketing_objectives TEXT[] DEFAULT '{}',
    target_metrics JSONB DEFAULT '{}',
    
    -- Target Audience
    primary_audience TEXT,
    secondary_audience TEXT,
    audience_characteristics JSONB DEFAULT '{}',
    
    -- Positioning
    brand_positioning TEXT,
    value_proposition TEXT,
    brand_personality TEXT[] DEFAULT '{}',
    
    -- Pricing Strategy
    pricing_strategy TEXT,
    price_points JSONB DEFAULT '{}',
    pricing_justification TEXT,
    
    -- Distribution Channels
    distribution_channels TEXT[] DEFAULT '{}',
    channel_strategy TEXT,
    
    -- Promotional Strategy
    promotional_channels TEXT[] DEFAULT '{}',
    content_strategy TEXT,
    social_media_strategy TEXT,
    
    -- Marketing Budget
    marketing_budget DECIMAL(12,2) DEFAULT 0,
    budget_allocation JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella Operational Plan
CREATE TABLE IF NOT EXISTS business_plan_operational_plan (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    business_plan_id UUID REFERENCES business_plan(id) ON DELETE CASCADE,
    
    -- Operations Overview
    operations_overview TEXT,
    key_processes TEXT[] DEFAULT '{}',
    operational_goals TEXT[] DEFAULT '{}',
    
    -- Technology Requirements
    technology_stack TEXT[] DEFAULT '{}',
    software_requirements TEXT[] DEFAULT '{}',
    hardware_requirements TEXT[] DEFAULT '{}',
    
    -- Human Resources
    organizational_structure JSONB DEFAULT '{}',
    key_positions TEXT[] DEFAULT '{}',
    hiring_plan JSONB DEFAULT '{}',
    
    -- Facilities
    office_requirements TEXT,
    location_strategy TEXT,
    facility_costs DECIMAL(12,2) DEFAULT 0,
    
    -- Suppliers
    key_suppliers TEXT[] DEFAULT '{}',
    supplier_relationships TEXT,
    supply_chain_risks TEXT[] DEFAULT '{}',
    
    -- Quality Control
    quality_standards TEXT[] DEFAULT '{}',
    quality_control_processes TEXT[] DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella Financial Plan
CREATE TABLE IF NOT EXISTS business_plan_financial_plan (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    business_plan_id UUID REFERENCES business_plan(id) ON DELETE CASCADE,
    
    -- Revenue Projections
    revenue_year1 DECIMAL(12,2) DEFAULT 0,
    revenue_year2 DECIMAL(12,2) DEFAULT 0,
    revenue_year3 DECIMAL(12,2) DEFAULT 0,
    revenue_growth_rate DECIMAL(5,2) DEFAULT 0,
    
    -- Cost Structure
    fixed_costs DECIMAL(12,2) DEFAULT 0,
    variable_costs DECIMAL(12,2) DEFAULT 0,
    cost_breakdown JSONB DEFAULT '{}',
    
    -- Funding Requirements
    funding_needed DECIMAL(12,2) DEFAULT 0,
    funding_sources TEXT[] DEFAULT '{}',
    funding_timeline JSONB DEFAULT '{}',
    
    -- Cash Flow Projections
    cash_flow_year1 JSONB DEFAULT '{}',
    cash_flow_year2 JSONB DEFAULT '{}',
    cash_flow_year3 JSONB DEFAULT '{}',
    
    -- Break-even Analysis
    break_even_point DECIMAL(12,2) DEFAULT 0,
    break_even_timeline TEXT,
    
    -- Financial Assumptions
    financial_assumptions TEXT[] DEFAULT '{}',
    risk_factors TEXT[] DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella Business Model
CREATE TABLE IF NOT EXISTS business_plan_business_model (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    business_plan_id UUID REFERENCES business_plan(id) ON DELETE CASCADE,
    
    -- Value Proposition
    value_proposition TEXT,
    customer_problems TEXT[] DEFAULT '{}',
    solution_benefits TEXT[] DEFAULT '{}',
    
    -- Revenue Streams
    revenue_streams TEXT[] DEFAULT '{}',
    revenue_models TEXT[] DEFAULT '{}',
    pricing_models TEXT[] DEFAULT '{}',
    
    -- Key Partnerships
    key_partnerships TEXT[] DEFAULT '{}',
    partnership_types TEXT[] DEFAULT '{}',
    partnership_strategy TEXT,
    
    -- Key Activities
    key_activities TEXT[] DEFAULT '{}',
    activity_priorities TEXT[] DEFAULT '{}',
    
    -- Key Resources
    key_resources TEXT[] DEFAULT '{}',
    resource_requirements JSONB DEFAULT '{}',
    
    -- Customer Relationships
    customer_relationship_types TEXT[] DEFAULT '{}',
    customer_acquisition_strategy TEXT,
    customer_retention_strategy TEXT,
    
    -- Channels
    distribution_channels TEXT[] DEFAULT '{}',
    channel_strategy TEXT,
    
    -- Cost Structure
    cost_structure TEXT,
    cost_drivers TEXT[] DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella Roadmap
CREATE TABLE IF NOT EXISTS business_plan_roadmap (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    business_plan_id UUID REFERENCES business_plan(id) ON DELETE CASCADE,
    
    -- Roadmap Overview
    roadmap_overview TEXT,
    strategic_goals TEXT[] DEFAULT '{}',
    
    -- Milestones
    milestones JSONB DEFAULT '{}',
    key_deliverables TEXT[] DEFAULT '{}',
    
    -- Timeline
    timeline JSONB DEFAULT '{}',
    critical_path TEXT[] DEFAULT '{}',
    
    -- Success Metrics
    success_metrics JSONB DEFAULT '{}',
    kpis TEXT[] DEFAULT '{}',
    
    -- Risk Mitigation
    risk_mitigation JSONB DEFAULT '{}',
    contingency_plans TEXT[] DEFAULT '{}',
    
    -- Resource Requirements
    resource_requirements JSONB DEFAULT '{}',
    budget_requirements DECIMAL(12,2) DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella Documentation
CREATE TABLE IF NOT EXISTS business_plan_documentation (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    business_plan_id UUID REFERENCES business_plan(id) ON DELETE CASCADE,
    
    -- Document Info
    document_name TEXT NOT NULL,
    document_type TEXT DEFAULT 'section' CHECK (document_type IN ('section', 'appendix', 'attachment', 'reference')),
    document_content TEXT,
    
    -- File Info
    file_url TEXT,
    file_size INTEGER,
    file_type TEXT,
    
    -- Version Control
    version TEXT DEFAULT '1.0',
    is_current_version BOOLEAN DEFAULT TRUE,
    
    -- Status
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'approved', 'published')),
    
    -- Team
    author TEXT,
    reviewer TEXT,
    approver TEXT,
    
    -- Dates
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== RLS E POLICY =====

-- Abilita RLS su tutte le tabelle
ALTER TABLE business_plan ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_executive_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_market_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_marketing_strategy ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_operational_plan ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_financial_plan ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_business_model ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_roadmap ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_documentation ENABLE ROW LEVEL SECURITY;

-- Policy per accesso completo (temporanea)
CREATE POLICY "Allow all operations for now" ON business_plan FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON business_plan_executive_summary FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON business_plan_market_analysis FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON business_plan_marketing_strategy FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON business_plan_operational_plan FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON business_plan_financial_plan FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON business_plan_business_model FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON business_plan_roadmap FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON business_plan_documentation FOR ALL USING (true);

-- ===== TRIGGER PER UPDATED_AT =====

CREATE TRIGGER update_business_plan_updated_at 
    BEFORE UPDATE ON business_plan 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_plan_executive_summary_updated_at 
    BEFORE UPDATE ON business_plan_executive_summary 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_plan_market_analysis_updated_at 
    BEFORE UPDATE ON business_plan_market_analysis 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_plan_marketing_strategy_updated_at 
    BEFORE UPDATE ON business_plan_marketing_strategy 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_plan_operational_plan_updated_at 
    BEFORE UPDATE ON business_plan_operational_plan 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_plan_financial_plan_updated_at 
    BEFORE UPDATE ON business_plan_financial_plan 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_plan_business_model_updated_at 
    BEFORE UPDATE ON business_plan_business_model 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_plan_roadmap_updated_at 
    BEFORE UPDATE ON business_plan_roadmap 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_plan_documentation_updated_at 
    BEFORE UPDATE ON business_plan_documentation 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===== INDICI PER PERFORMANCE =====

CREATE INDEX IF NOT EXISTS idx_business_plan_user_id ON business_plan(user_id);
CREATE INDEX IF NOT EXISTS idx_business_plan_status ON business_plan(status);
CREATE INDEX IF NOT EXISTS idx_business_plan_executive_summary_business_plan_id ON business_plan_executive_summary(business_plan_id);
CREATE INDEX IF NOT EXISTS idx_business_plan_market_analysis_business_plan_id ON business_plan_market_analysis(business_plan_id);
CREATE INDEX IF NOT EXISTS idx_business_plan_marketing_strategy_business_plan_id ON business_plan_marketing_strategy(business_plan_id);
CREATE INDEX IF NOT EXISTS idx_business_plan_operational_plan_business_plan_id ON business_plan_operational_plan(business_plan_id);
CREATE INDEX IF NOT EXISTS idx_business_plan_financial_plan_business_plan_id ON business_plan_financial_plan(business_plan_id);
CREATE INDEX IF NOT EXISTS idx_business_plan_business_model_business_plan_id ON business_plan_business_model(business_plan_id);
CREATE INDEX IF NOT EXISTS idx_business_plan_roadmap_business_plan_id ON business_plan_roadmap(business_plan_id);
CREATE INDEX IF NOT EXISTS idx_business_plan_documentation_business_plan_id ON business_plan_documentation(business_plan_id);
CREATE INDEX IF NOT EXISTS idx_business_plan_documentation_status ON business_plan_documentation(status);
