# 🧪 Guida Test Database Supabase

## 📋 RISULTATI TEST ATTUALE

### ✅ **CONNESSIONE OK**
- URL Supabase: ✅ Presente
- Chiave API: ✅ Presente  
- Connessione: ✅ Funzionante

### ✅ **TABELLE OK** (16/16)
- task_calendar_projects ✅
- task_calendar_tasks ✅
- task_calendar_appointments ✅
- recurring_activities ✅
- quick_tasks ✅
- campaigns ✅
- leads ✅
- financial_fixed_costs ✅
- financial_variable_costs ✅
- financial_revenues ✅
- financial_budgets ✅
- warehouse_categories ✅ (1 record)
- warehouse_items ✅
- quotes ✅
- quote_items ✅
- quote_settings ✅

### ❌ **PROBLEMA IDENTIFICATO**
- **Colonne user_id mancanti** in 5 tabelle
- Questo causa gli errori nel frontend

---

## 🔧 SOLUZIONE

### **1️⃣ Esegui Fix in Supabase:**

1. Vai su **Supabase Dashboard**
2. **SQL Editor** → **New Query**
3. Copia e incolla questo script:

```sql
-- Aggiungi user_id alle tabelle che ne hanno bisogno
ALTER TABLE task_calendar_tasks 
ADD COLUMN IF NOT EXISTS user_id VARCHAR(255) DEFAULT 'default-user';

ALTER TABLE task_calendar_appointments 
ADD COLUMN IF NOT EXISTS user_id VARCHAR(255) DEFAULT 'default-user';

ALTER TABLE task_calendar_projects 
ADD COLUMN IF NOT EXISTS user_id VARCHAR(255) DEFAULT 'default-user';

ALTER TABLE recurring_activities 
ADD COLUMN IF NOT EXISTS user_id VARCHAR(255) DEFAULT 'default-user';

ALTER TABLE quick_tasks 
ADD COLUMN IF NOT EXISTS user_id VARCHAR(255) DEFAULT 'default-user';

-- Aggiorna tutti i record esistenti con user_id di default
UPDATE task_calendar_tasks SET user_id = 'default-user' WHERE user_id IS NULL;
UPDATE task_calendar_appointments SET user_id = 'default-user' WHERE user_id IS NULL;
UPDATE task_calendar_projects SET user_id = 'default-user' WHERE user_id IS NULL;
UPDATE recurring_activities SET user_id = 'default-user' WHERE user_id IS NULL;
UPDATE quick_tasks SET user_id = 'default-user' WHERE user_id IS NULL;

-- Notifica refresh schema
NOTIFY pgrst, 'reload schema';
```

4. Click **"Run"**

### **2️⃣ Reload Schema:**
- **Settings** → **API** → Scroll down → **"Reload schema"**

### **3️⃣ Testa il Fix:**
```bash
node scripts/test-after-fix.js
```

### **4️⃣ Riavvia Server:**
```bash
npm run dev
```

---

## 🧪 SCRIPT DI TEST

### **Test Connessione Completa:**
```bash
node scripts/test-database-connection.js
```

### **Test Dopo Fix:**
```bash
node scripts/test-after-fix.js
```

---

## ✅ RISULTATO ATTESO

Dopo il fix dovresti vedere:
```
🎉 TUTTE LE COLONNE USER_ID SONO OK!
✅ Il database è pronto per l'uso!
```

---

## 🚀 PROSSIMI PASSI

1. **Esegui il fix SQL** in Supabase
2. **Reload schema** 
3. **Testa con script**
4. **Riavvia npm run dev**
5. **Testa Task e Calendario** nel frontend

Il database funzionerà perfettamente! 🎉
