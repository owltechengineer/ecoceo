-- =====================================================
-- LISTA FUNZIONI UTILI
-- =====================================================
-- Mostra solo le funzioni che potrebbero essere utili
-- =====================================================

-- 1. FUNZIONI TRIGGER (per updated_at)
-- =====================================================
SELECT 
    routine_name,
    routine_type,
    'Trigger function for updated_at' as description
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name LIKE '%updated_at%'
ORDER BY routine_name;

-- 2. FUNZIONI UTILI (se esistono)
-- =====================================================
SELECT 
    routine_name,
    routine_type,
    return_type,
    'Useful function' as description
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN (
    'exec_sql',
    'generate_quote_number',
    'update_updated_at_column'
)
ORDER BY routine_name;

-- 3. TUTTE LE FUNZIONI RIMANENTI
-- =====================================================
SELECT 
    routine_name,
    routine_type,
    return_type,
    'Check if still needed' as description
FROM information_schema.routines
WHERE routine_schema = 'public'
ORDER BY routine_name;

-- 4. CONTEGGIO FUNZIONI
-- =====================================================
SELECT 
    COUNT(*) as total_functions,
    COUNT(CASE WHEN routine_type = 'FUNCTION' THEN 1 END) as functions,
    COUNT(CASE WHEN routine_type = 'PROCEDURE' THEN 1 END) as procedures
FROM information_schema.routines
WHERE routine_schema = 'public';
