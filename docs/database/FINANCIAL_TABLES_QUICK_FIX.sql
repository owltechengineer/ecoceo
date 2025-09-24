-- =====================================================
-- FINANCIAL TABLES QUICK FIX
-- Script veloce per creare tabelle finanziarie mancanti
-- =====================================================

-- Funzione per aggiornare updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Tabella Settori Aziendali
CREATE TABLE IF NOT EXISTS financial_departments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    budget_limit DECIMAL(12,2),
    manager TEXT,
    color TEXT DEFAULT '#3B82F6',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella Costi Fissi
CREATE TABLE IF NOT EXISTS financial_fixed_costs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    amount DECIMAL(12,2) NOT NULL,
    frequency TEXT DEFAULT 'monthly' CHECK (frequency IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')),
    category TEXT DEFAULT 'general' CHECK (category IN ('office', 'software', 'marketing', 'personnel', 'utilities', 'insurance', 'legal', 'other')),
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    next_payment_date TIMESTAMP WITH TIME ZONE,
    payment_day INTEGER CHECK (payment_day >= 1 AND payment_day <= 31),
    is_active BOOLEAN DEFAULT TRUE,
    auto_generate BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella Costi Variabili
CREATE TABLE IF NOT EXISTS financial_variable_costs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    amount DECIMAL(12,2) NOT NULL,
    category TEXT DEFAULT 'general' CHECK (category IN ('marketing', 'travel', 'materials', 'services', 'equipment', 'training', 'other')),
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    vendor TEXT,
    payment_method TEXT CHECK (payment_method IN ('cash', 'card', 'transfer', 'check', 'other')),
    is_paid BOOLEAN DEFAULT FALSE,
    payment_date TIMESTAMP WITH TIME ZONE,
    receipt_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella Budget
CREATE TABLE IF NOT EXISTS financial_budgets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    amount DECIMAL(12,2) NOT NULL,
    period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    category TEXT DEFAULT 'general' CHECK (category IN ('revenue', 'expense', 'investment', 'operational', 'marketing', 'personnel', 'other')),
    department_id UUID REFERENCES financial_departments(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella Ricavi
CREATE TABLE IF NOT EXISTS financial_revenues (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    amount DECIMAL(12,2) NOT NULL,
    source TEXT DEFAULT 'sales' CHECK (source IN ('sales', 'services', 'subscriptions', 'investments', 'grants', 'other')),
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    client TEXT,
    payment_method TEXT CHECK (payment_method IN ('cash', 'card', 'transfer', 'check', 'other')),
    is_received BOOLEAN DEFAULT FALSE,
    received_date TIMESTAMP WITH TIME ZONE,
    invoice_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella distribuzione costi
CREATE TABLE IF NOT EXISTS financial_cost_distributions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    cost_id UUID NOT NULL,
    cost_type TEXT NOT NULL CHECK (cost_type IN ('fixed', 'variable')),
    department_id UUID REFERENCES financial_departments(id) ON DELETE CASCADE,
    amount DECIMAL(12,2) NOT NULL,
    percentage DECIMAL(5,2) NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(cost_id, cost_type, department_id)
);

-- Abilita RLS su tutte le tabelle
ALTER TABLE financial_departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_cost_distributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_fixed_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_variable_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_revenues ENABLE ROW LEVEL SECURITY;

-- Policy permissive per sviluppo (elimina prima conflitti)
DROP POLICY IF EXISTS "Allow all operations for now" ON financial_departments;
DROP POLICY IF EXISTS "financial_departments_allow_all" ON financial_departments;
CREATE POLICY "financial_departments_allow_all" ON financial_departments FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all operations for now" ON financial_cost_distributions;
DROP POLICY IF EXISTS "financial_cost_distributions_allow_all" ON financial_cost_distributions;
CREATE POLICY "financial_cost_distributions_allow_all" ON financial_cost_distributions FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all operations for now" ON financial_fixed_costs;
DROP POLICY IF EXISTS "financial_fixed_costs_allow_all" ON financial_fixed_costs;
CREATE POLICY "financial_fixed_costs_allow_all" ON financial_fixed_costs FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all operations for now" ON financial_variable_costs;
DROP POLICY IF EXISTS "financial_variable_costs_allow_all" ON financial_variable_costs;
CREATE POLICY "financial_variable_costs_allow_all" ON financial_variable_costs FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all operations for now" ON financial_budgets;
DROP POLICY IF EXISTS "financial_budgets_allow_all" ON financial_budgets;
CREATE POLICY "financial_budgets_allow_all" ON financial_budgets FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all operations for now" ON financial_revenues;
DROP POLICY IF EXISTS "financial_revenues_allow_all" ON financial_revenues;
CREATE POLICY "financial_revenues_allow_all" ON financial_revenues FOR ALL USING (true);

-- Trigger per updated_at
DROP TRIGGER IF EXISTS update_financial_departments_updated_at ON financial_departments;
CREATE TRIGGER update_financial_departments_updated_at 
    BEFORE UPDATE ON financial_departments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_financial_cost_distributions_updated_at ON financial_cost_distributions;
CREATE TRIGGER update_financial_cost_distributions_updated_at 
    BEFORE UPDATE ON financial_cost_distributions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_financial_fixed_costs_updated_at ON financial_fixed_costs;
CREATE TRIGGER update_financial_fixed_costs_updated_at 
    BEFORE UPDATE ON financial_fixed_costs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_financial_variable_costs_updated_at ON financial_variable_costs;
CREATE TRIGGER update_financial_variable_costs_updated_at 
    BEFORE UPDATE ON financial_variable_costs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_financial_budgets_updated_at ON financial_budgets;
CREATE TRIGGER update_financial_budgets_updated_at 
    BEFORE UPDATE ON financial_budgets 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_financial_revenues_updated_at ON financial_revenues;
CREATE TRIGGER update_financial_revenues_updated_at 
    BEFORE UPDATE ON financial_revenues 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indici per performance
CREATE INDEX IF NOT EXISTS idx_financial_departments_user_id ON financial_departments(user_id);
CREATE INDEX IF NOT EXISTS idx_financial_cost_distributions_cost_id ON financial_cost_distributions(cost_id);
CREATE INDEX IF NOT EXISTS idx_financial_cost_distributions_department_id ON financial_cost_distributions(department_id);
CREATE INDEX IF NOT EXISTS idx_financial_fixed_costs_user_id ON financial_fixed_costs(user_id);
CREATE INDEX IF NOT EXISTS idx_financial_fixed_costs_next_payment_date ON financial_fixed_costs(next_payment_date);
CREATE INDEX IF NOT EXISTS idx_financial_variable_costs_user_id ON financial_variable_costs(user_id);
CREATE INDEX IF NOT EXISTS idx_financial_variable_costs_date ON financial_variable_costs(date);
CREATE INDEX IF NOT EXISTS idx_financial_budgets_user_id ON financial_budgets(user_id);
CREATE INDEX IF NOT EXISTS idx_financial_budgets_period ON financial_budgets(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_financial_revenues_user_id ON financial_revenues(user_id);
CREATE INDEX IF NOT EXISTS idx_financial_revenues_date ON financial_revenues(date);
