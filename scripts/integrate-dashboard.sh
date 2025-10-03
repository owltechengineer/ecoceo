#!/bin/bash

# 🔄 SCRIPT INTEGRAZIONE DASHBOARD
# Questo script integra la dashboard nel progetto destinazione

set -e  # Exit on any error

echo "🔄 INTEGRAZIONE DASHBOARD"
echo "========================"

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funzione per logging
log() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

# Parametri
SOURCE_BRANCH="feature/dashboard-migration-$(date +%Y%m%d)"
INTEGRATION_BRANCH="feature/integrate-dashboard"

# 1. Verifica ambiente
log "Verificando ambiente..."
if [ ! -f "package.json" ]; then
    error "package.json non trovato! Eseguire dalla root del progetto destinazione."
    exit 1
fi

if [ ! -d ".git" ]; then
    error "Git repository non trovato!"
    exit 1
fi

success "Ambiente verificato"

# 2. Backup progetto destinazione
log "Creando backup progetto destinazione..."
BACKUP_DIR="backup-destinazione/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Backup file critici
cp -r src/ "$BACKUP_DIR/" 2>/dev/null || warning "Cartella src non trovata"
cp package.json "$BACKUP_DIR/" 2>/dev/null || warning "package.json non trovato"
cp tsconfig.json "$BACKUP_DIR/" 2>/dev/null || warning "tsconfig.json non trovato"
cp tailwind.config.js "$BACKUP_DIR/" 2>/dev/null || warning "tailwind.config.js non trovato"
cp next.config.js "$BACKUP_DIR/" 2>/dev/null || warning "next.config.js non trovato"

success "Backup creato in: $BACKUP_DIR"

# 3. Verifica remote
log "Verificando remote repository..."
if ! git remote -v | grep -q "origin"; then
    warning "Remote origin non configurato. Configurare prima di procedere."
    echo "git remote add origin <repository-url>"
    exit 1
fi

# 4. Fetch e checkout
log "Fetching e checkout branch sorgente..."
git fetch origin "$SOURCE_BRANCH" 2>/dev/null || {
    error "Branch $SOURCE_BRANCH non trovato nel remote!"
    echo "Assicurarsi che il branch sia stato pushato nel repository sorgente."
    exit 1
}

# 5. Creazione branch integrazione
log "Creando branch integrazione..."
if git show-ref --verify --quiet refs/heads/"$INTEGRATION_BRANCH"; then
    warning "Branch $INTEGRATION_BRANCH già esiste. Passando a quello esistente..."
    git checkout "$INTEGRATION_BRANCH"
else
    git checkout -b "$INTEGRATION_BRANCH"
    success "Branch $INTEGRATION_BRANCH creato"
fi

# 6. Merge selettivo componenti dashboard
log "Integrando componenti dashboard..."
echo "📦 Copiando componenti dashboard..."

# Crea directory se non esiste
mkdir -p src/components/Dashboard
mkdir -p src/components/ThreeJS
mkdir -p src/app/threejs

# Merge selettivo
git checkout "origin/$SOURCE_BRANCH" -- src/components/Dashboard/ || {
    error "Errore nel checkout componenti dashboard"
    exit 1
}

git checkout "origin/$SOURCE_BRANCH" -- src/components/ThreeJS/ || {
    warning "Componenti ThreeJS non trovati, saltando..."
}

git checkout "origin/$SOURCE_BRANCH" -- src/app/threejs/ || {
    warning "Pagina ThreeJS non trovata, saltando..."
}

success "Componenti dashboard integrati"

# 7. Merge API routes
log "Integrando API routes..."
echo "🔌 Copiando API routes..."

# Crea directory se non esiste
mkdir -p src/app/api/webhook
mkdir -p src/app/api/create-checkout-session
mkdir -p src/app/api/create-portal-session
mkdir -p src/app/api/create-subscription-session
mkdir -p src/app/api/payment/create-payment-intent

# Merge selettivo API
git checkout "origin/$SOURCE_BRANCH" -- src/app/api/webhook/ || warning "Webhook API non trovata"
git checkout "origin/$SOURCE_BRANCH" -- src/app/api/create-checkout-session/ || warning "Checkout API non trovata"
git checkout "origin/$SOURCE_BRANCH" -- src/app/api/create-portal-session/ || warning "Portal API non trovata"
git checkout "origin/$SOURCE_BRANCH" -- src/app/api/create-subscription-session/ || warning "Subscription API non trovata"
git checkout "origin/$SOURCE_BRANCH" -- src/app/api/payment/create-payment-intent/ || warning "Payment API non trovata"

success "API routes integrate"

# 8. Merge package.json (merge intelligente)
log "Aggiornando dipendenze..."
echo "📦 Aggiornando package.json..."

# Backup package.json corrente
cp package.json package.json.backup

# Estrai dipendenze Three.js dal branch sorgente
git show "origin/$SOURCE_BRANCH:package.json" > /tmp/source_package.json

# Merge dipendenze Three.js
echo "🔧 Aggiungendo dipendenze Three.js..."
npm install three @types/three @react-three/fiber @react-three/drei

success "Dipendenze aggiornate"

# 9. Verifica conflitti
log "Verificando conflitti..."
if git status --porcelain | grep -q "^UU"; then
    warning "Conflitti rilevati! Risolvere manualmente:"
    git status --porcelain | grep "^UU"
    echo ""
    echo "Per risolvere i conflitti:"
    echo "1. git status"
    echo "2. Aprire i file in conflitto"
    echo "3. Risolvere manualmente"
    echo "4. git add <file-risolto>"
    echo "5. git commit"
    exit 1
fi

success "Nessun conflitto rilevato"

# 10. Commit integrazione
log "Committing integrazione..."
git add .
git commit -m "feat: integrate responsive dashboard with optimizations

- Responsive layout optimizations
- Mobile-first design implementation
- Three.js animation integration
- Bug fixes (RangeError, undefined tags)
- Stripe API conditional initialization
- Warehouse layout improvements
- Compact sidebar and navigation

Integrated from: $SOURCE_BRANCH"

success "Integrazione committata"

# 11. Test build
log "Testando build post-integrazione..."
if npm run build > /dev/null 2>&1; then
    success "Build test successful"
else
    error "Build test failed! Controllare errori:"
    npm run build
    exit 1
fi

# 12. Verifica environment variables
log "Verificando environment variables..."
echo "🌍 Variabili ambiente richieste:"
echo "  - NEXT_PUBLIC_SUPABASE_URL"
echo "  - NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "  - STRIPE_SECRET_KEY"
echo "  - STRIPE_WEBHOOK_SECRET"
echo "  - STRIPE_PUBLISHABLE_KEY"

if [ -f ".env.local" ]; then
    echo "📄 File .env.local trovato"
    if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local; then
        success "Supabase configurato"
    else
        warning "Supabase non configurato in .env.local"
    fi
    
    if grep -q "STRIPE_SECRET_KEY" .env.local; then
        success "Stripe configurato"
    else
        warning "Stripe non configurato in .env.local"
    fi
else
    warning "File .env.local non trovato. Creare con le variabili necessarie."
fi

# 13. Test funzionalità
log "Testando funzionalità..."
echo "🧪 Test da eseguire manualmente:"
echo "  1. npm run dev"
echo "  2. Visitare /dashboard"
echo "  3. Verificare layout responsive"
echo "  4. Testare creazione task"
echo "  5. Verificare Three.js animation (/threejs)"
echo "  6. Testare warehouse layout"
echo "  7. Verificare sidebar compatta"

# 14. Verifica finale
log "Verifica finale..."
echo "📋 Checklist Post-Integrazione:"
echo "  ✅ Backup creato: $BACKUP_DIR"
echo "  ✅ Branch creato: $INTEGRATION_BRANCH"
echo "  ✅ Componenti dashboard integrati"
echo "  ✅ API routes integrate"
echo "  ✅ Dipendenze aggiornate"
echo "  ✅ Build test successful"
echo "  ✅ Integrazione committata"

# 15. Istruzioni finali
echo ""
echo "🎉 INTEGRAZIONE COMPLETATA!"
echo "=========================="
echo ""
echo "📋 Prossimi passi:"
echo "  1. Testare funzionalità: npm run dev"
echo "  2. Verificare dashboard: http://localhost:3000/dashboard"
echo "  3. Testare Three.js: http://localhost:3000/threejs"
echo "  4. Configurare environment variables se necessario"
echo "  5. Push del branch: git push origin $INTEGRATION_BRANCH"
echo "  6. Creare Pull Request per merge in main"
echo ""
echo "📁 File di supporto:"
echo "  - $BACKUP_DIR/ (backup progetto destinazione)"
echo "  - package.json.backup (backup package.json)"
echo "  - MIGRATION_CHANGES.md (se presente)"
echo ""
echo "🚨 In caso di problemi:"
echo "  - Rollback: git checkout main"
echo "  - Ripristino: cp -r $BACKUP_DIR/* ."
echo ""
echo "🔧 Comandi utili:"
echo "  - git status (verifica stato)"
echo "  - git log --oneline (verifica commit)"
echo "  - npm run dev (test locale)"
echo "  - npm run build (test build)"
echo ""
success "Dashboard integrata con successo!"
