# 📄 Setup Tabelle Preventivi (Quotes)

## 🎯 Panoramica
Sistema completo per la gestione dei preventivi con numerazione automatica, tracking stati e integrazione completa con il magazzino.

## 📋 Prerequisiti
- Supabase attivo
- Accesso al SQL Editor
- Autenticazione configurata (opzionale per RLS)

## ⚡ Installazione Rapida

### 1. Esegui lo script SQL
```bash
# Apri Supabase Dashboard → SQL Editor
# Copia e incolla il contenuto di QUOTES_TABLE.sql
# Click su "Run"
```

### 2. Verifica Tabelle Create
```sql
-- Verifica tabella preventivi
SELECT * FROM quotes LIMIT 10;

-- Verifica tabella articoli preventivi
SELECT * FROM quote_items LIMIT 10;

-- Verifica trigger numerazione automatica
SELECT generate_quote_number();
```

## 📊 Struttura Database

### Tabella `quotes`
```sql
quotes (
  id UUID PRIMARY KEY,
  quote_number VARCHAR(50) UNIQUE,  -- Auto: QT-2025-0001
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255),
  client_address TEXT,
  language VARCHAR(10) DEFAULT 'it',
  subtotal DECIMAL(10, 2),
  tax DECIMAL(10, 2),
  total DECIMAL(10, 2),
  valid_until DATE,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### Tabella `quote_items`
```sql
quote_items (
  id UUID PRIMARY KEY,
  quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE,
  item_id VARCHAR(50),  -- Reference to warehouse item
  name VARCHAR(255) NOT NULL,
  description TEXT,
  quantity INTEGER,
  unit_price DECIMAL(10, 2),
  total DECIMAL(10, 2)
)
```

## 🔧 Funzionalità Principali

### 1. Numerazione Automatica
```sql
-- Formato: QT-ANNO-NUMERO
-- Esempio: QT-2025-0001, QT-2025-0002, ...
```

### 2. Stati Preventivo
- `draft` - Bozza (creato ma non inviato)
- `sent` - Inviato al cliente
- `accepted` - Accettato dal cliente
- `rejected` - Rifiutato dal cliente
- `expired` - Scaduto

### 3. Trigger Automatici
- **Auto-numero**: Genera automaticamente numero progressivo
- **Updated_at**: Aggiorna timestamp alla modifica

## 🎨 Integrazione Frontend

### Import Service
```typescript
import { quotesService } from '@/lib/supabase';
```

### Salva Preventivo
```typescript
const quote = await quotesService.saveQuote({
  clientName: 'Mario Rossi',
  clientEmail: 'mario@example.com',
  clientAddress: 'Via Roma 1, Milano',
  language: 'it',
  subtotal: 1000.00,
  tax: 220.00,
  total: 1220.00,
  validUntil: '2025-10-30',
  notes: 'Preventivo personalizzato',
  status: 'sent',
  items: [
    {
      itemId: 'LAPTOP-001',
      name: 'Laptop Dell XPS 13',
      description: 'Ultrabook i7',
      quantity: 1,
      unitPrice: 1299.00,
      total: 1299.00
    }
  ]
});
```

### Carica Preventivi
```typescript
const quotes = await quotesService.loadQuotes();
console.log(`Caricati ${quotes.length} preventivi`);
```

### Aggiorna Stato
```typescript
await quotesService.updateQuoteStatus(quoteId, 'accepted');
```

### Elimina Preventivo
```typescript
await quotesService.deleteQuote(quoteId);
```

## 🔍 Query Utili

### Statistiche Preventivi
```sql
-- Preventivi per stato
SELECT status, COUNT(*) as count, SUM(total) as total_amount
FROM quotes
GROUP BY status;

-- Preventivi del mese
SELECT COUNT(*) as count, SUM(total) as revenue
FROM quotes
WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)
  AND status IN ('sent', 'accepted');

-- Top 10 clienti
SELECT client_name, COUNT(*) as quote_count, SUM(total) as total_revenue
FROM quotes
GROUP BY client_name
ORDER BY total_revenue DESC
LIMIT 10;
```

### Articoli più Venduti
```sql
SELECT 
  qi.name, 
  SUM(qi.quantity) as total_quantity,
  COUNT(DISTINCT qi.quote_id) as times_quoted,
  SUM(qi.total) as total_revenue
FROM quote_items qi
JOIN quotes q ON q.id = qi.quote_id
WHERE q.status = 'accepted'
GROUP BY qi.name
ORDER BY total_revenue DESC
LIMIT 10;
```

## 🛡️ Sicurezza (RLS)

Le policy sono configurate per permettere tutte le operazioni (per testing).  
**In produzione, personalizza le policy:**

```sql
-- Esempio: Solo utenti autenticati
DROP POLICY IF EXISTS "Allow all operations on quotes" ON quotes;

CREATE POLICY "Authenticated users can manage quotes"
  ON quotes
  FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);
```

## 📝 Checklist Installazione

- [x] Script SQL eseguito
- [ ] Tabelle `quotes` e `quote_items` create
- [ ] Trigger per numerazione automatica attivi
- [ ] Policy RLS configurate
- [ ] Frontend integrato (`quotesService`)
- [ ] Test salvataggio preventivo
- [ ] Test caricamento preventivi
- [ ] Test eliminazione preventivo

## 🚀 Test Rapido

```typescript
// 1. Vai su: /dashboard → Magazzino e Documenti
// 2. Click su "📄 Nuovo Preventivo"
// 3. Seleziona articoli dal magazzino
// 4. Compila dati cliente
// 5. Click "📄 Genera Preventivo PDF"
// 6. Vai su tab "📄 Preventivi"
// 7. Verifica che il preventivo sia salvato!
```

## 🐛 Troubleshooting

### Errore: "relation quotes does not exist"
```sql
-- Riesegui lo script QUOTES_TABLE.sql
```

### Errore: "policy ... already exists"
```sql
-- Lo script gestisce automaticamente con DROP POLICY IF EXISTS
-- Se persiste, elimina manualmente e riesegui:
DROP POLICY IF EXISTS "Allow all operations on quotes" ON quotes;
```

### Numero preventivo non generato
```sql
-- Verifica funzione trigger
SELECT generate_quote_number();
-- Dovrebbe restituire: QT-2025-0001 (o successivo)
```

## 📚 Risorse Aggiuntive

- **File SQL**: `docs/database/QUOTES_TABLE.sql`
- **Service Frontend**: `src/lib/supabase.ts` (quotesService)
- **UI Component**: `src/components/Dashboard/WarehouseManagement.tsx`
- **Docs Supabase**: https://supabase.com/docs

## ✅ Completato!

Il sistema preventivi è ora attivo! 🎉

**Prossimi Step:**
- Implementare invio email automatico
- Aggiungere template PDF personalizzabili
- Creare dashboard analytics preventivi
- Integrazione firma digitale
