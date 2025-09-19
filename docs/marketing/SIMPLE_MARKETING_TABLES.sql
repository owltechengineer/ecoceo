-- Schema Semplice per Marketing Dashboard
-- Tabelle base per campaigns e leads come richiesto dal codice

-- ===== TABELLE BASE MARKETING =====

-- Tabella Campaigns (semplice)
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    name TEXT NOT NULL,
    channel TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    budget DECIMAL(12,2) NOT NULL,
    spent DECIMAL(12,2) NOT NULL DEFAULT 0,
    leads INTEGER NOT NULL DEFAULT 0,
    conversions INTEGER NOT NULL DEFAULT 0,
    revenue DECIMAL(12,2) NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
    cac DECIMAL(8,2) NOT NULL DEFAULT 0,
    ltv DECIMAL(8,2) NOT NULL DEFAULT 0,
    ltv_cac_ratio DECIMAL(8,2) NOT NULL DEFAULT 0,
    planned_leads INTEGER NOT NULL DEFAULT 0,
    planned_conversions INTEGER NOT NULL DEFAULT 0,
    planned_revenue DECIMAL(12,2) NOT NULL DEFAULT 0,
    actual_leads INTEGER NOT NULL DEFAULT 0,
    actual_conversions INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella Leads (semplice)
CREATE TABLE IF NOT EXISTS leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT DEFAULT 'default-user' NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    source TEXT NOT NULL,
    campaign TEXT,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
    value DECIMAL(12,2) NOT NULL DEFAULT 0,
    date DATE NOT NULL,
    roi DECIMAL(8,2) NOT NULL DEFAULT 0,
    planned_value DECIMAL(12,2) NOT NULL DEFAULT 0,
    actual_value DECIMAL(12,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== INDICI =====

-- Indici per campaigns
CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_start_date ON campaigns(start_date);
CREATE INDEX IF NOT EXISTS idx_campaigns_channel ON campaigns(channel);

-- Indici per leads
CREATE INDEX IF NOT EXISTS idx_leads_user_id ON leads(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_campaign ON leads(campaign);
CREATE INDEX IF NOT EXISTS idx_leads_date ON leads(date);

-- ===== TRIGGERS =====

-- Funzione per aggiornare updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger per campaigns
DROP TRIGGER IF EXISTS update_campaigns_updated_at ON campaigns;
CREATE TRIGGER update_campaigns_updated_at
    BEFORE UPDATE ON campaigns
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger per leads
DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;
CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ===== RLS (Row Level Security) =====

-- Abilita RLS
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Policy per permettere accesso completo (per sviluppo)
CREATE POLICY "Enable all operations for all users" ON campaigns
FOR ALL USING (true);

CREATE POLICY "Enable all operations for all users" ON leads
FOR ALL USING (true);

-- ===== DATI DI ESEMPIO =====

-- Inserisci alcune campagne di esempio
INSERT INTO campaigns (name, channel, start_date, end_date, budget, spent, leads, conversions, revenue, status, cac, ltv, ltv_cac_ratio, planned_leads, planned_conversions, planned_revenue, actual_leads, actual_conversions) VALUES
('Campagna Google Ads Q1', 'Google Ads', '2024-01-01', '2024-03-31', 5000.00, 3200.00, 150, 25, 12500.00, 'active', 21.33, 500.00, 23.44, 200, 30, 15000.00, 150, 25),
('Campagna Facebook Q1', 'Facebook', '2024-01-15', '2024-03-15', 3000.00, 1800.00, 80, 12, 6000.00, 'active', 22.50, 500.00, 22.22, 100, 15, 7500.00, 80, 12),
('Campagna LinkedIn B2B', 'LinkedIn', '2024-02-01', '2024-04-30', 4000.00, 0.00, 0, 0, 0.00, 'paused', 0.00, 0.00, 0.00, 50, 8, 4000.00, 0, 0),
('Campagna Email Marketing', 'Email', '2024-01-01', '2024-12-31', 2000.00, 800.00, 200, 40, 20000.00, 'active', 4.00, 500.00, 125.00, 300, 60, 30000.00, 200, 40);

-- Inserisci alcuni lead di esempio
INSERT INTO leads (name, email, source, campaign, status, value, date, roi, planned_value, actual_value) VALUES
('Mario Rossi', 'mario.rossi@email.com', 'Google Ads', 'Campagna Google Ads Q1', 'converted', 500.00, '2024-01-15', 25.00, 400.00, 500.00),
('Giulia Bianchi', 'giulia.bianchi@email.com', 'Facebook', 'Campagna Facebook Q1', 'qualified', 0.00, '2024-01-20', 0.00, 500.00, 0.00),
('Luca Verdi', 'luca.verdi@email.com', 'LinkedIn', 'Campagna LinkedIn B2B', 'contacted', 0.00, '2024-02-05', 0.00, 600.00, 0.00),
('Anna Neri', 'anna.neri@email.com', 'Email', 'Campagna Email Marketing', 'converted', 500.00, '2024-01-10', 30.00, 450.00, 500.00),
('Paolo Blu', 'paolo.blu@email.com', 'Google Ads', 'Campagna Google Ads Q1', 'new', 0.00, '2024-01-25', 0.00, 500.00, 0.00),
('Sara Gialli', 'sara.gialli@email.com', 'Facebook', 'Campagna Facebook Q1', 'converted', 500.00, '2024-01-18', 28.00, 480.00, 500.00),
('Marco Rossi', 'marco.rossi@email.com', 'Email', 'Campagna Email Marketing', 'qualified', 0.00, '2024-01-12', 0.00, 500.00, 0.00),
('Elena Bianchi', 'elena.bianchi@email.com', 'Google Ads', 'Campagna Google Ads Q1', 'lost', 0.00, '2024-01-22', 0.00, 500.00, 0.00);

-- ===== VERIFICA =====

-- Controlla che le tabelle siano state create correttamente
SELECT 
    'campaigns' as table_name, 
    COUNT(*) as record_count 
FROM campaigns
UNION ALL
SELECT 
    'leads' as table_name, 
    COUNT(*) as record_count 
FROM leads;

-- Mostra la struttura delle tabelle
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('campaigns', 'leads')
ORDER BY table_name, ordinal_position;
