# 🔄 Dashboard Sync Guide - Aggiornamento Reciproco Progetti

## 📊 Panoramica
Questa guida permette di sincronizzare la dashboard tra progetti paralleli mantenendo la coerenza e le ultime modifiche.

## 🎯 Progetti Coinvolti
- **Progetto A**: `/Users/gaiofabiano/Library/Mobile Documents/com~apple~CloudDocs/LEM SOLUTIONS/ecoceo/ecoceo`
- **Progetto B**: `/Users/gaiofabiano/Downloads/startup-nextjs-main 2`

## 📁 File da Sincronizzare

### 🔧 **Componenti Dashboard (Core)**
```
src/components/Dashboard/          # Tutti i componenti dashboard
├── MainDashboard.tsx              # Componente principale
├── DashboardTotale.tsx            # Dashboard principale
├── SidebarNavigation.tsx          # Navigazione laterale
├── QuickActions.tsx               # Azioni rapide
├── MarketingView.tsx              # Vista marketing
├── ProjectsView.tsx               # Vista progetti
├── FinancialManagement.tsx        # Gestione finanziaria
├── BusinessPlanManagement.tsx     # Piano business
├── AIManagement.tsx               # Gestione AI
└── ... (tutti gli altri componenti)
```

### 📱 **Pagine e Route**
```
src/app/(dashboard)/               # Pagine dashboard
├── dashboard/page.tsx             # Pagina principale
├── api/                           # API routes
└── threejs/                       # Componenti 3D
```

### 🧠 **Contexti e State Management**
```
src/contexts/
├── DashboardContext.tsx           # Contexto dashboard
└── InfoModalContext.tsx           # Contexto modali
```

### ⚙️ **Configurazione e Hook**
```
src/config/auth.ts                 # Configurazione autenticazione
src/hooks/
├── useClientDate.ts               # Hook per date
└── useClientAnalytics.ts          # Hook analytics
src/services/mockDataService.ts    # Servizio dati mock
src/components/Auth/ProtectedRoute.tsx # Autenticazione
```

## 🚀 Script di Sincronizzazione

### **Script A → B (Ecoceo → Startup)**
```bash
#!/bin/bash
# sync-dashboard-eco-to-startup.sh

SOURCE="/Users/gaiofabiano/Library/Mobile Documents/com~apple~CloudDocs/LEM SOLUTIONS/ecoceo/ecoceo"
DEST="/Users/gaiofabiano/Downloads/startup-nextjs-main 2"

echo "🔄 Sincronizzazione Ecoceo → Startup..."

# Componenti Dashboard
cp -r "$SOURCE/src/components/Dashboard/"* "$DEST/src/components/Dashboard/"

# Pagine Dashboard
cp -r "$SOURCE/src/app/(dashboard)/"* "$DEST/src/app/(dashboard)/"

# Contexti
cp "$SOURCE/src/contexts/DashboardContext.tsx" "$DEST/src/contexts/"
cp "$SOURCE/src/contexts/InfoModalContext.tsx" "$DEST/src/contexts/"

# Config e Hook
cp "$SOURCE/src/config/auth.ts" "$DEST/src/config/"
cp "$SOURCE/src/hooks/useClientDate.ts" "$DEST/src/hooks/"
cp "$SOURCE/src/hooks/useClientAnalytics.ts" "$DEST/src/hooks/"
cp "$SOURCE/src/services/mockDataService.ts" "$DEST/src/services/"
cp "$SOURCE/src/components/Auth/ProtectedRoute.tsx" "$DEST/src/components/Auth/"

echo "✅ Sincronizzazione completata!"
```

### **Script B → A (Startup → Ecoceo)**
```bash
#!/bin/bash
# sync-dashboard-startup-to-eco.sh

SOURCE="/Users/gaiofabiano/Downloads/startup-nextjs-main 2"
DEST="/Users/gaiofabiano/Library/Mobile Documents/com~apple~CloudDocs/LEM SOLUTIONS/ecoceo/ecoceo"

echo "🔄 Sincronizzazione Startup → Ecoceo..."

# Componenti Dashboard
cp -r "$SOURCE/src/components/Dashboard/"* "$DEST/src/components/Dashboard/"

# Pagine Dashboard
cp -r "$SOURCE/src/app/(dashboard)/"* "$DEST/src/app/(dashboard)/"

# Contexti
cp "$SOURCE/src/contexts/DashboardContext.tsx" "$DEST/src/contexts/"
cp "$SOURCE/src/contexts/InfoModalContext.tsx" "$DEST/src/contexts/"

# Config e Hook
cp "$SOURCE/src/config/auth.ts" "$DEST/src/config/"
cp "$SOURCE/src/hooks/useClientDate.ts" "$DEST/src/hooks/"
cp "$SOURCE/src/hooks/useClientAnalytics.ts" "$DEST/src/hooks/"
cp "$SOURCE/src/services/mockDataService.ts" "$DEST/src/services/"
cp "$SOURCE/src/components/Auth/ProtectedRoute.tsx" "$DEST/src/components/Auth/"

echo "✅ Sincronizzazione completata!"
```

## 📋 Checklist Pre-Sincronizzazione

### ✅ **Prima di sincronizzare:**
1. **Backup** del progetto di destinazione
2. **Commit** di tutte le modifiche nel progetto sorgente
3. **Verifica** che il progetto di destinazione sia funzionante
4. **Controllo** delle dipendenze in `package.json`

### ✅ **Dopo la sincronizzazione:**
1. **Test** della dashboard nel progetto di destinazione
2. **Verifica** delle dipendenze mancanti
3. **Controllo** delle variabili ambiente
4. **Test** delle funzionalità principali

## 🔧 Dipendenze Necessarie

### **Package.json - Dipendenze Dashboard**
```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.x.x",
    "@sanity/client": "^6.x.x",
    "recharts": "^2.x.x",
    "date-fns": "^2.x.x",
    "next-auth": "^4.x.x"
  }
}
```

### **Variabili Ambiente (.env.local)**
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production

# Dashboard
NEXT_PUBLIC_DASHBOARD_PASSWORD=your_dashboard_password
AREA_CLIENTI_PASSWORD=your_client_area_password
```

## 🚨 Troubleshooting

### **Errori Comuni:**
1. **"Module not found"** → Installa dipendenze mancanti
2. **"Context not found"** → Verifica che i contexti siano copiati
3. **"Hook not found"** → Controlla che gli hook siano presenti
4. **"API routes 404"** → Verifica che le API routes siano copiate

### **Soluzioni:**
```bash
# Reinstalla dipendenze
npm install

# Verifica struttura
ls -la src/components/Dashboard/
ls -la src/app/(dashboard)/
ls -la src/contexts/

# Test dashboard
npm run dev
# Vai su http://localhost:3000/dashboard
```

## 📅 Cronologia Sincronizzazioni

| Data | Direzione | Modifiche | Note |
|------|-----------|-----------|------|
| 2025-10-09 | Ecoceo → Startup | Prima sincronizzazione completa | Setup iniziale |

## 🎯 Best Practices

1. **Sincronizza regolarmente** per evitare divergenze
2. **Testa sempre** dopo ogni sincronizzazione
3. **Mantieni backup** prima di operazioni importanti
4. **Documenta modifiche** significative
5. **Usa git** per tracciare le modifiche

---

**📞 Supporto**: Per problemi di sincronizzazione, controlla prima questa guida e poi consulta i log di errore specifici.
