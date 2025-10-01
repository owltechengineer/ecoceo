# 🗄️ Database Documentation

Questa sezione contiene tutti gli script SQL necessari per il funzionamento del database della dashboard.

## 📋 Script Principali

### 🚀 Setup Completo
- **[00_RESET_ALL_TABLES.sql](./00_RESET_ALL_TABLES.sql)** - **RESET COMPLETO** - Elimina e ricrea tutte le tabelle

### 📊 Sezioni Principali
- **[01_FINANCIAL_SECTION.sql](./01_FINANCIAL_SECTION.sql)** - Sezione Finanziaria (Entrate, Costi, Budget)
- **[02_MARKETING_SECTION.sql](./02_MARKETING_SECTION.sql)** - Sezione Marketing (Campagne, Lead, Budget)
- **[03_PROJECTS_SECTION.sql](./03_PROJECTS_SECTION.sql)** - Sezione Progetti (Progetti, Task, Quick Tasks, Calendario)
- **[04_BUSINESS_PLAN_SECTION.sql](./04_BUSINESS_PLAN_SECTION.sql)** - Sezione Business Plan (Tutte le sezioni del BP)

## 🚨 Errori Comuni e Soluzioni

### PGRST202 - Funzione non trovata
```
Error: Could not find the function public.get_cost_distribution
```
**Soluzione**: Esegui `01_FINANCIAL_SECTION.sql`

### 42P01 - Tabella non esiste
```
ERROR: 42P01: relation "projects" does not exist
```
**Soluzione**: Esegui `03_PROJECTS_SECTION.sql`

### 42P13 - Tipo ritorno funzione
```
ERROR: 42P13: cannot change return type of existing function
```
**Soluzione**: Esegui `00_RESET_ALL_TABLES.sql`

## 📖 Ordine di Esecuzione Raccomandato

### Setup Iniziale
1. `00_RESET_ALL_TABLES.sql` - Reset completo del database
2. Verifica che tutte le tabelle siano create

### Setup per Sezioni
1. `01_FINANCIAL_SECTION.sql` - Solo sezione finanziaria
2. `02_MARKETING_SECTION.sql` - Solo sezione marketing
3. `03_PROJECTS_SECTION.sql` - Solo sezione progetti
4. `04_BUSINESS_PLAN_SECTION.sql` - Solo business plan

### Fix Errori Specifici
1. Identifica l'errore
2. Usa lo script specifico per la sezione
3. Verifica il funzionamento

## 🗂️ Tabelle Principali

### Sezione Finanziaria
- `financial_departments` - Dipartimenti
- `financial_revenues` - Ricavi
- `financial_fixed_costs` - Costi fissi
- `financial_variable_costs` - Costi variabili
- `financial_budgets` - Budget

### Sezione Marketing
- `marketing_campaigns` - Campagne marketing
- `marketing_leads` - Lead e contatti
- `marketing_budgets` - Budget marketing

### Sezione Progetti
- `projects` - Progetti principali
- `tasks` - Task
- `task_calendar_appointments` - Appuntamenti calendario
- `quick_tasks` - Task veloci

### Sezione Business Plan
- `business_plan` - Piano business principale
- `business_plan_executive_summary` - Executive summary
- `business_plan_company_overview` - Panoramica azienda
- `business_plan_market_analysis` - Analisi mercato
- `business_plan_operations` - Operazioni
- `business_plan_management` - Management
- `business_plan_marketing_strategy` - Strategia marketing
- `business_plan_business_model` - Modello business
- `business_plan_financial_projections` - Proiezioni finanziarie
- `business_plan_swot_analysis` - Analisi SWOT
- `business_plan_competitor_analysis` - Analisi competitor
- `business_plan_risk_analysis` - Analisi rischi
- `business_plan_funding` - Finanziamento
- `business_plan_appendix` - Appendice

## 🔧 Funzioni Principali

- `update_updated_at_column()` - Aggiorna timestamp
- Trigger automatici per `updated_at`
- RLS (Row Level Security) configurato
- Policy per accesso completo

## 📞 Supporto

Per problemi:
1. Controlla gli errori comuni sopra
2. Usa gli script di fix appropriati
3. Verifica l'ordine di esecuzione
4. Consulta i log di Supabase per dettagli

## 🎯 Vantaggi della Nuova Struttura

- **Modulare**: Ogni sezione è indipendente
- **Pulita**: Solo le tabelle necessarie per sezione
- **Manutenibile**: Facile aggiungere/rimuovere sezioni
- **Sicura**: RLS configurato su tutte le tabelle
- **Efficiente**: Trigger automatici per timestamp