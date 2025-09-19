# 🚀 Configurazione Supabase - ISTRUZIONI COMPLETE

## ✅ **CREDENZIALI FORNITE**
- **URL**: `https://gwieustvitlezpssjkwf.supabase.co`
- **API Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3aWV1c3R2aXRsZXpwc3Nqa3dmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNDQ4NTQsImV4cCI6MjA3MjkyMDg1NH0.1FQV_na_0f5fOyZ_9bMi6IjjytmkGbXbYgjzrvi0wXs`

## 📋 **PASSI PER LA CONFIGURAZIONE**

### 1. **Crea il file `.env.local`**
Nella root del progetto, crea il file `.env.local` con questo contenuto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://gwieustvitlezpssjkwf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3aWV1c3R2aXRsZXpwc3Nqa3dmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNDQ4NTQsImV4cCI6MjA3MjkyMDg1NH0.1FQV_na_0f5fOyZ_9bMi6IjjytmkGbXbYgjzrvi0wXs
```

### 2. **Configura il Database Supabase**

#### A. Vai al tuo progetto Supabase
- Apri [https://supabase.com/dashboard](https://supabase.com/dashboard)
- Seleziona il progetto `gwieustvitlezpssjkwf`

#### B. Apri l'SQL Editor
- Nel menu laterale, clicca su "SQL Editor"
- Clicca su "New query"

#### C. Esegui lo Schema SQL
Copia e incolla tutto il contenuto del file `supabase-schema.sql` e clicca "Run":

```sql
-- Schema Supabase per Dashboard e Business Plan
-- Esegui questi comandi nel SQL Editor di Supabase

-- 1. Tabella dashboard_data
CREATE TABLE dashboard_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  data_type TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, data_type)
);

-- 2. Tabella business_plan
CREATE TABLE business_plan (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  section TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, section)
);

-- 3. Indici per performance
CREATE INDEX idx_dashboard_data_user_id ON dashboard_data(user_id);
CREATE INDEX idx_dashboard_data_type ON dashboard_data(data_type);
CREATE INDEX idx_business_plan_user_id ON business_plan(user_id);
CREATE INDEX idx_business_plan_section ON business_plan(section);

-- 4. Funzione per aggiornare updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 5. Trigger per dashboard_data
CREATE TRIGGER update_dashboard_data_updated_at 
    BEFORE UPDATE ON dashboard_data 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 6. Trigger per business_plan
CREATE TRIGGER update_business_plan_updated_at 
    BEFORE UPDATE ON business_plan 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 7. Abilita Row Level Security
ALTER TABLE dashboard_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan ENABLE ROW LEVEL SECURITY;

-- 8. Policy per dashboard_data (per ora permette tutto, in futuro con auth)
CREATE POLICY "Allow all operations for now" ON dashboard_data
    FOR ALL USING (true);

-- 9. Policy per business_plan (per ora permette tutto, in futuro con auth)
CREATE POLICY "Allow all operations for now" ON business_plan
    FOR ALL USING (true);

-- 10. Inserisci dati di test
INSERT INTO dashboard_data (user_id, data_type, data) VALUES 
('default-user', 'complete', '{"projects": [], "services": [], "budgets": [], "investments": [], "rdProjects": [], "campaigns": [], "leads": [], "tasks": [], "appointments": [], "weeklyPlans": [], "timeEntries": [], "websiteAnalytics": [], "conversions": [], "shopOrders": [], "contactRequests": []}');

-- 11. Inserisci dati di test per business plan
INSERT INTO business_plan (user_id, section, data) VALUES 
('default-user', 'executive-summary', '{"id": "1", "content": "", "pitch": "", "documents": []}'),
('default-user', 'market-analysis', '{"demographics": [], "competitors": [], "swot": {"strengths": [], "weaknesses": [], "opportunities": [], "threats": []}}'),
('default-user', 'marketing-strategy', '{"id": "1", "description": "", "timeline": [], "customerJourney": ""}'),
('default-user', 'business-model', '{"id": "1", "canvas": {"keyPartners": [], "keyActivities": [], "valuePropositions": [], "customerRelationships": [], "customerSegments": [], "keyResources": [], "channels": [], "costStructure": [], "revenueStreams": []}}');
```

### 3. **Testa la Configurazione**

#### A. Avvia l'applicazione
```bash
npm run dev
```

#### B. Vai alla Dashboard
- Apri [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
- Clicca sul tab "🧪 Test Supabase"

#### C. Esegui i Test
- Clicca "🔄 Testa Connessione"
- Se tutto funziona, vedrai "Connesso a Supabase ✅"
- Clicca "📋 Test Business Plan" per testare le funzioni specifiche

### 4. **Verifica la Sincronizzazione**

#### A. Controlla il Componente SyncStatus
- In basso a destra vedrai l'indicatore di sincronizzazione
- Dovrebbe mostrare "Online" con punto verde

#### B. Testa il Business Plan
- Vai al tab "📋 Business Plan"
- Modifica qualche campo
- Clicca "💾 Salva Tutto"
- Dovresti vedere "Business Plan completo salvato con successo!"

#### C. Verifica nel Database
- Torna a Supabase Dashboard
- Vai su "Table Editor"
- Controlla le tabelle `dashboard_data` e `business_plan`
- Dovresti vedere i dati salvati

## 🎯 **COSA SUCCEDE DOPO LA CONFIGURAZIONE**

### **Sincronizzazione Automatica**
- ✅ Tutti i dati della dashboard vengono salvati automaticamente in Supabase
- ✅ Caricamento automatico all'avvio dell'applicazione
- ✅ Sincronizzazione in tempo reale ad ogni modifica
- ✅ Fallback a LocalStorage se Supabase non disponibile

### **Business Plan Management**
- ✅ Executive Summary sincronizzato
- ✅ Analisi di Mercato persistente
- ✅ Strategia Marketing salvata
- ✅ Business Model Canvas sincronizzato
- ✅ Roadmap e Obiettivi persistenti
- ✅ Documentazione e Allegati gestiti

### **Dashboard Completa**
- ✅ Progetti sincronizzati
- ✅ Finanze persistenti
- ✅ Marketing salvato
- ✅ Task e Calendario sincronizzati
- ✅ R&D persistente

## 🚨 **RISOLUZIONE PROBLEMI**

### **Errore di Connessione**
- Verifica che il file `.env.local` sia nella root del progetto
- Controlla che le credenziali siano corrette
- Assicurati che lo schema SQL sia stato eseguito

### **Errore di Permessi**
- Verifica che le RLS policies siano state create
- Controlla che le tabelle esistano nel database

### **Dati Non Sincronizzati**
- Controlla la console del browser per errori
- Verifica lo stato della connessione nel componente SyncStatus
- Prova a cliccare "🔄 Sincronizza" manualmente

## 🎉 **RISULTATO FINALE**

Dopo la configurazione, avrai:

- 🔄 **Sincronizzazione automatica** di tutti i dati
- 💾 **Persistenza cloud** con backup locale
- 🌐 **Funzionamento offline** con sync automatico
- 📊 **Business Plan completo** salvato in database
- 🚀 **Performance ottimali** con cache intelligente

**La dashboard sarà completamente integrata con Supabase e tutti i dati verranno sincronizzati automaticamente!** 🎯
