# 🚀 Setup Database - Guida Rapida

## ⚡ Setup in 3 Step

### 1️⃣ Esegui Script SQL
```bash
Supabase Dashboard → SQL Editor → New Query
Copia e incolla: ESSENTIAL_SETUP.sql
Click "Run"
```

### 2️⃣ Reload Schema
```bash
Supabase → Settings → API → Reload schema
```

### 3️⃣ Riavvia Server
```bash
npm run dev
```

---

## 📁 File Disponibili

| File | Quando Usarlo |
|------|---------------|
| **ESSENTIAL_SETUP.sql** | ⭐ Setup veloce (CONSIGLIATO) |
| MASTER_DATABASE_SETUP.sql | Setup completo con trigger avanzati |
| FIX_SCHEMA_CACHE.sql | Problemi di cache/connessione |
| QUOTES_TABLE.sql | Solo preventivi |
| QUICK_TASKS_TABLE.sql | Solo quick tasks |

---

## ✅ Tabelle Create

### Marketing
- campaigns (campagne)
- leads (potenziali clienti)

### Progetti & Task
- task_calendar_projects
- task_calendar_tasks
- task_calendar_appointments
- recurring_activities
- quick_tasks

### Finanza
- financial_fixed_costs
- financial_variable_costs
- financial_revenues
- financial_budgets

### Magazzino
- warehouse_categories (con 4 categorie precaricate)
- warehouse_items

### Preventivi
- quotes (con numerazione automatica QT-2025-0001)
- quote_items
- quote_settings (personalizzazione)

---

## 🐛 Problemi?

### "Could not find table in schema cache"
→ Esegui FIX_SCHEMA_CACHE.sql

### "No rows returned"
→ Normale! Significa che lo script è stato eseguito correttamente

### Dati non caricano
→ Reload schema + riavvia npm run dev

---

## 📞 Support

Tutti gli script includono:
- `IF NOT EXISTS` (sicuro da rieseguire)
- Policy RLS "Allow All" per testing
- Commenti esplicativi

Esegui ESSENTIAL_SETUP.sql e sei pronto! 🎉
