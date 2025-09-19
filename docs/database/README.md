# 🗄️ Database Documentation

Questa sezione contiene tutti gli script SQL necessari per il funzionamento del database della dashboard.

## 📋 Script Principali

### 🚀 Setup Completo
- **[00_COMPLETE_DATABASE_SETUP.sql](./00_COMPLETE_DATABASE_SETUP.sql)** - Script principale per setup completo del database

### 📊 Schema per Sezione
- **[01_FINANCIAL_TABLES.sql](./01_FINANCIAL_TABLES.sql)** - Tabelle e funzioni finanziarie
- **[02_MARKETING_TABLES.sql](./02_MARKETING_TABLES.sql)** - Tabelle marketing e campagne
- **[03_PROJECTS_TABLES.sql](./03_PROJECTS_TABLES.sql)** - Tabelle progetti e gestione
- **[04_TASKS_CALENDAR_TABLES.sql](./04_TASKS_CALENDAR_TABLES.sql)** - Tabelle task e calendario
- **[05_BUSINESS_PLAN_TABLES.sql](./05_BUSINESS_PLAN_TABLES.sql)** - Tabelle business plan
- **[06_DASHBOARD_TABLES.sql](./06_DASHBOARD_TABLES.sql)** - Tabelle dashboard e dati generici

## 🚨 Errori Comuni e Soluzioni

### PGRST202 - Funzione non trovata
```
Error: Could not find the function public.get_cost_distribution
```
**Soluzione**: Esegui `01_FINANCIAL_TABLES.sql`

### 42P01 - Tabella non esiste
```
ERROR: 42P01: relation "projects_projects" does not exist
```
**Soluzione**: Esegui `03_PROJECTS_TABLES.sql`

### 42P13 - Tipo ritorno funzione
```
ERROR: 42P13: cannot change return type of existing function
```
**Soluzione**: Esegui `00_COMPLETE_DATABASE_SETUP.sql`

## 📖 Ordine di Esecuzione Raccomandato

### Setup Iniziale
1. `00_COMPLETE_DATABASE_SETUP.sql` - Setup completo
2. Verifica che tutte le tabelle siano create

### Fix Errori Specifici
1. Identifica l'errore
2. Usa lo script specifico per la sezione
3. Verifica il funzionamento

### Manutenzione
1. `00_COMPLETE_DATABASE_SETUP.sql` per aggiornamenti completi
2. Script specifici per sezioni individuali

## 🗂️ Tabelle Principali

### Finanziario
- `financial_departments` - Dipartimenti
- `financial_cost_distributions` - Distribuzioni costi
- `financial_fixed_costs` - Costi fissi
- `financial_variable_costs` - Costi variabili
- `financial_budgets` - Budget
- `financial_revenues` - Ricavi

### Marketing
- `campaigns` - Campagne marketing
- `leads` - Lead e contatti
- `marketing_seo_projects` - Progetti SEO
- `marketing_crm_campaigns` - Campagne CRM
- `marketing_ad_campaigns` - Campagne pubblicitarie

### Progetti
- `projects_projects` - Progetti principali
- `projects_objectives` - Obiettivi progetti
- `projects_budget` - Budget progetti
- `projects_team` - Team progetti
- `projects_milestones` - Milestone
- `projects_risks` - Rischi progetti

### Task e Calendario
- `task_calendar_projects` - Progetti calendario
- `task_calendar_tasks` - Task
- `task_calendar_appointments` - Appuntamenti
- `recurring_activities` - Attività ricorrenti
- `weekly_templates` - Template settimanali

### Dashboard
- `dashboard_data` - Dati dashboard
- `business_plan` - Piano business
- `business_plan_executive_summary` - Executive summary
- `business_plan_market_analysis` - Analisi mercato
- `business_plan_marketing_strategy` - Strategia marketing
- `business_plan_operational_plan` - Piano operativo
- `business_plan_financial_plan` - Piano finanziario
- `business_plan_business_model` - Modello business
- `business_plan_roadmap` - Roadmap
- `business_plan_documentation` - Documentazione

## 🔧 Funzioni Principali

- `get_cost_distribution()` - Distribuzione costi per dipartimento
- `distribute_cost()` - Distribuisce costi
- `generate_recurring_costs()` - Genera costi ricorrenti
- `generate_recurring_activities()` - Genera attività ricorrenti
- `generate_week_from_template()` - Genera settimana da template
- `exec_sql()` - Esegue SQL dinamico

## 📞 Supporto

Per problemi:
1. Controlla gli errori comuni sopra
2. Usa gli script di fix appropriati
3. Verifica l'ordine di esecuzione
4. Consulta i log di Supabase per dettagli