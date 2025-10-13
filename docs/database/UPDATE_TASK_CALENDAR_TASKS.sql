-- =====================================================
-- UPDATE TASK_CALENDAR_TASKS TABLE
-- =====================================================
-- Aggiunge le colonne mancanti alla tabella task_calendar_tasks
-- per supportare tutte le funzionalità del task manager
-- =====================================================

-- Aggiungi colonne mancanti alla tabella task_calendar_tasks
ALTER TABLE task_calendar_tasks 
ADD COLUMN IF NOT EXISTS estimated_hours DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS actual_hours DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
ADD COLUMN IF NOT EXISTS depends_on_tasks UUID[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Aggiorna la tabella per supportare più stati
ALTER TABLE task_calendar_tasks 
DROP CONSTRAINT IF EXISTS task_calendar_tasks_status_check;

ALTER TABLE task_calendar_tasks 
ADD CONSTRAINT task_calendar_tasks_status_check 
CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled', 'on_hold', 'review'));

-- Aggiorna la tabella per supportare più priorità
ALTER TABLE task_calendar_tasks 
DROP CONSTRAINT IF EXISTS task_calendar_tasks_priority_check;

ALTER TABLE task_calendar_tasks 
ADD CONSTRAINT task_calendar_tasks_priority_check 
CHECK (priority IN ('low', 'medium', 'high', 'urgent', 'critical'));

-- Aggiungi indici per le nuove colonne
CREATE INDEX IF NOT EXISTS idx_tasks_estimated_hours ON task_calendar_tasks(estimated_hours);
CREATE INDEX IF NOT EXISTS idx_tasks_actual_hours ON task_calendar_tasks(actual_hours);
CREATE INDEX IF NOT EXISTS idx_tasks_progress ON task_calendar_tasks(progress_percentage);
CREATE INDEX IF NOT EXISTS idx_tasks_tags ON task_calendar_tasks USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_tasks_depends_on ON task_calendar_tasks USING GIN(depends_on_tasks);

-- Verifica che tutte le colonne siano state aggiunte
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'task_calendar_tasks' 
AND table_schema = 'public'
ORDER BY ordinal_position;
