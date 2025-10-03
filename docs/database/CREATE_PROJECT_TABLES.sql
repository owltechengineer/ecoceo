-- =====================================================
-- CREAZIONE TABELLE PROGETTI MANCANTI
-- =====================================================
-- Questo script crea tutte le tabelle necessarie per la gestione completa dei progetti
-- =====================================================

-- Crea la tabella projects se non esiste
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'completed', 'on-hold', 'cancelled', 'planning')),
    start_date DATE,
    end_date DATE,
    budget DECIMAL(15,2),
    actual_cost DECIMAL(15,2) DEFAULT 0,
    currency VARCHAR(10) DEFAULT 'EUR',
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    client_name VARCHAR(255),
    project_manager VARCHAR(255),
    team_members TEXT[],
    tags TEXT[],
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella project_objectives
CREATE TABLE IF NOT EXISTS project_objectives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL,
    user_id TEXT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    objective_type VARCHAR(50) NOT NULL CHECK (objective_type IN ('goal', 'milestone', 'deliverable', 'kpi')),
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'in-progress', 'completed', 'cancelled', 'on-hold')),
    target_date DATE,
    completed_date DATE,
    target_value DECIMAL(15,2),
    actual_value DECIMAL(15,2),
    unit_of_measure VARCHAR(50),
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    success_criteria TEXT,
    dependencies TEXT[] DEFAULT '{}',
    responsible_person VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella project_budget
CREATE TABLE IF NOT EXISTS project_budget (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL,
    user_id TEXT NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('personnel', 'equipment', 'software', 'marketing', 'travel', 'materials', 'external', 'other')),
    item_name VARCHAR(255) NOT NULL,
    description TEXT,
    estimated_cost DECIMAL(15,2) NOT NULL DEFAULT 0,
    actual_cost DECIMAL(15,2) NOT NULL DEFAULT 0,
    currency VARCHAR(10) NOT NULL DEFAULT 'EUR',
    planned_date DATE,
    actual_date DATE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('planned', 'approved', 'in-progress', 'completed', 'cancelled')),
    vendor VARCHAR(255),
    invoice_number VARCHAR(100),
    payment_status VARCHAR(20) NOT NULL CHECK (payment_status IN ('pending', 'paid', 'overdue', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella project_team
CREATE TABLE IF NOT EXISTS project_team (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL,
    user_id TEXT NOT NULL,
    member_name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    department VARCHAR(255),
    email VARCHAR(255),
    allocation_percentage INTEGER NOT NULL DEFAULT 0 CHECK (allocation_percentage >= 0 AND allocation_percentage <= 100),
    hourly_rate DECIMAL(10,2),
    currency VARCHAR(10) NOT NULL DEFAULT 'EUR',
    start_date DATE,
    end_date DATE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'inactive', 'completed', 'removed')),
    skills TEXT[] DEFAULT '{}',
    responsibilities TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella project_milestones
CREATE TABLE IF NOT EXISTS project_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL,
    user_id TEXT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    milestone_type VARCHAR(50) NOT NULL CHECK (milestone_type IN ('milestone', 'phase', 'deliverable', 'review', 'decision')),
    planned_date DATE NOT NULL,
    actual_date DATE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'in-progress', 'completed', 'delayed', 'cancelled')),
    dependencies TEXT[] DEFAULT '{}',
    deliverables TEXT[] DEFAULT '{}',
    responsible_person VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella project_risks
CREATE TABLE IF NOT EXISTS project_risks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL,
    user_id TEXT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    risk_type VARCHAR(50) NOT NULL CHECK (risk_type IN ('operational', 'financial', 'technical', 'schedule', 'resource', 'external')),
    probability VARCHAR(20) NOT NULL CHECK (probability IN ('low', 'medium', 'high', 'very-high')),
    impact VARCHAR(20) NOT NULL CHECK (impact IN ('low', 'medium', 'high', 'critical')),
    risk_level VARCHAR(20) NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    mitigation_strategy TEXT,
    contingency_plan TEXT,
    owner VARCHAR(255),
    status VARCHAR(20) NOT NULL CHECK (status IN ('identified', 'assessed', 'mitigated', 'monitored', 'resolved', 'occurred')),
    identified_date DATE DEFAULT CURRENT_DATE,
    target_resolution_date DATE,
    actual_resolution_date DATE,
    cost_impact DECIMAL(15,2),
    schedule_impact_days INTEGER,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indici per performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_priority ON projects(priority);
CREATE INDEX IF NOT EXISTS idx_projects_start_date ON projects(start_date);
CREATE INDEX IF NOT EXISTS idx_projects_end_date ON projects(end_date);

CREATE INDEX IF NOT EXISTS idx_project_objectives_project_id ON project_objectives(project_id);
CREATE INDEX IF NOT EXISTS idx_project_objectives_user_id ON project_objectives(user_id);
CREATE INDEX IF NOT EXISTS idx_project_objectives_status ON project_objectives(status);

CREATE INDEX IF NOT EXISTS idx_project_budget_project_id ON project_budget(project_id);
CREATE INDEX IF NOT EXISTS idx_project_budget_user_id ON project_budget(user_id);
CREATE INDEX IF NOT EXISTS idx_project_budget_category ON project_budget(category);

CREATE INDEX IF NOT EXISTS idx_project_team_project_id ON project_team(project_id);
CREATE INDEX IF NOT EXISTS idx_project_team_user_id ON project_team(user_id);
CREATE INDEX IF NOT EXISTS idx_project_team_status ON project_team(status);

CREATE INDEX IF NOT EXISTS idx_project_milestones_project_id ON project_milestones(project_id);
CREATE INDEX IF NOT EXISTS idx_project_milestones_user_id ON project_milestones(user_id);
CREATE INDEX IF NOT EXISTS idx_project_milestones_planned_date ON project_milestones(planned_date);

CREATE INDEX IF NOT EXISTS idx_project_risks_project_id ON project_risks(project_id);
CREATE INDEX IF NOT EXISTS idx_project_risks_user_id ON project_risks(user_id);
CREATE INDEX IF NOT EXISTS idx_project_risks_risk_level ON project_risks(risk_level);

-- Trigger per updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Applica trigger a tutte le tabelle
CREATE TRIGGER update_projects_updated_at 
    BEFORE UPDATE ON projects 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_objectives_updated_at 
    BEFORE UPDATE ON project_objectives 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_budget_updated_at 
    BEFORE UPDATE ON project_budget 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_team_updated_at 
    BEFORE UPDATE ON project_team 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_milestones_updated_at 
    BEFORE UPDATE ON project_milestones 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_risks_updated_at 
    BEFORE UPDATE ON project_risks 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Abilita RLS (Row Level Security)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_budget ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_team ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_risks ENABLE ROW LEVEL SECURITY;

-- Policy per permettere tutte le operazioni (temporaneo per sviluppo)
-- Usa DO per gestire errori se le policy esistono già
DO $$
BEGIN
    -- Projects
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'projects' AND policyname = 'Allow all operations for now') THEN
        CREATE POLICY "Allow all operations for now" ON projects FOR ALL USING (true);
    END IF;
    
    -- Project Objectives
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'project_objectives' AND policyname = 'Allow all operations for now') THEN
        CREATE POLICY "Allow all operations for now" ON project_objectives FOR ALL USING (true);
    END IF;
    
    -- Project Budget
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'project_budget' AND policyname = 'Allow all operations for now') THEN
        CREATE POLICY "Allow all operations for now" ON project_budget FOR ALL USING (true);
    END IF;
    
    -- Project Team
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'project_team' AND policyname = 'Allow all operations for now') THEN
        CREATE POLICY "Allow all operations for now" ON project_team FOR ALL USING (true);
    END IF;
    
    -- Project Milestones
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'project_milestones' AND policyname = 'Allow all operations for now') THEN
        CREATE POLICY "Allow all operations for now" ON project_milestones FOR ALL USING (true);
    END IF;
    
    -- Project Risks
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'project_risks' AND policyname = 'Allow all operations for now') THEN
        CREATE POLICY "Allow all operations for now" ON project_risks FOR ALL USING (true);
    END IF;
END $$;



INSERT INTO project_budget (project_id, user_id, category, item_name, description, estimated_cost, actual_cost, currency, status, vendor, payment_status) VALUES
('aae04797-b80a-408e-9017-11dc2aa459ed', 'test-user', 'personnel', 'Sviluppatore Senior', 'Sviluppo frontend e backend', 15000.00, 8505.00, 'EUR', 'in-progress', 'TechCorp', 'pending'),
('aae04797-b80a-408e-9017-11dc2aa459ed', 'test-user', 'software', 'Licenze software', 'Licenze per strumenti di sviluppo', 2000.00, 2000.00, 'EUR', 'completed', 'SoftwareVendor', 'paid'),
('aae04797-b80a-408e-9017-11dc2aa459ed', 'test-user', 'equipment', 'Server cloud', 'Server per hosting e testing', 5000.00, 0.00, 'EUR', 'planned', 'CloudProvider', 'pending')
ON CONFLICT DO NOTHING;

INSERT INTO project_team (project_id, user_id, member_name, role, department, email, allocation_percentage, hourly_rate, currency, status, skills, responsibilities) VALUES
('aae04797-b80a-408e-9017-11dc2aa459ed', 'test-user', 'Mario Rossi', 'Lead Developer', 'IT', 'mario.rossi@company.com', 100, 75.00, 'EUR', 'active', ARRAY['React', 'Node.js', 'PostgreSQL'], 'Sviluppo frontend e coordinamento team'),
('aae04797-b80a-408e-9017-11dc2aa459ed', 'test-user', 'Giulia Bianchi', 'UI/UX Designer', 'Design', 'giulia.bianchi@company.com', 50, 60.00, 'EUR', 'active', ARRAY['Figma', 'Adobe XD', 'Prototyping'], 'Design interfacce e user experience'),
('aae04797-b80a-408e-9017-11dc2aa459ed', 'test-user', 'Luca Verdi', 'Backend Developer', 'IT', 'luca.verdi@company.com', 80, 70.00, 'EUR', 'active', ARRAY['Python', 'Django', 'API'], 'Sviluppo backend e API')
ON CONFLICT DO NOTHING;

INSERT INTO project_milestones (project_id, user_id, title, description, milestone_type, planned_date, status, deliverables, responsible_person) VALUES
('aae04797-b80a-408e-9017-11dc2aa459ed', 'test-user', 'Completamento Design', 'Finalizzazione di tutti i mockup e prototipi', 'deliverable', '2024-02-28', 'completed', ARRAY['Mockup finali', 'Prototipo interattivo'], 'Giulia Bianchi'),
('aae04797-b80a-408e-9017-11dc2aa459ed', 'test-user', 'Sviluppo Frontend', 'Implementazione completa del frontend', 'phase', '2024-03-15', 'in-progress', ARRAY['Componenti React', 'Pagine complete'], 'Mario Rossi'),
('aae04797-b80a-408e-9017-11dc2aa459ed', 'test-user', 'Test e Deploy', 'Testing completo e deployment in produzione', 'milestone', '2024-03-30', 'pending', ARRAY['Test suite', 'Deployment script'], 'Luca Verdi')
ON CONFLICT DO NOTHING;

INSERT INTO project_risks (project_id, user_id, title, description, risk_type, probability, impact, risk_level, mitigation_strategy, owner, status) VALUES
('aae04797-b80a-408e-9017-11dc2aa459ed', 'test-user', 'Ritardo sviluppo', 'Possibile ritardo nella consegna del progetto', 'schedule', 'medium', 'high', 'high', 'Aumentare risorse e ottimizzare processi', 'Mario Rossi', 'monitored'),
('aae04797-b80a-408e-9017-11dc2aa459ed', 'test-user', 'Budget insufficiente', 'Rischio di superamento del budget allocato', 'financial', 'low', 'medium', 'medium', 'Monitoraggio costi e ottimizzazione risorse', 'Giulia Bianchi', 'assessed'),
('aae04797-b80a-408e-9017-11dc2aa459ed', 'test-user', 'Problemi tecnici', 'Difficoltà tecniche impreviste', 'technical', 'medium', 'high', 'high', 'Formazione team e supporto esterno', 'Luca Verdi', 'identified')
ON CONFLICT DO NOTHING;

-- Verifica finale delle tabelle create
SELECT 
    table_name,
    CASE 
        WHEN table_name IS NOT NULL THEN '✅ Creata'
        ELSE '❌ Mancante'
    END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('projects', 'project_objectives', 'project_budget', 'project_team', 'project_milestones', 'project_risks')
ORDER BY table_name;
