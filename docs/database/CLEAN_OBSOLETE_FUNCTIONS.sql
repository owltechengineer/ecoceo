-- =====================================================
-- PULIZIA FUNZIONI OBSOLETE
-- =====================================================
-- Rimuove funzioni che fanno riferimento a tabelle non esistenti
-- =====================================================

-- Funzioni che fanno riferimento a tabelle obsolete
DROP FUNCTION IF EXISTS convert_quick_task_to_task(UUID) CASCADE;
DROP FUNCTION IF EXISTS distribute_cost(UUID, VARCHAR, JSONB) CASCADE;
DROP FUNCTION IF EXISTS generate_recurring_activities(DATE, DATE) CASCADE;
DROP FUNCTION IF EXISTS generate_recurring_costs() CASCADE;
DROP FUNCTION IF EXISTS generate_week_from_template(UUID, DATE) CASCADE;
DROP FUNCTION IF EXISTS get_cost_distribution(UUID, VARCHAR) CASCADE;
DROP FUNCTION IF EXISTS get_low_stock_items() CASCADE;
DROP FUNCTION IF EXISTS get_total_warehouse_value() CASCADE;
DROP FUNCTION IF EXISTS import_marketing_costs() CASCADE;
DROP FUNCTION IF EXISTS import_project_costs() CASCADE;
DROP FUNCTION IF EXISTS set_next_payment_date() CASCADE;
DROP FUNCTION IF EXISTS set_quick_tasks_completed_at() CASCADE;
DROP FUNCTION IF EXISTS set_quote_number() CASCADE;
DROP FUNCTION IF EXISTS sync_quick_tasks_to_calendar() CASCADE;
DROP FUNCTION IF EXISTS update_budget_spent() CASCADE;
DROP FUNCTION IF EXISTS update_dashboard_data_updated_at() CASCADE;
DROP FUNCTION IF EXISTS update_item_quantity_after_movement() CASCADE;
DROP FUNCTION IF EXISTS update_marketing_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS update_quick_tasks_updated_at() CASCADE;
DROP FUNCTION IF EXISTS update_warehouse_updated_at() CASCADE;

-- Funzioni che potrebbero essere utili (mantieni se necessario)
-- DROP FUNCTION IF EXISTS exec_sql(TEXT) CASCADE;
-- DROP FUNCTION IF EXISTS generate_quote_number() CASCADE;
-- DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- =====================================================
-- FUNZIONI OBSOLETE RIMOSSE
-- =====================================================
-- Le funzioni rimanenti dovrebbero essere solo quelle necessarie
-- =====================================================
