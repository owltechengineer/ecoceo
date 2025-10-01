-- =====================================================
-- SEZIONE PROGETTI - TABELLE E DATI
-- =====================================================
-- Gestione progetti e task aziendali
-- =====================================================

-- Progetti
CREATE TABLE IF NOT EXISTS projects (
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
CREATE TABLE IF NOT EXISTS tasks (
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
CREATE TABLE IF NOT EXISTS task_calendar_appointments (
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
CREATE TABLE IF NOT EXISTS quick_tasks (
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

-- Trigger per updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_task_calendar_appointments_updated_at BEFORE UPDATE ON task_calendar_appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quick_tasks_updated_at BEFORE UPDATE ON quick_tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS Policy
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_calendar_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE quick_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations for now" ON projects FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON tasks FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON task_calendar_appointments FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON quick_tasks FOR ALL USING (true);

-- Dati di esempio
INSERT INTO projects (name, description, start_date, end_date, status, priority, budget) VALUES
('Sviluppo App Mobile', 'Sviluppo di un\'applicazione mobile per iOS e Android', '2024-01-15', '2024-06-30', 'active', 'high', 50000.00),
('Redesign Sito Web', 'Rinnovamento completo del sito web aziendale', '2024-02-01', '2024-04-30', 'active', 'medium', 15000.00),
('Sistema CRM', 'Implementazione di un sistema CRM per la gestione clienti', '2024-03-01', '2024-08-31', 'planning', 'high', 30000.00)
ON CONFLICT DO NOTHING;

INSERT INTO quick_tasks (title, description, type, priority, status, stakeholder) VALUES
('Chiamare cliente', 'Richiamare il cliente per conferma ordine', 'call', 'high', 'pending', 'Mario Rossi'),
('Inviare preventivo', 'Inviare preventivo via email al cliente', 'email', 'medium', 'pending', 'Giulia Bianchi'),
('Preparare presentazione', 'Preparare slide per meeting settimanale', 'document', 'low', 'completed', 'Team Marketing'),
('Ordinare materiali', 'Ordinare nuovi materiali per ufficio', 'order', 'medium', 'pending', 'Amministrazione')
ON CONFLICT DO NOTHING;
