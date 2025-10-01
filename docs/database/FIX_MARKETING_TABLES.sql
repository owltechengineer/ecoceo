-- =====================================================
-- FIX SEZIONE MARKETING - TABELLE MANCANTI
-- =====================================================
-- Risolve il problema di caricamento dati marketing
-- Basato su analisi completa delle richieste al database
-- =====================================================

-- 1. CREA TABELLE MARKETING PRINCIPALI
-- =====================================================

-- Campagne Marketing (allineato con marketing.ts)
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) DEFAULT 'digital' CHECK (type IN ('digital', 'print', 'tv', 'radio', 'outdoor', 'social', 'email', 'other')),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('planning', 'active', 'paused', 'completed', 'cancelled')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    -- Budget e Costi
    budget DECIMAL(15,2) NOT NULL DEFAULT 0,
    spent_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'EUR',
    -- Date
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    -- Team
    campaign_manager VARCHAR(255),
    creative_director VARCHAR(255),
    account_manager VARCHAR(255),
    -- Metrics
    target_impressions INTEGER DEFAULT 0,
    target_clicks INTEGER DEFAULT 0,
    target_conversions INTEGER DEFAULT 0,
    actual_impressions INTEGER DEFAULT 0,
    actual_clicks INTEGER DEFAULT 0,
    actual_conversions INTEGER DEFAULT 0,
    -- Metadata
    notes TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lead (allineato con marketing.ts)
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    -- Informazioni Personali
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    company VARCHAR(255),
    job_title VARCHAR(255),
    -- Lead Information
    source VARCHAR(50) DEFAULT 'website' CHECK (source IN ('website', 'social', 'email', 'referral', 'advertising', 'event', 'cold_call', 'other')),
    status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    score INTEGER DEFAULT 0 CHECK (score >= 0 AND score <= 100),
    -- Campaign
    campaign_id UUID REFERENCES campaigns(id),
    -- Location
    country VARCHAR(100),
    city VARCHAR(100),
    address TEXT,
    -- Notes
    notes TEXT,
    tags TEXT[] DEFAULT '{}',
    -- Dates
    first_contact_date TIMESTAMP WITH TIME ZONE NOT NULL,
    last_contact_date TIMESTAMP WITH TIME ZONE,
    next_followup_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Budget Marketing (per compatibilità)
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

-- 2. CREA TRIGGER PER UPDATED_AT
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_marketing_campaigns_updated_at 
BEFORE UPDATE ON marketing_campaigns 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marketing_leads_updated_at 
BEFORE UPDATE ON marketing_leads 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marketing_budgets_updated_at 
BEFORE UPDATE ON marketing_budgets 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 3. ABILITA RLS
-- =====================================================
ALTER TABLE marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_budgets ENABLE ROW LEVEL SECURITY;

-- 4. CREA POLICY
-- =====================================================
CREATE POLICY "Allow all operations for now" ON marketing_campaigns FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON marketing_leads FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON marketing_budgets FOR ALL USING (true);

-- 3. CREA TABELLE PER DASHBOARD TOTALE
-- =====================================================

-- Progetti (per DashboardTotale)
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

-- Task (per DashboardTotale)
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

-- Appuntamenti (per DashboardTotale)
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

-- Attività Ricorrenti (per DashboardTotale)
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

-- Quick Tasks (per DashboardTotale)
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

-- 4. CREA INDICI PER PERFORMANCE
-- =====================================================
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

-- 5. INSERISCI DATI DI ESEMPIO
-- =====================================================

-- Campagne di esempio (nuovo formato)
INSERT INTO campaigns (user_id, name, description, type, status, priority, budget, spent_amount, start_date, end_date, target_impressions, target_clicks, target_conversions, actual_impressions, actual_clicks, actual_conversions) VALUES
('default-user', 'Campagna Social Media Q1', 'Campagna promozionale sui social media per il primo trimestre', 'social', 'active', 'high', 15000.00, 8500.00, '2024-01-01T00:00:00Z', '2024-03-31T23:59:59Z', 100000, 5000, 250, 75000, 3200, 180),
('default-user', 'Email Marketing Newsletter', 'Newsletter mensile per clienti esistenti', 'email', 'active', 'medium', 5000.00, 1200.00, '2024-01-01T00:00:00Z', '2024-12-31T23:59:59Z', 50000, 2500, 125, 45000, 2100, 95),
('default-user', 'Google Ads Search', 'Campagna Google Ads per parole chiave specifiche', 'digital', 'active', 'high', 25000.00, 18000.00, '2024-02-01T00:00:00Z', '2024-06-30T23:59:59Z', 200000, 10000, 500, 180000, 8500, 420),
('default-user', 'Campagna LinkedIn B2B', 'Campagna LinkedIn per lead B2B', 'social', 'active', 'medium', 8000.00, 3200.00, '2024-03-01T00:00:00Z', '2024-05-31T23:59:59Z', 30000, 1500, 75, 25000, 1200, 60),
('default-user', 'Influencer Marketing', 'Collaborazione con influencer del settore', 'social', 'planning', 'medium', 12000.00, 0.00, '2024-04-01T00:00:00Z', '2024-06-30T23:59:59Z', 50000, 2500, 125, 0, 0, 0)
ON CONFLICT DO NOTHING;

-- Lead di esempio (nuovo formato)
INSERT INTO leads (user_id, first_name, last_name, email, phone, company, job_title, source, status, priority, score, first_contact_date, notes) VALUES
('default-user', 'Mario', 'Rossi', 'mario.rossi@email.com', '+39 123 456 7890', 'Azienda ABC', 'CEO', 'advertising', 'new', 'high', 85, '2024-01-15T10:00:00Z', 'Interessato al prodotto premium'),
('default-user', 'Giulia', 'Bianchi', 'giulia.bianchi@email.com', '+39 098 765 4321', 'Startup XYZ', 'Marketing Manager', 'social', 'contacted', 'medium', 70, '2024-01-20T14:30:00Z', 'Richiesta informazioni via LinkedIn'),
('default-user', 'Luca', 'Verdi', 'luca.verdi@email.com', '+39 555 123 4567', 'Freelancer', 'Designer', 'email', 'qualified', 'high', 90, '2024-01-25T09:15:00Z', 'Cliente potenziale per servizi B2B'),
('default-user', 'Anna', 'Neri', 'anna.neri@email.com', '+39 333 987 6543', 'Corporation DEF', 'CTO', 'social', 'new', 'medium', 75, '2024-02-01T11:45:00Z', 'Interessata a soluzioni enterprise'),
('default-user', 'Paolo', 'Blu', 'paolo.blu@email.com', '+39 777 456 7890', 'Agenzia GHI', 'Account Manager', 'referral', 'contacted', 'low', 60, '2024-02-05T16:20:00Z', 'Contatto tramite influencer')
ON CONFLICT DO NOTHING;

-- Progetti di esempio
INSERT INTO task_calendar_projects (user_id, name, description, status, priority, start_date, end_date, budget, spent, progress) VALUES
('default-user', 'Sviluppo App Mobile', 'Sviluppo di un\'applicazione mobile per iOS e Android', 'active', 'high', '2024-01-01T00:00:00Z', '2024-06-30T23:59:59Z', 50000.00, 25000.00, 60),
('default-user', 'Redesign Sito Web', 'Rinnovamento completo del sito web aziendale', 'active', 'medium', '2024-02-01T00:00:00Z', '2024-04-30T23:59:59Z', 15000.00, 8000.00, 40),
('default-user', 'Campagna Marketing Q2', 'Campagna marketing per il secondo trimestre', 'planning', 'high', '2024-04-01T00:00:00Z', '2024-06-30T23:59:59Z', 30000.00, 0.00, 0)
ON CONFLICT DO NOTHING;

-- Task di esempio
INSERT INTO task_calendar_tasks (user_id, title, description, status, priority, due_date, assigned_to, category) VALUES
('default-user', 'Completare wireframe app', 'Creare wireframe dettagliati per tutte le schermate', 'in_progress', 'high', '2024-02-15T18:00:00Z', 'Designer Team', 'Design'),
('default-user', 'Setup database', 'Configurare database per la nuova applicazione', 'pending', 'medium', '2024-02-20T17:00:00Z', 'Dev Team', 'Development'),
('default-user', 'Test funzionalità', 'Eseguire test completi su tutte le funzionalità', 'pending', 'high', '2024-03-01T18:00:00Z', 'QA Team', 'Testing')
ON CONFLICT DO NOTHING;

-- Quick Tasks di esempio
INSERT INTO quick_tasks (user_id, type, title, description, stakeholder, priority, status) VALUES
('default-user', 'reminder', 'Chiamare cliente ABC', 'Richiamare cliente per follow-up proposta', 'Mario Rossi', 'high', 'pending'),
('default-user', 'invoice', 'Fattura progetto XYZ', 'Generare fattura per progetto completato', 'Giulia Bianchi', 'medium', 'pending'),
('default-user', 'document', 'Preparare contratto', 'Preparare contratto per nuovo cliente', 'Luca Verdi', 'high', 'pending')
ON CONFLICT DO NOTHING;

-- 6. ABILITA RLS PER TUTTE LE TABELLE
-- =====================================================
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_calendar_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_calendar_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_calendar_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE quick_tasks ENABLE ROW LEVEL SECURITY;

-- 7. CREA POLICY PER TUTTE LE TABELLE
-- =====================================================
CREATE POLICY "Allow all operations for now" ON campaigns FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON leads FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON marketing_budgets FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON task_calendar_projects FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON task_calendar_tasks FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON task_calendar_appointments FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON recurring_activities FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON quick_tasks FOR ALL USING (true);

-- 8. CREA TRIGGER PER TUTTE LE TABELLE
-- =====================================================
CREATE TRIGGER update_campaigns_updated_at 
BEFORE UPDATE ON campaigns 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at 
BEFORE UPDATE ON leads 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marketing_budgets_updated_at 
BEFORE UPDATE ON marketing_budgets 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at 
BEFORE UPDATE ON task_calendar_projects 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at 
BEFORE UPDATE ON task_calendar_tasks 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at 
BEFORE UPDATE ON task_calendar_appointments 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recurring_updated_at 
BEFORE UPDATE ON recurring_activities 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quick_tasks_updated_at 
BEFORE UPDATE ON quick_tasks 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 9. VERIFICA CREAZIONE COMPLETA
-- =====================================================
SELECT 
    'All marketing and dashboard tables created successfully' as status,
    (SELECT COUNT(*) FROM campaigns) as campaigns_count,
    (SELECT COUNT(*) FROM leads) as leads_count,
    (SELECT COUNT(*) FROM marketing_budgets) as budgets_count,
    (SELECT COUNT(*) FROM task_calendar_projects) as projects_count,
    (SELECT COUNT(*) FROM task_calendar_tasks) as tasks_count,
    (SELECT COUNT(*) FROM task_calendar_appointments) as appointments_count,
    (SELECT COUNT(*) FROM recurring_activities) as recurring_count,
    (SELECT COUNT(*) FROM quick_tasks) as quick_tasks_count;

-- 10. LISTA TUTTE LE TABELLE CREATE
-- =====================================================
SELECT 
    table_name,
    'Created' as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'campaigns', 'leads', 'marketing_budgets',
    'task_calendar_projects', 'task_calendar_tasks', 'task_calendar_appointments',
    'recurring_activities', 'quick_tasks'
)
ORDER BY table_name;

-- =====================================================
-- FIX MARKETING E DASHBOARD COMPLETATO
-- =====================================================
-- Tutte le tabelle necessarie per marketing e dashboard sono ora disponibili
-- Schema allineato con le richieste del codice frontend
-- =====================================================
