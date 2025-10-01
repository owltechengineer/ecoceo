-- =====================================================
-- DROP ALL TABLES - COMANDO VELOCE
-- =====================================================
-- ATTENZIONE: Elimina TUTTE le tabelle del database
-- =====================================================

-- Elimina tutte le tabelle in ordine (per evitare foreign key constraints)
DROP TABLE IF EXISTS task_calendar_appointments CASCADE;
DROP TABLE IF EXISTS quick_tasks CASCADE;
DROP TABLE IF EXISTS financial_revenues CASCADE;
DROP TABLE IF EXISTS financial_fixed_costs CASCADE;
DROP TABLE IF EXISTS financial_variable_costs CASCADE;
DROP TABLE IF EXISTS financial_budgets CASCADE;
DROP TABLE IF EXISTS financial_departments CASCADE;
DROP TABLE IF EXISTS business_plan_marketing_strategy CASCADE;
DROP TABLE IF EXISTS business_plan_business_model CASCADE;
DROP TABLE IF EXISTS business_plan_financial_projections CASCADE;
DROP TABLE IF EXISTS business_plan_swot_analysis CASCADE;
DROP TABLE IF EXISTS business_plan_competitor_analysis CASCADE;
DROP TABLE IF EXISTS business_plan_risk_analysis CASCADE;
DROP TABLE IF EXISTS business_plan_executive_summary CASCADE;
DROP TABLE IF EXISTS business_plan_company_overview CASCADE;
DROP TABLE IF EXISTS business_plan_market_analysis CASCADE;
DROP TABLE IF EXISTS business_plan_operations CASCADE;
DROP TABLE IF EXISTS business_plan_management CASCADE;
DROP TABLE IF EXISTS business_plan_funding CASCADE;
DROP TABLE IF EXISTS business_plan_appendix CASCADE;
DROP TABLE IF EXISTS business_plan CASCADE;
DROP TABLE IF EXISTS marketing_campaigns CASCADE;
DROP TABLE IF EXISTS marketing_leads CASCADE;
DROP TABLE IF EXISTS marketing_budgets CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;

-- Elimina anche le funzioni se esistono
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- =====================================================
-- TUTTE LE TABELLE ELIMINATE
-- =====================================================
