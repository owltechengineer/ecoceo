# 🔧 Troubleshooting Documentation

Questa sezione contiene guide per risolvere problemi comuni della dashboard.

## 📋 File Disponibili

### 🗄️ Database
- **[COMPLETE_ALL_TABLES.sql](../database/COMPLETE_ALL_TABLES.sql)** - Fix per tabelle mancanti
- **[FIX_FINANCIAL_FUNCTIONS.sql](../database/FIX_FINANCIAL_FUNCTIONS.sql)** - Fix funzioni finanziarie
- **[IMMEDIATE_FIX.sql](../database/IMMEDIATE_FIX.sql)** - Fix immediato errori comuni

## 🚨 Errori Comuni e Soluzioni

### PGRST202 - Funzione non trovata
```
Error: Could not find the function public.get_cost_distribution
```
**Soluzione**: Esegui `FIX_FINANCIAL_FUNCTIONS.sql`

### 42P01 - Tabella non esiste
```
ERROR: 42P01: relation "projects_projects" does not exist
```
**Soluzione**: Esegui `COMPLETE_ALL_TABLES.sql`

### 42P13 - Tipo ritorno funzione
```
ERROR: 42P13: cannot change return type of existing function
```
**Soluzione**: Esegui `UNIFIED_DATABASE_SCHEMA.sql`

### Errori di salvataggio
**Soluzione**: Verifica che tutte le tabelle esistano

### Errori di caricamento dati
**Soluzione**: Controlla le policy RLS

## 🔧 Procedura di Fix

### 1. Identifica l'Errore
- Controlla i log di Supabase
- Identifica il tipo di errore
- Localizza la tabella/funzione coinvolta

### 2. Applica il Fix
- Usa lo script appropriato
- Segui l'ordine di esecuzione
- Verifica il risultato

### 3. Verifica la Soluzione
- Testa la funzionalità
- Controlla i log
- Verifica i dati

## 📞 Supporto

Per problemi:
1. Controlla gli errori comuni
2. Usa gli script di fix
3. Verifica la documentazione
4. Consulta i log di Supabase
