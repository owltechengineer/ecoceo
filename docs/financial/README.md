# 💰 Financial Documentation

Questa sezione contiene la documentazione per il modulo finanziario della dashboard.

## 📋 File Disponibili

### 🗄️ Database
- **[FINANCIAL_MANAGEMENT_SCHEMA.sql](../database/FINANCIAL_MANAGEMENT_SCHEMA.sql)** - Schema completo tabelle finanziarie
- **[FIX_FINANCIAL_FUNCTIONS.sql](../database/FIX_FINANCIAL_FUNCTIONS.sql)** - Fix funzioni finanziarie

## 🎯 Funzionalità Finanziarie

### Gestione Dipartimenti
- Creazione dipartimenti
- Color coding
- Budget allocation
- Cost distribution

### Costi Fissi
- Gestione costi fissi
- Frequency settings (daily, weekly, monthly, quarterly, yearly)
- Auto-generation
- Payment tracking

### Costi Variabili
- Gestione costi variabili
- Categories
- Date tracking
- Payment status

### Budget Management
- Budget planning
- Period management
- Variance tracking
- Reporting

### Revenue Tracking
- Revenue recording
- Source tracking
- Period analysis
- Growth metrics

### Cost Distribution
- Department allocation
- Percentage distribution
- Amount calculation
- Reporting

## 🚨 Errori Comuni

### PGRST202 - Funzione non trovata
```
Error: Could not find the function public.get_cost_distribution
```
**Soluzione**: Esegui `FIX_FINANCIAL_FUNCTIONS.sql`

### Costi non caricati
**Soluzione**: Verifica che le tabelle finanziarie esistano

### Errori distribuzione costi
**Soluzione**: Verifica la funzione `get_cost_distribution`

## 📞 Supporto

Per problemi finanziari:
1. Verifica le tabelle database
2. Controlla i log di Supabase
3. Usa gli script di fix appropriati
4. Consulta la documentazione database
