-- =====================================================
-- QUICK FIX - CREA TABELLA DASHBOARD_DATA
-- =====================================================
-- Risolve l'errore: Could not find the table 'public.dashboard_data'
-- =====================================================

-- 1. CREA TABELLA DASHBOARD_DATA
-- =====================================================
CREATE TABLE IF NOT EXISTS dashboard_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    data_type TEXT NOT NULL,
    data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, data_type)
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

CREATE TRIGGER update_dashboard_data_updated_at 
BEFORE UPDATE ON dashboard_data 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 3. ABILITA RLS
-- =====================================================
ALTER TABLE dashboard_data ENABLE ROW LEVEL SECURITY;

-- 4. CREA POLICY
-- =====================================================
CREATE POLICY "Allow all operations for now" ON dashboard_data FOR ALL USING (true);

-- 5. INSERISCI DATI DI ESEMPIO
-- =====================================================
INSERT INTO dashboard_data (user_id, data_type, data) VALUES
('default-user', 'dashboard_overview', '{"total_revenue": 0, "total_costs": 0, "active_projects": 0}'),
('default-user', 'financial_summary', '{"revenues": [], "costs": [], "budgets": []}'),
('default-user', 'marketing_summary', '{"campaigns": [], "leads": [], "conversions": 0}'),
('default-user', 'projects_summary', '{"active": [], "completed": [], "pending": []}')
ON CONFLICT (user_id, data_type) DO NOTHING;

-- 6. VERIFICA CREAZIONE
-- =====================================================
SELECT 
    'dashboard_data table created successfully' as status,
    COUNT(*) as records_count
FROM dashboard_data;

-- =====================================================
-- FIX COMPLETATO
-- =====================================================
-- La tabella dashboard_data è ora disponibile
-- =====================================================
