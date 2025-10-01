# 🔧 Fix Problemi Connessione Supabase

## 🐛 Problema
```
"Could not find the table in the schema cache"
"Errore caricamento progetti/campagne/lead"
```

## ✅ Soluzione Completa

### PASSO 1: Verifica Variabili d'Ambiente

Crea/Modifica il file `.env.local` nella root del progetto:

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://gwieustvitlezpssjkwf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_here
```

**⚠️ IMPORTANTE:**
- Il nome DEVE essere `NEXT_PUBLIC_SUPABASE_ANON_KEY` (non `SUPABASE_KEY`)
- Devi trovare la tua chiave su Supabase Dashboard

**Come trovare la chiave:**
1. Vai su: https://supabase.com/dashboard
2. Seleziona il tuo progetto
3. Vai su: Settings → API
4. Copia `anon/public` key (NON la service_role key!)
5. Incolla in `.env.local`

---

### PASSO 2: Verifica Client Supabase

Il file `src/lib/supabase.ts` DEVE contenere:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

**✅ Questo è GIÀ corretto nel tuo progetto!**

---

### PASSO 3: Esegui Script SQL

#### A. Diagnostica (ESEGUI PRIMA)
```bash
# Supabase Dashboard → SQL Editor
# Copia e incolla: docs/database/FIX_SCHEMA_CACHE.sql
# Click "Run"
# Leggi l'output nella console
```

**Output esempio:**
```
✅ campaigns: 5 records
✅ leads: 12 records
❌ task_calendar_projects: ERRORE - relation does not exist
```

#### B. Crea Tabelle Mancanti
```bash
# SE vedi tabelle con ❌:
# Esegui: docs/database/MASTER_DATABASE_SETUP.sql
# Questo crea TUTTE le tabelle necessarie
```

---

### PASSO 4: Reload Schema su Supabase

1. Vai su: **Supabase Dashboard**
2. Click su: **Settings** → **API**
3. Scroll down fino a: **PostgREST Settings**
4. Click su: **Reload schema** (o **Restart API**)
5. Aspetta 10-15 secondi

---

### PASSO 5: Riavvia Dev Server

```bash
# Nel terminale, ferma il server (Ctrl+C)
# Poi:
npm run dev
```

---

### PASSO 6: Verifica Console Browser

Apri la console del browser (F12) e cerca:
- ❌ Errori rossi di Supabase
- ⚠️ Warning sulle tabelle
- ✅ Log di caricamento dati

---

## 🔍 Verifica Rapida

### Test Connessione Supabase

Apri console browser e digita:

```javascript
// Test 1: Verifica URL
console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);

// Test 2: Verifica Key
console.log('Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'OK' : 'MANCANTE');

// Test 3: Test query
const { data, error } = await supabase.from('campaigns').select('*').limit(1);
console.log('Test query:', data, error);
```

**Risultati attesi:**
```
URL: https://gwieustvitlezpssjkwf.supabase.co
Key: OK
Test query: [Array] undefined
```

**Se vedi:**
```
URL: undefined  ❌
Key: MANCANTE  ❌
```
→ **Il file .env.local non esiste o ha nomi sbagliati!**

---

## 🎯 Checklist Completa

- [ ] File `.env.local` esiste nella root
- [ ] Contiene `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Contiene `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Eseguito `FIX_SCHEMA_CACHE.sql`
- [ ] Tutte le tabelle mostrano ✅
- [ ] Eseguito "Reload schema" su Supabase
- [ ] Riavviato `npm run dev`
- [ ] Console browser senza errori Supabase
- [ ] Progetti/Campagne/Lead caricano correttamente

---

## 🚨 Errori Comuni

### Errore: "anon key is undefined"
```bash
# Fix:
# Crea .env.local con la chiave corretta
# Riavvia npm run dev
```

### Errore: "relation does not exist"
```bash
# Fix:
# Esegui MASTER_DATABASE_SETUP.sql
# Reload schema su Supabase
```

### Errore: "permission denied"
```bash
# Fix:
# Esegui FIX_SCHEMA_CACHE.sql
# Ricrea policy Allow All
```

### Errore: "schema cache"
```bash
# Fix:
# NOTIFY pgrst (incluso in FIX_SCHEMA_CACHE.sql)
# Restart API su Supabase
```

---

## 📞 Next Steps

1. **Crea/Verifica `.env.local`** con le chiavi corrette
2. **Esegui `FIX_SCHEMA_CACHE.sql`** e guarda l'output
3. **Dimmi quali tabelle mostrano ❌** così creo quelle specifiche
4. **Reload schema** su Supabase
5. **Riavvia** il dev server

Fatto questo, il sistema dovrebbe tornare a funzionare! 🚀
