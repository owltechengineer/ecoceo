-- =====================================================
-- 🎯 MASTER DATABASE SETUP - Sistema Completo
-- =====================================================
-- ESEGUI QUESTO SCRIPT PER CREARE TUTTE LE TABELLE
-- Include: Dashboard, Marketing, Progetti, Finanza, Magazzino, Preventivi
-- Data: 2025-10-01
-- =====================================================

-- =====================================================
-- PARTE 1: TABELLE BASE
-- =====================================================

-- Dashboard Data (dati generici)
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
-- PARTE 2: MARKETING
-- =====================================================

-- Campagne Marketing
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  budget DECIMAL(10, 2) DEFAULT 0,
  spent DECIMAL(10, 2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active',
  start_date DATE,
  end_date DATE,
  platform VARCHAR(100),
  target_audience TEXT,
  conversions INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);

-- Lead (Potenziali Clienti)
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  company VARCHAR(255),
  position VARCHAR(100),
  source VARCHAR(100),
  status VARCHAR(50) DEFAULT 'new',
  priority VARCHAR(20) DEFAULT 'medium',
  estimated_value DECIMAL(10, 2) DEFAULT 0,
  notes TEXT,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_priority ON leads(priority);

-- =====================================================
-- PARTE 3: PROGETTI E TASK
-- =====================================================

-- Progetti
CREATE TABLE IF NOT EXISTS task_calendar_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'planning',
  priority VARCHAR(20) DEFAULT 'medium',
  start_date DATE,
  end_date DATE,
  budget DECIMAL(10, 2) DEFAULT 0,
  actual_cost DECIMAL(10, 2) DEFAULT 0,
  expected_revenue DECIMAL(10, 2) DEFAULT 0,
  actual_revenue DECIMAL(10, 2) DEFAULT 0,
  progress INTEGER DEFAULT 0,
  client VARCHAR(255),
  team_members TEXT[],
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_status ON task_calendar_projects(status);

-- Task
CREATE TABLE IF NOT EXISTS task_calendar_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  priority VARCHAR(20) DEFAULT 'medium',
  due_date DATE,
  completed_at TIMESTAMP WITH TIME ZONE,
  assigned_to VARCHAR(255),
  project_id UUID REFERENCES task_calendar_projects(id) ON DELETE CASCADE,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_status ON task_calendar_tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON task_calendar_tasks(due_date);

-- Appuntamenti
CREATE TABLE IF NOT EXISTS task_calendar_appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  location VARCHAR(255),
  participants TEXT[],
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_appointments_start_time ON task_calendar_appointments(start_time);

-- Attività Ricorrenti
CREATE TABLE IF NOT EXISTS recurring_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  frequency VARCHAR(50) NOT NULL,
  day_of_week INTEGER,
  day_of_month INTEGER,
  start_date DATE NOT NULL,
  end_date DATE,
  time TIME,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_recurring_activities_active ON recurring_activities(is_active);

-- =====================================================
-- PARTE 4: FINANZA
-- =====================================================

-- Costi Fissi
CREATE TABLE IF NOT EXISTS financial_fixed_costs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100),
  start_date DATE NOT NULL,
  end_date DATE,
  is_paid BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Costi Variabili
CREATE TABLE IF NOT EXISTS financial_variable_costs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100),
  date DATE NOT NULL,
  vendor VARCHAR(255),
  is_paid BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Entrate
CREATE TABLE IF NOT EXISTS financial_revenues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100),
  date DATE NOT NULL,
  source VARCHAR(255),
  is_received BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Budget
CREATE TABLE IF NOT EXISTS financial_budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  spent DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dipartimenti Finanziari
CREATE TABLE IF NOT EXISTS financial_departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  budget DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- PARTE 5: MAGAZZINO
-- =====================================================

-- Categorie Magazzino
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

INSERT INTO warehouse_categories (name, description, icon, color, sort_order)
VALUES 
  ('Elettronica', 'Dispositivi elettronici', '💻', '#3b82f6', 1),
  ('Accessori', 'Accessori e periferiche', '🖱️', '#8b5cf6', 2),
  ('Software', 'Licenze software', '💾', '#06b6d4', 3),
  ('Servizi', 'Servizi e consulenze', '⚙️', '#10b981', 4)
ON CONFLICT (name) DO NOTHING;

-- Articoli Magazzino
CREATE TABLE IF NOT EXISTS warehouse_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category_id UUID REFERENCES warehouse_categories(id) ON DELETE SET NULL,
  purchase_price DECIMAL(10, 2) DEFAULT 0,
  sale_price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  unit VARCHAR(20) DEFAULT 'pz',
  min_stock INTEGER DEFAULT 0,
  max_stock INTEGER DEFAULT 0,
  location VARCHAR(100),
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_warehouse_items_sku ON warehouse_items(sku);

-- Movimenti Magazzino
CREATE TABLE IF NOT EXISTS warehouse_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID REFERENCES warehouse_items(id) ON DELETE CASCADE,
  movement_type VARCHAR(20) NOT NULL,
  quantity INTEGER NOT NULL,
  reference_type VARCHAR(50),
  reference_id UUID,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- PARTE 6: PREVENTIVI
-- =====================================================

-- Preventivi
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
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Articoli Preventivi
CREATE TABLE IF NOT EXISTS quote_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE,
  item_id VARCHAR(50),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Impostazioni Preventivi
CREATE TABLE IF NOT EXISTS quote_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name VARCHAR(255) DEFAULT '',
  company_address VARCHAR(255) DEFAULT '',
  company_city VARCHAR(100) DEFAULT '',
  company_zip VARCHAR(20) DEFAULT '',
  company_country VARCHAR(100) DEFAULT 'Italia',
  company_phone VARCHAR(50) DEFAULT '',
  company_email VARCHAR(255) DEFAULT '',
  company_website VARCHAR(255) DEFAULT '',
  company_logo_url TEXT,
  vat_number VARCHAR(50) DEFAULT '',
  tax_code VARCHAR(50) DEFAULT '',
  pec VARCHAR(255) DEFAULT '',
  sdi_code VARCHAR(7) DEFAULT '',
  bank_name VARCHAR(255) DEFAULT '',
  iban VARCHAR(50) DEFAULT '',
  swift VARCHAR(20) DEFAULT '',
  footer_text TEXT DEFAULT '',
  terms_and_conditions TEXT DEFAULT '',
  legal_note TEXT DEFAULT '',
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

-- =====================================================
-- PARTE 7: QUICK TASKS
-- =====================================================

CREATE TABLE IF NOT EXISTS quick_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  stakeholder VARCHAR(255),
  priority VARCHAR(20) DEFAULT 'medium',
  status VARCHAR(50) DEFAULT 'pending',
  due_date DATE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quick_tasks_status ON quick_tasks(status);
CREATE INDEX IF NOT EXISTS idx_quick_tasks_type ON quick_tasks(type);

-- =====================================================
-- TRIGGERS
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables
DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN 
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN (
      'dashboard_data', 'campaigns', 'leads', 
      'task_calendar_projects', 'task_calendar_tasks', 
      'task_calendar_appointments', 'financial_fixed_costs',
      'financial_variable_costs', 'financial_revenues',
      'financial_budgets', 'recurring_activities',
      'warehouse_items', 'warehouse_categories',
      'quotes', 'quote_settings', 'quick_tasks'
    )
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS update_%I_updated_at ON %I', t, t);
    EXECUTE format('
      CREATE TRIGGER update_%I_updated_at
      BEFORE UPDATE ON %I
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column()
    ', t, t);
  END LOOP;
END $$;

-- Auto-numerazione preventivi
CREATE OR REPLACE FUNCTION generate_quote_number()
RETURNS VARCHAR(50) AS $$
DECLARE
  year_part VARCHAR(4);
  count_part INTEGER;
BEGIN
  year_part := TO_CHAR(NOW(), 'YYYY');
  SELECT COUNT(*) + 1 INTO count_part
  FROM quotes
  WHERE quote_number LIKE 'QT-' || year_part || '-%';
  RETURN 'QT-' || year_part || '-' || LPAD(count_part::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

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

-- =====================================================
-- RLS POLICIES (Allow All per Testing)
-- =====================================================

DO $$
DECLARE
  t TEXT;
BEGIN
  -- Enable RLS on all tables
  FOR t IN 
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN (
      'dashboard_data', 'campaigns', 'leads', 
      'task_calendar_projects', 'task_calendar_tasks', 
      'task_calendar_appointments', 'financial_fixed_costs',
      'financial_variable_costs', 'financial_revenues',
      'financial_budgets', 'financial_departments',
      'recurring_activities', 'warehouse_items', 
      'warehouse_categories', 'warehouse_movements',
      'quotes', 'quote_items', 'quote_settings', 'quick_tasks'
    )
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('DROP POLICY IF EXISTS "Allow all on %I" ON %I', t, t);
    EXECUTE format('
      CREATE POLICY "Allow all on %I"
      ON %I FOR ALL
      USING (true) WITH CHECK (true)
    ', t, t);
  END LOOP;
END $$;

-- =====================================================
-- VERIFICA FINALE
-- =====================================================

DO $$
DECLARE
  table_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO table_count
  FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name IN (
    'dashboard_data', 'campaigns', 'leads',
    'task_calendar_projects', 'task_calendar_tasks',
    'task_calendar_appointments', 'financial_fixed_costs',
    'financial_variable_costs', 'financial_revenues',
    'financial_budgets', 'financial_departments',
    'recurring_activities', 'warehouse_items',
    'warehouse_categories', 'warehouse_movements',
    'quotes', 'quote_items', 'quote_settings', 'quick_tasks'
  );
  
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ SETUP COMPLETATO CON SUCCESSO!';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Tabelle create: %', table_count;
  RAISE NOTICE '';
  RAISE NOTICE '📊 MARKETING:';
  RAISE NOTICE '  - campaigns (%)' , (SELECT COUNT(*) FROM campaigns);
  RAISE NOTICE '  - leads (%)' , (SELECT COUNT(*) FROM leads);
  RAISE NOTICE '';
  RAISE NOTICE '📋 PROGETTI & TASK:';
  RAISE NOTICE '  - task_calendar_projects';
  RAISE NOTICE '  - task_calendar_tasks';
  RAISE NOTICE '  - task_calendar_appointments';
  RAISE NOTICE '  - recurring_activities';
  RAISE NOTICE '  - quick_tasks';
  RAISE NOTICE '';
  RAISE NOTICE '💰 FINANZA:';
  RAISE NOTICE '  - financial_fixed_costs';
  RAISE NOTICE '  - financial_variable_costs';
  RAISE NOTICE '  - financial_revenues';
  RAISE NOTICE '  - financial_budgets';
  RAISE NOTICE '  - financial_departments';
  RAISE NOTICE '';
  RAISE NOTICE '📦 MAGAZZINO:';
  RAISE NOTICE '  - warehouse_categories (%)' , (SELECT COUNT(*) FROM warehouse_categories);
  RAISE NOTICE '  - warehouse_items';
  RAISE NOTICE '  - warehouse_movements';
  RAISE NOTICE '';
  RAISE NOTICE '📄 PREVENTIVI:';
  RAISE NOTICE '  - quotes';
  RAISE NOTICE '  - quote_items';
  RAISE NOTICE '  - quote_settings';
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '🎉 Sistema pronto per l''uso!';
  RAISE NOTICE '========================================';
END $$;

-- =====================================================
-- FINE SCRIPT
-- =====================================================
