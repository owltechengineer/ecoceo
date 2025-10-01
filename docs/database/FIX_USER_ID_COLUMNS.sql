-- =====================================================
-- 🔧 FIX: Aggiungi colonne user_id mancanti
-- =====================================================
-- Risolve: "column user_id does not exist"
-- =====================================================

-- Aggiungi user_id alle tabelle che ne hanno bisogno
ALTER TABLE task_calendar_tasks 
ADD COLUMN IF NOT EXISTS user_id VARCHAR(255) DEFAULT 'default-user';

ALTER TABLE task_calendar_appointments 
ADD COLUMN IF NOT EXISTS user_id VARCHAR(255) DEFAULT 'default-user';

ALTER TABLE task_calendar_projects 
ADD COLUMN IF NOT EXISTS user_id VARCHAR(255) DEFAULT 'default-user';

ALTER TABLE recurring_activities 
ADD COLUMN IF NOT EXISTS user_id VARCHAR(255) DEFAULT 'default-user';

ALTER TABLE quick_tasks 
ADD COLUMN IF NOT EXISTS user_id VARCHAR(255) DEFAULT 'default-user';

-- Aggiorna tutti i record esistenti con user_id di default
UPDATE task_calendar_tasks SET user_id = 'default-user' WHERE user_id IS NULL;
UPDATE task_calendar_appointments SET user_id = 'default-user' WHERE user_id IS NULL;
UPDATE task_calendar_projects SET user_id = 'default-user' WHERE user_id IS NULL;
UPDATE recurring_activities SET user_id = 'default-user' WHERE user_id IS NULL;
UPDATE quick_tasks SET user_id = 'default-user' WHERE user_id IS NULL;

-- Notifica refresh schema
NOTIFY pgrst, 'reload schema';

-- =====================================================
-- ✅ FIX COMPLETATO
-- =====================================================
