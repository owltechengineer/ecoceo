-- =====================================================
-- COMANDI PER ISPEZIONARE IL DATABASE
-- =====================================================
-- Comandi utili per conoscere tabelle e struttura
-- =====================================================

-- 1. LISTA TUTTE LE TABELLE
-- =====================================================
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- 2. CONTA LE TABELLE
-- =====================================================
SELECT COUNT(*) as total_tables
FROM pg_tables 
WHERE schemaname = 'public';

-- 3. STRUTTURA DI UNA TABELLA SPECIFICA
-- =====================================================
-- Sostituisci 'nome_tabella' con il nome della tabella
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'nome_tabella'
ORDER BY ordinal_position;

-- 4. STRUTTURA DI TUTTE LE TABELLE
-- =====================================================
SELECT 
    t.table_name,
    c.column_name,
    c.data_type,
    c.is_nullable,
    c.column_default
FROM information_schema.tables t
JOIN information_schema.columns c ON t.table_name = c.table_name
WHERE t.table_schema = 'public'
ORDER BY t.table_name, c.ordinal_position;

-- 5. FOREIGN KEYS E RELAZIONI
-- =====================================================
SELECT
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
ORDER BY tc.table_name;

-- 6. TRIGGER ATTIVI
-- =====================================================
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_timing,
    action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- 7. POLICY RLS
-- =====================================================
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 8. DIMENSIONI TABELLE
-- =====================================================
SELECT 
    schemaname,
    tablename,
    attname,
    n_distinct,
    correlation
FROM pg_stats
WHERE schemaname = 'public'
ORDER BY tablename, attname;

-- 9. INDICI
-- =====================================================
SELECT 
    t.relname as table_name,
    i.relname as index_name,
    a.attname as column_name,
    ix.indisunique as is_unique,
    ix.indisprimary as is_primary
FROM pg_class t
JOIN pg_index ix ON t.oid = ix.indrelid
JOIN pg_class i ON i.oid = ix.indexrelid
JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum = ANY(ix.indkey)
WHERE t.relkind = 'r'
ORDER BY t.relname, i.relname;

-- 10. FUNZIONI E PROCEDURE
-- =====================================================
SELECT 
    routine_name,
    routine_type,
    data_type as return_type,
    routine_definition
FROM information_schema.routines
WHERE routine_schema = 'public'
ORDER BY routine_name;
