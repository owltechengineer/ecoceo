-- =====================================================
-- FIX SCHEMA CACHE - Risolve problemi di riconoscimento tabelle
-- =====================================================
-- Esegui questo se vedi errori tipo:
-- "Could not find the table 'public.XXX' in the schema cache"
-- =====================================================

-- =====================================================
-- STEP 1: Refresh Schema Cache
-- =====================================================

-- Verifica quali tabelle esistono
SELECT 
  table_name,
  table_type
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'campaigns',
    'leads',
    'task_calendar_projects',
    'task_calendar_tasks',
    'task_calendar_appointments',
    'financial_fixed_costs',
    'financial_variable_costs',
    'financial_revenues',
    'financial_budgets',
    'financial_departments',
    'recurring_activities',
    'organizational_analysis',
    'warehouse_items',
    'warehouse_categories',
    'quotes',
    'quote_items',
    'quote_settings',
    'quick_tasks',
    'dashboard_data'
  )
ORDER BY table_name;

-- =====================================================
-- STEP 2: Verifica RLS Policies
-- =====================================================

-- Mostra tutte le policy RLS attive
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

-- =====================================================
-- STEP 3: Fix Policy "Allow All" per TUTTE le tabelle
-- =====================================================

DO $$
DECLARE
  t TEXT;
  tables TEXT[] := ARRAY[
    'campaigns', 'leads', 'task_calendar_projects', 
    'task_calendar_tasks', 'task_calendar_appointments',
    'financial_fixed_costs', 'financial_variable_costs', 
    'financial_revenues', 'financial_budgets', 'financial_departments',
    'recurring_activities', 'organizational_analysis',
    'warehouse_items', 'warehouse_categories', 'warehouse_movements',
    'quotes', 'quote_items', 'quote_settings',
    'quick_tasks', 'dashboard_data'
  ];
BEGIN
  FOREACH t IN ARRAY tables
  LOOP
    -- Abilita RLS
    EXECUTE format('ALTER TABLE IF EXISTS %I ENABLE ROW LEVEL SECURITY', t);
    
    -- Rimuovi tutte le policy esistenti
    EXECUTE format('DROP POLICY IF EXISTS "Allow all on %I" ON %I', t, t);
    EXECUTE format('DROP POLICY IF EXISTS "Allow all operations on %I" ON %I', t, t);
    EXECUTE format('DROP POLICY IF EXISTS "Users can manage own %I" ON %I', t, t);
    
    -- Crea policy "Allow All" pulita
    EXECUTE format('
      CREATE POLICY "Allow all on %I"
      ON %I FOR ALL
      USING (true) WITH CHECK (true)
    ', t, t);
    
    RAISE NOTICE 'Policy aggiornata per: %', t;
  END LOOP;
  
  RAISE NOTICE '';
  RAISE NOTICE '✅ Policy RLS aggiornate per tutte le tabelle!';
END $$;

-- =====================================================
-- STEP 4: Refresh Supabase Schema Cache
-- =====================================================

-- Notifica Supabase di aggiornare la cache
NOTIFY pgrst, 'reload schema';

-- =====================================================
-- STEP 5: Verifica Connessioni
-- =====================================================

SELECT 
  COUNT(*) as active_connections,
  application_name
FROM pg_stat_activity
WHERE datname = current_database()
GROUP BY application_name;

-- =====================================================
-- STEP 6: Test Query su Ogni Tabella
-- =====================================================

DO $$
DECLARE
  t TEXT;
  count_result INTEGER;
  tables TEXT[] := ARRAY[
    'campaigns', 'leads', 'task_calendar_projects',
    'financial_revenues', 'quotes', 'warehouse_items',
    'quick_tasks', 'dashboard_data'
  ];
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '🔍 TEST ACCESSO TABELLE:';
  RAISE NOTICE '========================================';
  
  FOREACH t IN ARRAY tables
  LOOP
    BEGIN
      EXECUTE format('SELECT COUNT(*) FROM %I', t) INTO count_result;
      RAISE NOTICE '✅ %-30s: % records', t, count_result;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE '❌ %-30s: ERRORE - %', t, SQLERRM;
    END;
  END LOOP;
  
  RAISE NOTICE '========================================';
END $$;

-- =====================================================
-- STEP 7: Informazioni Debug
-- =====================================================

-- Mostra info database
SELECT 
  'Database' as info_type,
  current_database() as value
UNION ALL
SELECT 
  'Schema Version',
  setting
FROM pg_settings
WHERE name = 'server_version'
UNION ALL
SELECT
  'Total Tables',
  COUNT(*)::TEXT
FROM information_schema.tables
WHERE table_schema = 'public';

-- =====================================================
-- ISTRUZIONI FINALI
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '📋 ISTRUZIONI POST-ESECUZIONE:';
  RAISE NOTICE '========================================';
  RAISE NOTICE '1. Se vedi tabelle con ❌, creale con MASTER_DATABASE_SETUP.sql';
  RAISE NOTICE '2. Vai su Supabase → Settings → API';
  RAISE NOTICE '3. Controlla che le tabelle appaiano nella sezione "Tables"';
  RAISE NOTICE '4. Se necessario, click su "Reload Schema"';
  RAISE NOTICE '5. Riavvia il dev server: npm run dev';
  RAISE NOTICE '6. Controlla la console del browser per errori';
  RAISE NOTICE '';
  RAISE NOTICE '🔧 SE PROBLEMI PERSISTONO:';
  RAISE NOTICE '- Vai su Supabase Dashboard → Database → Replication';
  RAISE NOTICE '- Verifica che PostgREST sia attivo';
  RAISE NOTICE '- Controlla i log di Supabase per errori';
  RAISE NOTICE '========================================';
END $$;

-- =====================================================
-- FINE SCRIPT
-- =====================================================
