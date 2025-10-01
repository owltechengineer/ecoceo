-- =====================================================
-- COMPLETE DATABASE FIX
-- Script completo per creare tutte le tabelle mancanti
-- =====================================================

-- Funzione per aggiornare updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- =====================================================
-- 1. DASHBOARD TABLES
-- =====================================================

-- Dashboard Data
CREATE TABLE IF NOT EXISTS dashboard_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  data_type TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, data_type)
);

-- =====================================================
-- 2. FINANCIAL TABLES
-- =====================================================

-- Financial Departments
CREATE TABLE IF NOT EXISTS financial_departments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT DEFAULT 'default-user' NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  budget_limit DECIMAL(12,2),
  manager TEXT,
  color TEXT DEFAULT '#3B82F6',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Financial Fixed Costs
CREATE TABLE IF NOT EXISTS financial_fixed_costs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT DEFAULT 'default-user' NOT NULL,
  name TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  department TEXT,
  category TEXT,
  frequency TEXT DEFAULT 'monthly' CHECK (frequency IN ('monthly', 'quarterly', 'yearly')),
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Financial Variable Costs
CREATE TABLE IF NOT EXISTS financial_variable_costs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT DEFAULT 'default-user' NOT NULL,
  name TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  department TEXT,
  category TEXT,
  frequency TEXT DEFAULT 'monthly' CHECK (frequency IN ('monthly', 'quarterly', 'yearly')),
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Financial Revenues
CREATE TABLE IF NOT EXISTS financial_revenues (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT DEFAULT 'default-user' NOT NULL,
  name TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  department TEXT,
  category TEXT,
  frequency TEXT DEFAULT 'monthly' CHECK (frequency IN ('monthly', 'quarterly', 'yearly')),
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Financial Budgets
CREATE TABLE IF NOT EXISTS financial_budgets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT DEFAULT 'default-user' NOT NULL,
  name TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  department TEXT,
  category TEXT,
  frequency TEXT DEFAULT 'monthly' CHECK (frequency IN ('monthly', 'quarterly', 'yearly')),
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. MARKETING TABLES
-- =====================================================

-- Marketing Campaigns
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

-- Marketing Leads
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

-- =====================================================
-- 4. PROJECTS TABLES
-- =====================================================

-- Projects
CREATE TABLE IF NOT EXISTS projects_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT DEFAULT 'default-user' NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
  start_date DATE,
  end_date DATE,
  budget DECIMAL(12,2),
  spent DECIMAL(12,2) DEFAULT 0,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project Services
CREATE TABLE IF NOT EXISTS projects_services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT DEFAULT 'default-user' NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(12,2),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. TASKS & CALENDAR TABLES
-- =====================================================

-- Task Calendar Projects
CREATE TABLE IF NOT EXISTS task_calendar_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT DEFAULT 'default-user' NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Task Calendar Tasks
CREATE TABLE IF NOT EXISTS task_calendar_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT DEFAULT 'default-user' NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  due_date DATE,
  project_id UUID REFERENCES task_calendar_projects(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Task Calendar Appointments
CREATE TABLE IF NOT EXISTS task_calendar_appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT DEFAULT 'default-user' NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  is_task BOOLEAN DEFAULT FALSE,
  is_recurring BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recurring Activities
CREATE TABLE IF NOT EXISTS recurring_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT DEFAULT 'default-user' NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly', 'yearly')),
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. BUSINESS PLAN TABLES
-- =====================================================

-- Business Plan Executive Summary
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

-- Business Plan Market Analysis
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

-- Business Plan Marketing Strategy
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

-- Business Plan Operational Plan
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

-- Business Plan Financial Plan
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

-- Business Plan Business Model
CREATE TABLE IF NOT EXISTS business_plan_business_model (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  canvas JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Business Plan Roadmap
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

-- Business Plan Documentation
CREATE TABLE IF NOT EXISTS business_plan_documentation (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  files JSONB DEFAULT '[]',
  links JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- =====================================================
-- 7. QUICK TASKS TABLE
-- =====================================================

-- Quick Tasks
CREATE TABLE IF NOT EXISTS quick_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT DEFAULT 'default-user' NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('order', 'reminder', 'invoice', 'document', 'mail')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  stakeholder TEXT,
  due_date DATE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 8. QUOTES TABLES
-- =====================================================

-- Quotes
CREATE TABLE IF NOT EXISTS quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid(),
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_address TEXT,
  quote_number TEXT UNIQUE,
  language TEXT DEFAULT 'it' NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL,
  tax NUMERIC(10, 2) NOT NULL,
  total NUMERIC(10, 2) NOT NULL,
  valid_until DATE,
  notes TEXT,
  status TEXT DEFAULT 'draft'
);

-- Quote Items
CREATE TABLE IF NOT EXISTS quote_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE NOT NULL,
  item_id TEXT,
  name TEXT NOT NULL,
  description TEXT,
  quantity INTEGER NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL,
  total NUMERIC(10, 2) NOT NULL
);

-- =====================================================
-- 9. INDICES FOR PERFORMANCE
-- =====================================================

-- Dashboard indices
CREATE INDEX IF NOT EXISTS idx_dashboard_data_user_id ON dashboard_data(user_id);
CREATE INDEX IF NOT EXISTS idx_dashboard_data_type ON dashboard_data(data_type);

-- Financial indices
CREATE INDEX IF NOT EXISTS idx_financial_departments_user_id ON financial_departments(user_id);
CREATE INDEX IF NOT EXISTS idx_financial_fixed_costs_user_id ON financial_fixed_costs(user_id);
CREATE INDEX IF NOT EXISTS idx_financial_variable_costs_user_id ON financial_variable_costs(user_id);
CREATE INDEX IF NOT EXISTS idx_financial_revenues_user_id ON financial_revenues(user_id);
CREATE INDEX IF NOT EXISTS idx_financial_budgets_user_id ON financial_budgets(user_id);

-- Marketing indices
CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_leads_user_id ON leads(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);

-- Projects indices
CREATE INDEX IF NOT EXISTS idx_projects_projects_user_id ON projects_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_services_user_id ON projects_services(user_id);

-- Tasks indices
CREATE INDEX IF NOT EXISTS idx_task_calendar_projects_user_id ON task_calendar_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_task_calendar_tasks_user_id ON task_calendar_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_task_calendar_appointments_user_id ON task_calendar_appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_recurring_activities_user_id ON recurring_activities(user_id);

-- Business Plan indices
CREATE INDEX IF NOT EXISTS idx_bp_executive_summary_user_id ON business_plan_executive_summary(user_id);
CREATE INDEX IF NOT EXISTS idx_bp_market_analysis_user_id ON business_plan_market_analysis(user_id);
CREATE INDEX IF NOT EXISTS idx_bp_marketing_strategy_user_id ON business_plan_marketing_strategy(user_id);
CREATE INDEX IF NOT EXISTS idx_bp_operational_plan_user_id ON business_plan_operational_plan(user_id);
CREATE INDEX IF NOT EXISTS idx_bp_financial_plan_user_id ON business_plan_financial_plan(user_id);
CREATE INDEX IF NOT EXISTS idx_bp_business_model_user_id ON business_plan_business_model(user_id);
CREATE INDEX IF NOT EXISTS idx_bp_roadmap_user_id ON business_plan_roadmap(user_id);
CREATE INDEX IF NOT EXISTS idx_bp_documentation_user_id ON business_plan_documentation(user_id);

-- Quick Tasks indices
CREATE INDEX IF NOT EXISTS idx_quick_tasks_user_id ON quick_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_quick_tasks_status ON quick_tasks(status);

-- Quotes indices
CREATE INDEX IF NOT EXISTS idx_quotes_user_id ON quotes(user_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_quote_items_quote_id ON quote_items(quote_id);

-- =====================================================
-- 10. TRIGGERS FOR UPDATED_AT
-- =====================================================

-- Dashboard triggers
CREATE TRIGGER update_dashboard_data_updated_at BEFORE UPDATE ON dashboard_data FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Financial triggers
CREATE TRIGGER update_financial_departments_updated_at BEFORE UPDATE ON financial_departments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_financial_fixed_costs_updated_at BEFORE UPDATE ON financial_fixed_costs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_financial_variable_costs_updated_at BEFORE UPDATE ON financial_variable_costs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_financial_revenues_updated_at BEFORE UPDATE ON financial_revenues FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_financial_budgets_updated_at BEFORE UPDATE ON financial_budgets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Marketing triggers
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Projects triggers
CREATE TRIGGER update_projects_projects_updated_at BEFORE UPDATE ON projects_projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_services_updated_at BEFORE UPDATE ON projects_services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Tasks triggers
CREATE TRIGGER update_task_calendar_projects_updated_at BEFORE UPDATE ON task_calendar_projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_task_calendar_tasks_updated_at BEFORE UPDATE ON task_calendar_tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_task_calendar_appointments_updated_at BEFORE UPDATE ON task_calendar_appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_recurring_activities_updated_at BEFORE UPDATE ON recurring_activities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Business Plan triggers
CREATE TRIGGER update_bp_executive_summary_updated_at BEFORE UPDATE ON business_plan_executive_summary FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bp_market_analysis_updated_at BEFORE UPDATE ON business_plan_market_analysis FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bp_marketing_strategy_updated_at BEFORE UPDATE ON business_plan_marketing_strategy FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bp_operational_plan_updated_at BEFORE UPDATE ON business_plan_operational_plan FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bp_financial_plan_updated_at BEFORE UPDATE ON business_plan_financial_plan FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bp_business_model_updated_at BEFORE UPDATE ON business_plan_business_model FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bp_roadmap_updated_at BEFORE UPDATE ON business_plan_roadmap FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bp_documentation_updated_at BEFORE UPDATE ON business_plan_documentation FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Quick Tasks triggers
CREATE TRIGGER update_quick_tasks_updated_at BEFORE UPDATE ON quick_tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Quotes triggers
CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON quotes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 11. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE dashboard_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_fixed_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_variable_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_revenues ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_calendar_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_calendar_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_calendar_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_executive_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_market_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_marketing_strategy ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_operational_plan ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_financial_plan ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_business_model ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_roadmap ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_documentation ENABLE ROW LEVEL SECURITY;
ALTER TABLE quick_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_items ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 12. POLICIES FOR ALL TABLES
-- =====================================================

-- Create policies for all tables (temporary - allow all operations)
CREATE POLICY "Allow all operations for now" ON dashboard_data FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON financial_departments FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON financial_fixed_costs FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON financial_variable_costs FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON financial_revenues FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON financial_budgets FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON campaigns FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON leads FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON projects_projects FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON projects_services FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON task_calendar_projects FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON task_calendar_tasks FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON task_calendar_appointments FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON recurring_activities FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON business_plan_executive_summary FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON business_plan_market_analysis FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON business_plan_marketing_strategy FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON business_plan_operational_plan FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON business_plan_financial_plan FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON business_plan_business_model FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON business_plan_roadmap FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON business_plan_documentation FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON quick_tasks FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON quotes FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON quote_items FOR ALL USING (true);

-- =====================================================
-- 13. VERIFICATION QUERY
-- =====================================================

-- Verify all tables were created successfully
SELECT 
    table_name,
    CASE 
        WHEN table_name IS NOT NULL THEN '✅ Creata'
        ELSE '❌ Mancante'
    END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'dashboard_data',
    'financial_departments',
    'financial_fixed_costs',
    'financial_variable_costs',
    'financial_revenues',
    'financial_budgets',
    'campaigns',
    'leads',
    'projects_projects',
    'projects_services',
    'task_calendar_projects',
    'task_calendar_tasks',
    'task_calendar_appointments',
    'recurring_activities',
    'business_plan_executive_summary',
    'business_plan_market_analysis',
    'business_plan_marketing_strategy',
    'business_plan_operational_plan',
    'business_plan_financial_plan',
    'business_plan_business_model',
    'business_plan_roadmap',
    'business_plan_documentation',
    'quick_tasks',
    'quotes',
    'quote_items'
)
ORDER BY table_name;
