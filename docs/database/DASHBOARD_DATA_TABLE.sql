-- =====================================================
-- DASHBOARD_DATA TABLE - Dati Dashboard Generici
-- =====================================================
-- Descrizione: Tabella per memorizzare dati dashboard generici
-- Data: 2025-10-01
-- =====================================================

CREATE TABLE IF NOT EXISTS dashboard_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  data_type VARCHAR(100) NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Un solo record per tipo per utente
  UNIQUE(user_id, data_type)
);

-- Indici per performance
CREATE INDEX IF NOT EXISTS idx_dashboard_data_user ON dashboard_data(user_id);
CREATE INDEX IF NOT EXISTS idx_dashboard_data_type ON dashboard_data(data_type);
CREATE INDEX IF NOT EXISTS idx_dashboard_data_user_type ON dashboard_data(user_id, data_type);

-- Trigger per updated_at
CREATE OR REPLACE FUNCTION update_dashboard_data_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  DROP TRIGGER IF EXISTS trigger_dashboard_data_updated_at ON dashboard_data;
  CREATE TRIGGER trigger_dashboard_data_updated_at
    BEFORE UPDATE ON dashboard_data
    FOR EACH ROW
    EXECUTE FUNCTION update_dashboard_data_updated_at();
END $$;

-- RLS Policy
ALTER TABLE dashboard_data ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  -- Policy temporanea per testing
  DROP POLICY IF EXISTS "Allow all operations on dashboard_data" ON dashboard_data;
  CREATE POLICY "Allow all operations on dashboard_data"
    ON dashboard_data
    FOR ALL
    USING (true)
    WITH CHECK (true);
    
  -- Policy per produzione (commentata)
  /*
  DROP POLICY IF EXISTS "Users can manage own dashboard data" ON dashboard_data;
  CREATE POLICY "Users can manage own dashboard data"
    ON dashboard_data
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
  */
END $$;

-- Commenti
COMMENT ON TABLE dashboard_data IS 'Dati generici dashboard per utente';
COMMENT ON COLUMN dashboard_data.data_type IS 'Tipo di dato salvato (es: preferences, layout, cache)';
COMMENT ON COLUMN dashboard_data.data IS 'Dati in formato JSON';

-- =====================================================
-- FINE SCRIPT
-- =====================================================
