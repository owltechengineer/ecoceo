# 🚀 Setup e Configurazione

Questa sezione contiene le guide per configurare e impostare il sistema dashboard.

## 📋 Guide Disponibili

### 🗄️ Database
- **[SETUP_DATABASE.md](./SETUP_DATABASE.md)** - Guida completa per configurare il database
- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Configurazione specifica Supabase

## 🚀 Setup Rapido

### 1. Configurazione Supabase
1. Crea un progetto Supabase
2. Ottieni URL e API Key
3. Configura le variabili d'ambiente
4. Segui `SUPABASE_SETUP.md`

### 2. Setup Database
1. Apri SQL Editor in Supabase
2. Esegui `COMPLETE_DATABASE_SETUP.sql`
3. Verifica con `COMPLETE_ALL_TABLES.sql`
4. Segui `SETUP_DATABASE.md`

### 3. Verifica Installazione
1. Avvia l'applicazione
2. Vai alla dashboard finanziaria
3. Verifica che non ci siano errori
4. Testa le funzionalità principali

## 🔧 Configurazione Ambiente

### Variabili Richieste
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### File di Configurazione
- `src/lib/supabase.ts` - Configurazione client Supabase
- `src/config/auth.ts` - Configurazione autenticazione
- `next.config.js` - Configurazione Next.js

## 📞 Supporto

Per problemi di setup:
1. Controlla le guide specifiche
2. Verifica le variabili d'ambiente
3. Controlla i log di Supabase
4. Consulta la documentazione database