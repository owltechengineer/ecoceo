-- =====================================================
-- 🎯 ESSENTIAL DATABASE SETUP
-- =====================================================
-- Script minimalista con SOLO le tabelle essenziali
-- Esegui questo per setup veloce
-- =====================================================

-- =====================================================
-- MARKETING
-- =====================================================

CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  budget DECIMAL(10, 2) DEFAULT 0,
  spent DECIMAL(10, 2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active',
  start_date DATE,
  end_date DATE,
  conversions INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  company VARCHAR(255),
  status VARCHAR(50) DEFAULT 'new',
  priority VARCHAR(20) DEFAULT 'medium',
  estimated_value DECIMAL(10, 2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- PROGETTI E TASK
-- =====================================================

CREATE TABLE IF NOT EXISTS task_calendar_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'active',
  priority VARCHAR(20) DEFAULT 'medium',
  start_date DATE,
  end_date DATE,
  budget DECIMAL(10, 2) DEFAULT 0,
  progress INTEGER DEFAULT 0,
  user_id VARCHAR(255) DEFAULT 'default-user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS task_calendar_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  priority VARCHAR(20) DEFAULT 'medium',
  due_date DATE,
  assigned_to VARCHAR(255),
  project_id UUID REFERENCES task_calendar_projects(id) ON DELETE CASCADE,
  user_id VARCHAR(255) DEFAULT 'default-user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS task_calendar_appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  user_id VARCHAR(255) DEFAULT 'default-user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS recurring_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  frequency VARCHAR(50) NOT NULL,
  start_date DATE NOT NULL,
  time TIME,
  is_active BOOLEAN DEFAULT true,
  user_id VARCHAR(255) DEFAULT 'default-user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quick_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  stakeholder VARCHAR(255),
  priority VARCHAR(20) DEFAULT 'medium',
  status VARCHAR(50) DEFAULT 'pending',
  completed_at TIMESTAMP WITH TIME ZONE,
  user_id VARCHAR(255) DEFAULT 'default-user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- FINANZA
-- =====================================================

CREATE TABLE IF NOT EXISTS financial_fixed_costs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100),
  start_date DATE NOT NULL,
  end_date DATE,
  is_paid BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS financial_variable_costs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100),
  date DATE NOT NULL,
  vendor VARCHAR(255),
  is_paid BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS financial_revenues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100),
  date DATE NOT NULL,
  source VARCHAR(255),
  is_received BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS financial_budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- MAGAZZINO
-- =====================================================

CREATE TABLE IF NOT EXISTS warehouse_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  icon VARCHAR(50),
  color VARCHAR(20)
);

INSERT INTO warehouse_categories (name, icon, color)
VALUES 
  ('Elettronica', '💻', '#3b82f6'),
  ('Accessori', '🖱️', '#8b5cf6'),
  ('Software', '💾', '#06b6d4'),
  ('Servizi', '⚙️', '#10b981')
ON CONFLICT (name) DO NOTHING;

CREATE TABLE IF NOT EXISTS warehouse_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category_id UUID REFERENCES warehouse_categories(id) ON DELETE SET NULL,
  sale_price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER DEFAULT 0,
  unit VARCHAR(20) DEFAULT 'pz',
  min_stock INTEGER DEFAULT 0,
  location VARCHAR(100),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- PREVENTIVI
-- =====================================================

CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_number VARCHAR(50) UNIQUE NOT NULL,
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255),
  client_address TEXT,
  language VARCHAR(10) DEFAULT 'it',
  subtotal DECIMAL(10, 2) DEFAULT 0,
  tax DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) DEFAULT 0,
  valid_until DATE,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quote_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  quantity INTEGER DEFAULT 1,
  unit_price DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS quote_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name VARCHAR(255) DEFAULT '',
  company_address VARCHAR(255) DEFAULT '',
  company_city VARCHAR(100) DEFAULT '',
  company_zip VARCHAR(20) DEFAULT '',
  company_phone VARCHAR(50) DEFAULT '',
  company_email VARCHAR(255) DEFAULT '',
  company_website VARCHAR(255) DEFAULT '',
  company_logo_url TEXT,
  vat_number VARCHAR(50) DEFAULT '',
  tax_code VARCHAR(50) DEFAULT '',
  pec VARCHAR(255) DEFAULT '',
  sdi_code VARCHAR(7) DEFAULT '',
  iban VARCHAR(50) DEFAULT '',
  bank_name VARCHAR(255) DEFAULT '',
  primary_color VARCHAR(7) DEFAULT '#2563eb',
  secondary_color VARCHAR(7) DEFAULT '#16a34a',
  footer_text TEXT DEFAULT '',
  show_logo BOOLEAN DEFAULT true,
  show_footer BOOLEAN DEFAULT true,
  show_bank_details BOOLEAN DEFAULT true,
  default_validity_days INTEGER DEFAULT 30,
  UNIQUE(user_id)
);

-- =====================================================
-- TRIGGERS ESSENZIALI
-- =====================================================

-- Auto-numerazione preventivi
CREATE OR REPLACE FUNCTION generate_quote_number()
RETURNS VARCHAR(50) AS $$
BEGIN
  RETURN 'QT-' || TO_CHAR(NOW(), 'YYYY') || '-' || 
    LPAD((SELECT COUNT(*) + 1 FROM quotes)::TEXT, 4, '0');
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

DROP TRIGGER IF EXISTS trigger_set_quote_number ON quotes;
CREATE TRIGGER trigger_set_quote_number
  BEFORE INSERT ON quotes
  FOR EACH ROW
  EXECUTE FUNCTION set_quote_number();

-- =====================================================
-- RLS POLICIES (Allow All)
-- =====================================================

ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_calendar_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_calendar_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_calendar_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE quick_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_fixed_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_variable_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_revenues ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouse_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouse_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_settings ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE
  tables TEXT[] := ARRAY[
    'campaigns', 'leads', 'task_calendar_projects', 'task_calendar_tasks',
    'task_calendar_appointments', 'recurring_activities', 'quick_tasks',
    'financial_fixed_costs', 'financial_variable_costs', 'financial_revenues',
    'financial_budgets', 'warehouse_categories', 'warehouse_items',
    'quotes', 'quote_items', 'quote_settings'
  ];
  t TEXT;
BEGIN
  FOREACH t IN ARRAY tables LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Allow all on %I" ON %I', t, t);
    EXECUTE format('
      CREATE POLICY "Allow all on %I" ON %I 
      FOR ALL USING (true) WITH CHECK (true)
    ', t, t);
  END LOOP;
END $$;

-- Notifica refresh schema
NOTIFY pgrst, 'reload schema';

-- =====================================================
-- FINE - Sistema Pronto! 🎉
-- =====================================================
