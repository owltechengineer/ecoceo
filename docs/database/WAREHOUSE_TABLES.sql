-- =====================================================
-- WAREHOUSE TABLES - Sistema Magazzino e Inventario
-- =====================================================
-- Descrizione: Tabelle per gestione magazzino completo
-- Data: 2025-10-01
-- =====================================================

-- =====================================================
-- 1. CATEGORIE MAGAZZINO
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
-- 2. ARTICOLI MAGAZZINO
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

-- Indici per performance
CREATE INDEX IF NOT EXISTS idx_warehouse_items_sku ON warehouse_items(sku);
CREATE INDEX IF NOT EXISTS idx_warehouse_items_category ON warehouse_items(category_id);
CREATE INDEX IF NOT EXISTS idx_warehouse_items_active ON warehouse_items(is_active);
CREATE INDEX IF NOT EXISTS idx_warehouse_items_quantity ON warehouse_items(quantity);

-- =====================================================
-- 3. MOVIMENTI MAGAZZINO
-- =====================================================
CREATE TABLE IF NOT EXISTS warehouse_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID REFERENCES warehouse_items(id) ON DELETE CASCADE,
  movement_type VARCHAR(20) NOT NULL, -- 'in', 'out', 'adjustment', 'return'
  quantity INTEGER NOT NULL,
  reference_type VARCHAR(50), -- 'purchase', 'sale', 'quote', 'adjustment'
  reference_id UUID,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Indici
CREATE INDEX IF NOT EXISTS idx_warehouse_movements_item ON warehouse_movements(item_id);
CREATE INDEX IF NOT EXISTS idx_warehouse_movements_type ON warehouse_movements(movement_type);
CREATE INDEX IF NOT EXISTS idx_warehouse_movements_created ON warehouse_movements(created_at DESC);

-- =====================================================
-- 4. FORNITORI
-- =====================================================
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  vat_number VARCHAR(50),
  payment_terms INTEGER DEFAULT 30, -- giorni
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indici
CREATE INDEX IF NOT EXISTS idx_suppliers_name ON suppliers(name);
CREATE INDEX IF NOT EXISTS idx_suppliers_active ON suppliers(is_active);

-- =====================================================
-- 5. RELAZIONE ARTICOLI-FORNITORI
-- =====================================================
CREATE TABLE IF NOT EXISTS item_suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID REFERENCES warehouse_items(id) ON DELETE CASCADE,
  supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
  supplier_sku VARCHAR(100),
  supplier_price DECIMAL(10, 2),
  lead_time_days INTEGER DEFAULT 7,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(item_id, supplier_id)
);

-- Indici
CREATE INDEX IF NOT EXISTS idx_item_suppliers_item ON item_suppliers(item_id);
CREATE INDEX IF NOT EXISTS idx_item_suppliers_supplier ON item_suppliers(supplier_id);

-- =====================================================
-- 6. ORDINI FORNITORI
-- =====================================================
CREATE TABLE IF NOT EXISTS purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
  order_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expected_delivery DATE,
  status VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, delivered, cancelled
  subtotal DECIMAL(10, 2) DEFAULT 0,
  tax DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Indici
CREATE INDEX IF NOT EXISTS idx_purchase_orders_supplier ON purchase_orders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_status ON purchase_orders(status);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_date ON purchase_orders(order_date DESC);

-- =====================================================
-- 7. RIGHE ORDINI FORNITORI
-- =====================================================
CREATE TABLE IF NOT EXISTS purchase_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES purchase_orders(id) ON DELETE CASCADE,
  item_id UUID REFERENCES warehouse_items(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  received_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indici
CREATE INDEX IF NOT EXISTS idx_purchase_order_items_order ON purchase_order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_purchase_order_items_item ON purchase_order_items(item_id);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger per aggiornare updated_at
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
    
  DROP TRIGGER IF EXISTS trigger_suppliers_updated_at ON suppliers;
  CREATE TRIGGER trigger_suppliers_updated_at
    BEFORE UPDATE ON suppliers
    FOR EACH ROW
    EXECUTE FUNCTION update_warehouse_updated_at();
    
  DROP TRIGGER IF EXISTS trigger_purchase_orders_updated_at ON purchase_orders;
  CREATE TRIGGER trigger_purchase_orders_updated_at
    BEFORE UPDATE ON purchase_orders
    FOR EACH ROW
    EXECUTE FUNCTION update_warehouse_updated_at();
END $$;

-- Trigger per auto-generare numero ordine
CREATE OR REPLACE FUNCTION generate_purchase_order_number()
RETURNS VARCHAR(50) AS $$
DECLARE
  year_part VARCHAR(4);
  count_part INTEGER;
  new_number VARCHAR(50);
BEGIN
  year_part := TO_CHAR(NOW(), 'YYYY');
  
  SELECT COUNT(*) + 1 INTO count_part
  FROM purchase_orders
  WHERE order_number LIKE 'PO-' || year_part || '-%';
  
  new_number := 'PO-' || year_part || '-' || LPAD(count_part::TEXT, 4, '0');
  
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_purchase_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := generate_purchase_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  DROP TRIGGER IF EXISTS trigger_set_purchase_order_number ON purchase_orders;
  CREATE TRIGGER trigger_set_purchase_order_number
    BEFORE INSERT ON purchase_orders
    FOR EACH ROW
    EXECUTE FUNCTION set_purchase_order_number();
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
ALTER TABLE warehouse_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouse_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouse_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_order_items ENABLE ROW LEVEL SECURITY;

-- Policy: Tutti possono accedere (per ora)
DO $$
BEGIN
  DROP POLICY IF EXISTS "Allow all operations on warehouse_categories" ON warehouse_categories;
  CREATE POLICY "Allow all operations on warehouse_categories"
    ON warehouse_categories FOR ALL USING (true) WITH CHECK (true);
    
  DROP POLICY IF EXISTS "Allow all operations on warehouse_items" ON warehouse_items;
  CREATE POLICY "Allow all operations on warehouse_items"
    ON warehouse_items FOR ALL USING (true) WITH CHECK (true);
    
  DROP POLICY IF EXISTS "Allow all operations on warehouse_movements" ON warehouse_movements;
  CREATE POLICY "Allow all operations on warehouse_movements"
    ON warehouse_movements FOR ALL USING (true) WITH CHECK (true);
    
  DROP POLICY IF EXISTS "Allow all operations on suppliers" ON suppliers;
  CREATE POLICY "Allow all operations on suppliers"
    ON suppliers FOR ALL USING (true) WITH CHECK (true);
    
  DROP POLICY IF EXISTS "Allow all operations on item_suppliers" ON item_suppliers;
  CREATE POLICY "Allow all operations on item_suppliers"
    ON item_suppliers FOR ALL USING (true) WITH CHECK (true);
    
  DROP POLICY IF EXISTS "Allow all operations on purchase_orders" ON purchase_orders;
  CREATE POLICY "Allow all operations on purchase_orders"
    ON purchase_orders FOR ALL USING (true) WITH CHECK (true);
    
  DROP POLICY IF EXISTS "Allow all operations on purchase_order_items" ON purchase_order_items;
  CREATE POLICY "Allow all operations on purchase_order_items"
    ON purchase_order_items FOR ALL USING (true) WITH CHECK (true);
END $$;

-- =====================================================
-- COMMENTI
-- =====================================================
COMMENT ON TABLE warehouse_categories IS 'Categorie prodotti magazzino';
COMMENT ON TABLE warehouse_items IS 'Articoli in magazzino';
COMMENT ON TABLE warehouse_movements IS 'Movimenti di magazzino (carico/scarico)';
COMMENT ON TABLE suppliers IS 'Fornitori';
COMMENT ON TABLE item_suppliers IS 'Relazione articoli-fornitori';
COMMENT ON TABLE purchase_orders IS 'Ordini di acquisto dai fornitori';
COMMENT ON TABLE purchase_order_items IS 'Righe ordini di acquisto';

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
*/

-- =====================================================
-- FINE SCRIPT
-- =====================================================
