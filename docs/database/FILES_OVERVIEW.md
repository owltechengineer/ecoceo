# 📁 Database Files Overview

## 🚀 FILE PRINCIPALI PER SETUP

### **1. SETUP COMPLETO (RACCOMANDATO)**
```
COMPLETE_DATABASE_SETUP.sql
```
- ✅ **File unico** per ricreare tutto il database
- ✅ Elimina tutte le tabelle esistenti
- ✅ Crea tutte le tabelle necessarie
- ✅ Include trigger, RLS, policy e dati di esempio
- ✅ **25+ tabelle** per tutte le sezioni

### **2. SETUP PER SEZIONI**
```
01_FINANCIAL_SECTION.sql    - Solo sezione finanziaria
02_MARKETING_SECTION.sql    - Solo sezione marketing  
03_PROJECTS_SECTION.sql     - Solo sezione progetti
04_BUSINESS_PLAN_SECTION.sql - Solo business plan
```

### **3. UTILITY**
```
DROP_ALL_QUICK.sql          - Elimina tutto velocemente
INSPECT_DATABASE.sql        - Comandi per ispezionare
CLEAN_OBSOLETE_FUNCTIONS.sql - Pulisce funzioni obsolete
TEST_CONNECTION_AND_SETUP.sql - Test connessione
```

---

## 🎯 COME USARE

### **OPZIONE 1: Setup Completo (Raccomandato)**
```sql
\i docs/database/COMPLETE_DATABASE_SETUP.sql
```

### **OPZIONE 2: Setup per Sezioni**
```sql
\i docs/database/01_FINANCIAL_SECTION.sql
\i docs/database/02_MARKETING_SECTION.sql
\i docs/database/03_PROJECTS_SECTION.sql
\i docs/database/04_BUSINESS_PLAN_SECTION.sql
```

### **OPZIONE 3: Reset Completo**
```sql
\i docs/database/DROP_ALL_QUICK.sql
\i docs/database/COMPLETE_DATABASE_SETUP.sql
```

### **OPZIONE 4: Componente React**
```tsx
<DatabaseSetup />
```

---

## 📊 TABELLE INCLUSE

### **🏠 DASHBOARD (1 tabella)**
- `dashboard_data` - Dati dashboard principale

### **💰 FINANZIARIO (5 tabelle)**
- `financial_departments` - Dipartimenti
- `financial_revenues` - Entrate
- `financial_fixed_costs` - Costi fissi
- `financial_variable_costs` - Costi variabili
- `financial_budgets` - Budget

### **📈 BUSINESS PLAN (15 tabelle)**
- `business_plan` - Piano principale
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

### **📢 MARKETING (3 tabelle)**
- `marketing_campaigns` - Campagne
- `marketing_leads` - Lead
- `marketing_budgets` - Budget marketing

### **📋 PROGETTI E TASK (4 tabelle)**
- `projects` - Progetti
- `tasks` - Task
- `task_calendar_appointments` - Appuntamenti calendario
- `quick_tasks` - Task veloci

---

## 🔧 CARATTERISTICHE

### **✅ COMPLETO**
- **25+ tabelle** per tutte le sezioni
- **Trigger** automatici per `updated_at`
- **RLS** (Row Level Security) abilitato
- **Policy** permissive per sviluppo
- **Foreign key** relationships
- **Dati di esempio** per test

### **✅ SICURO**
- Elimina tabelle esistenti prima di creare
- Elimina funzioni obsolete
- Configurazione RLS corretta
- Policy permissive per sviluppo

### **✅ PRONTO ALL'USO**
- Nessun errore di dipendenze
- Struttura completa
- Dati di esempio inclusi

---

## 🚨 ERRORI COMUNI

### **PGRST202 - Funzione non trovata**
```sql
\i docs/database/CLEAN_OBSOLETE_FUNCTIONS.sql
```

### **42P01 - Tabella non esiste**
```sql
\i docs/database/COMPLETE_DATABASE_SETUP.sql
```

### **42P13 - Tipo ritorno funzione**
```sql
\i docs/database/COMPLETE_DATABASE_SETUP.sql
```

---

## 📞 SUPPORTO

Per problemi:
1. Controlla gli errori comuni sopra
2. Usa `COMPLETE_DATABASE_SETUP.sql` per reset completo
3. Verifica l'ordine di esecuzione
4. Consulta i log di Supabase per dettagli

---

## 🎯 RACCOMANDAZIONE

**Usa sempre `COMPLETE_DATABASE_SETUP.sql` per setup completo!**

È il file più affidabile e include tutto il necessario per ricreare il database da zero.
