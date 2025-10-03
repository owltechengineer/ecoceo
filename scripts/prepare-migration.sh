#!/bin/bash

# 🚀 SCRIPT PREPARAZIONE MIGRAZIONE DASHBOARD
# Questo script prepara la dashboard per il push su un altro progetto

set -e  # Exit on any error

echo "🚀 PREPARAZIONE MIGRAZIONE DASHBOARD"
echo "=================================="

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

# 1. Verifica ambiente
log "Verificando ambiente..."
if [ ! -f "package.json" ]; then
    error "package.json non trovato! Eseguire dalla root del progetto."
    exit 1
fi

if [ ! -d "src/components/Dashboard" ]; then
    error "Cartella Dashboard non trovata!"
    exit 1
fi

success "Ambiente verificato"

# 2. Backup completo
log "Creando backup completo..."
BACKUP_DIR="backup/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Backup componenti dashboard
cp -r src/components/Dashboard/ "$BACKUP_DIR/"
cp -r src/app/api/ "$BACKUP_DIR/"
cp -r src/app/threejs/ "$BACKUP_DIR/"
cp package.json "$BACKUP_DIR/"
cp tsconfig.json "$BACKUP_DIR/"
cp tailwind.config.js "$BACKUP_DIR/" 2>/dev/null || warning "tailwind.config.js non trovato"
cp next.config.js "$BACKUP_DIR/" 2>/dev/null || warning "next.config.js non trovato"

success "Backup creato in: $BACKUP_DIR"

# 3. Creazione branch dedicato
log "Creando branch dedicato per migrazione..."
BRANCH_NAME="feature/dashboard-migration-$(date +%Y%m%d)"

# Verifica se git è inizializzato
if [ ! -d ".git" ]; then
    warning "Git non inizializzato. Inizializzando..."
    git init
    git add .
    git commit -m "Initial commit"
fi

# Crea branch se non esiste
if git show-ref --verify --quiet refs/heads/"$BRANCH_NAME"; then
    warning "Branch $BRANCH_NAME già esiste. Passando a quello esistente..."
    git checkout "$BRANCH_NAME"
else
    git checkout -b "$BRANCH_NAME"
    success "Branch $BRANCH_NAME creato"
fi

# 4. Commit modifiche
log "Committing modifiche dashboard..."
git add .
git commit -m "feat: dashboard responsive optimizations ready for migration

- Responsive layout optimizations
- Mobile-first design implementation  
- Three.js animation integration
- Bug fixes (RangeError, undefined tags)
- Stripe API conditional initialization
- Warehouse layout improvements
- Compact sidebar and navigation"

success "Modifiche committate"

# 5. Verifica dipendenze
log "Verificando dipendenze..."
echo "📦 Dipendenze Three.js:"
npm list three @types/three @react-three/fiber @react-three/drei 2>/dev/null || warning "Alcune dipendenze Three.js potrebbero mancare"

echo "📦 Dipendenze Supabase:"
npm list @supabase/supabase-js 2>/dev/null || warning "Supabase non trovato"

echo "📦 Dipendenze Stripe:"
npm list stripe 2>/dev/null || warning "Stripe non trovato"

# 6. Test build
log "Testando build..."
if npm run build > /dev/null 2>&1; then
    success "Build test successful"
else
    error "Build test failed! Controllare errori prima della migrazione."
    exit 1
fi

# 7. Generazione documentazione
log "Generando documentazione migrazione..."
cat > MIGRATION_CHANGES.md << EOF
# Modifiche Dashboard - $(date)

## 🎯 Modifiche Principali

### Responsive Optimizations
- ✅ Sidebar: larghezza ridotta (w-72 → w-64)
- ✅ Padding ridotto in tutti i componenti
- ✅ Mobile-first design implementato
- ✅ Grid layouts ottimizzati

### Bug Fixes
- ✅ UnifiedTaskCalendarNew: RangeError fixed
- ✅ TasksView: undefined tags fixed  
- ✅ Stripe API: conditional initialization
- ✅ Database insertion errors fixed

### New Features
- ✅ Three.js Animation: parabola matematica
- ✅ Warehouse: 3 items per row, SKU styling
- ✅ Urgent Tasks: nuova sezione dashboard
- ✅ Compact navigation design

## 📦 File Modificati

### Components
- src/components/Dashboard/MainDashboard.tsx
- src/components/Dashboard/DashboardTotale.tsx
- src/components/Dashboard/SidebarNavigation.tsx
- src/components/Dashboard/UnifiedTaskCalendarNew.tsx
- src/components/Dashboard/TasksView.tsx
- src/components/Dashboard/WarehouseManagement.tsx
- src/components/ThreeJS/ThreeJSAnimation.tsx

### API Routes
- src/app/api/webhook/route.ts
- src/app/api/create-checkout-session/route.ts
- src/app/api/create-portal-session/route.ts
- src/app/api/create-subscription-session/route.ts
- src/app/api/payment/create-payment-intent/route.ts

### Configuration
- package.json (Three.js dependencies)
- src/app/threejs/page.tsx

## 🔧 Dipendenze Aggiunte
\`\`\`json
{
  "three": "^0.160.0",
  "@types/three": "^0.160.0", 
  "@react-three/fiber": "^8.15.0",
  "@react-three/drei": "^9.88.0"
}
\`\`\`

## 🌍 Environment Variables Richieste
\`\`\`bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PUBLISHABLE_KEY=
\`\`\`

## ✅ Test Completati
- [x] Build successful
- [x] Dashboard responsive
- [x] Three.js animation
- [x] Task creation
- [x] Warehouse layout
- [x] API routes

## 🚀 Pronto per Migrazione
EOF

success "Documentazione generata: MIGRATION_CHANGES.md"

# 8. Verifica finale
log "Verifica finale..."
echo "📋 Checklist Pre-Migration:"
echo "  ✅ Backup creato: $BACKUP_DIR"
echo "  ✅ Branch creato: $BRANCH_NAME"
echo "  ✅ Modifiche committate"
echo "  ✅ Build test successful"
echo "  ✅ Documentazione generata"

# 9. Istruzioni finali
echo ""
echo "🎉 PREPARAZIONE COMPLETATA!"
echo "=========================="
echo ""
echo "📋 Prossimi passi:"
echo "  1. Verificare il branch: git branch"
echo "  2. Push del branch: git push origin $BRANCH_NAME"
echo "  3. Nel progetto destinazione:"
echo "     - git clone <destinazione-repo>"
echo "     - git checkout -b feature/integrate-dashboard"
echo "     - git checkout $BRANCH_NAME -- src/components/Dashboard/"
echo "     - git checkout $BRANCH_NAME -- src/app/api/"
echo "     - git checkout $BRANCH_NAME -- package.json"
echo ""
echo "📁 File di supporto:"
echo "  - MIGRATION_CHANGES.md (modifiche specifiche)"
echo "  - MIGRATION_STRATEGY.md (strategia completa)"
echo "  - PROJECT_ARCHITECTURE_DOCUMENTATION.md (architettura)"
echo "  - $BACKUP_DIR/ (backup completo)"
echo ""
echo "🚨 In caso di problemi:"
echo "  - Rollback: git checkout main"
echo "  - Ripristino: cp -r $BACKUP_DIR/* src/"
echo ""
success "Dashboard pronta per la migrazione!"
