-- =====================================================
-- DASHBOARD MANAGEMENT TABLES
-- Tabelle per gestione dashboard e dati generici
-- =====================================================

-- ===== TABELLE DASHBOARD =====

-- Tabella Dashboard Data (Generica)
CREATE TABLE IF NOT EXISTS dashboard_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    data_type TEXT NOT NULL CHECK (data_type IN ('metric', 'chart', 'widget', 'report', 'alert', 'notification', 'other')),
    data_key TEXT NOT NULL,
    data_value JSONB DEFAULT '{}',
    data_metadata JSONB DEFAULT '{}',
    
    -- Status
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived', 'deleted')),
    
    -- Dates
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Access
    is_public BOOLEAN DEFAULT FALSE,
    access_level TEXT DEFAULT 'private' CHECK (access_level IN ('private', 'team', 'public')),
    
    -- Metadata
    notes TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, data_type, data_key)
);

-- Tabella Services (Servizi)
CREATE TABLE IF NOT EXISTS services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'general' CHECK (category IN ('consulting', 'development', 'design', 'marketing', 'support', 'other')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived', 'discontinued')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    
    -- Pricing
    base_price DECIMAL(10,2) DEFAULT 0,
    currency TEXT DEFAULT 'EUR',
    pricing_model TEXT DEFAULT 'fixed' CHECK (pricing_model IN ('fixed', 'hourly', 'monthly', 'project', 'other')),
    
    -- Delivery
    delivery_time_days INTEGER DEFAULT 0,
    delivery_method TEXT DEFAULT 'remote' CHECK (delivery_method IN ('remote', 'onsite', 'hybrid')),
    
    -- Team
    service_manager TEXT,
    team_members TEXT[] DEFAULT '{}',
    
    -- Requirements
    requirements TEXT[] DEFAULT '{}',
    deliverables TEXT[] DEFAULT '{}',
    
    -- Metadata
    notes TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella Budget (Generica)
CREATE TABLE IF NOT EXISTS budgets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'general' CHECK (category IN ('revenue', 'expense', 'investment', 'operational', 'marketing', 'personnel', 'other')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived', 'completed')),
    
    -- Budget Amounts
    planned_amount DECIMAL(12,2) NOT NULL,
    actual_amount DECIMAL(12,2) DEFAULT 0,
    remaining_amount DECIMAL(12,2) DEFAULT 0,
    currency TEXT DEFAULT 'EUR',
    
    -- Period
    period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Variance
    variance_amount DECIMAL(12,2) DEFAULT 0,
    variance_percentage DECIMAL(5,2) DEFAULT 0,
    
    -- Approval
    approved_by TEXT,
    approval_date TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    notes TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella R&D Projects
CREATE TABLE IF NOT EXISTS rd_projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'on-hold', 'cancelled', 'planning')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    
    -- Research Focus
    research_area TEXT,
    technology_focus TEXT[] DEFAULT '{}',
    innovation_level TEXT DEFAULT 'incremental' CHECK (innovation_level IN ('incremental', 'breakthrough', 'radical')),
    
    -- Budget
    budget DECIMAL(12,2) DEFAULT 0,
    spent_amount DECIMAL(12,2) DEFAULT 0,
    currency TEXT DEFAULT 'EUR',
    
    -- Timeline
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    expected_completion TIMESTAMP WITH TIME ZONE,
    
    -- Team
    project_lead TEXT,
    research_team TEXT[] DEFAULT '{}',
    external_collaborators TEXT[] DEFAULT '{}',
    
    -- Outcomes
    expected_outcomes TEXT[] DEFAULT '{}',
    patents_filed INTEGER DEFAULT 0,
    publications INTEGER DEFAULT 0,
    
    -- Metadata
    notes TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella R&D Technologies
CREATE TABLE IF NOT EXISTS rd_technologies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'software' CHECK (category IN ('software', 'hardware', 'ai', 'biotech', 'materials', 'energy', 'other')),
    status TEXT DEFAULT 'research' CHECK (status IN ('research', 'development', 'testing', 'production', 'deprecated')),
    maturity_level TEXT DEFAULT 'concept' CHECK (maturity_level IN ('concept', 'prototype', 'beta', 'production', 'mature')),
    
    -- Technology Details
    technology_stack TEXT[] DEFAULT '{}',
    dependencies TEXT[] DEFAULT '{}',
    integration_requirements TEXT[] DEFAULT '{}',
    
    -- R&D Project
    rd_project_id UUID REFERENCES rd_projects(id) ON DELETE SET NULL,
    
    -- Investment
    investment_amount DECIMAL(12,2) DEFAULT 0,
    roi_expected DECIMAL(5,2) DEFAULT 0,
    currency TEXT DEFAULT 'EUR',
    
    -- Team
    technology_lead TEXT,
    development_team TEXT[] DEFAULT '{}',
    
    -- Timeline
    development_start TIMESTAMP WITH TIME ZONE,
    expected_completion TIMESTAMP WITH TIME ZONE,
    launch_date TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    notes TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella Business Metrics
CREATE TABLE IF NOT EXISTS business_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'financial' CHECK (category IN ('financial', 'operational', 'marketing', 'customer', 'employee', 'other')),
    metric_type TEXT DEFAULT 'kpi' CHECK (metric_type IN ('kpi', 'okr', 'metric', 'indicator', 'other')),
    
    -- Metric Values
    current_value DECIMAL(15,4) DEFAULT 0,
    target_value DECIMAL(15,4) DEFAULT 0,
    previous_value DECIMAL(15,4) DEFAULT 0,
    unit TEXT DEFAULT 'count',
    
    -- Calculation
    calculation_method TEXT,
    data_source TEXT,
    update_frequency TEXT DEFAULT 'monthly' CHECK (update_frequency IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')),
    
    -- Trend
    trend_direction TEXT DEFAULT 'stable' CHECK (trend_direction IN ('up', 'down', 'stable', 'volatile')),
    trend_percentage DECIMAL(5,2) DEFAULT 0,
    
    -- Status
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived', 'deprecated')),
    
    -- Dates
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    next_update TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    notes TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella AI Models
CREATE TABLE IF NOT EXISTS ai_models (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    model_type TEXT DEFAULT 'ml' CHECK (model_type IN ('ml', 'dl', 'nlp', 'cv', 'rl', 'other')),
    status TEXT DEFAULT 'development' CHECK (status IN ('development', 'training', 'testing', 'production', 'deprecated')),
    
    -- Model Details
    algorithm TEXT,
    framework TEXT,
    programming_language TEXT DEFAULT 'python',
    model_size_mb DECIMAL(10,2) DEFAULT 0,
    
    -- Performance
    accuracy DECIMAL(5,4) DEFAULT 0,
    precision DECIMAL(5,4) DEFAULT 0,
    recall DECIMAL(5,4) DEFAULT 0,
    f1_score DECIMAL(5,4) DEFAULT 0,
    
    -- Training
    training_data_size INTEGER DEFAULT 0,
    training_time_hours DECIMAL(8,2) DEFAULT 0,
    last_trained TIMESTAMP WITH TIME ZONE,
    
    -- Deployment
    deployment_environment TEXT DEFAULT 'cloud' CHECK (deployment_environment IN ('cloud', 'edge', 'mobile', 'desktop')),
    api_endpoint TEXT,
    version TEXT DEFAULT '1.0',
    
    -- Team
    model_developer TEXT,
    data_scientist TEXT,
    ml_engineer TEXT,
    
    -- Metadata
    notes TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella AI Training Data
CREATE TABLE IF NOT EXISTS ai_training_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    ai_model_id UUID REFERENCES ai_models(id) ON DELETE CASCADE,
    dataset_name TEXT NOT NULL,
    description TEXT,
    data_type TEXT DEFAULT 'structured' CHECK (data_type IN ('structured', 'unstructured', 'semi-structured', 'image', 'text', 'audio', 'video')),
    
    -- Dataset Details
    dataset_size INTEGER DEFAULT 0,
    file_format TEXT DEFAULT 'csv' CHECK (file_format IN ('csv', 'json', 'parquet', 'hdf5', 'image', 'text', 'other')),
    data_source TEXT,
    
    -- Quality
    data_quality_score DECIMAL(5,4) DEFAULT 0,
    completeness_percentage DECIMAL(5,2) DEFAULT 0,
    accuracy_percentage DECIMAL(5,2) DEFAULT 0,
    
    -- Preprocessing
    preprocessing_steps TEXT[] DEFAULT '{}',
    feature_engineering TEXT[] DEFAULT '{}',
    
    -- Splits
    train_split DECIMAL(5,4) DEFAULT 0.7,
    validation_split DECIMAL(5,4) DEFAULT 0.15,
    test_split DECIMAL(5,4) DEFAULT 0.15,
    
    -- Dates
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Metadata
    notes TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella Marketing SEO Tasks
CREATE TABLE IF NOT EXISTS marketing_seo_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    seo_project_id UUID REFERENCES marketing_seo_projects(id) ON DELETE CASCADE,
    task_name TEXT NOT NULL,
    description TEXT,
    task_type TEXT DEFAULT 'content' CHECK (task_type IN ('content', 'technical', 'link_building', 'keyword_research', 'competitor_analysis', 'other')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed', 'cancelled', 'on-hold')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    
    -- Task Details
    target_keywords TEXT[] DEFAULT '{}',
    target_url TEXT,
    content_requirements TEXT,
    
    -- Assignment
    assigned_to TEXT,
    due_date TIMESTAMP WITH TIME ZONE,
    
    -- Progress
    progress_percentage DECIMAL(5,2) DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    
    -- Results
    completion_date TIMESTAMP WITH TIME ZONE,
    results_notes TEXT,
    
    -- Metadata
    notes TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella Financial Analysis
CREATE TABLE IF NOT EXISTS financial_analysis (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    analysis_name TEXT NOT NULL,
    description TEXT,
    analysis_type TEXT DEFAULT 'monthly' CHECK (analysis_type IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'custom')),
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'in-progress', 'completed', 'approved', 'archived')),
    
    -- Analysis Period
    period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Financial Data
    total_revenue DECIMAL(15,2) DEFAULT 0,
    total_expenses DECIMAL(15,2) DEFAULT 0,
    net_profit DECIMAL(15,2) DEFAULT 0,
    gross_margin DECIMAL(5,2) DEFAULT 0,
    net_margin DECIMAL(5,2) DEFAULT 0,
    
    -- Key Metrics
    revenue_growth DECIMAL(5,2) DEFAULT 0,
    expense_growth DECIMAL(5,2) DEFAULT 0,
    profit_growth DECIMAL(5,2) DEFAULT 0,
    
    -- Analysis Results
    analysis_results JSONB DEFAULT '{}',
    key_insights TEXT[] DEFAULT '{}',
    recommendations TEXT[] DEFAULT '{}',
    
    -- Team
    analyst TEXT,
    reviewer TEXT,
    approver TEXT,
    
    -- Dates
    analysis_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    review_date TIMESTAMP WITH TIME ZONE,
    approval_date TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    notes TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== RLS E POLICY =====

-- Abilita RLS su tutte le tabelle
ALTER TABLE dashboard_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE rd_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE rd_technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_training_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_seo_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_analysis ENABLE ROW LEVEL SECURITY;

-- Policy per accesso completo (temporanea)
CREATE POLICY "Allow all operations for now" ON dashboard_data FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON services FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON budgets FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON rd_projects FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON rd_technologies FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON business_metrics FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON ai_models FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON ai_training_data FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON marketing_seo_tasks FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON financial_analysis FOR ALL USING (true);

-- ===== TRIGGER PER UPDATED_AT =====

CREATE TRIGGER update_dashboard_data_updated_at 
    BEFORE UPDATE ON dashboard_data 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at 
    BEFORE UPDATE ON services 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budgets_updated_at 
    BEFORE UPDATE ON budgets 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rd_projects_updated_at 
    BEFORE UPDATE ON rd_projects 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rd_technologies_updated_at 
    BEFORE UPDATE ON rd_technologies 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_metrics_updated_at 
    BEFORE UPDATE ON business_metrics 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_models_updated_at 
    BEFORE UPDATE ON ai_models 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_training_data_updated_at 
    BEFORE UPDATE ON ai_training_data 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marketing_seo_tasks_updated_at 
    BEFORE UPDATE ON marketing_seo_tasks 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_financial_analysis_updated_at 
    BEFORE UPDATE ON financial_analysis 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===== INDICI PER PERFORMANCE =====

CREATE INDEX IF NOT EXISTS idx_dashboard_data_user_id ON dashboard_data(user_id);
CREATE INDEX IF NOT EXISTS idx_dashboard_data_data_type ON dashboard_data(data_type);
CREATE INDEX IF NOT EXISTS idx_dashboard_data_status ON dashboard_data(status);
CREATE INDEX IF NOT EXISTS idx_services_user_id ON services(user_id);
CREATE INDEX IF NOT EXISTS idx_services_status ON services(status);
CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON budgets(user_id);
CREATE INDEX IF NOT EXISTS idx_budgets_period ON budgets(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_rd_projects_user_id ON rd_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_rd_projects_status ON rd_projects(status);
CREATE INDEX IF NOT EXISTS idx_rd_technologies_rd_project_id ON rd_technologies(rd_project_id);
CREATE INDEX IF NOT EXISTS idx_rd_technologies_status ON rd_technologies(status);
CREATE INDEX IF NOT EXISTS idx_business_metrics_user_id ON business_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_business_metrics_category ON business_metrics(category);
CREATE INDEX IF NOT EXISTS idx_ai_models_user_id ON ai_models(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_models_status ON ai_models(status);
CREATE INDEX IF NOT EXISTS idx_ai_training_data_ai_model_id ON ai_training_data(ai_model_id);
CREATE INDEX IF NOT EXISTS idx_marketing_seo_tasks_seo_project_id ON marketing_seo_tasks(seo_project_id);
CREATE INDEX IF NOT EXISTS idx_marketing_seo_tasks_status ON marketing_seo_tasks(status);
CREATE INDEX IF NOT EXISTS idx_financial_analysis_user_id ON financial_analysis(user_id);
CREATE INDEX IF NOT EXISTS idx_financial_analysis_period ON financial_analysis(period_start, period_end);
