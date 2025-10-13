# 📚 Documentazione Dashboard Startup

Questa documentazione è organizzata per sezioni della dashboard e contiene solo i documenti essenziali per il funzionamento del sistema.

## 🗂️ Struttura Documentazione

### 🗄️ Database
- **[COMPLETE_DATABASE_SETUP.sql](./database/COMPLETE_DATABASE_SETUP.sql)** - Script completo per creare tutte le tabelle e funzioni
- **[UNIFIED_DATABASE_SCHEMA.sql](./database/UNIFIED_DATABASE_SCHEMA.sql)** - Schema unificato con tutte le tabelle
- **[COMPLETE_ALL_TABLES.sql](./database/COMPLETE_ALL_TABLES.sql)** - Script per creare tutte le tabelle mancanti
- **[README.md](./database/README.md)** - Guida database e troubleshooting

### 💰 Gestione Finanziaria
- **[FINANCIAL_MANAGEMENT_SCHEMA.sql](./database/FINANCIAL_MANAGEMENT_SCHEMA.sql)** - Schema tabelle finanziarie
- **[FIX_FINANCIAL_FUNCTIONS.sql](./database/FIX_FINANCIAL_FUNCTIONS.sql)** - Fix funzioni finanziarie

### 📊 Marketing
- **[MARKETING_SCHEMA.sql](./database/MARKETING_SCHEMA.sql)** - Schema tabelle marketing
- **[SIMPLE_MARKETING_TABLES.sql](./marketing/SIMPLE_MARKETING_TABLES.sql)** - Tabelle marketing semplificate

### 📋 Progetti e Task
- **[PROJECTS_SCHEMA.sql](./database/PROJECTS_SCHEMA.sql)** - Schema tabelle progetti
- **[TASKS_CALENDAR_SCHEMA.sql](./database/TASKS_CALENDAR_SCHEMA.sql)** - Schema calendario e task
- **[RECURRING_ACTIVITIES_SCHEMA.sql](./database/RECURRING_ACTIVITIES_SCHEMA.sql)** - Schema attività ricorrenti

### 🚀 Setup e Configurazione
- **[SETUP_DATABASE.md](./setup/SETUP_DATABASE.md)** - Guida setup database
- **[SUPABASE_SETUP.md](./setup/SUPABASE_SETUP.md)** - Configurazione Supabase

## 🚨 Fix Rapidi

### Errori Comuni
1. **PGRST202 - Funzione non trovata**: Usa `FIX_FINANCIAL_FUNCTIONS.sql`
2. **42P01 - Tabella non esiste**: Usa `COMPLETE_ALL_TABLES.sql`
3. **42P13 - Tipo ritorno funzione**: Usa `UNIFIED_DATABASE_SCHEMA.sql`

### Ordine di Esecuzione
1. Esegui `COMPLETE_DATABASE_SETUP.sql` per setup completo
2. Se ci sono errori specifici, usa i fix dedicati
3. Verifica con `COMPLETE_ALL_TABLES.sql` per tabelle mancanti

## 📖 Come Usare

1. **Setup Iniziale**: Segui `setup/SETUP_DATABASE.md`
2. **Problemi Database**: Consulta `database/README.md`
3. **Fix Errori**: Usa gli script SQL nella cartella `database/`
4. **Configurazione**: Segui `setup/SUPABASE_SETUP.md`

## 🔧 Componenti Dashboard

- **FinancialManagement**: Gestione costi, budget, analisi
- **MarketingManagement**: Campagne, lead, SEO
- **ProjectManagement**: Progetti, milestone, team
- **TaskCalendar**: Task, appuntamenti, calendario
- **RecurringActivities**: Attività ricorrenti e template
- **BusinessPlan**: Piano business completo

## 📞 Supporto

Per problemi o domande:
1. Controlla prima la documentazione
2. Verifica gli errori comuni
3. Usa gli script di fix appropriati
4. Consulta i README specifici per ogni sezione