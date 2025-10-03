#!/bin/bash

# 🧹 SCRIPT PULIZIA E ORGANIZZAZIONE COMPLETA DIRECTORY SRC
# Questo script pulisce e organizza tutta la directory src per una struttura professionale

set -e  # Exit on any error

echo "🧹 PULIZIA E ORGANIZZAZIONE COMPLETA DIRECTORY SRC"
echo "================================================="

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
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

info() {
    echo -e "${PURPLE}ℹ️  $1${NC}"
}

# 1. Verifica ambiente
log "Verificando ambiente..."
if [ ! -f "package.json" ]; then
    error "package.json non trovato! Eseguire dalla root del progetto."
    exit 1
fi

if [ ! -d "src" ]; then
    error "Cartella src non trovata!"
    exit 1
fi

success "Ambiente verificato"

# 2. Backup completo
log "Creando backup completo della directory src..."
BACKUP_DIR="src-cleanup-backup/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Backup tutto src
cp -r src/ "$BACKUP_DIR/"
success "Backup creato in: $BACKUP_DIR"

# 3. Analisi struttura attuale
log "Analizzando struttura attuale..."

# Conta file e directory
TOTAL_FILES=$(find src -type f | wc -l)
TOTAL_DIRS=$(find src -type d | wc -l)

info "Struttura attuale: $TOTAL_FILES file, $TOTAL_DIRS directory"

# 4. Pulizia directory vuote
log "Rimuovendo directory vuote..."

EMPTY_DIRS=()
while IFS= read -r -d '' dir; do
    EMPTY_DIRS+=("$dir")
done < <(find src -type d -empty -print0)

if [ ${#EMPTY_DIRS[@]} -gt 0 ]; then
    for dir in "${EMPTY_DIRS[@]}"; do
        rm -rf "$dir"
        success "Rimosso directory vuota: $dir"
    done
else
    info "Nessuna directory vuota trovata"
fi

# 5. Organizzazione componenti
log "Organizzando componenti..."

# Crea directory per componenti pubblici se non esistono
mkdir -p src/components/\(public\)/Common
mkdir -p src/components/\(public\)/Layout
mkdir -p src/components/\(public\)/UI
mkdir -p src/components/\(public\)/Forms
mkdir -p src/components/\(public\)/Sections

# Sposta componenti pubblici
PUBLIC_COMPONENTS=(
    "About"
    "Blog"
    "Brands"
    "Common"
    "Contact"
    "Features"
    "Footer"
    "Header"
    "Hero"
    "Navigation"
    "Projects"
    "ScrollToTop"
    "Services"
    "Shop"
    "Testimonials"
)

for component in "${PUBLIC_COMPONENTS[@]}"; do
    if [ -d "src/components/$component" ]; then
        mv "src/components/$component" "src/components/\(public\)/"
        success "Spostato componente pubblico: $component"
    fi
done

# Sposta componenti dashboard
DASHBOARD_COMPONENTS=(
    "Dashboard"
    "Auth"
    "ThreeJS"
)

for component in "${DASHBOARD_COMPONENTS[@]}"; do
    if [ -d "src/components/$component" ]; then
        mv "src/components/$component" "src/components/\(dashboard\)/"
        success "Spostato componente dashboard: $component"
    fi
done

# 6. Organizzazione servizi
log "Organizzando servizi..."

# Crea directory per servizi organizzati
mkdir -p src/services/external
mkdir -p src/services/internal
mkdir -p src/services/data

# Sposta servizi esterni
if [ -f "src/services/analyticsService.ts" ]; then
    mv src/services/analyticsService.ts src/services/external/
    success "Spostato servizio esterno: analyticsService"
fi

if [ -f "src/services/marketingService.ts" ]; then
    mv src/services/marketingService.ts src/services/external/
    success "Spostato servizio esterno: marketingService"
fi

# Sposta servizi interni
if [ -f "src/services/orderService.ts" ]; then
    mv src/services/orderService.ts src/services/internal/
    success "Spostato servizio interno: orderService"
fi

if [ -f "src/services/mockDataService.ts" ]; then
    mv src/services/mockDataService.ts src/services/internal/
    success "Spostato servizio interno: mockDataService"
fi

# Sposta servizi dati
if [ -f "src/services/sanityDataService.ts" ]; then
    mv src/services/sanityDataService.ts src/services/data/
    success "Spostato servizio dati: sanityDataService"
fi

if [ -f "src/services/sanitySync.ts" ]; then
    mv src/services/sanitySync.ts src/services/data/
    success "Spostato servizio dati: sanitySync"
fi

# 7. Organizzazione hooks
log "Organizzando hooks..."

# Crea directory per hooks organizzati
mkdir -p src/hooks/auth
mkdir -p src/hooks/data
mkdir -p src/hooks/ui
mkdir -p src/hooks/external

# Sposta hooks di autenticazione
if [ -f "src/hooks/useAuth.ts" ]; then
    mv src/hooks/useAuth.ts src/hooks/auth/
    success "Spostato hook auth: useAuth"
fi

# Sposta hooks di dati
if [ -f "src/hooks/useMarketingData.ts" ]; then
    mv src/hooks/useMarketingData.ts src/hooks/data/
    success "Spostato hook dati: useMarketingData"
fi

if [ -f "src/hooks/useClientDate.ts" ]; then
    mv src/hooks/useClientDate.ts src/hooks/data/
    success "Spostato hook dati: useClientDate"
fi

# Sposta hooks UI
if [ -f "src/hooks/useNotifications.ts" ]; then
    mv src/hooks/useNotifications.ts src/hooks/ui/
    success "Spostato hook UI: useNotifications"
fi

if [ -f "src/hooks/useSanityStyles.ts" ]; then
    mv src/hooks/useSanityStyles.ts src/hooks/ui/
    success "Spostato hook UI: useSanityStyles"
fi

if [ -f "src/hooks/useSanityUIComponents.ts" ]; then
    mv src/hooks/useSanityUIComponents.ts src/hooks/ui/
    success "Spostato hook UI: useSanityUIComponents"
fi

# Sposta hooks esterni
if [ -f "src/hooks/useClientAnalytics.ts" ]; then
    mv src/hooks/useClientAnalytics.ts src/hooks/external/
    success "Spostato hook esterno: useClientAnalytics"
fi

# 8. Organizzazione contexts
log "Organizzando contexts..."

# Crea directory per contexts organizzati
mkdir -p src/contexts/auth
mkdir -p src/contexts/data
mkdir -p src/contexts/ui

# Sposta contexts di autenticazione
if [ -f "src/contexts/DashboardContext.tsx" ]; then
    mv src/contexts/DashboardContext.tsx src/contexts/auth/
    success "Spostato context auth: DashboardContext"
fi

# Sposta contexts di dati
if [ -f "src/contexts/CartContext.tsx" ]; then
    mv src/contexts/CartContext.tsx src/contexts/data/
    success "Spostato context dati: CartContext"
fi

# Sposta contexts UI
if [ -f "src/contexts/InfoModalContext.tsx" ]; then
    mv src/contexts/InfoModalContext.tsx src/contexts/ui/
    success "Spostato context UI: InfoModalContext"
fi

if [ -f "src/contexts/AnalyticsContext.tsx" ]; then
    mv src/contexts/AnalyticsContext.tsx src/contexts/ui/
    success "Spostato context UI: AnalyticsContext"
fi

# 9. Organizzazione types
log "Organizzando types..."

# Crea directory per types organizzati
mkdir -p src/types/api
mkdir -p src/types/ui
mkdir -p src/types/data

# Sposta types API
if [ -f "src/types/order.ts" ]; then
    mv src/types/order.ts src/types/api/
    success "Spostato type API: order"
fi

# Sposta types UI
if [ -f "src/types/feature.ts" ]; then
    mv src/types/feature.ts src/types/ui/
    success "Spostato type UI: feature"
fi

if [ -f "src/types/menu.ts" ]; then
    mv src/types/menu.ts src/types/ui/
    success "Spostato type UI: menu"
fi

if [ -f "src/types/testimonial.ts" ]; then
    mv src/types/testimonial.ts src/types/ui/
    success "Spostato type UI: testimonial"
fi

# Sposta types dati
if [ -f "src/types/blog.ts" ]; then
    mv src/types/blog.ts src/types/data/
    success "Spostato type dati: blog"
fi

if [ -f "src/types/product.ts" ]; then
    mv src/types/product.ts src/types/data/
    success "Spostato type dati: product"
fi

if [ -f "src/types/project.ts" ]; then
    mv src/types/project.ts src/types/data/
    success "Spostato type dati: project"
fi

# 10. Organizzazione lib
log "Organizzando lib..."

# Crea directory per lib organizzati
mkdir -p src/lib/external
mkdir -p src/lib/internal
mkdir -p src/lib/utils

# Sposta lib esterne
if [ -f "src/lib/supabase.ts" ]; then
    mv src/lib/supabase.ts src/lib/external/
    success "Spostato lib esterna: supabase"
fi

# Sposta lib interne
if [ -f "src/lib/marketing.ts" ]; then
    mv src/lib/marketing.ts src/lib/internal/
    success "Spostato lib interna: marketing"
fi

if [ -f "src/lib/business-plan-helpers.ts" ]; then
    mv src/lib/business-plan-helpers.ts src/lib/internal/
    success "Spostato lib interna: business-plan-helpers"
fi

# Sposta lib utils
if [ -f "src/lib/translation.ts" ]; then
    mv src/lib/translation.ts src/lib/utils/
    success "Spostato lib utils: translation"
fi

if [ -f "src/lib/ai-integrations.ts" ]; then
    mv src/lib/ai-integrations.ts src/lib/utils/
    success "Spostato lib utils: ai-integrations"
fi

# 11. Organizzazione utils
log "Organizzando utils..."

# Crea directory per utils organizzati
mkdir -p src/utils/env
mkdir -p src/utils/validation
mkdir -p src/utils/formatting

# Sposta utils env
if [ -f "src/utils/envCheck.ts" ]; then
    mv src/utils/envCheck.ts src/utils/env/
    success "Spostato util env: envCheck"
fi

# 12. Organizzazione config
log "Organizzando config..."

# Crea directory per config organizzati
mkdir -p src/config/auth
mkdir -p src/config/external

# Sposta config auth
if [ -f "src/config/auth.ts" ]; then
    mv src/config/auth.ts src/config/auth/
    success "Spostato config auth: auth"
fi

# 13. Verifica build dopo organizzazione
log "Testando build dopo organizzazione..."
if npm run build > /dev/null 2>&1; then
    success "Build successful dopo organizzazione"
else
    error "Build failed! Ripristinando backup..."
    rm -rf src/
    cp -r "$BACKUP_DIR" src/
    exit 1
fi

# 14. Calcola statistiche finali
log "Calcolando statistiche finali..."
FINAL_FILES=$(find src -type f | wc -l)
FINAL_DIRS=$(find src -type d | wc -l)
REMOVED_DIRS=${#EMPTY_DIRS[@]}

# 15. Verifica finale
log "Verifica finale..."
echo "📋 Checklist Organizzazione:"
echo "  ✅ Backup creato: $BACKUP_DIR"
echo "  ✅ Directory vuote rimosse: $REMOVED_DIRS"
echo "  ✅ Componenti organizzati"
echo "  ✅ Servizi organizzati"
echo "  ✅ Hooks organizzati"
echo "  ✅ Contexts organizzati"
echo "  ✅ Types organizzati"
echo "  ✅ Lib organizzati"
echo "  ✅ Utils organizzati"
echo "  ✅ Config organizzati"
echo "  ✅ Build test successful"

# 16. Istruzioni finali
echo ""
echo "🎉 ORGANIZZAZIONE COMPLETATA!"
echo "============================="
echo ""
echo "📊 Statistiche:"
echo "  📁 File totali: $FINAL_FILES"
echo "  📂 Directory totali: $FINAL_DIRS"
echo "  🗑️  Directory vuote rimosse: $REMOVED_DIRS"
echo "  ✅ Build funzionante"
echo ""
echo "🏗️ Struttura organizzata:"
echo "  📁 src/app/(public)/     - Frontend pubblico"
echo "  📁 src/app/(dashboard)/  - Dashboard privata"
echo "  📁 src/components/(public)/     - Componenti pubblici"
echo "  📁 src/components/(dashboard)/  - Componenti dashboard"
echo "  📁 src/services/external/       - Servizi esterni"
echo "  📁 src/services/internal/       - Servizi interni"
echo "  📁 src/services/data/           - Servizi dati"
echo "  📁 src/hooks/auth/              - Hooks autenticazione"
echo "  📁 src/hooks/data/              - Hooks dati"
echo "  📁 src/hooks/ui/                - Hooks UI"
echo "  📁 src/hooks/external/          - Hooks esterni"
echo "  📁 src/contexts/auth/           - Contexts autenticazione"
echo "  📁 src/contexts/data/           - Contexts dati"
echo "  📁 src/contexts/ui/             - Contexts UI"
echo "  📁 src/types/api/               - Types API"
echo "  📁 src/types/ui/                - Types UI"
echo "  📁 src/types/data/              - Types dati"
echo "  📁 src/lib/external/            - Lib esterne"
echo "  📁 src/lib/internal/            - Lib interne"
echo "  📁 src/lib/utils/               - Lib utils"
echo "  📁 src/utils/env/               - Utils ambiente"
echo "  📁 src/utils/validation/        - Utils validazione"
echo "  📁 src/utils/formatting/        - Utils formattazione"
echo "  📁 src/config/auth/             - Config autenticazione"
echo "  📁 src/config/external/         - Config esterne"
echo ""
echo "🚨 In caso di problemi:"
echo "  - Rollback: rm -rf src && cp -r $BACKUP_DIR src"
echo "  - Git reset: git checkout HEAD -- src/"
echo ""
success "Organizzazione completata con successo!"
