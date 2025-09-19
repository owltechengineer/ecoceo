-- =====================================================
-- TASKS & CALENDAR MANAGEMENT TABLES
-- Tabelle per gestione task e calendario
-- =====================================================

-- ===== TABELLE TASK E CALENDARIO =====

-- Tabella Progetti Calendario
CREATE TABLE IF NOT EXISTS task_calendar_projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'on-hold', 'cancelled', 'planning')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    
    -- Date
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    
    -- Progress
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    
    -- Team
    project_manager TEXT,
    team_members TEXT[] DEFAULT '{}',
    
    -- Metadata
    notes TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella Task
CREATE TABLE IF NOT EXISTS task_calendar_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    project_id UUID REFERENCES task_calendar_projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed', 'cancelled', 'on-hold')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    
    -- Assignment
    assigned_to TEXT,
    assigned_by TEXT,
    
    -- Dates
    due_date TIMESTAMP WITH TIME ZONE,
    start_date TIMESTAMP WITH TIME ZONE,
    completed_date TIMESTAMP WITH TIME ZONE,
    
    -- Time Tracking
    estimated_hours DECIMAL(6,2) DEFAULT 0,
    actual_hours DECIMAL(6,2) DEFAULT 0,
    
    -- Progress
    progress_percentage DECIMAL(5,2) DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    
    -- Dependencies
    depends_on_tasks UUID[] DEFAULT '{}',
    
    -- Category
    category TEXT DEFAULT 'general' CHECK (category IN ('development', 'design', 'testing', 'documentation', 'meeting', 'review', 'other')),
    
    -- Metadata
    notes TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella Appuntamenti
CREATE TABLE IF NOT EXISTS task_calendar_appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT DEFAULT 'meeting' CHECK (type IN ('meeting', 'call', 'presentation', 'interview', 'training', 'other')),
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'rescheduled')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    
    -- Schedule
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER,
    
    -- Location
    location TEXT,
    meeting_url TEXT,
    meeting_id TEXT,
    
    -- Participants
    attendees TEXT[] DEFAULT '{}',
    organizer TEXT,
    
    -- Recurrence
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_pattern TEXT CHECK (recurrence_pattern IN ('daily', 'weekly', 'monthly', 'yearly')),
    recurrence_end_date TIMESTAMP WITH TIME ZONE,
    
    -- Reminders
    reminder_minutes INTEGER DEFAULT 15,
    reminder_sent BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    notes TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella Attività Ricorrenti
CREATE TABLE IF NOT EXISTS recurring_activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT DEFAULT 'task' CHECK (type IN ('task', 'appointment', 'reminder', 'other')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    
    -- Schedule
    frequency TEXT DEFAULT 'weekly' CHECK (frequency IN ('daily', 'weekly', 'monthly', 'yearly')),
    day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday
    day_of_month INTEGER CHECK (day_of_month >= 1 AND day_of_month <= 31),
    time_of_day TIME,
    
    -- Duration
    duration_minutes INTEGER DEFAULT 60,
    
    -- Assignment
    assigned_to TEXT,
    
    -- Template
    is_template BOOLEAN DEFAULT FALSE,
    template_id UUID REFERENCES recurring_activities(id) ON DELETE SET NULL,
    
    -- Dates
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    last_generated TIMESTAMP WITH TIME ZONE,
    next_generation TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    notes TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella Template Settimanali
CREATE TABLE IF NOT EXISTS weekly_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
    
    -- Template Data
    template_data JSONB DEFAULT '{}',
    
    -- Schedule
    week_start_day INTEGER DEFAULT 1 CHECK (week_start_day >= 0 AND week_start_day <= 6), -- 0 = Sunday, 1 = Monday
    
    -- Usage
    usage_count INTEGER DEFAULT 0,
    last_used TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    notes TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella Task Generati da Template
CREATE TABLE IF NOT EXISTS generated_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    template_id UUID REFERENCES weekly_templates(id) ON DELETE CASCADE,
    recurring_activity_id UUID REFERENCES recurring_activities(id) ON DELETE CASCADE,
    
    -- Task Details
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed', 'cancelled')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    
    -- Schedule
    scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE,
    
    -- Assignment
    assigned_to TEXT,
    
    -- Generation Info
    generation_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    week_start_date TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    notes TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== FUNZIONI TASK E CALENDARIO =====

-- Funzione generate_recurring_activities
DROP FUNCTION IF EXISTS generate_recurring_activities(DATE, DATE);
DROP FUNCTION IF EXISTS generate_recurring_activities;

CREATE OR REPLACE FUNCTION generate_recurring_activities(
    p_start_date DATE,
    p_end_date DATE
)
RETURNS TABLE (
    activity_id UUID,
    generated_date DATE,
    status TEXT
) AS $$
DECLARE
    activity RECORD;
    loop_date DATE;
    generated_count INTEGER;
BEGIN
    loop_date := p_start_date;
    
    WHILE loop_date <= p_end_date LOOP
        FOR activity IN 
            SELECT * FROM recurring_activities 
            WHERE status = 'active' 
            AND (end_date IS NULL OR end_date >= loop_date)
            AND (next_generation IS NULL OR next_generation <= loop_date)
        LOOP
            -- Genera attività basata sulla frequenza
            CASE activity.frequency
                WHEN 'daily' THEN
                    INSERT INTO generated_tasks (
                        template_id, recurring_activity_id, title, description, 
                        scheduled_date, assigned_to, week_start_date
                    ) VALUES (
                        activity.template_id, activity.id, activity.name, activity.description,
                        loop_date, activity.assigned_to, loop_date
                    );
                    
                WHEN 'weekly' THEN
                    IF EXTRACT(DOW FROM loop_date) = activity.day_of_week THEN
                        INSERT INTO generated_tasks (
                            template_id, recurring_activity_id, title, description, 
                            scheduled_date, assigned_to, week_start_date
                        ) VALUES (
                            activity.template_id, activity.id, activity.name, activity.description,
                            loop_date, activity.assigned_to, loop_date
                        );
                    END IF;
                    
                WHEN 'monthly' THEN
                    IF EXTRACT(DAY FROM loop_date) = activity.day_of_month THEN
                        INSERT INTO generated_tasks (
                            template_id, recurring_activity_id, title, description, 
                            scheduled_date, assigned_to, week_start_date
                        ) VALUES (
                            activity.template_id, activity.id, activity.name, activity.description,
                            loop_date, activity.assigned_to, loop_date
                        );
                    END IF;
            END CASE;
            
            -- Aggiorna next_generation
            UPDATE recurring_activities 
            SET next_generation = loop_date + INTERVAL '1 day',
                last_generated = loop_date
            WHERE id = activity.id;
        END LOOP;
        
        loop_date := loop_date + INTERVAL '1 day';
    END LOOP;
    
    RETURN QUERY
    SELECT 
        ra.id,
        loop_date,
        'generated'::TEXT
    FROM recurring_activities ra
    WHERE ra.status = 'active';
END;
$$ LANGUAGE plpgsql;

-- Funzione generate_week_from_template
DROP FUNCTION IF EXISTS generate_week_from_template(UUID, DATE);
DROP FUNCTION IF EXISTS generate_week_from_template;

CREATE OR REPLACE FUNCTION generate_week_from_template(
    p_template_id UUID,
    p_week_start_date DATE
)
RETURNS TABLE (
    task_id UUID,
    task_title TEXT,
    scheduled_date DATE
) AS $$
DECLARE
    template RECORD;
    task_data JSONB;
    loop_date DATE;
    day_offset INTEGER;
BEGIN
    -- Ottieni template
    SELECT * INTO template FROM weekly_templates WHERE id = p_template_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Template not found';
    END IF;
    
    -- Genera task per ogni giorno della settimana
    FOR day_offset IN 0..6 LOOP
        loop_date := p_week_start_date + (day_offset || ' days')::INTERVAL;
        
        -- Genera task dal template data
        FOR task_data IN SELECT * FROM jsonb_array_elements(template.template_data)
        LOOP
            INSERT INTO generated_tasks (
                template_id, title, description, scheduled_date, week_start_date
            ) VALUES (
                p_template_id,
                task_data->>'title',
                task_data->>'description',
                loop_date,
                p_week_start_date
            );
        END LOOP;
    END LOOP;
    
    -- Aggiorna usage count
    UPDATE weekly_templates 
    SET usage_count = usage_count + 1,
        last_used = NOW()
    WHERE id = p_template_id;
    
    RETURN QUERY
    SELECT 
        gt.id,
        gt.title,
        gt.scheduled_date::DATE
    FROM generated_tasks gt
    WHERE gt.template_id = p_template_id
    AND gt.week_start_date = p_week_start_date;
END;
$$ LANGUAGE plpgsql;

-- ===== RLS E POLICY =====

-- Abilita RLS su tutte le tabelle
ALTER TABLE task_calendar_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_calendar_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_calendar_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_tasks ENABLE ROW LEVEL SECURITY;

-- Policy per accesso completo (temporanea)
CREATE POLICY "Allow all operations for now" ON task_calendar_projects FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON task_calendar_tasks FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON task_calendar_appointments FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON recurring_activities FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON weekly_templates FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON generated_tasks FOR ALL USING (true);

-- ===== TRIGGER PER UPDATED_AT =====

CREATE TRIGGER update_task_calendar_projects_updated_at 
    BEFORE UPDATE ON task_calendar_projects 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_task_calendar_tasks_updated_at 
    BEFORE UPDATE ON task_calendar_tasks 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_task_calendar_appointments_updated_at 
    BEFORE UPDATE ON task_calendar_appointments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recurring_activities_updated_at 
    BEFORE UPDATE ON recurring_activities 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_weekly_templates_updated_at 
    BEFORE UPDATE ON weekly_templates 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_generated_tasks_updated_at 
    BEFORE UPDATE ON generated_tasks 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===== INDICI PER PERFORMANCE =====

CREATE INDEX IF NOT EXISTS idx_task_calendar_projects_user_id ON task_calendar_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_task_calendar_projects_status ON task_calendar_projects(status);
CREATE INDEX IF NOT EXISTS idx_task_calendar_tasks_project_id ON task_calendar_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_task_calendar_tasks_status ON task_calendar_tasks(status);
CREATE INDEX IF NOT EXISTS idx_task_calendar_tasks_due_date ON task_calendar_tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_task_calendar_tasks_assigned_to ON task_calendar_tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_task_calendar_appointments_user_id ON task_calendar_appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_task_calendar_appointments_start_time ON task_calendar_appointments(start_time);
CREATE INDEX IF NOT EXISTS idx_task_calendar_appointments_status ON task_calendar_appointments(status);
CREATE INDEX IF NOT EXISTS idx_recurring_activities_user_id ON recurring_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_recurring_activities_status ON recurring_activities(status);
CREATE INDEX IF NOT EXISTS idx_recurring_activities_next_generation ON recurring_activities(next_generation);
CREATE INDEX IF NOT EXISTS idx_weekly_templates_user_id ON weekly_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_templates_status ON weekly_templates(status);
CREATE INDEX IF NOT EXISTS idx_generated_tasks_template_id ON generated_tasks(template_id);
CREATE INDEX IF NOT EXISTS idx_generated_tasks_scheduled_date ON generated_tasks(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_generated_tasks_status ON generated_tasks(status);
