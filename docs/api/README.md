# 🔌 API Documentation

Questa sezione contiene la documentazione per le API e servizi della dashboard.

## 📋 File Disponibili

### 🗄️ Database
- **[COMPLETE_ALL_TABLES.sql](../database/COMPLETE_ALL_TABLES.sql)** - Include funzioni API

## 🎯 Funzioni API Principali

### get_cost_distribution()
- **Parametri**: `p_cost_id UUID`, `p_cost_type TEXT`
- **Ritorna**: Distribuzione costi per dipartimento
- **Uso**: Analisi distribuzione costi

### distribute_cost()
- **Parametri**: `p_cost_id UUID`, `p_cost_type TEXT`, `p_distributions JSONB`
- **Ritorna**: void
- **Uso**: Distribuisce costi tra dipartimenti

### generate_recurring_costs()
- **Parametri**: nessuno
- **Ritorna**: void
- **Uso**: Genera costi ricorrenti automaticamente

### generate_recurring_activities()
- **Parametri**: `p_start_date DATE`, `p_end_date DATE`
- **Ritorna**: Attività generate
- **Uso**: Genera attività ricorrenti

### generate_week_from_template()
- **Parametri**: `p_template_id UUID`, `p_week_start_date DATE`
- **Ritorna**: Task generati
- **Uso**: Genera settimana da template

### exec_sql()
- **Parametri**: `sql TEXT`
- **Ritorna**: Risultato esecuzione
- **Uso**: Esegue SQL dinamico

## 🚨 Errori Comuni

### Funzione non trovata
**Soluzione**: Esegui `FIX_FINANCIAL_FUNCTIONS.sql`

### Parametri errati
**Soluzione**: Verifica i tipi di parametri

### Errori esecuzione
**Soluzione**: Controlla i log di Supabase

## 📞 Supporto

Per problemi API:
1. Verifica le funzioni database
2. Controlla i log di Supabase
3. Usa gli script di fix appropriati
4. Consulta la documentazione database
