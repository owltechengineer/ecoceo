-- =====================================================
-- TEST CONNESSIONE E SETUP DATABASE
-- =====================================================
-- Esegui questo file per testare la connessione e setup
-- =====================================================

-- 1. TEST CONNESSIONE
-- =====================================================
SELECT 
    'Connessione Supabase OK' as status,
    NOW() as timestamp,
    version() as postgres_version;

-- 2. VERIFICA TABELLE ESISTENTI
-- =====================================================
SELECT 
    COUNT(*) as existing_tables,
    'Tabelle esistenti prima del setup' as description
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE';

-- 3. LISTA TABELLE ESISTENTI
-- =====================================================
SELECT 
    table_name,
    'Esistente' as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- 4. VERIFICA FUNZIONI ESISTENTI
-- =====================================================
SELECT 
    COUNT(*) as existing_functions,
    'Funzioni esistenti prima del setup' as description
FROM information_schema.routines
WHERE routine_schema = 'public';

-- 5. ESEGUI SETUP COMPLETO
-- =====================================================
-- NOTA: Esegui manualmente il file COMPLETE_DATABASE_SETUP.sql
-- \i docs/database/COMPLETE_DATABASE_SETUP.sql

-- 6. VERIFICA FINALE DOPO SETUP
-- =====================================================
-- SELECT 
--     COUNT(*) as new_tables,
--     'Tabelle create dopo setup' as description
-- FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- AND table_type = 'BASE TABLE';

-- SELECT 
--     table_name,
--     '✅ Creata' as status
-- FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- AND table_type = 'BASE TABLE'
-- ORDER BY table_name;

-- =====================================================
-- ISTRUZIONI:
-- =====================================================
-- 1. Esegui questo file per testare la connessione
-- 2. Poi esegui: \i docs/database/COMPLETE_DATABASE_SETUP.sql
-- 3. Infine esegui di nuovo questo file per verificare
-- =====================================================
