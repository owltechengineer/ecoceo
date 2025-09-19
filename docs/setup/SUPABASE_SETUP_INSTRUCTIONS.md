# 🚀 ISTRUZIONI SETUP SUPABASE - BUSINESS PLAN

## ❌ **PROBLEMA IDENTIFICATO**

L'errore `Errore nel salvataggio executive summary: {}` indica che le tabelle del Business Plan non sono state create su Supabase.

## 🔧 **SOLUZIONE: CREARE LE TABELLE**

### **Passo 1: Accedi a Supabase**
1. Vai su [https://supabase.com](https://supabase.com)
2. Accedi al tuo account
3. Seleziona il progetto: `gwieustvitlezpssjkwf`

### **Passo 2: Apri SQL Editor**
1. Nel menu laterale, clicca su **"SQL Editor"**
2. Clicca su **"New query"**

### **Passo 3: Esegui lo Schema SQL**
1. Copia tutto il contenuto del file `supabase-schema.sql`
2. Incollalo nell'editor SQL
3. Clicca su **"Run"** per eseguire lo script

### **Passo 4: Verifica le Tabelle**
Dopo aver eseguito lo script, verifica che le tabelle siano state create:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'business_plan%';
```

Dovresti vedere 8 tabelle:
- `business_plan_executive_summary`
- `business_plan_market_analysis`
- `business_plan_marketing_strategy`
- `business_plan_operational_plan`
- `business_plan_financial_plan`
- `business_plan_business_model`
- `business_plan_roadmap`
- `business_plan_documentation`

## 🧪 **TEST DOPO IL SETUP**

### **Passo 1: Usa i Componenti di Test**
1. Vai alla sezione **Business Plan** nella dashboard
2. Clicca **"Test Connessione Base"** nel primo componente
3. Verifica che appaia: `✅ Connessione Supabase OK`

### **Passo 2: Test Creazione Tabelle**
1. Clicca **"Test Creazione Tabelle"**
2. Verifica che appaia: `✅ Test completato con successo!`

### **Passo 3: Test Tutte le Tabelle**
1. Clicca **"Test Tutte le Tabelle"**
2. Verifica che tutte le 8 tabelle mostrino: `✅ [nome-tabella]: OK`

## 🔍 **DIAGNOSI ERRORI COMUNI**

### **❌ "relation does not exist"**
**Causa:** Le tabelle non sono state create
**Soluzione:** Esegui lo schema SQL su Supabase

### **❌ "permission denied"**
**Causa:** Policy RLS non configurate
**Soluzione:** Lo schema SQL include le policy, ri-esegui lo script

### **❌ "duplicate key value violates unique constraint"**
**Causa:** Dati duplicati
**Soluzione:** Usa `cleanup-database.sql` per pulire i dati

## 📋 **CHECKLIST COMPLETO**

- [ ] ✅ Accedi a Supabase
- [ ] ✅ Apri SQL Editor
- [ ] ✅ Esegui `supabase-schema.sql`
- [ ] ✅ Verifica che le 8 tabelle esistano
- [ ] ✅ Testa la connessione con i componenti
- [ ] ✅ Verifica che il salvataggio funzioni
- [ ] ✅ Verifica che il caricamento funzioni

## 🎯 **RISULTATO ATTESO**

Dopo aver completato tutti i passi:
- ✅ **Connessione Supabase** funzionante
- ✅ **8 tabelle Business Plan** create
- ✅ **Salvataggio dati** funzionante
- ✅ **Caricamento dati** funzionante
- ✅ **Business Plan** completamente operativo

---

**Status**: 🔧 **SETUP RICHIESTO** - Esegui lo schema SQL su Supabase per risolvere l'errore!
