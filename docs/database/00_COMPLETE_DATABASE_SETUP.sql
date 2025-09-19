-- =====================================================
-- COMPLETE DATABASE SETUP
-- Esegue tutti i file SQL per setup completo database
-- =====================================================

-- Questo file esegue tutti i file SQL necessari per il setup completo del database
-- Esegui questo file per creare tutte le tabelle e funzioni necessarie

-- ===== ORDINE DI ESECUZIONE =====
-- 1. 01_FINANCIAL_TABLES.sql - Tabelle e funzioni finanziarie
-- 2. 02_MARKETING_TABLES.sql - Tabelle marketing
-- 3. 03_PROJECTS_TABLES.sql - Tabelle progetti
-- 4. 04_TASKS_CALENDAR_TABLES.sql - Tabelle task e calendario
-- 5. 05_BUSINESS_PLAN_TABLES.sql - Tabelle business plan
-- 6. 06_DASHBOARD_TABLES.sql - Tabelle dashboard

-- ===== ISTRUZIONI =====
-- 1. Esegui questo file in Supabase SQL Editor
-- 2. Verifica che non ci siano errori
-- 3. Controlla che tutte le tabelle siano create
-- 4. Testa le funzionalità principali

-- ===== NOTE =====
-- - Tutte le tabelle hanno RLS abilitato
-- - Policy temporanee per accesso completo
-- - Trigger per updated_at su tutte le tabelle
-- - Indici per performance ottimizzate
-- - Funzioni per operazioni complesse

-- ===== VERIFICA POST-INSTALLAZIONE =====
-- Controlla che queste tabelle esistano:
-- - financial_departments
-- - campaigns
-- - projects_projects
-- - task_calendar_tasks
-- - business_plan
-- - dashboard_data

-- ===== FIX ERRORI COMUNI =====
-- Se hai errori PGRST202: Funzione non trovata
-- Se hai errori 42P01: Tabella non esiste
-- Se hai errori 42P13: Tipo ritorno funzione
-- Esegui questo file completo

-- ===== SUPPORTO =====
-- Per problemi consulta:
-- - docs/database/README.md
-- - docs/troubleshooting/README.md
-- - Log di Supabase per dettagli errori

-- ===== ESECUZIONE =====
-- IMPORTANTE: Esegui i file SQL in questo ordine:

-- 1. FINANCIAL TABLES
\i 01_FINANCIAL_TABLES.sql

-- 2. MARKETING TABLES  
\i 02_MARKETING_TABLES.sql

-- 3. PROJECTS TABLES
\i 03_PROJECTS_TABLES.sql

-- 4. TASKS & CALENDAR TABLES
\i 04_TASKS_CALENDAR_TABLES.sql

-- 5. BUSINESS PLAN TABLES
\i 05_BUSINESS_PLAN_TABLES.sql

-- 6. DASHBOARD TABLES
\i 06_DASHBOARD_TABLES.sql

-- ===== VERIFICA FINALE =====
-- Controlla che tutte le tabelle siano create
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'financial_departments',
    'campaigns', 
    'projects_projects',
    'task_calendar_tasks',
    'business_plan',
    'dashboard_data'
)
ORDER BY table_name;

-- Controlla che le funzioni principali esistano
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN (
    'get_cost_distribution',
    'distribute_cost',
    'generate_recurring_costs',
    'generate_recurring_activities',
    'generate_week_from_template'
)
ORDER BY routine_name;

-- ===== COMPLETATO =====
-- Setup database completato!
-- Ora puoi usare la dashboard senza errori
