-- =====================================================
-- SETUP COMPLETO DATABASE - TUTTE LE TABELLE NECESSARIE
-- =====================================================
-- File unico per ricreare tutto il database da capo
-- =====================================================

-- 1. ELIMINA TUTTE LE TABELLE ESISTENTI
-- =====================================================
DROP TABLE IF EXISTS task_calendar_appointments CASCADE;
DROP TABLE IF EXISTS quick_tasks CASCADE;
DROP TABLE IF EXISTS financial_revenues CASCADE;
DROP TABLE IF EXISTS financial_fixed_costs CASCADE;
DROP TABLE IF EXISTS financial_variable_costs CASCADE;
DROP TABLE IF EXISTS financial_budgets CASCADE;
DROP TABLE IF EXISTS financial_departments CASCADE;
DROP TABLE IF EXISTS business_plan_marketing_strategy CASCADE;
DROP TABLE IF EXISTS business_plan_business_model CASCADE;
DROP TABLE IF EXISTS business_plan_financial_projections CASCADE;
DROP TABLE IF EXISTS business_plan_swot_analysis CASCADE;
DROP TABLE IF EXISTS business_plan_competitor_analysis CASCADE;
DROP TABLE IF EXISTS business_plan_risk_analysis CASCADE;
DROP TABLE IF EXISTS business_plan_executive_summary CASCADE;
DROP TABLE IF EXISTS business_plan_company_overview CASCADE;
DROP TABLE IF EXISTS business_plan_market_analysis CASCADE;
DROP TABLE IF EXISTS business_plan_operations CASCADE;
DROP TABLE IF EXISTS business_plan_management CASCADE;
DROP TABLE IF EXISTS business_plan_funding CASCADE;
DROP TABLE IF EXISTS business_plan_appendix CASCADE;
DROP TABLE IF EXISTS business_plan CASCADE;
DROP TABLE IF EXISTS marketing_campaigns CASCADE;
DROP TABLE IF EXISTS marketing_leads CASCADE;
DROP TABLE IF EXISTS marketing_budgets CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS dashboard_data CASCADE;

-- 2. ELIMINA TUTTE LE FUNZIONI
-- =====================================================
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS convert_quick_task_to_task(UUID) CASCADE;
DROP FUNCTION IF EXISTS distribute_cost(UUID, VARCHAR, JSONB) CASCADE;
DROP FUNCTION IF EXISTS generate_recurring_activities(DATE, DATE) CASCADE;
DROP FUNCTION IF EXISTS generate_recurring_costs() CASCADE;
DROP FUNCTION IF EXISTS generate_week_from_template(UUID, DATE) CASCADE;
DROP FUNCTION IF EXISTS get_cost_distribution(UUID, VARCHAR) CASCADE;
DROP FUNCTION IF EXISTS get_low_stock_items() CASCADE;
DROP FUNCTION IF EXISTS get_total_warehouse_value() CASCADE;
DROP FUNCTION IF EXISTS import_marketing_costs() CASCADE;
DROP FUNCTION IF EXISTS import_project_costs() CASCADE;
DROP FUNCTION IF EXISTS set_next_payment_date() CASCADE;
DROP FUNCTION IF EXISTS set_quick_tasks_completed_at() CASCADE;
DROP FUNCTION IF EXISTS set_quote_number() CASCADE;
DROP FUNCTION IF EXISTS sync_quick_tasks_to_calendar() CASCADE;
DROP FUNCTION IF EXISTS update_budget_spent() CASCADE;
DROP FUNCTION IF EXISTS update_dashboard_data_updated_at() CASCADE;
DROP FUNCTION IF EXISTS update_item_quantity_after_movement() CASCADE;
DROP FUNCTION IF EXISTS update_marketing_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS update_quick_tasks_updated_at() CASCADE;
DROP FUNCTION IF EXISTS update_warehouse_updated_at() CASCADE;
DROP FUNCTION IF EXISTS exec_sql(TEXT) CASCADE;
DROP FUNCTION IF EXISTS generate_quote_number() CASCADE;

-- 3. CREA TUTTE LE TABELLE
-- =====================================================

-- Dashboard Data (principale)
CREATE TABLE dashboard_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    data_type TEXT NOT NULL,
    data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, data_type)
);

-- Dipartimenti Finanziari
CREATE TABLE financial_departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    budget_allocated DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Entrate
CREATE TABLE financial_revenues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name VARCHAR(255) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    category VARCHAR(100),
    date DATE NOT NULL,
    description TEXT,
    payment_method VARCHAR(50),
    is_received BOOLEAN DEFAULT false,
    department_id UUID REFERENCES financial_departments(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Costi Fissi
CREATE TABLE financial_fixed_costs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    category VARCHAR(100),
    start_date DATE NOT NULL,
    end_date DATE,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    department_id UUID REFERENCES financial_departments(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Costi Variabili
CREATE TABLE financial_variable_costs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    category VARCHAR(100),
    date DATE NOT NULL,
    description TEXT,
    vendor VARCHAR(255),
    is_paid BOOLEAN DEFAULT false,
    department_id UUID REFERENCES financial_departments(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Budget
CREATE TABLE financial_budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    category VARCHAR(100),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    description TEXT,
    department_id UUID REFERENCES financial_departments(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Business Plan Principale
CREATE TABLE business_plan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    status VARCHAR(50) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Executive Summary
CREATE TABLE business_plan_executive_summary (
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
CREATE TABLE business_plan_company_overview (
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
CREATE TABLE business_plan_market_analysis (
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
CREATE TABLE business_plan_operations (
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
CREATE TABLE business_plan_management (
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
CREATE TABLE business_plan_marketing_strategy (
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
CREATE TABLE business_plan_business_model (
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
CREATE TABLE business_plan_financial_projections (
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
CREATE TABLE business_plan_swot_analysis (
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
CREATE TABLE business_plan_competitor_analysis (
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
CREATE TABLE business_plan_risk_analysis (
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
CREATE TABLE business_plan_funding (
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
CREATE TABLE business_plan_appendix (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_plan_id UUID REFERENCES business_plan(id) ON DELETE CASCADE,
    supporting_documents TEXT,
    financial_statements TEXT,
    market_research TEXT,
    legal_documents TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campagne Marketing
CREATE TABLE marketing_campaigns (
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
CREATE TABLE marketing_leads (
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
CREATE TABLE marketing_budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES marketing_campaigns(id),
    amount DECIMAL(15,2) NOT NULL,
    spent DECIMAL(15,2) DEFAULT 0,
    category VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Progetti
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    status VARCHAR(50) DEFAULT 'active',
    priority VARCHAR(20) DEFAULT 'medium',
    budget DECIMAL(15,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Task
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    priority VARCHAR(20) DEFAULT 'medium',
    due_date DATE,
    project_id UUID REFERENCES projects(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Task Calendar Appointments
CREATE TABLE task_calendar_appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    is_task BOOLEAN DEFAULT false,
    is_recurring BOOLEAN DEFAULT false,
    recurring_frequency VARCHAR(50),
    task_id UUID REFERENCES tasks(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quick Tasks
CREATE TABLE quick_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL,
    priority VARCHAR(20) DEFAULT 'medium',
    status VARCHAR(50) DEFAULT 'pending',
    stakeholder VARCHAR(255),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. CREA FUNZIONI NECESSARIE
-- =====================================================

-- Funzione per aggiornare updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 5. CREA TRIGGER PER UPDATED_AT
-- =====================================================

CREATE TRIGGER update_dashboard_data_updated_at BEFORE UPDATE ON dashboard_data FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_financial_departments_updated_at BEFORE UPDATE ON financial_departments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_financial_revenues_updated_at BEFORE UPDATE ON financial_revenues FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_financial_fixed_costs_updated_at BEFORE UPDATE ON financial_fixed_costs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_financial_variable_costs_updated_at BEFORE UPDATE ON financial_variable_costs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_financial_budgets_updated_at BEFORE UPDATE ON financial_budgets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
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
CREATE TRIGGER update_marketing_campaigns_updated_at BEFORE UPDATE ON marketing_campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_marketing_leads_updated_at BEFORE UPDATE ON marketing_leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_marketing_budgets_updated_at BEFORE UPDATE ON marketing_budgets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_task_calendar_appointments_updated_at BEFORE UPDATE ON task_calendar_appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quick_tasks_updated_at BEFORE UPDATE ON quick_tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. ABILITA RLS (ROW LEVEL SECURITY)
-- =====================================================

ALTER TABLE dashboard_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_revenues ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_fixed_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_variable_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_budgets ENABLE ROW LEVEL SECURITY;
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
ALTER TABLE marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_calendar_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE quick_tasks ENABLE ROW LEVEL SECURITY;

-- 7. CREA POLICY RLS
-- =====================================================

CREATE POLICY "Allow all operations for now" ON dashboard_data FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON financial_departments FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON financial_revenues FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON financial_fixed_costs FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON financial_variable_costs FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON financial_budgets FOR ALL USING (true);
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
CREATE POLICY "Allow all operations for now" ON marketing_campaigns FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON marketing_leads FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON marketing_budgets FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON projects FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON tasks FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON task_calendar_appointments FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON quick_tasks FOR ALL USING (true);

-- 8. INSERISCI DATI DI ESEMPIO
-- =====================================================

-- Dipartimenti di esempio
INSERT INTO financial_departments (name, description, budget_allocated) VALUES
('Marketing', 'Dipartimento Marketing e Comunicazione', 50000.00),
('Vendite', 'Dipartimento Vendite e Clienti', 75000.00),
('Sviluppo', 'Dipartimento Sviluppo e R&D', 100000.00),
('Amministrazione', 'Dipartimento Amministrativo', 30000.00);

-- Quick Task di esempio
INSERT INTO quick_tasks (title, description, type, priority, status, stakeholder) VALUES
('Chiamare cliente', 'Richiamare il cliente per conferma ordine', 'call', 'high', 'pending', 'Mario Rossi'),
('Inviare preventivo', 'Inviare preventivo via email al cliente', 'email', 'medium', 'pending', 'Giulia Bianchi'),
('Preparare presentazione', 'Preparare slide per meeting settimanale', 'document', 'low', 'completed', 'Team Marketing'),
('Ordinare materiali', 'Ordinare nuovi materiali per ufficio', 'order', 'medium', 'pending', 'Amministrazione');

-- Business Plan di esempio
INSERT INTO business_plan (title, company_name, industry, status) VALUES
('Business Plan 2024', 'TechStart S.r.l.', 'Tecnologia', 'draft'),
('Piano Strategico Q2', 'Innovation Lab', 'Software', 'active');

-- Campagne Marketing di esempio
INSERT INTO marketing_campaigns (name, description, start_date, end_date, budget, status, channel, target_audience) VALUES
('Campagna Social Media Q1', 'Campagna promozionale sui social media per il primo trimestre', '2024-01-01', '2024-03-31', 15000.00, 'active', 'Social Media', 'Giovani 18-35 anni'),
('Email Marketing Newsletter', 'Newsletter mensile per clienti esistenti', '2024-01-01', '2024-12-31', 5000.00, 'active', 'Email', 'Clienti esistenti'),
('Google Ads Search', 'Campagna Google Ads per parole chiave specifiche', '2024-02-01', '2024-06-30', 25000.00, 'active', 'Google Ads', 'Professionisti 25-50 anni');

-- Lead di esempio
INSERT INTO marketing_leads (name, email, phone, company, source, status, priority, notes) VALUES
('Mario Rossi', 'mario.rossi@email.com', '+39 123 456 7890', 'Azienda ABC', 'Google Ads', 'new', 'high', 'Interessato al prodotto premium'),
('Giulia Bianchi', 'giulia.bianchi@email.com', '+39 098 765 4321', 'Startup XYZ', 'Social Media', 'contacted', 'medium', 'Richiesta informazioni via LinkedIn'),
('Luca Verdi', 'luca.verdi@email.com', '+39 555 123 4567', 'Freelancer', 'Newsletter', 'qualified', 'high', 'Cliente potenziale per servizi B2B');

-- Progetti di esempio
INSERT INTO projects (name, description, start_date, end_date, status, priority, budget) VALUES
('Sviluppo App Mobile', 'Sviluppo di un\'applicazione mobile per iOS e Android', '2024-01-15', '2024-06-30', 'active', 'high', 50000.00),
('Redesign Sito Web', 'Rinnovamento completo del sito web aziendale', '2024-02-01', '2024-04-30', 'active', 'medium', 15000.00),
('Sistema CRM', 'Implementazione di un sistema CRM per la gestione clienti', '2024-03-01', '2024-08-31', 'planning', 'high', 30000.00);

-- 9. VERIFICA FINALE
-- =====================================================

-- Conta le tabelle create
SELECT 
    COUNT(*) as total_tables,
    'Tabelle create con successo' as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE';

-- Lista tutte le tabelle
SELECT 
    table_name,
    '✅ Creata' as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- =====================================================
-- SETUP COMPLETO TERMINATO
-- =====================================================
-- Tutte le tabelle sono state create con:
-- - Trigger per updated_at
-- - RLS abilitato
-- - Policy per accesso completo
-- - Dati di esempio
-- =====================================================
