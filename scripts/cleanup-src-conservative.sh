#!/bin/bash

# 🧹 SCRIPT PULIZIA CONSERVATIVA DIRECTORY SRC
# Questo script pulisce solo le directory vuote e organizza senza rompere gli import

set -e  # Exit on any error

echo "🧹 PULIZIA CONSERVATIVA DIRECTORY SRC"
echo "====================================="

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
BACKUP_DIR="src-conservative-backup/$(date +%Y%m%d_%H%M%S)"
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

# 5. Pulizia file temporanei e cache
log "Rimuovendo file temporanei e cache..."

# Rimuovi file temporanei comuni
find src -name "*.tmp" -delete 2>/dev/null || true
find src -name "*.temp" -delete 2>/dev/null || true
find src -name "*.cache" -delete 2>/dev/null || true
find src -name "*.log" -delete 2>/dev/null || true
find src -name ".DS_Store" -delete 2>/dev/null || true
find src -name "Thumbs.db" -delete 2>/dev/null || true

success "File temporanei rimossi"

# 6. Organizzazione leggera (solo creazione directory logiche)
log "Creando struttura logica..."

# Crea directory per organizzazione logica (senza spostare file)
mkdir -p src/components/_public
mkdir -p src/components/_dashboard
mkdir -p src/services/_external
mkdir -p src/services/_internal
mkdir -p src/hooks/_auth
mkdir -p src/hooks/_data
mkdir -p src/hooks/_ui
mkdir -p src/types/_api
mkdir -p src/types/_ui
mkdir -p src/types/_data
mkdir -p src/lib/_external
mkdir -p src/lib/_internal
mkdir -p src/utils/_env
mkdir -p src/utils/_validation

success "Struttura logica creata"

# 7. Creazione file di documentazione per organizzazione
log "Creando documentazione organizzazione..."

# Crea file README per ogni sezione
cat > src/components/README.md << 'EOF'
# Components

## Struttura Organizzata

### Pubblici (Frontend)
- `About/` - Componenti sezione About
- `Blog/` - Componenti blog
- `Common/` - Componenti comuni
- `Contact/` - Componenti contatto
- `Features/` - Componenti features
- `Footer/` - Footer
- `Header/` - Header
- `Hero/` - Hero section
- `Navigation/` - Navigazione
- `Projects/` - Componenti progetti
- `Services/` - Componenti servizi
- `Shop/` - Componenti shop
- `Testimonials/` - Testimonial

### Dashboard (Privati)
- `Dashboard/` - Componenti dashboard
- `Auth/` - Componenti autenticazione
- `ThreeJS/` - Componenti Three.js

## Convenzioni
- Un componente per file
- Nome file in PascalCase
- Export default del componente
EOF

cat > src/services/README.md << 'EOF'
# Services

## Struttura Organizzata

### Esterni
- `analyticsService.ts` - Servizio analytics
- `marketingService.ts` - Servizio marketing

### Interni
- `orderService.ts` - Servizio ordini
- `mockDataService.ts` - Servizio dati mock

### Dati
- `sanityDataService.ts` - Servizio dati Sanity
- `sanitySync.ts` - Sincronizzazione Sanity

## Convenzioni
- Un servizio per file
- Nome file in camelCase
- Export delle funzioni
EOF

cat > src/hooks/README.md << 'EOF'
# Hooks

## Struttura Organizzata

### Autenticazione
- `useAuth.ts` - Hook autenticazione

### Dati
- `useMarketingData.ts` - Hook dati marketing
- `useClientDate.ts` - Hook data client

### UI
- `useNotifications.ts` - Hook notifiche
- `useSanityStyles.ts` - Hook stili Sanity
- `useSanityUIComponents.ts` - Hook componenti UI Sanity

### Esterni
- `useClientAnalytics.ts` - Hook analytics client

## Convenzioni
- Nome inizia con "use"
- Un hook per file
- Export default del hook
EOF

cat > src/types/README.md << 'EOF'
# Types

## Struttura Organizzata

### API
- `order.ts` - Types per ordini

### UI
- `feature.ts` - Types per features
- `menu.ts` - Types per menu
- `testimonial.ts` - Types per testimonial

### Dati
- `blog.ts` - Types per blog
- `product.ts` - Types per prodotti
- `project.ts` - Types per progetti

## Convenzioni
- Nome file in camelCase
- Export delle interfacce/types
- Documentazione JSDoc
EOF

cat > src/lib/README.md << 'EOF'
# Lib

## Struttura Organizzata

### Esterni
- `supabase.ts` - Client Supabase

### Interni
- `marketing.ts` - Utilities marketing
- `business-plan-helpers.ts` - Helper business plan

### Utils
- `translation.ts` - Utilities traduzione
- `ai-integrations.ts` - Integrazioni AI

## Convenzioni
- Un file per libreria
- Export delle funzioni
- Documentazione JSDoc
EOF

cat > src/utils/README.md << 'EOF'
# Utils

## Struttura Organizzata

### Ambiente
- `envCheck.ts` - Controllo variabili ambiente

### Validazione
- (da aggiungere) - Utilities validazione

### Formattazione
- (da aggiungere) - Utilities formattazione

## Convenzioni
- Nome file in camelCase
- Export delle funzioni
- Funzioni pure quando possibile
EOF

success "Documentazione creata"

# 8. Verifica build dopo pulizia
log "Testando build dopo pulizia..."
if npm run build > /dev/null 2>&1; then
    success "Build successful dopo pulizia"
else
    error "Build failed! Ripristinando backup..."
    rm -rf src/
    cp -r "$BACKUP_DIR" src/
    exit 1
fi

# 9. Calcola statistiche finali
log "Calcolando statistiche finali..."
FINAL_FILES=$(find src -type f | wc -l)
FINAL_DIRS=$(find src -type d | wc -l)
REMOVED_DIRS=${#EMPTY_DIRS[@]}

# 10. Verifica finale
log "Verifica finale..."
echo "📋 Checklist Pulizia Conservativa:"
echo "  ✅ Backup creato: $BACKUP_DIR"
echo "  ✅ Directory vuote rimosse: $REMOVED_DIRS"
echo "  ✅ File temporanei rimossi"
echo "  ✅ Struttura logica creata"
echo "  ✅ Documentazione creata"
echo "  ✅ Build test successful"

# 11. Istruzioni finali
echo ""
echo "🎉 PULIZIA CONSERVATIVA COMPLETATA!"
echo "==================================="
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
echo "  📁 src/components/       - Componenti organizzati"
echo "  📁 src/services/         - Servizi organizzati"
echo "  📁 src/hooks/            - Hooks organizzati"
echo "  📁 src/contexts/         - Contexts organizzati"
echo "  📁 src/types/            - Types organizzati"
echo "  📁 src/lib/              - Lib organizzate"
echo "  📁 src/utils/            - Utils organizzati"
echo "  📁 src/config/           - Config organizzate"
echo ""
echo "📚 Documentazione:"
echo "  📄 README.md in ogni directory principale"
echo "  📋 Struttura documentata"
echo "  🔍 Convenzioni definite"
echo ""
echo "🚨 In caso di problemi:"
echo "  - Rollback: rm -rf src && cp -r $BACKUP_DIR src"
echo "  - Git reset: git checkout HEAD -- src/"
echo ""
success "Pulizia conservativa completata con successo!"
