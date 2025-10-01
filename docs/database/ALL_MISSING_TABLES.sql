-- =====================================================
-- ALL MISSING TABLES - Setup Completo Dashboard
-- =====================================================
-- Script per creare TUTTE le tabelle mancanti
-- Data: 2025-10-01
-- =====================================================

-- =====================================================
-- 1. CAMPAIGNS (Campagne Marketing)
-- =====================================================
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  budget DECIMAL(10, 2) DEFAULT 0,
  spent DECIMAL(10, 2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active', -- active, paused, completed
  start_date DATE,
  end_date DATE,
  platform VARCHAR(100), -- facebook, google, linkedin, etc.
  target_audience TEXT,
  conversions INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_start_date ON campaigns(start_date DESC);

-- =====================================================
-- 2. LEADS (Potenziali Clienti)
-- =====================================================
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  company VARCHAR(255),
  position VARCHAR(100),
  source VARCHAR(100), -- website, campaign, referral, etc.
  status VARCHAR(50) DEFAULT 'new', -- new, contacted, qualified, converted, lost
  priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high
  estimated_value DECIMAL(10, 2) DEFAULT 0,
  notes TEXT,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  converted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_priority ON leads(priority);
CREATE INDEX IF NOT EXISTS idx_leads_campaign ON leads(campaign_id);

-- =====================================================
-- 3. TASK_CALENDAR_PROJECTS (Progetti con Task)
-- =====================================================
CREATE TABLE IF NOT EXISTS task_calendar_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'planning', -- planning, active, on-hold, completed, cancelled
  priority VARCHAR(20) DEFAULT 'medium',
  start_date DATE,
  end_date DATE,
  budget DECIMAL(10, 2) DEFAULT 0,
  actual_cost DECIMAL(10, 2) DEFAULT 0,
  expected_revenue DECIMAL(10, 2) DEFAULT 0,
  actual_revenue DECIMAL(10, 2) DEFAULT 0,
  progress INTEGER DEFAULT 0, -- 0-100
  client VARCHAR(255),
  team_members TEXT[], -- Array di nomi team
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_status ON task_calendar_projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_priority ON task_calendar_projects(priority);

-- =====================================================
-- 4. TASK_CALENDAR_TASKS (Task)
-- =====================================================
CREATE TABLE IF NOT EXISTS task_calendar_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending', -- pending, in_progress, completed, cancelled
  priority VARCHAR(20) DEFAULT 'medium',
  due_date DATE,
  completed_at TIMESTAMP WITH TIME ZONE,
  assigned_to VARCHAR(255),
  project_id UUID REFERENCES task_calendar_projects(id) ON DELETE CASCADE,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_status ON task_calendar_tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON task_calendar_tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_project ON task_calendar_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON task_calendar_tasks(due_date);

-- =====================================================
-- 5. TASK_CALENDAR_APPOINTMENTS (Appuntamenti)
-- =====================================================
CREATE TABLE IF NOT EXISTS task_calendar_appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  location VARCHAR(255),
  participants TEXT[],
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_appointments_start_time ON task_calendar_appointments(start_time);

-- =====================================================
-- 6. FINANCIAL_FIXED_COSTS (Costi Fissi)
-- =====================================================
CREATE TABLE IF NOT EXISTS financial_fixed_costs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100),
  start_date DATE NOT NULL,
  end_date DATE,
  is_paid BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fixed_costs_start_date ON financial_fixed_costs(start_date);

-- =====================================================
-- 7. FINANCIAL_VARIABLE_COSTS (Costi Variabili)
-- =====================================================
CREATE TABLE IF NOT EXISTS financial_variable_costs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100),
  date DATE NOT NULL,
  vendor VARCHAR(255),
  is_paid BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_variable_costs_date ON financial_variable_costs(date);

-- =====================================================
-- 8. FINANCIAL_REVENUES (Entrate)
-- =====================================================
CREATE TABLE IF NOT EXISTS financial_revenues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100),
  date DATE NOT NULL,
  source VARCHAR(255),
  is_received BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_revenues_date ON financial_revenues(date);

-- =====================================================
-- 9. RECURRING_ACTIVITIES (Attività Ricorrenti)
-- =====================================================
CREATE TABLE IF NOT EXISTS recurring_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  frequency VARCHAR(50) NOT NULL, -- daily, weekly, monthly, yearly
  day_of_week INTEGER, -- 0-6 for weekly
  day_of_month INTEGER, -- 1-31 for monthly
  start_date DATE NOT NULL,
  end_date DATE,
  time TIME,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_recurring_activities_frequency ON recurring_activities(frequency);
CREATE INDEX IF NOT EXISTS idx_recurring_activities_active ON recurring_activities(is_active);

-- =====================================================
-- 10. ORGANIZATIONAL_ANALYSIS (Analisi Organizzativa)
-- =====================================================
CREATE TABLE IF NOT EXISTS organizational_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_type VARCHAR(100) NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  period_start DATE,
  period_end DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TRIGGERS - Updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  DROP TRIGGER IF EXISTS update_campaigns_updated_at ON campaigns;
  CREATE TRIGGER update_campaigns_updated_at
    BEFORE UPDATE ON campaigns
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
    
  DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;
  CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
    
  DROP TRIGGER IF EXISTS update_projects_updated_at ON task_calendar_projects;
  CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON task_calendar_projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
    
  DROP TRIGGER IF EXISTS update_tasks_updated_at ON task_calendar_tasks;
  CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON task_calendar_tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
    
  DROP TRIGGER IF EXISTS update_appointments_updated_at ON task_calendar_appointments;
  CREATE TRIGGER update_appointments_updated_at
    BEFORE UPDATE ON task_calendar_appointments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
END $$;

-- =====================================================
-- RLS POLICIES
-- =====================================================
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_calendar_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_calendar_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_calendar_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_fixed_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_variable_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_revenues ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizational_analysis ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  -- Allow all per testing
  DROP POLICY IF EXISTS "Allow all on campaigns" ON campaigns;
  CREATE POLICY "Allow all on campaigns"
    ON campaigns FOR ALL USING (true) WITH CHECK (true);
    
  DROP POLICY IF EXISTS "Allow all on leads" ON leads;
  CREATE POLICY "Allow all on leads"
    ON leads FOR ALL USING (true) WITH CHECK (true);
    
  DROP POLICY IF EXISTS "Allow all on task_calendar_projects" ON task_calendar_projects;
  CREATE POLICY "Allow all on task_calendar_projects"
    ON task_calendar_projects FOR ALL USING (true) WITH CHECK (true);
    
  DROP POLICY IF EXISTS "Allow all on task_calendar_tasks" ON task_calendar_tasks;
  CREATE POLICY "Allow all on task_calendar_tasks"
    ON task_calendar_tasks FOR ALL USING (true) WITH CHECK (true);
    
  DROP POLICY IF EXISTS "Allow all on task_calendar_appointments" ON task_calendar_appointments;
  CREATE POLICY "Allow all on task_calendar_appointments"
    ON task_calendar_appointments FOR ALL USING (true) WITH CHECK (true);
    
  DROP POLICY IF EXISTS "Allow all on financial_fixed_costs" ON financial_fixed_costs;
  CREATE POLICY "Allow all on financial_fixed_costs"
    ON financial_fixed_costs FOR ALL USING (true) WITH CHECK (true);
    
  DROP POLICY IF EXISTS "Allow all on financial_variable_costs" ON financial_variable_costs;
  CREATE POLICY "Allow all on financial_variable_costs"
    ON financial_variable_costs FOR ALL USING (true) WITH CHECK (true);
    
  DROP POLICY IF EXISTS "Allow all on financial_revenues" ON financial_revenues;
  CREATE POLICY "Allow all on financial_revenues"
    ON financial_revenues FOR ALL USING (true) WITH CHECK (true);
    
  DROP POLICY IF EXISTS "Allow all on recurring_activities" ON recurring_activities;
  CREATE POLICY "Allow all on recurring_activities"
    ON recurring_activities FOR ALL USING (true) WITH CHECK (true);
    
  DROP POLICY IF EXISTS "Allow all on organizational_analysis" ON organizational_analysis;
  CREATE POLICY "Allow all on organizational_analysis"
    ON organizational_analysis FOR ALL USING (true) WITH CHECK (true);
END $$;

-- =====================================================
-- COMMENTI
-- =====================================================
COMMENT ON TABLE campaigns IS 'Campagne di marketing';
COMMENT ON TABLE leads IS 'Potenziali clienti (lead)';
COMMENT ON TABLE task_calendar_projects IS 'Progetti con task associati';
COMMENT ON TABLE task_calendar_tasks IS 'Task assegnati ai progetti';
COMMENT ON TABLE task_calendar_appointments IS 'Appuntamenti calendario';
COMMENT ON TABLE financial_fixed_costs IS 'Costi fissi ricorrenti';
COMMENT ON TABLE financial_variable_costs IS 'Costi variabili';
COMMENT ON TABLE financial_revenues IS 'Entrate/ricavi';
COMMENT ON TABLE recurring_activities IS 'Attività ricorrenti';
COMMENT ON TABLE organizational_analysis IS 'Analisi organizzative';

-- =====================================================
-- VERIFICA
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE '✅ Tutte le tabelle sono state create!';
  RAISE NOTICE 'Tabelle create:';
  RAISE NOTICE '- campaigns';
  RAISE NOTICE '- leads';
  RAISE NOTICE '- task_calendar_projects';
  RAISE NOTICE '- task_calendar_tasks';
  RAISE NOTICE '- task_calendar_appointments';
  RAISE NOTICE '- financial_fixed_costs';
  RAISE NOTICE '- financial_variable_costs';
  RAISE NOTICE '- financial_revenues';
  RAISE NOTICE '- recurring_activities';
  RAISE NOTICE '- organizational_analysis';
END $$;

-- =====================================================
-- FINE SCRIPT
-- =====================================================
