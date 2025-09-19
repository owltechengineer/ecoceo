-- =====================================================
-- PROJECT MANAGEMENT TABLES
-- Tabelle per gestione progetti completa
-- =====================================================

-- ===== TABELLE PROGETTI =====

-- Tabella Progetti Principali
CREATE TABLE IF NOT EXISTS projects_projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'on-hold', 'cancelled', 'planning')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    
    -- Date
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    planned_start_date TIMESTAMP WITH TIME ZONE,
    planned_end_date TIMESTAMP WITH TIME ZONE,
    
    -- Budget
    budget DECIMAL(12,2) DEFAULT 0,
    actual_cost DECIMAL(12,2) DEFAULT 0,
    currency TEXT DEFAULT 'EUR',
    
    -- Progress
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    completion_percentage DECIMAL(5,2) DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    
    -- Team
    client TEXT,
    project_manager TEXT,
    team_size INTEGER DEFAULT 0,
    team_members TEXT[] DEFAULT '{}',
    
    -- Technology
    technology_stack TEXT[] DEFAULT '{}',
    tools_used TEXT[] DEFAULT '{}',
    
    -- Metadata
    notes TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella Obiettivi Progetti
CREATE TABLE IF NOT EXISTS projects_objectives (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    project_id UUID REFERENCES projects_projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'achieved', 'failed', 'cancelled')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    
    -- Target
    target_value DECIMAL(12,2),
    target_unit TEXT,
    current_value DECIMAL(12,2) DEFAULT 0,
    
    -- Dates
    target_date TIMESTAMP WITH TIME ZONE,
    achieved_date TIMESTAMP WITH TIME ZONE,
    
    -- Metrics
    success_criteria TEXT,
    measurement_method TEXT,
    
    -- Team
    responsible_person TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella Budget Progetti
CREATE TABLE IF NOT EXISTS projects_budget (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    project_id UUID REFERENCES projects_projects(id) ON DELETE CASCADE,
    category TEXT DEFAULT 'general' CHECK (category IN ('personnel', 'equipment', 'software', 'marketing', 'travel', 'materials', 'external', 'other')),
    name TEXT NOT NULL,
    description TEXT,
    
    -- Budget
    planned_amount DECIMAL(12,2) NOT NULL,
    actual_amount DECIMAL(12,2) DEFAULT 0,
    currency TEXT DEFAULT 'EUR',
    
    -- Variance
    variance_amount DECIMAL(12,2) DEFAULT 0,
    variance_percentage DECIMAL(5,2) DEFAULT 0,
    
    -- Dates
    planned_date TIMESTAMP WITH TIME ZONE,
    actual_date TIMESTAMP WITH TIME ZONE,
    
    -- Status
    status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'approved', 'spent', 'cancelled')),
    
    -- Vendor
    vendor TEXT,
    invoice_number TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella Team Progetti
CREATE TABLE IF NOT EXISTS projects_team (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    project_id UUID REFERENCES projects_projects(id) ON DELETE CASCADE,
    member_name TEXT NOT NULL,
    role TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    
    -- Assignment
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    allocation_percentage INTEGER DEFAULT 100 CHECK (allocation_percentage >= 0 AND allocation_percentage <= 100),
    
    -- Compensation
    hourly_rate DECIMAL(8,2),
    currency TEXT DEFAULT 'EUR',
    total_hours DECIMAL(8,2) DEFAULT 0,
    total_cost DECIMAL(12,2) DEFAULT 0,
    
    -- Status
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'completed', 'cancelled')),
    
    -- Skills
    skills TEXT[] DEFAULT '{}',
    experience_level TEXT DEFAULT 'intermediate' CHECK (experience_level IN ('junior', 'intermediate', 'senior', 'expert')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella Milestone
CREATE TABLE IF NOT EXISTS projects_milestones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    project_id UUID REFERENCES projects_projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed', 'cancelled')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    
    -- Dates
    planned_date TIMESTAMP WITH TIME ZONE NOT NULL,
    actual_date TIMESTAMP WITH TIME ZONE,
    
    -- Deliverables
    deliverables TEXT[] DEFAULT '{}',
    acceptance_criteria TEXT,
    
    -- Dependencies
    depends_on_milestones UUID[] DEFAULT '{}',
    
    -- Team
    responsible_person TEXT,
    
    -- Progress
    progress_percentage DECIMAL(5,2) DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella Rischi Progetti
CREATE TABLE IF NOT EXISTS projects_risks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    project_id UUID REFERENCES projects_projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'technical' CHECK (category IN ('technical', 'financial', 'schedule', 'resource', 'external', 'other')),
    
    -- Risk Assessment
    probability INTEGER DEFAULT 50 CHECK (probability >= 0 AND probability <= 100),
    impact INTEGER DEFAULT 50 CHECK (impact >= 0 AND impact <= 100),
    risk_level TEXT DEFAULT 'medium' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    
    -- Status
    status TEXT DEFAULT 'identified' CHECK (status IN ('identified', 'assessed', 'mitigated', 'monitored', 'closed')),
    
    -- Mitigation
    mitigation_strategy TEXT,
    contingency_plan TEXT,
    mitigation_cost DECIMAL(12,2) DEFAULT 0,
    
    -- Impact
    potential_impact TEXT,
    potential_cost DECIMAL(12,2) DEFAULT 0,
    
    -- Team
    owner TEXT,
    reviewer TEXT,
    
    -- Dates
    identified_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    review_date TIMESTAMP WITH TIME ZONE,
    closure_date TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella Progetti Main (Alternativa)
CREATE TABLE IF NOT EXISTS projects_main (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'on-hold', 'cancelled', 'planning')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    
    -- Date
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    
    -- Budget
    budget DECIMAL(12,2) DEFAULT 0,
    actual_cost DECIMAL(12,2) DEFAULT 0,
    
    -- Progress
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    
    -- Team
    client TEXT,
    project_manager TEXT,
    team_size INTEGER DEFAULT 0,
    
    -- Technology
    technology_stack TEXT[] DEFAULT '{}',
    
    -- Metadata
    notes TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== RLS E POLICY =====

-- Abilita RLS su tutte le tabelle
ALTER TABLE projects_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects_objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects_budget ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects_team ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects_risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects_main ENABLE ROW LEVEL SECURITY;

-- Policy per accesso completo (temporanea)
CREATE POLICY "Allow all operations for now" ON projects_projects FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON projects_objectives FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON projects_budget FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON projects_team FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON projects_milestones FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON projects_risks FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON projects_main FOR ALL USING (true);

-- ===== TRIGGER PER UPDATED_AT =====

CREATE TRIGGER update_projects_projects_updated_at 
    BEFORE UPDATE ON projects_projects 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_objectives_updated_at 
    BEFORE UPDATE ON projects_objectives 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_budget_updated_at 
    BEFORE UPDATE ON projects_budget 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_team_updated_at 
    BEFORE UPDATE ON projects_team 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_milestones_updated_at 
    BEFORE UPDATE ON projects_milestones 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_risks_updated_at 
    BEFORE UPDATE ON projects_risks 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_main_updated_at 
    BEFORE UPDATE ON projects_main 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===== INDICI PER PERFORMANCE =====

CREATE INDEX IF NOT EXISTS idx_projects_projects_user_id ON projects_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_projects_status ON projects_projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_projects_start_date ON projects_projects(start_date);
CREATE INDEX IF NOT EXISTS idx_projects_objectives_project_id ON projects_objectives(project_id);
CREATE INDEX IF NOT EXISTS idx_projects_objectives_status ON projects_objectives(status);
CREATE INDEX IF NOT EXISTS idx_projects_budget_project_id ON projects_budget(project_id);
CREATE INDEX IF NOT EXISTS idx_projects_budget_category ON projects_budget(category);
CREATE INDEX IF NOT EXISTS idx_projects_team_project_id ON projects_team(project_id);
CREATE INDEX IF NOT EXISTS idx_projects_team_status ON projects_team(status);
CREATE INDEX IF NOT EXISTS idx_projects_milestones_project_id ON projects_milestones(project_id);
CREATE INDEX IF NOT EXISTS idx_projects_milestones_status ON projects_milestones(status);
CREATE INDEX IF NOT EXISTS idx_projects_risks_project_id ON projects_risks(project_id);
CREATE INDEX IF NOT EXISTS idx_projects_risks_status ON projects_risks(status);
CREATE INDEX IF NOT EXISTS idx_projects_main_user_id ON projects_main(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_main_status ON projects_main(status);
