# 📋 COMANDI DI COPIA MANUALE

## 🎯 COMANDI PRONTI ALL'USO

### **FASE 1: PREPARAZIONE (Progetto Attuale)**

#### **1.1 Crea Cartella di Migrazione**
```bash
mkdir dashboard-migration
mkdir dashboard-migration/components
mkdir dashboard-migration/api
mkdir dashboard-migration/pages
```

#### **1.2 Copia Componenti Dashboard**
```bash
# Copia cartella Dashboard completa
cp -r src/components/Dashboard/ dashboard-migration/components/

# Oppure copia singoli file:
cp src/components/Dashboard/MainDashboard.tsx dashboard-migration/components/Dashboard/
cp src/components/Dashboard/DashboardTotale.tsx dashboard-migration/components/Dashboard/
cp src/components/Dashboard/SidebarNavigation.tsx dashboard-migration/components/Dashboard/
cp src/components/Dashboard/UnifiedTaskCalendarNew.tsx dashboard-migration/components/Dashboard/
cp src/components/Dashboard/TasksView.tsx dashboard-migration/components/Dashboard/
cp src/components/Dashboard/WarehouseManagement.tsx dashboard-migration/components/Dashboard/
```

#### **1.3 Copia Componenti ThreeJS**
```bash
# Copia cartella ThreeJS completa
cp -r src/components/ThreeJS/ dashboard-migration/components/

# Oppure singolo file:
cp src/components/ThreeJS/ThreeJSAnimation.tsx dashboard-migration/components/ThreeJS/
```

#### **1.4 Copia API Routes**
```bash
# Crea directory API
mkdir -p dashboard-migration/api/webhook
mkdir -p dashboard-migration/api/create-checkout-session
mkdir -p dashboard-migration/api/create-portal-session
mkdir -p dashboard-migration/api/create-subscription-session
mkdir -p dashboard-migration/api/payment/create-payment-intent

# Copia file API
cp src/app/api/webhook/route.ts dashboard-migration/api/webhook/
cp src/app/api/create-checkout-session/route.ts dashboard-migration/api/create-checkout-session/
cp src/app/api/create-portal-session/route.ts dashboard-migration/api/create-portal-session/
cp src/app/api/create-subscription-session/route.ts dashboard-migration/api/create-subscription-session/
cp src/app/api/payment/create-payment-intent/route.ts dashboard-migration/api/payment/create-payment-intent/
```

#### **1.5 Copia Pagina ThreeJS**
```bash
# Crea directory pages
mkdir -p dashboard-migration/pages/threejs

# Copia pagina
cp src/app/threejs/page.tsx dashboard-migration/pages/threejs/
```

#### **1.6 Copia Riferimento package.json**
```bash
cp package.json dashboard-migration/package-reference.json
```

---

### **FASE 2: INTEGRAZIONE (Progetto Destinazione)**

#### **2.1 Backup Progetto Destinazione**
```bash
# Nel progetto destinazione
mkdir backup-before-migration
cp -r src/ backup-before-migration/
cp package.json backup-before-migration/
```

#### **2.2 Copia Componenti Dashboard**
```bash
# Crea directory se non esiste
mkdir -p src/components/Dashboard

# Copia cartella Dashboard completa
cp -r dashboard-migration/components/Dashboard/ src/components/

# Oppure copia singoli file:
cp dashboard-migration/components/Dashboard/MainDashboard.tsx src/components/Dashboard/
cp dashboard-migration/components/Dashboard/DashboardTotale.tsx src/components/Dashboard/
cp dashboard-migration/components/Dashboard/SidebarNavigation.tsx src/components/Dashboard/
cp dashboard-migration/components/Dashboard/UnifiedTaskCalendarNew.tsx src/components/Dashboard/
cp dashboard-migration/components/Dashboard/TasksView.tsx src/components/Dashboard/
cp dashboard-migration/components/Dashboard/WarehouseManagement.tsx src/components/Dashboard/
```

#### **2.3 Copia Componenti ThreeJS**
```bash
# Crea directory ThreeJS se non esiste
mkdir -p src/components/ThreeJS

# Copia componente
cp dashboard-migration/components/ThreeJS/ThreeJSAnimation.tsx src/components/ThreeJS/
```

#### **2.4 Copia API Routes**
```bash
# Crea directory API se non esistono
mkdir -p src/app/api/webhook
mkdir -p src/app/api/create-checkout-session
mkdir -p src/app/api/create-portal-session
mkdir -p src/app/api/create-subscription-session
mkdir -p src/app/api/payment/create-payment-intent

# Copia file API
cp dashboard-migration/api/webhook/route.ts src/app/api/webhook/
cp dashboard-migration/api/create-checkout-session/route.ts src/app/api/create-checkout-session/
cp dashboard-migration/api/create-portal-session/route.ts src/app/api/create-portal-session/
cp dashboard-migration/api/create-subscription-session/route.ts src/app/api/create-subscription-session/
cp dashboard-migration/api/payment/create-payment-intent/route.ts src/app/api/payment/create-payment-intent/
```

#### **2.5 Copia Pagina ThreeJS**
```bash
# Crea directory threejs se non esiste
mkdir -p src/app/threejs

# Copia pagina
cp dashboard-migration/pages/threejs/page.tsx src/app/threejs/
```

#### **2.6 Installa Dipendenze**
```bash
# Installa dipendenze Three.js
npm install three @types/three @react-three/fiber @react-three/drei
```

---

## 🚀 COMANDI RAPIDI (TUTTO IN UNO)

### **Preparazione Rapida**
```bash
# Crea e copia tutto in una volta
mkdir dashboard-migration && \
mkdir dashboard-migration/components && \
mkdir dashboard-migration/api && \
mkdir dashboard-migration/pages && \
cp -r src/components/Dashboard/ dashboard-migration/components/ && \
cp -r src/components/ThreeJS/ dashboard-migration/components/ && \
cp -r src/app/api/ dashboard-migration/api/ && \
cp -r src/app/threejs/ dashboard-migration/pages/ && \
cp package.json dashboard-migration/package-reference.json
```

### **Integrazione Rapida**
```bash
# Backup e integra tutto in una volta
mkdir backup-before-migration && \
cp -r src/ backup-before-migration/ && \
cp -r dashboard-migration/components/Dashboard/ src/components/ && \
cp -r dashboard-migration/components/ThreeJS/ src/components/ && \
cp -r dashboard-migration/api/ src/app/ && \
cp -r dashboard-migration/pages/threejs/ src/app/ && \
npm install three @types/three @react-three/fiber @react-three/drei
```

---

## 🔍 VERIFICA POST-COPIA

### **Verifica File Copiati**
```bash
# Verifica componenti Dashboard
ls -la src/components/Dashboard/

# Verifica componenti ThreeJS
ls -la src/components/ThreeJS/

# Verifica API routes
ls -la src/app/api/webhook/
ls -la src/app/api/create-checkout-session/
ls -la src/app/api/create-portal-session/
ls -la src/app/api/create-subscription-session/
ls -la src/app/api/payment/create-payment-intent/

# Verifica pagina ThreeJS
ls -la src/app/threejs/
```

### **Verifica Dipendenze**
```bash
# Verifica dipendenze Three.js
npm list three @react-three/fiber @react-three/drei

# Se mancano, installa
npm install three @types/three @react-three/fiber @react-three/drei
```

### **Test Build**
```bash
# Test build
npm run build

# Se build fallisce, controlla errori
npm run build 2>&1 | tee build-errors.log
```

### **Test Dev Server**
```bash
# Test dev server
npm run dev

# Verifica in browser:
# - http://localhost:3000/dashboard
# - http://localhost:3000/threejs
```

---

## 🚨 GESTIONE ERRORI COMUNI

### **Directory Non Esistente**
```bash
# Crea directory mancanti
mkdir -p src/components/Dashboard
mkdir -p src/components/ThreeJS
mkdir -p src/app/api/webhook
mkdir -p src/app/api/create-checkout-session
mkdir -p src/app/api/create-portal-session
mkdir -p src/app/api/create-subscription-session
mkdir -p src/app/api/payment/create-payment-intent
mkdir -p src/app/threejs
```

### **File Esistente (Conflitto)**
```bash
# Backup file esistente
mv src/components/Dashboard/MainDashboard.tsx src/components/Dashboard/MainDashboard.tsx.backup

# Copia nuovo file
cp dashboard-migration/components/Dashboard/MainDashboard.tsx src/components/Dashboard/
```

### **Dipendenze Mancanti**
```bash
# Installa tutte le dipendenze
npm install

# Installa specifiche dipendenze Three.js
npm install three @types/three @react-three/fiber @react-three/drei
```

### **Build Errors**
```bash
# Pulisci cache
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

---

## 📋 CHECKLIST RAPIDA

### **Pre-Copia**
- [ ] `mkdir dashboard-migration`
- [ ] `cp -r src/components/Dashboard/ dashboard-migration/components/`
- [ ] `cp -r src/components/ThreeJS/ dashboard-migration/components/`
- [ ] `cp -r src/app/api/ dashboard-migration/api/`
- [ ] `cp -r src/app/threejs/ dashboard-migration/pages/`

### **Post-Copia**
- [ ] `mkdir backup-before-migration`
- [ ] `cp -r dashboard-migration/components/Dashboard/ src/components/`
- [ ] `cp -r dashboard-migration/components/ThreeJS/ src/components/`
- [ ] `cp -r dashboard-migration/api/ src/app/`
- [ ] `cp -r dashboard-migration/pages/threejs/ src/app/`
- [ ] `npm install three @types/three @react-three/fiber @react-three/drei`
- [ ] `npm run build`
- [ ] `npm run dev`

---

## ✅ RISPOSTA FINALE

**SÌ, puoi copiare e incollare manualmente!**

### **Metodi Disponibili:**
1. **Terminal/Command Line** - Usa i comandi sopra
2. **File Manager** - Drag & drop cartelle/file
3. **IDE/Editor** - Copy/paste contenuto file
4. **Git** - Cherry-pick specifici file

### **Raccomandazione:**
- **Per sicurezza**: Usa i comandi terminal
- **Per velocità**: Copia cartelle complete
- **Per controllo**: Copia file singoli
- **Per backup**: Crea sempre backup prima

**La migrazione manuale è perfettamente sicura e controllata!** 🎯

---

*Comandi di Copia Manuale - Versione 1.0*
