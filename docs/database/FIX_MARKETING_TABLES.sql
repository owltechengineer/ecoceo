-- =====================================================
-- FIX SEZIONE MARKETING - TABELLE MANCANTI
-- =====================================================
-- Risolve il problema di caricamento dati marketing
-- =====================================================

-- 1. CREA TABELLE MARKETING
-- =====================================================

-- Campagne Marketing
CREATE TABLE IF NOT EXISTS marketing_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    budget DECIMAL(15,2),
    status VARCHAR(50) DEFAULT 'active',
    channel VARCHAR(100),
    target_audience TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lead
CREATE TABLE IF NOT EXISTS marketing_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    company VARCHAR(255),
    source VARCHAR(100),
    status VARCHAR(50) DEFAULT 'new',
    priority VARCHAR(20) DEFAULT 'medium',
    notes TEXT,
    campaign_id UUID REFERENCES marketing_campaigns(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Budget Marketing
CREATE TABLE IF NOT EXISTS marketing_budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES marketing_campaigns(id),
    amount DECIMAL(15,2) NOT NULL,
    spent DECIMAL(15,2) DEFAULT 0,
    category VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CREA TRIGGER PER UPDATED_AT
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_marketing_campaigns_updated_at 
BEFORE UPDATE ON marketing_campaigns 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marketing_leads_updated_at 
BEFORE UPDATE ON marketing_leads 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marketing_budgets_updated_at 
BEFORE UPDATE ON marketing_budgets 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 3. ABILITA RLS
-- =====================================================
ALTER TABLE marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_budgets ENABLE ROW LEVEL SECURITY;

-- 4. CREA POLICY
-- =====================================================
CREATE POLICY "Allow all operations for now" ON marketing_campaigns FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON marketing_leads FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON marketing_budgets FOR ALL USING (true);

-- 5. INSERISCI DATI DI ESEMPIO
-- =====================================================

-- Campagne di esempio
INSERT INTO marketing_campaigns (name, description, start_date, end_date, budget, status, channel, target_audience) VALUES
('Campagna Social Media Q1', 'Campagna promozionale sui social media per il primo trimestre', '2024-01-01', '2024-03-31', 15000.00, 'active', 'Social Media', 'Giovani 18-35 anni'),
('Email Marketing Newsletter', 'Newsletter mensile per clienti esistenti', '2024-01-01', '2024-12-31', 5000.00, 'active', 'Email', 'Clienti esistenti'),
('Google Ads Search', 'Campagna Google Ads per parole chiave specifiche', '2024-02-01', '2024-06-30', 25000.00, 'active', 'Google Ads', 'Professionisti 25-50 anni'),
('Campagna LinkedIn B2B', 'Campagna LinkedIn per lead B2B', '2024-03-01', '2024-05-31', 8000.00, 'active', 'LinkedIn', 'Professionisti B2B'),
('Influencer Marketing', 'Collaborazione con influencer del settore', '2024-04-01', '2024-06-30', 12000.00, 'planning', 'Influencer', 'Giovani 20-30 anni')
ON CONFLICT DO NOTHING;

-- Lead di esempio
INSERT INTO marketing_leads (name, email, phone, company, source, status, priority, notes) VALUES
('Mario Rossi', 'mario.rossi@email.com', '+39 123 456 7890', 'Azienda ABC', 'Google Ads', 'new', 'high', 'Interessato al prodotto premium'),
('Giulia Bianchi', 'giulia.bianchi@email.com', '+39 098 765 4321', 'Startup XYZ', 'Social Media', 'contacted', 'medium', 'Richiesta informazioni via LinkedIn'),
('Luca Verdi', 'luca.verdi@email.com', '+39 555 123 4567', 'Freelancer', 'Newsletter', 'qualified', 'high', 'Cliente potenziale per servizi B2B'),
('Anna Neri', 'anna.neri@email.com', '+39 333 987 6543', 'Corporation DEF', 'LinkedIn', 'new', 'medium', 'Interessata a soluzioni enterprise'),
('Paolo Blu', 'paolo.blu@email.com', '+39 777 456 7890', 'Agenzia GHI', 'Influencer', 'contacted', 'low', 'Contatto tramite influencer')
ON CONFLICT DO NOTHING;

-- Budget di esempio
INSERT INTO marketing_budgets (campaign_id, amount, spent, category, description) VALUES
((SELECT id FROM marketing_campaigns WHERE name = 'Campagna Social Media Q1'), 15000.00, 8500.00, 'Social Media', 'Budget per Facebook e Instagram Ads'),
((SELECT id FROM marketing_campaigns WHERE name = 'Email Marketing Newsletter'), 5000.00, 1200.00, 'Email', 'Budget per piattaforma email marketing'),
((SELECT id FROM marketing_campaigns WHERE name = 'Google Ads Search'), 25000.00, 18000.00, 'Search', 'Budget per Google Ads e SEO'),
((SELECT id FROM marketing_campaigns WHERE name = 'Campagna LinkedIn B2B'), 8000.00, 3200.00, 'B2B', 'Budget per LinkedIn Ads B2B'),
((SELECT id FROM marketing_campaigns WHERE name = 'Influencer Marketing'), 12000.00, 0.00, 'Influencer', 'Budget per collaborazioni influencer')
ON CONFLICT DO NOTHING;

-- 6. VERIFICA CREAZIONE
-- =====================================================
SELECT 
    'Marketing tables created successfully' as status,
    (SELECT COUNT(*) FROM marketing_campaigns) as campaigns_count,
    (SELECT COUNT(*) FROM marketing_leads) as leads_count,
    (SELECT COUNT(*) FROM marketing_budgets) as budgets_count;

-- 7. LISTA TABELLE MARKETING
-- =====================================================
SELECT 
    table_name,
    'Created' as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'marketing_%'
ORDER BY table_name;

-- =====================================================
-- FIX MARKETING COMPLETATO
-- =====================================================
-- Le tabelle marketing sono ora disponibili
-- =====================================================
