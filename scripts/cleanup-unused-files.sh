#!/bin/bash

# 🧹 SCRIPT PULIZIA FILE E DIRECTORY NON UTILIZZATI
# Questo script rimuove directory vuote e file non necessari

set -e  # Exit on any error

echo "🧹 PULIZIA FILE E DIRECTORY NON UTILIZZATI"
echo "=========================================="

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

if [ ! -d "src/app" ]; then
    error "Cartella src/app non trovata!"
    exit 1
fi

success "Ambiente verificato"

# 2. Backup prima della pulizia
log "Creando backup..."
BACKUP_DIR="cleanup-backup/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Backup directory che verranno rimosse
if [ -d "src/app/blog-data" ]; then
    cp -r src/app/blog-data "$BACKUP_DIR/"
    success "Backup: blog-data"
fi

if [ -d "src/app/blog-details" ]; then
    cp -r src/app/blog-details "$BACKUP_DIR/"
    success "Backup: blog-details"
fi

if [ -d "src/app/blog-sidebar" ]; then
    cp -r src/app/blog-sidebar "$BACKUP_DIR/"
    success "Backup: blog-sidebar"
fi

if [ -d "src/app/studio-data" ]; then
    cp -r src/app/studio-data "$BACKUP_DIR/"
    success "Backup: studio-data"
fi

if [ -d "src/app/ui-components-example" ]; then
    cp -r src/app/ui-components-example "$BACKUP_DIR/"
    success "Backup: ui-components-example"
fi

if [ -d "src/app/error" ]; then
    cp -r src/app/error "$BACKUP_DIR/"
    success "Backup: error"
fi

success "Backup creato in: $BACKUP_DIR"

# 3. Identifica directory vuote
log "Identificando directory vuote..."

EMPTY_DIRS=()

if [ -d "src/app/blog-data" ] && [ -z "$(ls -A src/app/blog-data)" ]; then
    EMPTY_DIRS+=("src/app/blog-data")
fi

if [ -d "src/app/blog-details" ] && [ -z "$(ls -A src/app/blog-details)" ]; then
    EMPTY_DIRS+=("src/app/blog-details")
fi

if [ -d "src/app/blog-sidebar" ] && [ -z "$(ls -A src/app/blog-sidebar)" ]; then
    EMPTY_DIRS+=("src/app/blog-sidebar")
fi

if [ -d "src/app/studio-data" ] && [ -z "$(ls -A src/app/studio-data)" ]; then
    EMPTY_DIRS+=("src/app/studio-data")
fi

if [ -d "src/app/ui-components-example" ] && [ -z "$(ls -A src/app/ui-components-example)" ]; then
    EMPTY_DIRS+=("src/app/ui-components-example")
fi

if [ -d "src/app/error" ] && [ -z "$(ls -A src/app/error)" ]; then
    EMPTY_DIRS+=("src/app/error")
fi

if [ ${#EMPTY_DIRS[@]} -eq 0 ]; then
    warning "Nessuna directory vuota trovata"
    exit 0
fi

log "Trovate ${#EMPTY_DIRS[@]} directory vuote:"
for dir in "${EMPTY_DIRS[@]}"; do
    echo "  - $dir"
done

# 4. Rimuovi directory vuote
log "Rimuovendo directory vuote..."

for dir in "${EMPTY_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        rm -rf "$dir"
        success "Rimosso: $dir"
    else
        warning "Directory non trovata: $dir"
    fi
done

# 5. Verifica build dopo pulizia
log "Testando build dopo pulizia..."
if npm run build > /dev/null 2>&1; then
    success "Build successful dopo pulizia"
else
    error "Build failed! Ripristinando backup..."
    cp -r "$BACKUP_DIR"/* src/app/ 2>/dev/null || true
    exit 1
fi

# 6. Calcola spazio liberato
log "Calcolando spazio liberato..."
if [ -d "$BACKUP_DIR" ]; then
    SPACE_FREED=$(du -sh "$BACKUP_DIR" 2>/dev/null | cut -f1 || echo "N/A")
    success "Spazio liberato: $SPACE_FREED"
else
    warning "Impossibile calcolare spazio liberato"
fi

# 7. Verifica finale
log "Verifica finale..."
echo "📋 Checklist Pulizia:"
echo "  ✅ Backup creato: $BACKUP_DIR"
echo "  ✅ Directory vuote identificate: ${#EMPTY_DIRS[@]}"
echo "  ✅ Directory rimosse: ${#EMPTY_DIRS[@]}"
echo "  ✅ Build test successful"
echo "  ✅ Spazio liberato: $SPACE_FREED"

# 8. Istruzioni finali
echo ""
echo "🎉 PULIZIA COMPLETATA!"
echo "====================="
echo ""
echo "📊 Risultati:"
echo "  🗑️  Directory rimosse: ${#EMPTY_DIRS[@]}"
echo "  💾 Spazio liberato: $SPACE_FREED"
echo "  ✅ Build funzionante"
echo ""
echo "📁 Directory rimosse:"
for dir in "${EMPTY_DIRS[@]}"; do
    echo "  - $dir"
done
echo ""
echo "🔍 Struttura attuale:"
echo "  📁 src/app/(public)/     - Frontend pubblico"
echo "  📁 src/app/(dashboard)/  - Dashboard privata"
echo "  📁 src/app/studio/       - Sanity CMS (mantenuto)"
echo ""
echo "🚨 In caso di problemi:"
echo "  - Rollback: cp -r $BACKUP_DIR/* src/app/"
echo "  - Git reset: git checkout HEAD -- src/app/"
echo ""
success "Pulizia completata con successo!"
