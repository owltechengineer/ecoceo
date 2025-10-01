-- =====================================================
-- SEZIONE BUSINESS PLAN - TABELLE E DATI
-- =====================================================
-- Gestione completa del business plan aziendale
-- =====================================================

-- Business Plan Principale
CREATE TABLE IF NOT EXISTS business_plan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    status VARCHAR(50) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Executive Summary
CREATE TABLE IF NOT EXISTS business_plan_executive_summary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_plan_id UUID REFERENCES business_plan(id) ON DELETE CASCADE,
    company_overview TEXT,
    mission_statement TEXT,
    vision_statement TEXT,
    key_objectives TEXT,
    financial_highlights TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Company Overview
CREATE TABLE IF NOT EXISTS business_plan_company_overview (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_plan_id UUID REFERENCES business_plan(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    legal_structure VARCHAR(100),
    industry VARCHAR(100),
    founded_date DATE,
    headquarters VARCHAR(255),
    number_of_employees INTEGER,
    website VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Market Analysis
CREATE TABLE IF NOT EXISTS business_plan_market_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_plan_id UUID REFERENCES business_plan(id) ON DELETE CASCADE,
    target_market TEXT,
    market_size DECIMAL(15,2),
    market_trends TEXT,
    customer_segments TEXT,
    market_opportunity TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Operations
CREATE TABLE IF NOT EXISTS business_plan_operations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_plan_id UUID REFERENCES business_plan(id) ON DELETE CASCADE,
    production_process TEXT,
    facilities TEXT,
    equipment TEXT,
    suppliers TEXT,
    quality_control TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Management
CREATE TABLE IF NOT EXISTS business_plan_management (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_plan_id UUID REFERENCES business_plan(id) ON DELETE CASCADE,
    key_personnel TEXT,
    organizational_structure TEXT,
    management_experience TEXT,
    advisory_board TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Marketing Strategy
CREATE TABLE IF NOT EXISTS business_plan_marketing_strategy (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_plan_id UUID REFERENCES business_plan(id) ON DELETE CASCADE,
    marketing_objectives TEXT,
    target_audience TEXT,
    marketing_channels TEXT,
    pricing_strategy TEXT,
    promotional_strategy TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Business Model
CREATE TABLE IF NOT EXISTS business_plan_business_model (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_plan_id UUID REFERENCES business_plan(id) ON DELETE CASCADE,
    revenue_streams TEXT,
    cost_structure TEXT,
    value_proposition TEXT,
    customer_relationships TEXT,
    key_partnerships TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Financial Projections
CREATE TABLE IF NOT EXISTS business_plan_financial_projections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_plan_id UUID REFERENCES business_plan(id) ON DELETE CASCADE,
    revenue_projection_1_year DECIMAL(15,2),
    revenue_projection_3_years DECIMAL(15,2),
    revenue_projection_5_years DECIMAL(15,2),
    profit_margin DECIMAL(5,2),
    break_even_analysis TEXT,
    cash_flow_projection TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SWOT Analysis
CREATE TABLE IF NOT EXISTS business_plan_swot_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_plan_id UUID REFERENCES business_plan(id) ON DELETE CASCADE,
    strengths TEXT,
    weaknesses TEXT,
    opportunities TEXT,
    threats TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Competitor Analysis
CREATE TABLE IF NOT EXISTS business_plan_competitor_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_plan_id UUID REFERENCES business_plan(id) ON DELETE CASCADE,
    main_competitors TEXT,
    competitive_advantages TEXT,
    market_positioning TEXT,
    competitive_strategy TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Risk Analysis
CREATE TABLE IF NOT EXISTS business_plan_risk_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_plan_id UUID REFERENCES business_plan(id) ON DELETE CASCADE,
    market_risks TEXT,
    operational_risks TEXT,
    financial_risks TEXT,
    mitigation_strategies TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Funding
CREATE TABLE IF NOT EXISTS business_plan_funding (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_plan_id UUID REFERENCES business_plan(id) ON DELETE CASCADE,
    funding_requirements DECIMAL(15,2),
    funding_sources TEXT,
    use_of_funds TEXT,
    repayment_plan TEXT,
    investor_expectations TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appendix
CREATE TABLE IF NOT EXISTS business_plan_appendix (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_plan_id UUID REFERENCES business_plan(id) ON DELETE CASCADE,
    supporting_documents TEXT,
    financial_statements TEXT,
    market_research TEXT,
    legal_documents TEXT,
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

CREATE TRIGGER update_business_plan_updated_at BEFORE UPDATE ON business_plan FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_business_plan_executive_summary_updated_at BEFORE UPDATE ON business_plan_executive_summary FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_business_plan_company_overview_updated_at BEFORE UPDATE ON business_plan_company_overview FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_business_plan_market_analysis_updated_at BEFORE UPDATE ON business_plan_market_analysis FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_business_plan_operations_updated_at BEFORE UPDATE ON business_plan_operations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_business_plan_management_updated_at BEFORE UPDATE ON business_plan_management FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_business_plan_marketing_strategy_updated_at BEFORE UPDATE ON business_plan_marketing_strategy FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_business_plan_business_model_updated_at BEFORE UPDATE ON business_plan_business_model FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_business_plan_financial_projections_updated_at BEFORE UPDATE ON business_plan_financial_projections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_business_plan_swot_analysis_updated_at BEFORE UPDATE ON business_plan_swot_analysis FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_business_plan_competitor_analysis_updated_at BEFORE UPDATE ON business_plan_competitor_analysis FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_business_plan_risk_analysis_updated_at BEFORE UPDATE ON business_plan_risk_analysis FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_business_plan_funding_updated_at BEFORE UPDATE ON business_plan_funding FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_business_plan_appendix_updated_at BEFORE UPDATE ON business_plan_appendix FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS Policy
ALTER TABLE business_plan ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_executive_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_company_overview ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_market_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_management ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_marketing_strategy ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_business_model ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_financial_projections ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_swot_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_competitor_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_risk_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_funding ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_appendix ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations for now" ON business_plan FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON business_plan_executive_summary FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON business_plan_company_overview FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON business_plan_market_analysis FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON business_plan_operations FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON business_plan_management FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON business_plan_marketing_strategy FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON business_plan_business_model FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON business_plan_financial_projections FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON business_plan_swot_analysis FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON business_plan_competitor_analysis FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON business_plan_risk_analysis FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON business_plan_funding FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON business_plan_appendix FOR ALL USING (true);

-- Dati di esempio
INSERT INTO business_plan (title, company_name, industry, status) VALUES
('Business Plan 2024', 'TechStart S.r.l.', 'Tecnologia', 'draft'),
('Piano Strategico Q2', 'Innovation Lab', 'Software', 'active')
ON CONFLICT DO NOTHING;
