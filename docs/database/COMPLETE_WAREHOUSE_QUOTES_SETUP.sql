-- =====================================================
-- COMPLETE WAREHOUSE & QUOTES SYSTEM
-- =====================================================
-- Sistema completo per Magazzino, Preventivi e Fornitori
-- Data: 2025-10-01
-- Esegui questo file per creare tutte le tabelle necessarie
-- =====================================================

-- =====================================================
-- PART 0: DASHBOARD_DATA TABLE (Base)
-- =====================================================
CREATE TABLE IF NOT EXISTS dashboard_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  data_type VARCHAR(100) NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, data_type)
);

CREATE INDEX IF NOT EXISTS idx_dashboard_data_user ON dashboard_data(user_id);
CREATE INDEX IF NOT EXISTS idx_dashboard_data_type ON dashboard_data(data_type);

-- =====================================================
-- PART 1: CATEGORIE MAGAZZINO
-- =====================================================
CREATE TABLE IF NOT EXISTS warehouse_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50),
  color VARCHAR(20),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserisci categorie di default
INSERT INTO warehouse_categories (name, description, icon, color, sort_order)
VALUES 
  ('Elettronica', 'Dispositivi elettronici e componenti', '💻', '#3b82f6', 1),
  ('Accessori', 'Accessori e periferiche', '🖱️', '#8b5cf6', 2),
  ('Software', 'Licenze software e abbonamenti', '💾', '#06b6d4', 3),
  ('Servizi', 'Servizi e consulenze', '⚙️', '#10b981', 4)
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- PART 2: ARTICOLI MAGAZZINO
-- =====================================================
CREATE TABLE IF NOT EXISTS warehouse_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category_id UUID REFERENCES warehouse_categories(id) ON DELETE SET NULL,
  
  -- Prezzi
  purchase_price DECIMAL(10, 2) DEFAULT 0,
  sale_price DECIMAL(10, 2) NOT NULL,
  tax_rate DECIMAL(5, 2) DEFAULT 22.00,
  
  -- Inventario
  quantity INTEGER NOT NULL DEFAULT 0,
  unit VARCHAR(20) DEFAULT 'pz',
  min_stock INTEGER DEFAULT 0,
  max_stock INTEGER DEFAULT 0,
  location VARCHAR(100),
  
  -- Media
  image_url TEXT,
  
  -- Metadata
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

CREATE INDEX IF NOT EXISTS idx_warehouse_items_sku ON warehouse_items(sku);
CREATE INDEX IF NOT EXISTS idx_warehouse_items_category ON warehouse_items(category_id);
CREATE INDEX IF NOT EXISTS idx_warehouse_items_active ON warehouse_items(is_active);

-- =====================================================
-- PART 3: MOVIMENTI MAGAZZINO
-- =====================================================
CREATE TABLE IF NOT EXISTS warehouse_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID REFERENCES warehouse_items(id) ON DELETE CASCADE,
  movement_type VARCHAR(20) NOT NULL, -- 'in', 'out', 'adjustment'
  quantity INTEGER NOT NULL,
  reference_type VARCHAR(50),
  reference_id UUID,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

CREATE INDEX IF NOT EXISTS idx_warehouse_movements_item ON warehouse_movements(item_id);
CREATE INDEX IF NOT EXISTS idx_warehouse_movements_type ON warehouse_movements(movement_type);

-- =====================================================
-- PART 4: PREVENTIVI (GIÀ ESISTENTI - ESTESI)
-- =====================================================
-- Quotes table già creata in QUOTES_TABLE.sql
-- Aggiungiamo solo i campi mancanti se necessario

-- =====================================================
-- PART 5: IMPOSTAZIONI PREVENTIVO
-- =====================================================
CREATE TABLE IF NOT EXISTS quote_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Dati Azienda
  company_name VARCHAR(255) DEFAULT 'La Tua Azienda S.r.l.',
  company_address VARCHAR(255) DEFAULT '',
  company_city VARCHAR(100) DEFAULT '',
  company_zip VARCHAR(20) DEFAULT '',
  company_country VARCHAR(100) DEFAULT 'Italia',
  company_phone VARCHAR(50) DEFAULT '',
  company_email VARCHAR(255) DEFAULT '',
  company_website VARCHAR(255) DEFAULT '',
  company_logo_url TEXT,
  
  -- Dati Fiscali
  vat_number VARCHAR(50) DEFAULT '',
  tax_code VARCHAR(50) DEFAULT '',
  pec VARCHAR(255) DEFAULT '',
  sdi_code VARCHAR(7) DEFAULT '',
  
  -- Dati Bancari
  bank_name VARCHAR(255) DEFAULT '',
  iban VARCHAR(50) DEFAULT '',
  swift VARCHAR(20) DEFAULT '',
  
  -- Testi
  footer_text TEXT DEFAULT '',
  terms_and_conditions TEXT DEFAULT '',
  legal_note TEXT DEFAULT '',
  
  -- Personalizzazione
  primary_color VARCHAR(7) DEFAULT '#2563eb',
  secondary_color VARCHAR(7) DEFAULT '#16a34a',
  show_logo BOOLEAN DEFAULT true,
  show_footer BOOLEAN DEFAULT true,
  show_bank_details BOOLEAN DEFAULT true,
  show_terms BOOLEAN DEFAULT true,
  default_validity_days INTEGER DEFAULT 30,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_quote_settings_user ON quote_settings(user_id);

-- =====================================================
-- PART 6: FORNITORI
-- =====================================================
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  vat_number VARCHAR(50),
  payment_terms INTEGER DEFAULT 30,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_suppliers_name ON suppliers(name);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger per updated_at
CREATE OR REPLACE FUNCTION update_warehouse_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  DROP TRIGGER IF EXISTS trigger_warehouse_items_updated_at ON warehouse_items;
  CREATE TRIGGER trigger_warehouse_items_updated_at
    BEFORE UPDATE ON warehouse_items
    FOR EACH ROW
    EXECUTE FUNCTION update_warehouse_updated_at();
    
  DROP TRIGGER IF EXISTS trigger_warehouse_categories_updated_at ON warehouse_categories;
  CREATE TRIGGER trigger_warehouse_categories_updated_at
    BEFORE UPDATE ON warehouse_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_warehouse_updated_at();
    
  DROP TRIGGER IF EXISTS trigger_quote_settings_updated_at ON quote_settings;
  CREATE TRIGGER trigger_quote_settings_updated_at
    BEFORE UPDATE ON quote_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_warehouse_updated_at();
    
  DROP TRIGGER IF EXISTS trigger_suppliers_updated_at ON suppliers;
  CREATE TRIGGER trigger_suppliers_updated_at
    BEFORE UPDATE ON suppliers
    FOR EACH ROW
    EXECUTE FUNCTION update_warehouse_updated_at();
END $$;

-- Trigger per aggiornare quantità dopo movimento
CREATE OR REPLACE FUNCTION update_item_quantity_after_movement()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.movement_type = 'in' THEN
    UPDATE warehouse_items 
    SET quantity = quantity + NEW.quantity 
    WHERE id = NEW.item_id;
  ELSIF NEW.movement_type IN ('out', 'adjustment') THEN
    UPDATE warehouse_items 
    SET quantity = quantity - NEW.quantity 
    WHERE id = NEW.item_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  DROP TRIGGER IF EXISTS trigger_update_item_quantity ON warehouse_movements;
  CREATE TRIGGER trigger_update_item_quantity
    AFTER INSERT ON warehouse_movements
    FOR EACH ROW
    EXECUTE FUNCTION update_item_quantity_after_movement();
END $$;

-- =====================================================
-- RLS POLICIES
-- =====================================================
ALTER TABLE dashboard_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouse_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouse_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouse_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  -- Allow all per testing
  DROP POLICY IF EXISTS "Allow all on dashboard_data" ON dashboard_data;
  CREATE POLICY "Allow all on dashboard_data"
    ON dashboard_data FOR ALL USING (true) WITH CHECK (true);
    
  DROP POLICY IF EXISTS "Allow all on warehouse_categories" ON warehouse_categories;
  CREATE POLICY "Allow all on warehouse_categories"
    ON warehouse_categories FOR ALL USING (true) WITH CHECK (true);
    
  DROP POLICY IF EXISTS "Allow all on warehouse_items" ON warehouse_items;
  CREATE POLICY "Allow all on warehouse_items"
    ON warehouse_items FOR ALL USING (true) WITH CHECK (true);
    
  DROP POLICY IF EXISTS "Allow all on warehouse_movements" ON warehouse_movements;
  CREATE POLICY "Allow all on warehouse_movements"
    ON warehouse_movements FOR ALL USING (true) WITH CHECK (true);
    
  DROP POLICY IF EXISTS "Allow all on quote_settings" ON quote_settings;
  CREATE POLICY "Allow all on quote_settings"
    ON quote_settings FOR ALL USING (true) WITH CHECK (true);
    
  DROP POLICY IF EXISTS "Allow all on suppliers" ON suppliers;
  CREATE POLICY "Allow all on suppliers"
    ON suppliers FOR ALL USING (true) WITH CHECK (true);
END $$;

-- =====================================================
-- COMMENTI
-- =====================================================
COMMENT ON TABLE warehouse_categories IS 'Categorie prodotti magazzino';
COMMENT ON TABLE warehouse_items IS 'Articoli in magazzino con prezzi e giacenze';
COMMENT ON TABLE warehouse_movements IS 'Storico movimenti carico/scarico';
COMMENT ON TABLE quote_settings IS 'Impostazioni azienda per preventivi';
COMMENT ON TABLE suppliers IS 'Anagrafica fornitori';

-- =====================================================
-- FUNZIONI UTILI
-- =====================================================

-- Funzione per ottenere valore totale magazzino
CREATE OR REPLACE FUNCTION get_total_warehouse_value()
RETURNS DECIMAL(10, 2) AS $$
DECLARE
  total_value DECIMAL(10, 2);
BEGIN
  SELECT COALESCE(SUM(sale_price * quantity), 0) INTO total_value
  FROM warehouse_items
  WHERE is_active = true;
  
  RETURN total_value;
END;
$$ LANGUAGE plpgsql;

-- Funzione per articoli sotto scorta minima
CREATE OR REPLACE FUNCTION get_low_stock_items()
RETURNS TABLE (
  item_id UUID,
  item_name VARCHAR(255),
  sku VARCHAR(50),
  current_quantity INTEGER,
  min_stock INTEGER,
  difference INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    id,
    name,
    warehouse_items.sku,
    quantity,
    warehouse_items.min_stock,
    warehouse_items.min_stock - quantity AS difference
  FROM warehouse_items
  WHERE is_active = true 
    AND quantity <= warehouse_items.min_stock
  ORDER BY (warehouse_items.min_stock - quantity) DESC;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- VISTA RIEPILOGO MAGAZZINO
-- =====================================================
CREATE OR REPLACE VIEW warehouse_summary AS
SELECT 
  wi.id,
  wi.sku,
  wi.name,
  wi.description,
  wc.name AS category_name,
  wi.sale_price,
  wi.quantity,
  wi.unit,
  wi.min_stock,
  wi.location,
  wi.image_url,
  (wi.sale_price * wi.quantity) AS total_value,
  CASE 
    WHEN wi.quantity <= wi.min_stock THEN 'low'
    WHEN wi.quantity >= wi.max_stock THEN 'high'
    ELSE 'normal'
  END AS stock_status,
  wi.is_active,
  wi.created_at,
  wi.updated_at
FROM warehouse_items wi
LEFT JOIN warehouse_categories wc ON wi.category_id = wc.id
WHERE wi.is_active = true
ORDER BY wi.name;

-- =====================================================
-- DATI DI TEST (OPZIONALE)
-- =====================================================
/*
-- Inserisci articoli di esempio
INSERT INTO warehouse_items (sku, name, description, category_id, sale_price, quantity, unit, min_stock, max_stock, location)
SELECT 
  'DELL-XPS13-001', 
  'Laptop Dell XPS 13', 
  'Laptop ultrabook con processore Intel i7, 16GB RAM, SSD 512GB',
  id,
  1299.00,
  15,
  'pz',
  5,
  50,
  'A1-B2'
FROM warehouse_categories WHERE name = 'Elettronica';

INSERT INTO warehouse_items (sku, name, description, category_id, sale_price, quantity, unit, min_stock, max_stock, location)
SELECT 
  'SAMS-27-4K-002', 
  'Monitor Samsung 27" 4K', 
  'Monitor 4K da 27 pollici con tecnologia IPS e HDR',
  id,
  399.00,
  8,
  'pz',
  3,
  20,
  'A2-B1'
FROM warehouse_categories WHERE name = 'Elettronica';
*/

-- =====================================================
-- VERIFICA INSTALLAZIONE
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE '✅ Setup completato!';
  RAISE NOTICE 'Tabelle create:';
  RAISE NOTICE '- warehouse_categories (% righe)', (SELECT COUNT(*) FROM warehouse_categories);
  RAISE NOTICE '- warehouse_items';
  RAISE NOTICE '- warehouse_movements';
  RAISE NOTICE '- quote_settings';
  RAISE NOTICE '- suppliers';
  RAISE NOTICE 'Trigger e funzioni attivati ✅';
END $$;

-- =====================================================
-- FINE SCRIPT
-- =====================================================
