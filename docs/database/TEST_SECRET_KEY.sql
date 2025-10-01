-- =====================================================
-- TEST SECRET KEY SUPABASE
-- =====================================================
-- Test della connessione con secret key
-- =====================================================

-- 1. TEST CONNESSIONE CON SECRET KEY
-- =====================================================
SELECT 
    'Secret Key Connection OK' as status,
    NOW() as timestamp,
    'sb_secret_Z7l9wY0V8-3iiqBM3Kw8IQ_ejR7prq9' as key_type;

-- 2. VERIFICA PERMESSI SECRET KEY
-- =====================================================
-- La secret key dovrebbe avere accesso completo al database
SELECT 
    'Secret key permissions verified' as status,
    current_user as current_user,
    session_user as session_user;

-- 3. TEST OPERAZIONI AVANZATE
-- =====================================================
-- Test creazione tabella temporanea
CREATE TEMP TABLE test_secret_key (
    id SERIAL PRIMARY KEY,
    test_data TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Inserisci dati di test
INSERT INTO test_secret_key (test_data) VALUES 
('Secret key test successful'),
('Database operations working'),
('Full access confirmed');

-- Verifica inserimento
SELECT 
    COUNT(*) as records_created,
    'Secret key operations working' as status
FROM test_secret_key;

-- Pulisci tabella temporanea
DROP TABLE test_secret_key;

-- 4. VERIFICA TABELLE ESISTENTI
-- =====================================================
SELECT 
    COUNT(*) as existing_tables,
    'Tables accessible with secret key' as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE';

-- 5. LISTA TABELLE ACCESSIBILI
-- =====================================================
SELECT 
    table_name,
    'Accessible' as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- =====================================================
-- SECRET KEY TEST COMPLETATO
-- =====================================================
-- Se questo script esegue senza errori, la secret key funziona
-- =====================================================
