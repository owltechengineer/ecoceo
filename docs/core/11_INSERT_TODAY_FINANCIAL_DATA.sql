-- Script per inserire dati finanziari di test per la data di oggi
-- Questo risolverà il problema del "Recap Pagamenti di Oggi" che mostra €0,00

-- Inserisci costi fissi con next_payment_date di oggi
INSERT INTO financial_fixed_costs (
    user_id, name, description, amount, frequency, category, 
    start_date, end_date, payment_day, next_payment_date, is_paid
) VALUES 
(
    'default-user', 
    'Affitto Ufficio', 
    'Affitto mensile dell''ufficio principale', 
    1200.00, 
    'monthly', 
    'operational', 
    CURRENT_DATE, 
    CURRENT_DATE + INTERVAL '1 year', 
    1, 
    CURRENT_DATE, 
    false
),
(
    'default-user', 
    'Assicurazione Auto Aziendale', 
    'Assicurazione RC Auto per veicolo aziendale', 
    150.00, 
    'monthly', 
    'insurance', 
    CURRENT_DATE, 
    CURRENT_DATE + INTERVAL '1 year', 
    1, 
    CURRENT_DATE, 
    false
),
(
    'default-user', 
    'Software Licenze', 
    'Licenze software per sviluppo e marketing', 
    300.00, 
    'monthly', 
    'technology', 
    CURRENT_DATE, 
    CURRENT_DATE + INTERVAL '1 year', 
    1, 
    CURRENT_DATE, 
    false
);

-- Inserisci costi variabili con date di oggi
INSERT INTO financial_variable_costs (
    user_id, name, description, amount, category, date, is_paid
) VALUES 
(
    'default-user', 
    'Marketing Digitale', 
    'Campagna Google Ads per il mese corrente', 
    500.00, 
    'marketing', 
    CURRENT_DATE, 
    false
),
(
    'default-user', 
    'Materiale Ufficio', 
    'Acquisto materiale di cancelleria', 
    75.00, 
    'operational', 
    CURRENT_DATE, 
    false
),
(
    'default-user', 
    'Consulenza Legale', 
    'Consulenza per contratti clienti', 
    200.00, 
    'professional', 
    CURRENT_DATE, 
    false
);

-- Inserisci entrate con received_date di oggi
INSERT INTO financial_revenues (
    user_id, name, description, amount, category, client, 
    invoice_number, received_date, is_received
) VALUES 
(
    'default-user', 
    'Progetto Sito Web - Cliente ABC', 
    'Sviluppo sito web e-commerce per cliente ABC', 
    2500.00, 
    'services', 
    'ABC S.r.l.', 
    'INV-2024-001', 
    CURRENT_DATE, 
    true
),
(
    'default-user', 
    'Consulenza Marketing - XYZ', 
    'Consulenza strategia marketing digitale', 
    800.00, 
    'consulting', 
    'XYZ S.p.A.', 
    'INV-2024-002', 
    CURRENT_DATE, 
    true
),
(
    'default-user', 
    'Vendita Software - DEF', 
    'Licenza software personalizzato', 
    1200.00, 
    'products', 
    'DEF L.t.d.', 
    'INV-2024-003', 
    CURRENT_DATE, 
    true
);

-- Verifica i dati inseriti
SELECT 'Costi Fissi di Oggi' as tipo, COUNT(*) as count, SUM(amount) as totale
FROM financial_fixed_costs 
WHERE next_payment_date = CURRENT_DATE
UNION ALL
SELECT 'Costi Variabili di Oggi', COUNT(*), SUM(amount)
FROM financial_variable_costs 
WHERE date = CURRENT_DATE
UNION ALL
SELECT 'Entrate di Oggi', COUNT(*), SUM(amount)
FROM financial_revenues 
WHERE received_date = CURRENT_DATE;
