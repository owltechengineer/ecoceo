-- =====================================================
-- SEZIONE FINANZIARIA - TABELLE E DATI
-- =====================================================
-- Gestione completa delle finanze aziendali
-- =====================================================

-- Dipartimenti Finanziari
CREATE TABLE IF NOT EXISTS financial_departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    budget_allocated DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Entrate
CREATE TABLE IF NOT EXISTS financial_revenues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name VARCHAR(255) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    category VARCHAR(100),
    date DATE NOT NULL,
    description TEXT,
    payment_method VARCHAR(50),
    is_received BOOLEAN DEFAULT false,
    department_id UUID REFERENCES financial_departments(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Costi Fissi
CREATE TABLE IF NOT EXISTS financial_fixed_costs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    category VARCHAR(100),
    start_date DATE NOT NULL,
    end_date DATE,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    department_id UUID REFERENCES financial_departments(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Costi Variabili
CREATE TABLE IF NOT EXISTS financial_variable_costs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    category VARCHAR(100),
    date DATE NOT NULL,
    description TEXT,
    vendor VARCHAR(255),
    is_paid BOOLEAN DEFAULT false,
    department_id UUID REFERENCES financial_departments(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Budget
CREATE TABLE IF NOT EXISTS financial_budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    category VARCHAR(100),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    description TEXT,
    department_id UUID REFERENCES financial_departments(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger per updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_financial_departments_updated_at BEFORE UPDATE ON financial_departments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_financial_revenues_updated_at BEFORE UPDATE ON financial_revenues FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_financial_fixed_costs_updated_at BEFORE UPDATE ON financial_fixed_costs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_financial_variable_costs_updated_at BEFORE UPDATE ON financial_variable_costs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_financial_budgets_updated_at BEFORE UPDATE ON financial_budgets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS Policy
ALTER TABLE financial_departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_revenues ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_fixed_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_variable_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_budgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations for now" ON financial_departments FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON financial_revenues FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON financial_fixed_costs FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON financial_variable_costs FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON financial_budgets FOR ALL USING (true);

-- Dati di esempio
INSERT INTO financial_departments (name, description, budget_allocated) VALUES
('Marketing', 'Dipartimento Marketing e Comunicazione', 50000.00),
('Vendite', 'Dipartimento Vendite e Clienti', 75000.00),
('Sviluppo', 'Dipartimento Sviluppo e R&D', 100000.00),
('Amministrazione', 'Dipartimento Amministrativo', 30000.00)
ON CONFLICT DO NOTHING;
