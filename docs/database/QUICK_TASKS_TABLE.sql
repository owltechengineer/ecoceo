-- Tabella per Task Veloci
-- Sistema semplificato per creazione rapida di task

CREATE TABLE IF NOT EXISTS quick_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL DEFAULT 'default-user',
    type TEXT NOT NULL CHECK (type IN ('reminder', 'order', 'invoice', 'document', 'email', 'call', 'meeting', 'payment')),
    title TEXT NOT NULL,
    description TEXT,
    stakeholder TEXT,
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    due_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT
);

-- Indici per performance
CREATE INDEX IF NOT EXISTS idx_quick_tasks_user_id ON quick_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_quick_tasks_type ON quick_tasks(type);
CREATE INDEX IF NOT EXISTS idx_quick_tasks_status ON quick_tasks(status);
CREATE INDEX IF NOT EXISTS idx_quick_tasks_due_date ON quick_tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_quick_tasks_priority ON quick_tasks(priority);

-- Trigger per aggiornare updated_at
CREATE OR REPLACE FUNCTION update_quick_tasks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER IF NOT EXISTS trigger_update_quick_tasks_updated_at
    BEFORE UPDATE ON quick_tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_quick_tasks_updated_at();

-- Trigger per impostare completed_at quando status diventa 'completed'
CREATE OR REPLACE FUNCTION set_quick_tasks_completed_at()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        NEW.completed_at = NOW();
    ELSIF NEW.status != 'completed' THEN
        NEW.completed_at = NULL;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER IF NOT EXISTS trigger_set_quick_tasks_completed_at
    BEFORE UPDATE ON quick_tasks
    FOR EACH ROW
    EXECUTE FUNCTION set_quick_tasks_completed_at();

-- RLS (Row Level Security)
ALTER TABLE quick_tasks ENABLE ROW LEVEL SECURITY;

-- Policy per permettere tutte le operazioni (per ora)
CREATE POLICY IF NOT EXISTS "Allow all operations for now" ON quick_tasks
    FOR ALL USING (true);

-- Funzione per convertire quick_task in task normale
CREATE OR REPLACE FUNCTION convert_quick_task_to_task(quick_task_id UUID)
RETURNS UUID AS $$
DECLARE
    new_task_id UUID;
    quick_task_record RECORD;
BEGIN
    -- Ottieni i dati del quick task
    SELECT * INTO quick_task_record FROM quick_tasks WHERE id = quick_task_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Quick task not found';
    END IF;
    
    -- Crea il task normale
    INSERT INTO task_calendar_tasks (
        user_id,
        title,
        description,
        status,
        priority,
        due_date,
        assigned_to,
        category,
        created_at,
        updated_at
    ) VALUES (
        quick_task_record.user_id,
        quick_task_record.title,
        COALESCE(quick_task_record.description, ''),
        quick_task_record.status,
        quick_task_record.priority,
        quick_task_record.due_date,
        COALESCE(quick_task_record.stakeholder, ''),
        quick_task_record.type,
        quick_task_record.created_at,
        quick_task_record.updated_at
    ) RETURNING id INTO new_task_id;
    
    -- Aggiorna lo status del quick task
    UPDATE quick_tasks 
    SET status = 'completed', completed_at = NOW()
    WHERE id = quick_task_id;
    
    RETURN new_task_id;
END;
$$ LANGUAGE plpgsql;

-- Funzione per sincronizzare quick_tasks con task_calendar_tasks
CREATE OR REPLACE FUNCTION sync_quick_tasks_to_calendar()
RETURNS VOID AS $$
BEGIN
    -- Inserisci tutti i quick_tasks pending come task normali
    INSERT INTO task_calendar_tasks (
        user_id,
        title,
        description,
        status,
        priority,
        due_date,
        assigned_to,
        category,
        created_at,
        updated_at
    )
    SELECT 
        user_id,
        title,
        COALESCE(description, ''),
        status,
        priority,
        due_date,
        COALESCE(stakeholder, ''),
        type,
        created_at,
        updated_at
    FROM quick_tasks 
    WHERE status = 'pending'
    ON CONFLICT DO NOTHING;
    
    -- Aggiorna lo status dei quick_tasks sincronizzati
    UPDATE quick_tasks 
    SET status = 'completed', completed_at = NOW()
    WHERE status = 'pending' 
    AND id IN (
        SELECT id FROM quick_tasks 
        WHERE status = 'pending'
    );
END;
$$ LANGUAGE plpgsql;
