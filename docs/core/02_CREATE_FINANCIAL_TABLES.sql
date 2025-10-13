-- =====================================================
-- CORREZIONI COMPLETE SEZIONE FINANZIARIA
-- =====================================================
-- Questo script risolve tutti i problemi identificati:
-- 1. Colonna department_id mancante nelle tabelle finanziarie
-- 2. Funzione get_cost_distribution mancante
-- 3. Tabelle mancanti per la gestione finanziaria completa
-- 4. Colonne aggiuntive mancanti
-- =====================================================

-- 1. CREA TABELLA DEPARTMENTS (se non esiste)
-- =====================================================
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    budget_limit DECIMAL(15,2),
    manager VARCHAR(255),
    color VARCHAR(7) DEFAULT '#3B82F6',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CREA TABELLA FINANCIAL_BUDGETS (se non esiste)
-- =====================================================
CREATE TABLE IF NOT EXISTS financial_budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    planned_amount DECIMAL(15,2) NOT NULL,
    actual_amount DECIMAL(15,2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'EUR',
    period VARCHAR(20) NOT NULL,
    category VARCHAR(100),
    department_id UUID REFERENCES departments(id),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled', 'on-hold')),
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Aggiungi colonne mancanti a financial_budgets se la tabella esiste già
DO $$ 
BEGIN
    -- Aggiungi period se mancante
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'financial_budgets' AND column_name = 'period') THEN
        ALTER TABLE financial_budgets ADD COLUMN period VARCHAR(20) DEFAULT '2024';
    END IF;
    
    -- Aggiungi currency se mancante
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'financial_budgets' AND column_name = 'currency') THEN
        ALTER TABLE financial_budgets ADD COLUMN currency VARCHAR(3) DEFAULT 'EUR';
    END IF;
    
    -- Aggiungi category se mancante
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'financial_budgets' AND column_name = 'category') THEN
        ALTER TABLE financial_budgets ADD COLUMN category VARCHAR(100);
    END IF;
    
    -- Aggiungi department_id se mancante
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'financial_budgets' AND column_name = 'department_id') THEN
        ALTER TABLE financial_budgets ADD COLUMN department_id UUID REFERENCES departments(id);
    END IF;
    
    -- Aggiungi status se mancante
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'financial_budgets' AND column_name = 'status') THEN
        ALTER TABLE financial_budgets ADD COLUMN status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled', 'on-hold'));
    END IF;
    
    -- Aggiungi start_date se mancante
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'financial_budgets' AND column_name = 'start_date') THEN
        ALTER TABLE financial_budgets ADD COLUMN start_date DATE;
    END IF;
    
    -- Aggiungi end_date se mancante
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'financial_budgets' AND column_name = 'end_date') THEN
        ALTER TABLE financial_budgets ADD COLUMN end_date DATE;
    END IF;
    
    -- Aggiungi description se mancante
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'financial_budgets' AND column_name = 'description') THEN
        ALTER TABLE financial_budgets ADD COLUMN description TEXT;
    END IF;
    
    -- Aggiungi planned_amount se mancante
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'financial_budgets' AND column_name = 'planned_amount') THEN
        ALTER TABLE financial_budgets ADD COLUMN planned_amount DECIMAL(15,2) DEFAULT 0;
    END IF;
    
    -- Aggiungi actual_amount se mancante
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'financial_budgets' AND column_name = 'actual_amount') THEN
        ALTER TABLE financial_budgets ADD COLUMN actual_amount DECIMAL(15,2) DEFAULT 0;
    END IF;
END $$;

-- 3. CREA TABELLA FINANCIAL_COST_DISTRIBUTIONS
-- =====================================================
CREATE TABLE IF NOT EXISTS financial_cost_distributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    cost_id UUID NOT NULL,
    cost_type VARCHAR(50) NOT NULL CHECK (cost_type IN ('fixed', 'variable')),
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    percentage DECIMAL(5,2) NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. AGGIUNGI COLONNE MANCANTI ALLE TABELLE ESISTENTI
-- =====================================================

-- Aggiungi colonne a financial_fixed_costs
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'financial_fixed_costs' AND column_name = 'department_id') THEN
        ALTER TABLE financial_fixed_costs ADD COLUMN department_id UUID REFERENCES departments(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'financial_fixed_costs' AND column_name = 'currency') THEN
        ALTER TABLE financial_fixed_costs ADD COLUMN currency VARCHAR(3) DEFAULT 'EUR';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'financial_fixed_costs' AND column_name = 'frequency') THEN
        ALTER TABLE financial_fixed_costs ADD COLUMN frequency VARCHAR(20) DEFAULT 'monthly' CHECK (frequency IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'one-time'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'financial_fixed_costs' AND column_name = 'start_date') THEN
        ALTER TABLE financial_fixed_costs ADD COLUMN start_date DATE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'financial_fixed_costs' AND column_name = 'end_date') THEN
        ALTER TABLE financial_fixed_costs ADD COLUMN end_date DATE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'financial_fixed_costs' AND column_name = 'is_active') THEN
        ALTER TABLE financial_fixed_costs ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'financial_fixed_costs' AND column_name = 'vendor') THEN
        ALTER TABLE financial_fixed_costs ADD COLUMN vendor VARCHAR(255);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'financial_fixed_costs' AND column_name = 'payment_method') THEN
        ALTER TABLE financial_fixed_costs ADD COLUMN payment_method VARCHAR(50);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'financial_fixed_costs' AND column_name = 'invoice_number') THEN
        ALTER TABLE financial_fixed_costs ADD COLUMN invoice_number VARCHAR(100);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'financial_fixed_costs' AND column_name = 'payment_day') THEN
        ALTER TABLE financial_fixed_costs ADD COLUMN payment_day INTEGER CHECK (payment_day >= 1 AND payment_day <= 31);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'financial_fixed_costs' AND column_name = 'auto_generate') THEN
        ALTER TABLE financial_fixed_costs ADD COLUMN auto_generate BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- Aggiungi colonne a financial_variable_costs
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'financial_variable_costs' AND column_name = 'department_id') THEN
        ALTER TABLE financial_variable_costs ADD COLUMN department_id UUID REFERENCES departments(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'financial_variable_costs' AND column_name = 'currency') THEN
        ALTER TABLE financial_variable_costs ADD COLUMN currency VARCHAR(3) DEFAULT 'EUR';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'financial_variable_costs' AND column_name = 'vendor') THEN
        ALTER TABLE financial_variable_costs ADD COLUMN vendor VARCHAR(255);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'financial_variable_costs' AND column_name = 'payment_method') THEN
        ALTER TABLE financial_variable_costs ADD COLUMN payment_method VARCHAR(50);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'financial_variable_costs' AND column_name = 'invoice_number') THEN
        ALTER TABLE financial_variable_costs ADD COLUMN invoice_number VARCHAR(100);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'financial_variable_costs' AND column_name = 'is_paid') THEN
        ALTER TABLE financial_variable_costs ADD COLUMN is_paid BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- Aggiungi colonne a financial_revenues
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'financial_revenues' AND column_name = 'department_id') THEN
        ALTER TABLE financial_revenues ADD COLUMN department_id UUID REFERENCES departments(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'financial_revenues' AND column_name = 'currency') THEN
        ALTER TABLE financial_revenues ADD COLUMN currency VARCHAR(3) DEFAULT 'EUR';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'financial_revenues' AND column_name = 'client') THEN
        ALTER TABLE financial_revenues ADD COLUMN client VARCHAR(255);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'financial_revenues' AND column_name = 'payment_method') THEN
        ALTER TABLE financial_revenues ADD COLUMN payment_method VARCHAR(50);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'financial_revenues' AND column_name = 'invoice_number') THEN
        ALTER TABLE financial_revenues ADD COLUMN invoice_number VARCHAR(100);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'financial_revenues' AND column_name = 'is_received') THEN
        ALTER TABLE financial_revenues ADD COLUMN is_received BOOLEAN DEFAULT FALSE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'financial_revenues' AND column_name = 'status') THEN
        ALTER TABLE financial_revenues ADD COLUMN status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'received', 'overdue', 'cancelled'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'financial_revenues' AND column_name = 'received_date') THEN
        ALTER TABLE financial_revenues ADD COLUMN received_date DATE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'financial_revenues' AND column_name = 'source') THEN
        ALTER TABLE financial_revenues ADD COLUMN source VARCHAR(100);
    END IF;
END $$;

-- 5. CREA FUNZIONE get_cost_distribution
-- =====================================================
CREATE OR REPLACE FUNCTION get_cost_distribution(
    p_cost_id UUID,
    p_cost_type VARCHAR(50)
)
RETURNS TABLE (
    id UUID,
    cost_id UUID,
    cost_type VARCHAR(50),
    department_id UUID,
    department_name VARCHAR(255),
    department_color VARCHAR(7),
    percentage DECIMAL(5,2),
    amount DECIMAL(15,2),
    currency VARCHAR(3),
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cd.id,
        cd.cost_id,
        cd.cost_type,
        cd.department_id,
        d.name as department_name,
        d.color as department_color,
        cd.percentage,
        cd.amount,
        cd.currency,
        cd.created_at,
        cd.updated_at
    FROM financial_cost_distributions cd
    JOIN departments d ON cd.department_id = d.id
    WHERE cd.cost_id = p_cost_id 
    AND cd.cost_type = p_cost_type
    ORDER BY cd.percentage DESC;
END;
$$ LANGUAGE plpgsql;

-- 6. CREA INDICI PER PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_departments_user_id ON departments(user_id);
CREATE INDEX IF NOT EXISTS idx_departments_is_active ON departments(is_active);

CREATE INDEX IF NOT EXISTS idx_financial_budgets_user_id ON financial_budgets(user_id);
CREATE INDEX IF NOT EXISTS idx_financial_budgets_period ON financial_budgets(period);
CREATE INDEX IF NOT EXISTS idx_financial_budgets_category ON financial_budgets(category);
CREATE INDEX IF NOT EXISTS idx_financial_budgets_department_id ON financial_budgets(department_id);

CREATE INDEX IF NOT EXISTS idx_financial_fixed_costs_department_id ON financial_fixed_costs(department_id);
CREATE INDEX IF NOT EXISTS idx_financial_fixed_costs_category ON financial_fixed_costs(category);
CREATE INDEX IF NOT EXISTS idx_financial_fixed_costs_frequency ON financial_fixed_costs(frequency);

CREATE INDEX IF NOT EXISTS idx_financial_variable_costs_department_id ON financial_variable_costs(department_id);
CREATE INDEX IF NOT EXISTS idx_financial_variable_costs_category ON financial_variable_costs(category);
CREATE INDEX IF NOT EXISTS idx_financial_variable_costs_date ON financial_variable_costs(date);

CREATE INDEX IF NOT EXISTS idx_financial_revenues_department_id ON financial_revenues(department_id);
CREATE INDEX IF NOT EXISTS idx_financial_revenues_category ON financial_revenues(category);
CREATE INDEX IF NOT EXISTS idx_financial_revenues_date ON financial_revenues(date);

CREATE INDEX IF NOT EXISTS idx_financial_cost_distributions_cost_id ON financial_cost_distributions(cost_id);
CREATE INDEX IF NOT EXISTS idx_financial_cost_distributions_department_id ON financial_cost_distributions(department_id);
CREATE INDEX IF NOT EXISTS idx_financial_cost_distributions_cost_type ON financial_cost_distributions(cost_type);

-- Trigger per updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_financial_budgets_updated_at 
    BEFORE UPDATE ON financial_budgets 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_departments_updated_at 
    BEFORE UPDATE ON departments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_financial_cost_distributions_updated_at 
    BEFORE UPDATE ON financial_cost_distributions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Abilita RLS
ALTER TABLE financial_budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_cost_distributions ENABLE ROW LEVEL SECURITY;

-- Policy per permettere tutte le operazioni (temporaneo per sviluppo)
CREATE POLICY "Allow all operations for now" ON financial_budgets FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON departments FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON financial_cost_distributions FOR ALL USING (true);

-- 7. INSERISCI DATI DI ESEMPIO
-- =====================================================
-- Dipartimenti
INSERT INTO departments (id, user_id, name, description, budget_limit, manager, color, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'default-user', 'Sviluppo', 'Dipartimento di sviluppo software', 50000.00, 'Mario Rossi', '#3B82F6', true),
('550e8400-e29b-41d4-a716-446655440002', 'default-user', 'Marketing', 'Dipartimento marketing e comunicazione', 30000.00, 'Giulia Bianchi', '#10B981', true),
('550e8400-e29b-41d4-a716-446655440003', 'default-user', 'Vendite', 'Dipartimento vendite e commerciale', 40000.00, 'Luca Verdi', '#F59E0B', true),
('550e8400-e29b-41d4-a716-446655440004', 'default-user', 'Amministrazione', 'Dipartimento amministrativo e contabile', 20000.00, 'Anna Neri', '#EF4444', true),
('550e8400-e29b-41d4-a716-446655440005', 'default-user', 'Risorse Umane', 'Dipartimento risorse umane', 15000.00, 'Paolo Bianchi', '#8B5CF6', true)
ON CONFLICT (id) DO NOTHING;

-- Budget di esempio
INSERT INTO financial_budgets (id, user_id, name, description, planned_amount, actual_amount, currency, period, category, department_id, status, start_date, end_date) VALUES
('550e8400-e29b-41d4-a716-446655440101', 'default-user', 'Budget Sviluppo 2024', 'Budget annuale per il dipartimento sviluppo', 50000.00, 15000.00, 'EUR', '2024', 'operational', '550e8400-e29b-41d4-a716-446655440001', 'active', '2024-01-01', '2024-12-31'),
('550e8400-e29b-41d4-a716-446655440102', 'default-user', 'Budget Marketing Q1', 'Budget primo trimestre marketing', 15000.00, 5000.00, 'EUR', 'Q1-2024', 'marketing', '550e8400-e29b-41d4-a716-446655440002', 'active', '2024-01-01', '2024-03-31'),
('550e8400-e29b-41d4-a716-446655440103', 'default-user', 'Budget Vendite 2024', 'Budget annuale per il dipartimento vendite', 40000.00, 10000.00, 'EUR', '2024', 'sales', '550e8400-e29b-41d4-a716-446655440003', 'active', '2024-01-01', '2024-12-31'),
('550e8400-e29b-41d4-a716-446655440104', 'default-user', 'Budget Amministrazione 2024', 'Budget annuale per il dipartimento amministrativo', 20000.00, 5000.00, 'EUR', '2024', 'administrative', '550e8400-e29b-41d4-a716-446655440004', 'active', '2024-01-01', '2024-12-31')
ON CONFLICT (id) DO NOTHING;

-- 8. VERIFICA FINALE
-- =====================================================
SELECT 
    'Correzioni database completate con successo!' as status,
    COUNT(*) as tables_created
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'departments', 
    'financial_budgets', 
    'financial_cost_distributions'
);

-- Verifica che la funzione esista
SELECT 
    routine_name,
    routine_type,
    'Funzione get_cost_distribution creata con successo' as status
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name = 'get_cost_distribution';

-- Verifica colonne aggiunte
SELECT 
    table_name,
    column_name,
    data_type,
    'Colonna aggiunta con successo' as status
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('financial_fixed_costs', 'financial_variable_costs', 'financial_revenues')
AND column_name = 'department_id';

-- =====================================================
-- CORREZIONI COMPLETATE
-- =====================================================
-- ✅ Tabella departments creata
-- ✅ Colonne department_id aggiunte alle tabelle finanziarie
-- ✅ Funzione get_cost_distribution creata
-- ✅ Tabelle financial_budgets e financial_cost_distributions create
-- ✅ Indici e RLS configurati
-- ✅ Dati di esempio inseriti
-- =====================================================
