-- =====================================================
-- QUOTE SETTINGS TABLE - Impostazioni Preventivi
-- =====================================================
-- Descrizione: Impostazioni azienda per generazione preventivi
-- Data: 2025-10-01
-- =====================================================

-- =====================================================
-- IMPOSTAZIONI PREVENTIVO
-- =====================================================
CREATE TABLE IF NOT EXISTS quote_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Dati Azienda Base
  company_name VARCHAR(255) NOT NULL DEFAULT 'La Tua Azienda S.r.l.',
  company_address VARCHAR(255) DEFAULT '',
  company_city VARCHAR(100) DEFAULT '',
  company_zip VARCHAR(20) DEFAULT '',
  company_country VARCHAR(100) DEFAULT 'Italia',
  company_phone VARCHAR(50) DEFAULT '',
  company_email VARCHAR(255) DEFAULT '',
  company_website VARCHAR(255) DEFAULT '',
  company_logo_url TEXT,
  
  -- Dati Fiscali
  vat_number VARCHAR(50) DEFAULT '', -- P.IVA
  tax_code VARCHAR(50) DEFAULT '', -- Codice Fiscale
  pec VARCHAR(255) DEFAULT '', -- PEC
  sdi_code VARCHAR(7) DEFAULT '', -- Codice SDI
  
  -- Dati Bancari
  bank_name VARCHAR(255) DEFAULT '',
  iban VARCHAR(50) DEFAULT '',
  swift VARCHAR(20) DEFAULT '',
  
  -- Testi Personalizzati
  footer_text TEXT DEFAULT 'Grazie per la vostra fiducia! Per informazioni: info@azienda.com',
  terms_and_conditions TEXT DEFAULT 'Il presente preventivo è valido per {days} giorni dalla data di emissione.',
  legal_note TEXT DEFAULT 'Ai sensi del D.Lgs. 196/2003, Vi informiamo che i Vostri dati sono raccolti per le finalità connesse ai rapporti commerciali tra di noi intercorrenti.',
  
  -- Personalizzazione Visiva
  primary_color VARCHAR(7) DEFAULT '#2563eb',
  secondary_color VARCHAR(7) DEFAULT '#16a34a',
  
  -- Opzioni Visualizzazione
  show_logo BOOLEAN DEFAULT true,
  show_footer BOOLEAN DEFAULT true,
  show_bank_details BOOLEAN DEFAULT true,
  show_terms BOOLEAN DEFAULT true,
  
  -- Impostazioni Default
  default_validity_days INTEGER DEFAULT 30,
  default_tax_rate DECIMAL(5, 2) DEFAULT 22.00,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Un solo record per utente
  UNIQUE(user_id)
);

-- Indice
CREATE INDEX IF NOT EXISTS idx_quote_settings_user ON quote_settings(user_id);

-- Trigger per updated_at
CREATE OR REPLACE FUNCTION update_quote_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  DROP TRIGGER IF EXISTS trigger_quote_settings_updated_at ON quote_settings;
  CREATE TRIGGER trigger_quote_settings_updated_at
    BEFORE UPDATE ON quote_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_quote_settings_updated_at();
END $$;

-- RLS Policy
ALTER TABLE quote_settings ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  DROP POLICY IF EXISTS "Users can manage their own quote settings" ON quote_settings;
  CREATE POLICY "Users can manage their own quote settings"
    ON quote_settings
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
    
  -- Policy temporanea per tutti (per testing)
  DROP POLICY IF EXISTS "Allow all operations on quote_settings" ON quote_settings;
  CREATE POLICY "Allow all operations on quote_settings"
    ON quote_settings
    FOR ALL
    USING (true)
    WITH CHECK (true);
END $$;

-- Funzione per ottenere/creare impostazioni
CREATE OR REPLACE FUNCTION get_or_create_quote_settings(p_user_id UUID)
RETURNS quote_settings AS $$
DECLARE
  settings quote_settings;
BEGIN
  SELECT * INTO settings FROM quote_settings WHERE user_id = p_user_id;
  
  IF NOT FOUND THEN
    INSERT INTO quote_settings (user_id)
    VALUES (p_user_id)
    RETURNING * INTO settings;
  END IF;
  
  RETURN settings;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- COMMENTI
-- =====================================================
COMMENT ON TABLE quote_settings IS 'Impostazioni personalizzate per generazione preventivi';
COMMENT ON COLUMN quote_settings.company_logo_url IS 'URL pubblico del logo aziendale';
COMMENT ON COLUMN quote_settings.vat_number IS 'Partita IVA';
COMMENT ON COLUMN quote_settings.tax_code IS 'Codice Fiscale';
COMMENT ON COLUMN quote_settings.pec IS 'Posta Elettronica Certificata';
COMMENT ON COLUMN quote_settings.sdi_code IS 'Codice destinatario SDI per fatturazione elettronica';
COMMENT ON COLUMN quote_settings.terms_and_conditions IS 'Usa {days} come placeholder per i giorni di validità';

-- =====================================================
-- DATI DI TEST (OPZIONALE)
-- =====================================================
/*
-- Inserisci impostazioni di default per utente test
INSERT INTO quote_settings (
  user_id,
  company_name,
  company_address,
  company_city,
  company_zip,
  company_country,
  company_phone,
  company_email,
  vat_number,
  tax_code
) VALUES (
  'YOUR_USER_ID_HERE',
  'Esempio S.r.l.',
  'Via Roma 123',
  'Milano',
  '20100',
  'Italia',
  '+39 02 1234567',
  'info@esempio.it',
  'IT12345678901',
  'RSSMRA80A01H501U'
);
*/

-- =====================================================
-- FINE SCRIPT
-- =====================================================
