# Configurazione Supabase

## Variabili d'ambiente necessarie

Aggiungi queste variabili al tuo file `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Schema Database

Esegui questi comandi SQL nel tuo progetto Supabase:

### 1. Tabella dashboard_data
```sql
CREATE TABLE dashboard_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  data_type TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, data_type)
);

-- Indici per performance
CREATE INDEX idx_dashboard_data_user_id ON dashboard_data(user_id);
CREATE INDEX idx_dashboard_data_type ON dashboard_data(data_type);
```

### 2. Tabella business_plan
```sql
CREATE TABLE business_plan (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  section TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, section)
);

-- Indici per performance
CREATE INDEX idx_business_plan_user_id ON business_plan(user_id);
CREATE INDEX idx_business_plan_section ON business_plan(section);
```

### 3. Trigger per updated_at
```sql
-- Funzione per aggiornare updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger per dashboard_data
CREATE TRIGGER update_dashboard_data_updated_at 
    BEFORE UPDATE ON dashboard_data 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger per business_plan
CREATE TRIGGER update_business_plan_updated_at 
    BEFORE UPDATE ON business_plan 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

## RLS (Row Level Security)

```sql
-- Abilita RLS
ALTER TABLE dashboard_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_plan ENABLE ROW LEVEL SECURITY;

-- Policy per dashboard_data
CREATE POLICY "Users can manage their own dashboard data" ON dashboard_data
    FOR ALL USING (auth.uid()::text = user_id);

-- Policy per business_plan
CREATE POLICY "Users can manage their own business plan" ON business_plan
    FOR ALL USING (auth.uid()::text = user_id);
```

## Come ottenere le credenziali Supabase

1. Vai su [supabase.com](https://supabase.com)
2. Crea un nuovo progetto
3. Vai su Settings > API
4. Copia:
   - Project URL (NEXT_PUBLIC_SUPABASE_URL)
   - anon public key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
