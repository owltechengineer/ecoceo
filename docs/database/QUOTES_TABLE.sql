-- =====================================================
-- QUOTES TABLE - Sistema Preventivi
-- =====================================================
-- Descrizione: Tabella per gestire i preventivi generati
-- Data: 2025-09-30
-- =====================================================

-- Tabella principale preventivi
CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_number VARCHAR(50) UNIQUE NOT NULL,
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255),
  client_address TEXT,
  language VARCHAR(10) DEFAULT 'it',
  subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0,
  tax DECIMAL(10, 2) NOT NULL DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL DEFAULT 0,
  valid_until DATE,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'draft', -- draft, sent, accepted, rejected, expired
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Tabella articoli del preventivo
CREATE TABLE IF NOT EXISTS quote_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE,
  item_id VARCHAR(50), -- Reference to warehouse item
  name VARCHAR(255) NOT NULL,
  description TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indici per performance
CREATE INDEX IF NOT EXISTS idx_quotes_client_name ON quotes(client_name);
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON quotes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_quote_items_quote_id ON quote_items(quote_id);

-- Trigger per aggiornare updated_at
CREATE OR REPLACE FUNCTION update_quotes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  DROP TRIGGER IF EXISTS trigger_update_quotes_updated_at ON quotes;
  CREATE TRIGGER trigger_update_quotes_updated_at
    BEFORE UPDATE ON quotes
    FOR EACH ROW
    EXECUTE FUNCTION update_quotes_updated_at();
END $$;

-- Funzione per generare numero preventivo
CREATE OR REPLACE FUNCTION generate_quote_number()
RETURNS VARCHAR(50) AS $$
DECLARE
  year_part VARCHAR(4);
  count_part INTEGER;
  new_number VARCHAR(50);
BEGIN
  year_part := TO_CHAR(NOW(), 'YYYY');
  
  SELECT COUNT(*) + 1 INTO count_part
  FROM quotes
  WHERE quote_number LIKE 'QT-' || year_part || '-%';
  
  new_number := 'QT-' || year_part || '-' || LPAD(count_part::TEXT, 4, '0');
  
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Trigger per auto-generare numero preventivo
CREATE OR REPLACE FUNCTION set_quote_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.quote_number IS NULL OR NEW.quote_number = '' THEN
    NEW.quote_number := generate_quote_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  DROP TRIGGER IF EXISTS trigger_set_quote_number ON quotes;
  CREATE TRIGGER trigger_set_quote_number
    BEFORE INSERT ON quotes
    FOR EACH ROW
    EXECUTE FUNCTION set_quote_number();
END $$;

-- RLS Policies
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_items ENABLE ROW LEVEL SECURITY;

-- Policy: Tutti possono leggere i preventivi (per ora)
DO $$
BEGIN
  DROP POLICY IF EXISTS "Allow all operations on quotes" ON quotes;
  CREATE POLICY "Allow all operations on quotes"
    ON quotes
    FOR ALL
    USING (true)
    WITH CHECK (true);
END $$;

DO $$
BEGIN
  DROP POLICY IF EXISTS "Allow all operations on quote_items" ON quote_items;
  CREATE POLICY "Allow all operations on quote_items"
    ON quote_items
    FOR ALL
    USING (true)
    WITH CHECK (true);
END $$;

-- =====================================================
-- COMMENTI E NOTE
-- =====================================================
COMMENT ON TABLE quotes IS 'Preventivi generati per clienti';
COMMENT ON TABLE quote_items IS 'Articoli inclusi nei preventivi';
COMMENT ON COLUMN quotes.quote_number IS 'Numero progressivo preventivo (es: QT-2025-0001)';
COMMENT ON COLUMN quotes.status IS 'Stato: draft, sent, accepted, rejected, expired';
COMMENT ON COLUMN quotes.language IS 'Lingua preventivo (it, en, de, fr, es, pt, ru, zh, etc.)';

-- =====================================================
-- DATI DI TEST (OPZIONALE)
-- =====================================================
-- INSERT INTO quotes (client_name, client_email, client_address, language, subtotal, tax, total, valid_until, notes, status)
-- VALUES 
--   ('Mario Rossi', 'mario.rossi@example.com', 'Via Roma 1, Milano', 'it', 1000.00, 220.00, 1220.00, '2025-10-30', 'Preventivo esempio', 'draft'),
--   ('John Smith', 'john.smith@example.com', '123 Main St, New York', 'en', 2000.00, 0.00, 2000.00, '2025-11-15', 'Sample quote', 'sent');

-- =====================================================
-- FINE SCRIPT
-- =====================================================
