-- =====================================================
-- FIX FINANCIAL TABLES - SAFE VERSION
-- =====================================================
-- Sistema le tabelle financial evitando errori di constraint esistenti
-- =====================================================

-- 1. FIX FINANCIAL_FIXED_COSTS TABLE
-- =====================================================

-- Aggiungi colonne mancanti (solo se non esistono)
ALTER TABLE financial_fixed_costs 
ADD COLUMN IF NOT EXISTS frequency VARCHAR(20) DEFAULT 'monthly';

ALTER TABLE financial_fixed_costs 
ADD COLUMN IF NOT EXISTS start_date DATE;

ALTER TABLE financial_fixed_costs 
ADD COLUMN IF NOT EXISTS end_date DATE;

ALTER TABLE financial_fixed_costs 
ADD COLUMN IF NOT EXISTS payment_day INTEGER DEFAULT 1;

-- Rendi la colonna 'date' nullable per evitare errori
ALTER TABLE financial_fixed_costs 
ALTER COLUMN date DROP NOT NULL;

-- Rimuovi constraint esistenti prima di ricrearli
ALTER TABLE financial_fixed_costs 
DROP CONSTRAINT IF EXISTS financial_fixed_costs_frequency_check;

ALTER TABLE financial_fixed_costs 
DROP CONSTRAINT IF EXISTS financial_fixed_costs_payment_day_check;

-- Aggiungi constraint per frequency
ALTER TABLE financial_fixed_costs 
ADD CONSTRAINT financial_fixed_costs_frequency_check 
CHECK (frequency IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'one-time'));

-- Aggiungi constraint per payment_day (1-31)
ALTER TABLE financial_fixed_costs 
ADD CONSTRAINT financial_fixed_costs_payment_day_check 
CHECK (payment_day >= 1 AND payment_day <= 31);

-- 2. FIX FINANCIAL_VARIABLE_COSTS TABLE
-- =====================================================

ALTER TABLE financial_variable_costs 
ADD COLUMN IF NOT EXISTS category VARCHAR(100);

ALTER TABLE financial_variable_costs 
ADD COLUMN IF NOT EXISTS vendor VARCHAR(255);

ALTER TABLE financial_variable_costs 
ADD COLUMN IF NOT EXISTS is_paid BOOLEAN DEFAULT FALSE;

ALTER TABLE financial_variable_costs 
ADD COLUMN IF NOT EXISTS frequency VARCHAR(20) DEFAULT 'monthly';

ALTER TABLE financial_variable_costs 
ADD COLUMN IF NOT EXISTS start_date DATE;

ALTER TABLE financial_variable_costs 
ADD COLUMN IF NOT EXISTS end_date DATE;

ALTER TABLE financial_variable_costs 
ADD COLUMN IF NOT EXISTS payment_day INTEGER DEFAULT 1;

-- 3. FIX FINANCIAL_REVENUES TABLE
-- =====================================================

ALTER TABLE financial_revenues 
ADD COLUMN IF NOT EXISTS category VARCHAR(100);

ALTER TABLE financial_revenues 
ADD COLUMN IF NOT EXISTS customer VARCHAR(255);

ALTER TABLE financial_revenues 
ADD COLUMN IF NOT EXISTS is_received BOOLEAN DEFAULT FALSE;

ALTER TABLE financial_revenues 
ADD COLUMN IF NOT EXISTS frequency VARCHAR(20) DEFAULT 'monthly';

ALTER TABLE financial_revenues 
ADD COLUMN IF NOT EXISTS start_date DATE;

ALTER TABLE financial_revenues 
ADD COLUMN IF NOT EXISTS end_date DATE;

ALTER TABLE financial_revenues 
ADD COLUMN IF NOT EXISTS payment_day INTEGER DEFAULT 1;

-- 4. VERIFICA RISULTATI
-- =====================================================

-- Verifica colonne financial_fixed_costs
SELECT 'financial_fixed_costs' as table_name, column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'financial_fixed_costs' 
AND table_schema = 'public'
ORDER BY ordinal_position;
