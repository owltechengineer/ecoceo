# 🚀 Database Setup Guide

Guida completa per il setup del database della dashboard.

## 📋 File SQL Disponibili

### 🎯 **Setup Completo (RACCOMANDATO)**
```sql
00_COMPLETE_DATABASE_SETUP.sql
```
**Contiene**: Tutti i file SQL in ordine corretto
**Uso**: Esegui questo per setup completo

### 📊 **File per Sezione**

#### 💰 **01_FINANCIAL_TABLES.sql**
- `financial_departments` - Dipartimenti aziendali
- `financial_cost_distributions` - Distribuzione costi
- `financial_fixed_costs` - Costi fissi
- `financial_variable_costs` - Costi variabili
- `financial_budgets` - Budget
- `financial_revenues` - Ricavi
- **Funzioni**: `get_cost_distribution()`, `distribute_cost()`, `generate_recurring_costs()`

#### 📊 **02_MARKETING_TABLES.sql**
- `campaigns` - Campagne marketing
- `leads` - Lead e contatti
- `marketing_seo_projects` - Progetti SEO
- `marketing_crm_campaigns` - Campagne CRM
- `marketing_ad_campaigns` - Campagne pubblicitarie
- `marketing_content_calendar` - Calendario contenuti

#### 📋 **03_PROJECTS_TABLES.sql**
- `projects_projects` - Progetti principali
- `projects_objectives` - Obiettivi progetti
- `projects_budget` - Budget progetti
- `projects_team` - Team progetti
- `projects_milestones` - Milestone
- `projects_risks` - Rischi progetti
- `projects_main` - Progetti alternativi

#### 📅 **04_TASKS_CALENDAR_TABLES.sql**
- `task_calendar_projects` - Progetti calendario
- `task_calendar_tasks` - Task
- `task_calendar_appointments` - Appuntamenti
- `recurring_activities` - Attività ricorrenti
- `weekly_templates` - Template settimanali
- `generated_tasks` - Task generati
- **Funzioni**: `generate_recurring_activities()`, `generate_week_from_template()`

#### 📊 **05_BUSINESS_PLAN_TABLES.sql**
- `business_plan` - Business plan principale
- `business_plan_executive_summary` - Executive summary
- `business_plan_market_analysis` - Analisi mercato
- `business_plan_marketing_strategy` - Strategia marketing
- `business_plan_operational_plan` - Piano operativo
- `business_plan_financial_plan` - Piano finanziario
- `business_plan_business_model` - Modello business
- `business_plan_roadmap` - Roadmap
- `business_plan_documentation` - Documentazione

#### 🏠 **06_DASHBOARD_TABLES.sql**
- `dashboard_data` - Dati dashboard generici
- `services` - Servizi
- `budgets` - Budget generici
- `rd_projects` - Progetti R&D
- `rd_technologies` - Tecnologie R&D
- `business_metrics` - Metriche business
- `ai_models` - Modelli AI
- `ai_training_data` - Dati training AI
- `marketing_seo_tasks` - Task SEO
- `financial_analysis` - Analisi finanziarie

## 🚀 **Come Eseguire il Setup**

### **Opzione 1: Setup Completo (RACCOMANDATO)**
1. Apri Supabase SQL Editor
2. Copia e incolla il contenuto di `00_COMPLETE_DATABASE_SETUP.sql`
3. Esegui lo script
4. Verifica che non ci siano errori

### **Opzione 2: Setup per Sezioni**
1. Esegui i file in questo ordine:
   - `01_FINANCIAL_TABLES.sql`
   - `02_MARKETING_TABLES.sql`
   - `03_PROJECTS_TABLES.sql`
   - `04_TASKS_CALENDAR_TABLES.sql`
   - `05_BUSINESS_PLAN_TABLES.sql`
   - `06_DASHBOARD_TABLES.sql`

## 🚨 **Errori Comuni e Soluzioni**

### **PGRST202 - Funzione non trovata**
```
Error: Could not find the function public.get_cost_distribution
```
**Soluzione**: Esegui `01_FINANCIAL_TABLES.sql`

### **42P01 - Tabella non esiste**
```
ERROR: 42P01: relation "projects_projects" does not exist
```
**Soluzione**: Esegui `03_PROJECTS_TABLES.sql`

### **42P13 - Tipo ritorno funzione**
```
ERROR: 42P13: cannot change return type of existing function
```
**Soluzione**: Esegui `00_COMPLETE_DATABASE_SETUP.sql`

## ✅ **Verifica Post-Installazione**

### **Controlla Tabelle Principali**
```sql
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
```

### **Controlla Funzioni Principali**
```sql
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
```

## 🎯 **Caratteristiche di Ogni File**

### **✅ Tutti i File Includono:**
- ✅ Tabelle con struttura completa
- ✅ RLS (Row Level Security) abilitato
- ✅ Policy temporanee per accesso completo
- ✅ Trigger per `updated_at` automatico
- ✅ Indici per performance ottimizzate
- ✅ Constraint e validazioni
- ✅ Funzioni per operazioni complesse

### **🔧 Funzioni Speciali:**
- **Finanziario**: Distribuzione costi, generazione ricorrenti
- **Task**: Generazione attività ricorrenti, template settimanali
- **Business Plan**: Gestione documentazione completa

## 📞 **Supporto**

Per problemi:
1. Controlla i log di Supabase
2. Verifica che tutte le tabelle esistano
3. Consulta `README.md` per dettagli
4. Usa gli script di fix specifici

## 🎉 **Completato!**

Dopo l'esecuzione di `00_COMPLETE_DATABASE_SETUP.sql`:
- ✅ Tutte le tabelle create
- ✅ Tutte le funzioni disponibili
- ✅ RLS e policy configurati
- ✅ Trigger e indici ottimizzati
- ✅ Dashboard pronta per l'uso
