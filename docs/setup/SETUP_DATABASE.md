# 🗄️ SETUP DATABASE SUPABASE - BUSINESS PLAN

## ✅ **ISTRUZIONI PER CONFIGURARE IL DATABASE**

Per far funzionare completamente il Business Plan, devi eseguire lo schema SQL su Supabase.

## 🚀 **PASSI PER CONFIGURARE IL DATABASE**

### **1. Accedi a Supabase**
- Vai su [https://supabase.com](https://supabase.com)
- Accedi al tuo progetto: `gwieustvitlezpssjkwf`

### **2. Apri SQL Editor**
- Nel dashboard di Supabase, clicca su **"SQL Editor"** nel menu laterale
- Clicca su **"New query"**

### **3. Esegui lo Schema**
- Copia tutto il contenuto del file `supabase-schema.sql`
- Incollalo nell'editor SQL
- Clicca su **"Run"** per eseguire lo script

### **4. Verifica le Tabelle**
Dopo l'esecuzione, dovresti vedere queste tabelle create:

#### **Tabelle Business Plan**
- ✅ `business_plan_executive_summary`
- ✅ `business_plan_market_analysis`
- ✅ `business_plan_marketing_strategy`
- ✅ `business_plan_operational_plan`
- ✅ `business_plan_financial_plan`
- ✅ `business_plan_business_model`
- ✅ `business_plan_roadmap`
- ✅ `business_plan_documentation`

#### **Tabelle Dashboard**
- ✅ `dashboard_data`
- ✅ `business_plan` (tabella generica)

## 🔧 **SCHEMA SQL COMPLETO**

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

-- 11. Tabelle specifiche per Business Plan
CREATE TABLE IF NOT EXISTS business_plan_executive_summary (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  content TEXT,
  pitch TEXT,
  documents JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS business_plan_market_analysis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  demographics JSONB DEFAULT '[]',
  competitors JSONB DEFAULT '[]',
  swot JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS business_plan_marketing_strategy (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  description TEXT,
  customer_journey TEXT,
  timeline JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS business_plan_operational_plan (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  roles JSONB DEFAULT '[]',
  milestones JSONB DEFAULT '[]',
  processes JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS business_plan_financial_plan (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  revenues JSONB DEFAULT '[]',
  expenses JSONB DEFAULT '[]',
  investments JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS business_plan_business_model (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  canvas JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS business_plan_roadmap (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  objectives JSONB DEFAULT '[]',
  kpis JSONB DEFAULT '[]',
  timeline JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS business_plan_documentation (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  documents JSONB DEFAULT '[]',
  external_links JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Indici per le nuove tabelle
CREATE INDEX idx_bp_executive_summary_user_id ON business_plan_executive_summary(user_id);
CREATE INDEX idx_bp_market_analysis_user_id ON business_plan_market_analysis(user_id);
CREATE INDEX idx_bp_marketing_strategy_user_id ON business_plan_marketing_strategy(user_id);
CREATE INDEX idx_bp_operational_plan_user_id ON business_plan_operational_plan(user_id);
CREATE INDEX idx_bp_financial_plan_user_id ON business_plan_financial_plan(user_id);
CREATE INDEX idx_bp_business_model_user_id ON business_plan_business_model(user_id);
CREATE INDEX idx_bp_roadmap_user_id ON business_plan_roadmap(user_id);
CREATE INDEX idx_bp_documentation_user_id ON business_plan_documentation(user_id);

-- 13. Trigger per le nuove tabelle
CREATE TRIGGER update_bp_executive_summary_updated_at 
    BEFORE UPDATE ON business_plan_executive_summary 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bp_market_analysis_updated_at 
    BEFORE UPDATE ON business_plan_market_analysis 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bp_marketing_strategy_updated_at 
    BEFORE UPDATE ON business_plan_marketing_strategy 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bp_operational_plan_updated_at 
    BEFORE UPDATE ON business_plan_operational_plan 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bp_financial_plan_updated_at 
    BEFORE UPDATE ON business_plan_financial_plan 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bp_business_model_updated_at 
    BEFORE UPDATE ON business_plan_business_model 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bp_roadmap_updated_at 
    BEFORE UPDATE ON business_plan_roadmap 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bp_documentation_updated_at 
    BEFORE UPDATE ON business_plan_documentation 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 14. RLS per le nuove tabelle
ALTER TABLE business_plan_executive_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_market_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_marketing_strategy ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_operational_plan ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_financial_plan ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_business_model ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_roadmap ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan_documentation ENABLE ROW LEVEL SECURITY;

-- 15. Policy per le nuove tabelle
CREATE POLICY "Allow all operations for now" ON business_plan_executive_summary FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON business_plan_market_analysis FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON business_plan_marketing_strategy FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON business_plan_operational_plan FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON business_plan_financial_plan FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON business_plan_business_model FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON business_plan_roadmap FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON business_plan_documentation FOR ALL USING (true);

-- 16. Inserisci dati di test per business plan
INSERT INTO business_plan (user_id, section, data) VALUES 
('default-user', 'executive-summary', '{"id": "1", "content": "", "pitch": "", "documents": []}'),
('default-user', 'market-analysis', '{"demographics": [], "competitors": [], "swot": {"strengths": [], "weaknesses": [], "opportunities": [], "threats": []}}'),
('default-user', 'marketing-strategy', '{"id": "1", "description": "", "timeline": [], "customerJourney": ""}'),
('default-user', 'business-model', '{"id": "1", "canvas": {"keyPartners": [], "keyActivities": [], "valuePropositions": [], "customerRelationships": [], "customerSegments": [], "keyResources": [], "channels": [], "costStructure": [], "revenueStreams": []}}');
```

## ✅ **VERIFICA CONFIGURAZIONE**

### **Dopo l'esecuzione dello schema:**

1. **Controlla le Tabelle**
   - Vai su **"Table Editor"** in Supabase
   - Dovresti vedere tutte le tabelle create

2. **Testa la Connessione**
   - Vai alla sezione Business Plan nella dashboard
   - I dati dovrebbero caricarsi automaticamente

3. **Testa il Salvataggio**
   - Modifica qualche campo nel Business Plan
   - I dati dovrebbero salvarsi automaticamente dopo 2 secondi

## 🚨 **RISOLUZIONE PROBLEMI**

### **Se vedi errori di connessione:**
1. Verifica che le variabili d'ambiente siano corrette in `.env.local`
2. Controlla che l'URL e la chiave API di Supabase siano giusti
3. Assicurati che le tabelle siano state create correttamente

### **Se i dati non si salvano:**
1. Controlla la console del browser per errori
2. Verifica che le policy RLS permettano le operazioni
3. Controlla che i trigger siano stati creati

---

**Status**: ✅ **SCHEMA PRONTO** - Esegui lo script SQL su Supabase!
