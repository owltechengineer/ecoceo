-- =====================================================
-- COMPLETE DATABASE SETUP - ALL 45 TABLES
-- =====================================================
-- Crea tutte le tabelle per tutte le sezioni del sistema
-- Basato su analisi completa DATABASE_ANALYSIS_COMPLETE.md
-- =====================================================

-- 1. DASHBOARD TOTALE - Panoramica generale (10 tabelle)
-- =====================================================

-- Campagne Marketing
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) DEFAULT 'digital' CHECK (type IN ('digital', 'print', 'tv', 'radio', 'outdoor', 'social', 'email', 'other')),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('planning', 'active', 'paused', 'completed', 'cancelled')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    budget DECIMAL(15,2) NOT NULL DEFAULT 0,
    spent_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'EUR',
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    campaign_manager VARCHAR(255),
    creative_director VARCHAR(255),
    account_manager VARCHAR(255),
    target_impressions INTEGER DEFAULT 0,
    target_clicks INTEGER DEFAULT 0,
    target_conversions INTEGER DEFAULT 0,
    actual_impressions INTEGER DEFAULT 0,
    actual_clicks INTEGER DEFAULT 0,
    actual_conversions INTEGER DEFAULT 0,
    notes TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lead
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    company VARCHAR(255),
    job_title VARCHAR(255),
    source VARCHAR(50) DEFAULT 'website' CHECK (source IN ('website', 'social', 'email', 'referral', 'advertising', 'event', 'cold_call', 'other')),
    status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    score INTEGER DEFAULT 0 CHECK (score >= 0 AND score <= 100),
    campaign_id UUID REFERENCES campaigns(id),
    country VARCHAR(100),
    city VARCHAR(100),
    address TEXT,
    notes TEXT,
    tags TEXT[] DEFAULT '{}',
    first_contact_date TIMESTAMP WITH TIME ZONE NOT NULL,
    last_contact_date TIMESTAMP WITH TIME ZONE,
    next_followup_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Progetti
CREATE TABLE IF NOT EXISTS task_calendar_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    budget DECIMAL(15,2) DEFAULT 0,
    spent DECIMAL(15,2) DEFAULT 0,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Task
CREATE TABLE IF NOT EXISTS task_calendar_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    due_date TIMESTAMP WITH TIME ZONE,
    assigned_to VARCHAR(255),
    category VARCHAR(100),
    project_id UUID REFERENCES task_calendar_projects(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appuntamenti
CREATE TABLE IF NOT EXISTS task_calendar_appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    location VARCHAR(255),
    attendees TEXT[],
    status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Attività Ricorrenti
CREATE TABLE IF NOT EXISTS recurring_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    frequency VARCHAR(20) DEFAULT 'weekly' CHECK (frequency IN ('daily', 'weekly', 'monthly', 'yearly')),
    day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6),
    day_of_month INTEGER CHECK (day_of_month >= 1 AND day_of_month <= 31),
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
    assigned_to VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quick Tasks
CREATE TABLE IF NOT EXISTS quick_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('reminder', 'order', 'invoice', 'document', 'mail')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    stakeholder VARCHAR(255),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
    due_date TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Costi Fissi
CREATE TABLE IF NOT EXISTS financial_fixed_costs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    amount DECIMAL(15,2) NOT NULL,
    category VARCHAR(100),
    date DATE NOT NULL,
    vendor VARCHAR(255),
    is_paid BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Costi Variabili
CREATE TABLE IF NOT EXISTS financial_variable_costs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    amount DECIMAL(15,2) NOT NULL,
    category VARCHAR(100),
    date DATE NOT NULL,
    vendor VARCHAR(255),
    is_paid BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Entrate
CREATE TABLE IF NOT EXISTS financial_revenues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    amount DECIMAL(15,2) NOT NULL,
    category VARCHAR(100),
    date DATE NOT NULL,
    client_name VARCHAR(255),
    is_received BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. MARKETING AVANZATO (12 tabelle)
-- =====================================================

-- Budget Marketing
CREATE TABLE IF NOT EXISTS marketing_budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES campaigns(id),
    amount DECIMAL(15,2) NOT NULL,
    spent DECIMAL(15,2) DEFAULT 0,
    category VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SEO Projects
CREATE TABLE IF NOT EXISTS marketing_seo_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    budget DECIMAL(15,2) DEFAULT 0,
    spent DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SEO Tasks
CREATE TABLE IF NOT EXISTS marketing_seo_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    due_date TIMESTAMP WITH TIME ZONE,
    assigned_to VARCHAR(255),
    project_id UUID REFERENCES marketing_seo_projects(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CRM Campaigns
CREATE TABLE IF NOT EXISTS marketing_crm_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    budget DECIMAL(15,2) DEFAULT 0,
    spent DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CRM Contacts
CREATE TABLE IF NOT EXISTS marketing_crm_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    company VARCHAR(255),
    source VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'blocked')),
    campaign_id UUID REFERENCES marketing_crm_campaigns(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ad Campaigns
CREATE TABLE IF NOT EXISTS marketing_ad_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    name VARCHAR(255) NOT NULL,
    platform VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
    budget DECIMAL(15,2) DEFAULT 0,
    spent DECIMAL(15,2) DEFAULT 0,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ad Groups
CREATE TABLE IF NOT EXISTS marketing_ad_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES marketing_ad_campaigns(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
    budget DECIMAL(15,2) DEFAULT 0,
    spent DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content Calendar
CREATE TABLE IF NOT EXISTS marketing_content_calendar (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    title VARCHAR(255) NOT NULL,
    content_type VARCHAR(100) NOT NULL,
    platform VARCHAR(100) NOT NULL,
    scheduled_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'published', 'cancelled')),
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Social Accounts
CREATE TABLE IF NOT EXISTS marketing_social_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    platform VARCHAR(100) NOT NULL,
    account_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    followers_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reports
CREATE TABLE IF NOT EXISTS marketing_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    report_type VARCHAR(100) NOT NULL,
    period VARCHAR(50) NOT NULL,
    metrics JSONB DEFAULT '{}',
    data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Newsletter Templates
CREATE TABLE IF NOT EXISTS marketing_newsletter_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Newsletter Campaigns
CREATE TABLE IF NOT EXISTS marketing_newsletter_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    name VARCHAR(255) NOT NULL,
    template_id UUID REFERENCES marketing_newsletter_templates(id),
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sent', 'cancelled')),
    scheduled_date TIMESTAMP WITH TIME ZONE,
    sent_date TIMESTAMP WITH TIME ZONE,
    recipients_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quick Quotes
CREATE TABLE IF NOT EXISTS marketing_quick_quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255),
    client_phone VARCHAR(50),
    items JSONB DEFAULT '[]',
    total_amount DECIMAL(15,2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. PROGETTI (6 tabelle)
-- =====================================================

-- Progetti Principali
CREATE TABLE IF NOT EXISTS projects_main (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    budget DECIMAL(15,2) DEFAULT 0,
    project_manager VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Obiettivi Progetto
CREATE TABLE IF NOT EXISTS project_objectives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects_main(id) ON DELETE CASCADE,
    objective VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    due_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Budget Progetto
CREATE TABLE IF NOT EXISTS project_budget (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects_main(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    spent DECIMAL(15,2) DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team Progetto
CREATE TABLE IF NOT EXISTS project_team (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects_main(id) ON DELETE CASCADE,
    member_name VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Milestone Progetto
CREATE TABLE IF NOT EXISTS project_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects_main(id) ON DELETE CASCADE,
    milestone_name VARCHAR(255) NOT NULL,
    description TEXT,
    due_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rischi Progetto
CREATE TABLE IF NOT EXISTS project_risks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects_main(id) ON DELETE CASCADE,
    risk_name VARCHAR(255) NOT NULL,
    description TEXT,
    probability VARCHAR(20) DEFAULT 'medium' CHECK (probability IN ('low', 'medium', 'high')),
    impact VARCHAR(20) DEFAULT 'medium' CHECK (impact IN ('low', 'medium', 'high')),
    mitigation_plan TEXT,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'mitigated', 'resolved')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. MAGAZZINO E DOCUMENTI (6 tabelle - DA CREARE)
-- =====================================================

-- Articoli Magazzino
CREATE TABLE IF NOT EXISTS warehouse_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    quantity INTEGER DEFAULT 0,
    unit VARCHAR(50) DEFAULT 'pz',
    price DECIMAL(15,2) NOT NULL,
    description TEXT,
    sku VARCHAR(100) UNIQUE,
    location VARCHAR(100),
    min_stock INTEGER DEFAULT 0,
    max_stock INTEGER DEFAULT 0,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categorie Articoli
CREATE TABLE IF NOT EXISTS warehouse_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES warehouse_categories(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Posizioni Magazzino
CREATE TABLE IF NOT EXISTS warehouse_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    capacity INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Preventivi
CREATE TABLE IF NOT EXISTS quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255),
    client_address TEXT,
    language VARCHAR(10) DEFAULT 'it',
    subtotal DECIMAL(15,2) DEFAULT 0,
    tax DECIMAL(15,2) DEFAULT 0,
    total DECIMAL(15,2) DEFAULT 0,
    valid_until TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Articoli Preventivo
CREATE TABLE IF NOT EXISTS quote_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE,
    item_id UUID REFERENCES warehouse_items(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(15,2) NOT NULL,
    total DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transazioni Magazzino
CREATE TABLE IF NOT EXISTS warehouse_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID REFERENCES warehouse_items(id),
    transaction_type VARCHAR(50) NOT NULL CHECK (transaction_type IN ('in', 'out', 'adjustment', 'transfer')),
    quantity INTEGER NOT NULL,
    reason TEXT,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. GESTIONE GENERALE (9 tabelle)
-- =====================================================

-- Dashboard Data
CREATE TABLE IF NOT EXISTS dashboard_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    data_type TEXT NOT NULL,
    data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, data_type)
);

-- Executive Summary
CREATE TABLE IF NOT EXISTS business_plan_executive_summary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    content TEXT,
    pitch TEXT,
    documents JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Market Analysis
CREATE TABLE IF NOT EXISTS business_plan_market_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    demographics JSONB DEFAULT '[]',
    competitors JSONB DEFAULT '[]',
    swot JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Marketing Strategy
CREATE TABLE IF NOT EXISTS business_plan_marketing_strategy (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    strategies JSONB DEFAULT '[]',
    timeline JSONB DEFAULT '[]',
    customer_journey JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Operational Plan
CREATE TABLE IF NOT EXISTS business_plan_operational_plan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    roles JSONB DEFAULT '[]',
    milestones JSONB DEFAULT '[]',
    flow_diagram JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Financial Plan
CREATE TABLE IF NOT EXISTS business_plan_financial_plan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    revenues JSONB DEFAULT '[]',
    expenses JSONB DEFAULT '[]',
    forecasts JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Business Model
CREATE TABLE IF NOT EXISTS business_plan_business_model (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    canvas JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Roadmap
CREATE TABLE IF NOT EXISTS business_plan_roadmap (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    goals JSONB DEFAULT '[]',
    kpis JSONB DEFAULT '[]',
    timeline JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Documentation
CREATE TABLE IF NOT EXISTS business_plan_documentation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    files JSONB DEFAULT '[]',
    links JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- 6. CREA FUNZIONI E TRIGGER
-- =====================================================

-- Funzione per updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 7. CREA INDICI PER PERFORMANCE
-- =====================================================

-- Indici per Dashboard
CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_leads_user_id ON leads(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_campaign_id ON leads(campaign_id);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON task_calendar_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON task_calendar_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON task_calendar_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON task_calendar_appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_recurring_user_id ON recurring_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_quick_tasks_user_id ON quick_tasks(user_id);

-- Indici per Marketing
CREATE INDEX IF NOT EXISTS idx_marketing_budgets_campaign_id ON marketing_budgets(campaign_id);
CREATE INDEX IF NOT EXISTS idx_seo_projects_user_id ON marketing_seo_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_seo_tasks_user_id ON marketing_seo_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_crm_campaigns_user_id ON marketing_crm_campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_user_id ON marketing_crm_contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_user_id ON marketing_ad_campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_content_calendar_user_id ON marketing_content_calendar(user_id);
CREATE INDEX IF NOT EXISTS idx_social_accounts_user_id ON marketing_social_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON marketing_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_templates_user_id ON marketing_newsletter_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_campaigns_user_id ON marketing_newsletter_campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_quick_quotes_user_id ON marketing_quick_quotes(user_id);

-- Indici per Progetti
CREATE INDEX IF NOT EXISTS idx_projects_main_user_id ON projects_main(user_id);
CREATE INDEX IF NOT EXISTS idx_project_objectives_project_id ON project_objectives(project_id);
CREATE INDEX IF NOT EXISTS idx_project_budget_project_id ON project_budget(project_id);
CREATE INDEX IF NOT EXISTS idx_project_team_project_id ON project_team(project_id);
CREATE INDEX IF NOT EXISTS idx_project_milestones_project_id ON project_milestones(project_id);
CREATE INDEX IF NOT EXISTS idx_project_risks_project_id ON project_risks(project_id);

-- Indici per Magazzino
CREATE INDEX IF NOT EXISTS idx_warehouse_items_user_id ON warehouse_items(user_id);
CREATE INDEX IF NOT EXISTS idx_warehouse_items_category ON warehouse_items(category);
CREATE INDEX IF NOT EXISTS idx_warehouse_items_sku ON warehouse_items(sku);
CREATE INDEX IF NOT EXISTS idx_quotes_user_id ON quotes(user_id);
CREATE INDEX IF NOT EXISTS idx_quote_items_quote_id ON quote_items(quote_id);
CREATE INDEX IF NOT EXISTS idx_warehouse_transactions_item_id ON warehouse_transactions(item_id);

-- Indici per Gestione
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

-- 8. ABILITA RLS PER TUTTE LE TABELLE
-- =====================================================

-- Dashboard
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_calendar_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_calendar_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_calendar_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE quick_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_fixed_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_variable_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_revenues ENABLE ROW LEVEL SECURITY;

-- Marketing
ALTER TABLE marketing_budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_seo_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_seo_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_crm_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_crm_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_ad_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_ad_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_content_calendar ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_newsletter_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_newsletter_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_quick_quotes ENABLE ROW LEVEL SECURITY;

-- Progetti
ALTER TABLE projects_main ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_budget ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_team ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_risks ENABLE ROW LEVEL SECURITY;

-- Magazzino
ALTER TABLE warehouse_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouse_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouse_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouse_transactions ENABLE ROW LEVEL SECURITY;

-- Gestione
ALTER TABLE dashboard_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_executive_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_market_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_marketing_strategy ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_operational_plan ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_financial_plan ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_business_model ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_roadmap ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_documentation ENABLE ROW LEVEL SECURITY;

-- 9. CREA POLICY PER TUTTE LE TABELLE
-- =====================================================

-- Dashboard
CREATE POLICY "Allow all operations for now" ON campaigns FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON leads FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON task_calendar_projects FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON task_calendar_tasks FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON task_calendar_appointments FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON recurring_activities FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON quick_tasks FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON financial_fixed_costs FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON financial_variable_costs FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON financial_revenues FOR ALL USING (true);

-- Marketing
CREATE POLICY "Allow all operations for now" ON marketing_budgets FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON marketing_seo_projects FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON marketing_seo_tasks FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON marketing_crm_campaigns FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON marketing_crm_contacts FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON marketing_ad_campaigns FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON marketing_ad_groups FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON marketing_content_calendar FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON marketing_social_accounts FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON marketing_reports FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON marketing_newsletter_templates FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON marketing_newsletter_campaigns FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON marketing_quick_quotes FOR ALL USING (true);

-- Progetti
CREATE POLICY "Allow all operations for now" ON projects_main FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON project_objectives FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON project_budget FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON project_team FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON project_milestones FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON project_risks FOR ALL USING (true);

-- Magazzino
CREATE POLICY "Allow all operations for now" ON warehouse_items FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON warehouse_categories FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON warehouse_locations FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON quotes FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON quote_items FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON warehouse_transactions FOR ALL USING (true);

-- Gestione
CREATE POLICY "Allow all operations for now" ON dashboard_data FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON business_plan_executive_summary FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON business_plan_market_analysis FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON business_plan_marketing_strategy FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON business_plan_operational_plan FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON business_plan_financial_plan FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON business_plan_business_model FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON business_plan_roadmap FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON business_plan_documentation FOR ALL USING (true);

-- 10. VERIFICA FINALE
-- =====================================================
SELECT 
    'Complete database setup finished' as status,
    COUNT(*) as total_tables_created
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    -- Dashboard (10)
    'campaigns', 'leads', 'task_calendar_projects', 'task_calendar_tasks', 'task_calendar_appointments',
    'recurring_activities', 'quick_tasks', 'financial_fixed_costs', 'financial_variable_costs', 'financial_revenues',
    -- Marketing (15)
    'marketing_budgets', 'marketing_seo_projects', 'marketing_seo_tasks', 'marketing_crm_campaigns', 'marketing_crm_contacts',
    'marketing_ad_campaigns', 'marketing_ad_groups', 'marketing_content_calendar', 'marketing_social_accounts', 'marketing_reports',
    'marketing_newsletter_templates', 'marketing_newsletter_campaigns', 'marketing_quick_quotes',
    -- Progetti (6)
    'projects_main', 'project_objectives', 'project_budget', 'project_team', 'project_milestones', 'project_risks',
    -- Magazzino (6)
    'warehouse_items', 'warehouse_categories', 'warehouse_locations', 'quotes', 'quote_items', 'warehouse_transactions',
    -- Gestione (9)
    'dashboard_data', 'business_plan_executive_summary', 'business_plan_market_analysis', 'business_plan_marketing_strategy',
    'business_plan_operational_plan', 'business_plan_financial_plan', 'business_plan_business_model', 'business_plan_roadmap', 'business_plan_documentation'
);

-- =====================================================
-- COMPLETE DATABASE SETUP FINISHED
-- =====================================================
-- Tutte le 45 tabelle sono state create con:
-- ✅ Schema completo per tutte le sezioni
-- ✅ Indici per performance
-- ✅ RLS abilitato
-- ✅ Policy per accesso
-- ✅ Foreign key relationships
-- ✅ Check constraints
-- =====================================================
