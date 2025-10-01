# 📦 Setup Database - Magazzino e Preventivi

## 🎯 Panoramica

Sistema completo per la gestione di:
- **Magazzino e Inventario** 📦
- **Preventivi Personalizzati** 📄
- **Fornitori** 🏪
- **Movimenti di Carico/Scarico** 📊

## ⚡ Installazione Rapida

### 1. Esegui lo Script Completo

```bash
# Vai su Supabase Dashboard → SQL Editor
# Copia e incolla il contenuto di:
COMPLETE_WAREHOUSE_QUOTES_SETUP.sql
# Click "Run"
```

### 2. Verifica Tabelle Create

```sql
-- Verifica categorie
SELECT * FROM warehouse_categories;

-- Verifica articoli
SELECT * FROM warehouse_items;

-- Verifica impostazioni
SELECT * FROM quote_settings;
```

## 📊 Struttura Database

### 📦 MAGAZZINO

#### `warehouse_categories`
```sql
- id (UUID)
- name (VARCHAR) - Nome categoria
- description (TEXT)
- icon (VARCHAR) - Emoji/icona
- color (VARCHAR) - Colore esadecimale
- sort_order (INTEGER)
```

**Categorie Default:**
- 💻 Elettronica
- 🖱️ Accessori
- 💾 Software
- ⚙️ Servizi

#### `warehouse_items`
```sql
- id (UUID)
- sku (VARCHAR) - Codice univoco
- name (VARCHAR) - Nome prodotto
- description (TEXT)
- category_id (UUID) - FK a warehouse_categories

-- Prezzi
- purchase_price (DECIMAL) - Prezzo acquisto
- sale_price (DECIMAL) - Prezzo vendita
- tax_rate (DECIMAL) - Aliquota IVA

-- Inventario
- quantity (INTEGER) - Quantità disponibile
- unit (VARCHAR) - Unità di misura (pz, kg, etc.)
- min_stock (INTEGER) - Scorta minima
- max_stock (INTEGER) - Scorta massima
- location (VARCHAR) - Posizione in magazzino

-- Media
- image_url (TEXT) - URL immagine prodotto

-- Metadata
- is_active (BOOLEAN)
- notes (TEXT)
- created_at, updated_at
```

#### `warehouse_movements`
```sql
- id (UUID)
- item_id (UUID) - FK a warehouse_items
- movement_type (VARCHAR) - 'in', 'out', 'adjustment'
- quantity (INTEGER)
- reference_type (VARCHAR) - Tipo operazione
- reference_id (UUID) - ID operazione correlata
- notes (TEXT)
- created_at
```

**Trigger Automatico:**
- ✅ Aggiorna quantità articolo automaticamente dopo movimento

### 📄 PREVENTIVI

#### `quotes` (già esistente - da QUOTES_TABLE.sql)
```sql
- id (UUID)
- quote_number (VARCHAR) - Numero progressivo (QT-2025-0001)
- client_name, client_email, client_address
- language (VARCHAR)
- subtotal, tax, total (DECIMAL)
- valid_until (DATE)
- notes (TEXT)
- status (VARCHAR) - draft, sent, accepted, rejected
```

#### `quote_items` (già esistente)
```sql
- id (UUID)
- quote_id (UUID) - FK a quotes
- item_id (VARCHAR) - Riferimento a warehouse_items
- name, description
- quantity (INTEGER)
- unit_price, total (DECIMAL)
```

#### `quote_settings` (NUOVO)
```sql
-- Dati Azienda
- company_name (VARCHAR)
- company_address, company_city, company_zip, company_country
- company_phone, company_email, company_website
- company_logo_url (TEXT)

-- Dati Fiscali
- vat_number (VARCHAR) - P.IVA
- tax_code (VARCHAR) - Codice Fiscale
- pec (VARCHAR) - PEC
- sdi_code (VARCHAR) - Codice SDI (7 caratteri)

-- Dati Bancari
- bank_name (VARCHAR)
- iban (VARCHAR)
- swift (VARCHAR)

-- Testi Personalizzati
- footer_text (TEXT)
- terms_and_conditions (TEXT) - Supporta {days} placeholder
- legal_note (TEXT) - Note privacy/GDPR

-- Personalizzazione Visiva
- primary_color (VARCHAR) - Colore primario
- secondary_color (VARCHAR) - Colore secondario
- show_logo, show_footer, show_bank_details, show_terms (BOOLEAN)
- default_validity_days (INTEGER)
```

### 🏪 FORNITORI

#### `suppliers`
```sql
- id (UUID)
- name (VARCHAR)
- contact_person (VARCHAR)
- email, phone (VARCHAR)
- address (TEXT)
- vat_number (VARCHAR)
- payment_terms (INTEGER) - Giorni di pagamento
- notes (TEXT)
- is_active (BOOLEAN)
```

## 🔧 Funzionalità Avanzate

### 📊 Valore Totale Magazzino
```sql
SELECT get_total_warehouse_value();
```

### ⚠️ Articoli Sotto Scorta
```sql
SELECT * FROM get_low_stock_items();
```

### 📈 Vista Riepilogo
```sql
SELECT * FROM warehouse_summary;
-- Mostra: articoli, categorie, valori, stato scorte
```

## 🎨 Integrazione Frontend

### Warehouse Service (da creare)
```typescript
import { supabase } from '@/lib/supabase';

// Carica articoli
const { data: items } = await supabase
  .from('warehouse_items')
  .select(`
    *,
    category:warehouse_categories(name, icon, color)
  `)
  .eq('is_active', true)
  .order('name');

// Aggiungi articolo
const { data } = await supabase
  .from('warehouse_items')
  .insert({
    sku: 'PROD-001',
    name: 'Prodotto',
    sale_price: 99.99,
    quantity: 10,
    category_id: 'uuid...'
  });

// Movimento magazzino (aggiorna quantità automaticamente)
await supabase
  .from('warehouse_movements')
  .insert({
    item_id: 'uuid...',
    movement_type: 'in',  // o 'out'
    quantity: 5,
    notes: 'Carico merce'
  });
```

### Quote Settings Service (da creare)
```typescript
// Carica impostazioni
const { data: settings } = await supabase
  .from('quote_settings')
  .select('*')
  .single();

// Salva/Aggiorna impostazioni
const { data } = await supabase
  .from('quote_settings')
  .upsert({
    user_id: 'uuid...',
    company_name: 'La Mia Azienda',
    vat_number: 'IT12345678901',
    iban: 'IT60...',
    primary_color: '#2563eb'
  });
```

## 📋 Workflow Completo

### 1. Setup Iniziale
```sql
-- Esegui COMPLETE_WAREHOUSE_QUOTES_SETUP.sql
-- Le categorie vengono create automaticamente
```

### 2. Aggiungi Articoli
```sql
INSERT INTO warehouse_items (
  sku, name, description, category_id, 
  sale_price, quantity, unit, min_stock, location
) 
SELECT 
  'LAPTOP-001',
  'Laptop Dell XPS 13',
  'Ultrabook Intel i7',
  id,
  1299.00,
  10,
  'pz',
  3,
  'A1-B2'
FROM warehouse_categories WHERE name = 'Elettronica';
```

### 3. Configura Impostazioni Preventivo
```sql
INSERT INTO quote_settings (
  user_id,
  company_name,
  vat_number,
  iban
) VALUES (
  'your-user-id',
  'La Tua Azienda S.r.l.',
  'IT12345678901',
  'IT60...'
);
```

### 4. Crea Preventivo
```typescript
// 1. Seleziona articoli da magazzino
// 2. Genera preventivo (usa quote_settings per dati azienda)
// 3. Salva in quotes + quote_items
// 4. Genera PDF con dati da quote_settings
```

## 🔍 Query Utili

### Articoli più venduti
```sql
SELECT 
  wi.name,
  wi.sku,
  COUNT(qi.id) AS times_quoted,
  SUM(qi.quantity) AS total_quantity
FROM warehouse_items wi
JOIN quote_items qi ON qi.item_id = wi.sku
GROUP BY wi.id, wi.name, wi.sku
ORDER BY times_quoted DESC
LIMIT 10;
```

### Valore magazzino per categoria
```sql
SELECT 
  wc.name AS category,
  COUNT(wi.id) AS items_count,
  SUM(wi.quantity) AS total_quantity,
  SUM(wi.sale_price * wi.quantity) AS total_value
FROM warehouse_items wi
JOIN warehouse_categories wc ON wi.category_id = wc.id
WHERE wi.is_active = true
GROUP BY wc.name
ORDER BY total_value DESC;
```

### Storico movimenti articolo
```sql
SELECT 
  wm.created_at,
  wm.movement_type,
  wm.quantity,
  wm.notes,
  wi.name AS item_name
FROM warehouse_movements wm
JOIN warehouse_items wi ON wm.item_id = wi.id
WHERE wi.sku = 'LAPTOP-001'
ORDER BY wm.created_at DESC;
```

## 🛡️ Sicurezza (RLS)

**Attuale:** Policy "Allow All" per testing

**Produzione (da implementare):**
```sql
-- Solo utenti autenticati
CREATE POLICY "Authenticated users"
  ON warehouse_items
  FOR ALL
  USING (auth.uid() IS NOT NULL);

-- Impostazioni solo per proprietario
CREATE POLICY "Own settings only"
  ON quote_settings
  FOR ALL
  USING (auth.uid() = user_id);
```

## ✅ Checklist Setup

- [ ] Eseguito COMPLETE_WAREHOUSE_QUOTES_SETUP.sql
- [ ] Verificate categorie create (4 default)
- [ ] Creati articoli di test
- [ ] Configurate quote_settings
- [ ] Testato movimento magazzino
- [ ] Verificato trigger quantità
- [ ] Integrato frontend
- [ ] Testata generazione preventivo con settings

## 🚀 Prossimi Step

1. **Frontend Service**: Creare `warehouseService` in `src/lib/supabase.ts`
2. **UI Magazzino**: Collegare UI a database reale
3. **Quote Settings**: Caricare da DB invece di localStorage
4. **Template PDF**: Usare `quote_settings` per generare PDF
5. **Movimenti**: Implementare UI per carico/scarico
6. **Fornitori**: Aggiungere gestione fornitori
7. **Stats Dashboard**: Visualizzare metriche magazzino

## 📚 File Correlati

- `WAREHOUSE_TABLES.sql` - Solo tabelle magazzino
- `QUOTE_SETTINGS_TABLE.sql` - Solo impostazioni preventivi
- `QUOTES_TABLE.sql` - Tabelle preventivi (già esistente)
- `COMPLETE_WAREHOUSE_QUOTES_SETUP.sql` - **Setup completo** ⭐

## 🐛 Troubleshooting

### Errore: "relation already exists"
```sql
-- Alcune tabelle già esistono, OK!
-- Lo script usa "IF NOT EXISTS"
```

### Errore: Policy già esistente
```sql
-- Lo script usa "DROP POLICY IF EXISTS"
-- Riesegui l'intero script
```

### Quantità non si aggiorna
```sql
-- Verifica trigger
SELECT * FROM pg_trigger 
WHERE tgname = 'trigger_update_item_quantity';

-- Verifica movimenti
SELECT * FROM warehouse_movements 
ORDER BY created_at DESC LIMIT 10;
```

---

**Sistema magazzino e preventivi completo! 🎉**

Esegui lo script e inizia a gestire il tuo inventario!
