# 🤖 Documentazione Matematica e Robotica - Three.js

## 📋 Panoramica

Questo sistema avanzato di visualizzazione matematica e robotica utilizza Three.js per creare dimostrazioni interattive di:

- **Funzioni matematiche a 2 variabili** (superfici 3D)
- **Funzioni matematiche a 3 variabili** (volumi e campi scalari)
- **Applicazioni robotiche** (cinematica, path planning, controllo)

## 🎯 Caratteristiche Principali

### 📐 Visualizzazione Parabola Base
- Funzione quadratica `y = ax² + bx + c`
- Controlli interattivi per parametri a, b, c
- Animazioni fluide e rotazioni
- Punti interattivi lungo la curva

### 🧮 Funzioni Matematiche Avanzate

#### Funzioni 2D (Superfici)
1. **Paraboloide**: `z = x² + y²`
2. **Iperboloide**: `z = x² - y²`
3. **Onde Sinusoidali**: `z = sin(x)cos(y)`
4. **Gaussiana**: `z = e^(-(x²+y²)/2)`
5. **Sella**: `z = xy`
6. **Onde Circolari**: `z = sin(√(x²+y²))`
7. **Incroci**: `z = sin(x)sin(y)`
8. **Spirale**: `z = sin(r)/r`

#### Funzioni 3D (Volumi)
1. **Sfera**: `x² + y² + z² = 1`
2. **Toro**: Superficie toroidale
3. **Iperboloide 3D**: `x² + y² - z² = 1`
4. **Ellissoide**: `x²/4 + y²/2 + z²/3 = 1`
5. **Onde 3D**: `sin(x) + cos(y) + sin(z)`
6. **Gaussiana 3D**: `e^(-(x²+y²+z²)/2)`

### 🤖 Applicazioni Robotiche

#### 1. Cinematica Diretta
- **Braccio robotico** con 3 giunti
- **Controlli interattivi** per angoli dei giunti
- **Calcolo automatico** della posizione end-effector
- **Traiettoria in tempo reale**

#### 2. Path Planning
- **Campi di potenziale** per evitamento ostacoli
- **Ostacoli dinamici** configurabili
- **Goal interattivo** con controlli slider
- **Visualizzazione del campo** di potenziale

#### 3. Algoritmi di Controllo
- **PID Controller**: Controllo proporzionale-integrativo-derivativo
- **LQR Controller**: Controllo lineare quadratico
- **MPC Controller**: Controllo predittivo a modello
- **Parametri regolabili** in tempo reale

## 🛠️ Implementazione Tecnica

### Architettura Componenti

```
MathRoboticsDemo (Componente principale)
├── ThreeJSAnimation (Parabola base)
├── AdvancedMathVisualization (Funzioni 2D/3D)
└── RoboticsApplications (Applicazioni robotiche)
```

### Tecnologie Utilizzate

- **React Three Fiber**: Integrazione React con Three.js
- **Three.js**: Rendering 3D e grafica
- **@react-three/drei**: Componenti helper per Three.js
- **TypeScript**: Tipizzazione statica
- **Tailwind CSS**: Styling responsive

### Algoritmi Implementati

#### Cinematica Diretta
```typescript
const calculateForwardKinematics = (angles: number[], lengths: number[]) => {
  let x = 0, y = 0, z = 0;
  let currentAngle = 0;
  
  for (let i = 0; i < angles.length; i++) {
    currentAngle += angles[i];
    x += lengths[i] * Math.cos(currentAngle);
    y += lengths[i] * Math.sin(currentAngle);
  }
  
  return { x, y, z };
};
```

#### Campo di Potenziale
```typescript
// Potenziale repulsivo dagli ostacoli
let repulsivePotential = 0;
obstacles.forEach(obs => {
  const dist = Math.sqrt((x - obs.x) ** 2 + (y - obs.y) ** 2);
  if (dist < obs.radius * 2) {
    repulsivePotential += (obs.radius * 2 - dist) ** 2;
  }
});

// Potenziale attrattivo verso il goal
const goalDist = Math.sqrt((x - goal.x) ** 2 + (y - goal.y) ** 2);
const attractivePotential = goalDist ** 2;
```

#### PID Controller
```typescript
const error = Math.sin(time) - (output || 0);
output = parameters.kp * error + 
         parameters.ki * error * time + 
         parameters.kd * error;
```

## 🎮 Controlli Interattivi

### Navigazione 3D
- **Mouse**: Ruota, zoom, pan
- **Touch**: Controlli touch su mobile
- **OrbitControls**: Navigazione fluida

### Selezione Funzioni
- **Click**: Seleziona funzioni matematiche
- **Slider**: Modifica parametri in tempo reale
- **Checkbox**: Attiva/disattiva elementi

### Controlli Robotici
- **Angoli giunti**: Slider per cinematica
- **Posizione goal**: Controlli per path planning
- **Parametri controllo**: Regolazione PID/LQR/MPC

## 📚 Applicazioni Didattiche

### Matematica
- **Calcolo differenziale**: Derivate parziali
- **Geometria analitica**: Superfici e volumi
- **Analisi complessa**: Funzioni di variabili multiple

### Fisica
- **Meccanica**: Movimento e forze
- **Onde**: Propagazione e interferenza
- **Campi elettromagnetici**: Potenziali e gradienti

### Robotica
- **Cinematica**: Movimento dei robot
- **Controllo**: Feedback e stabilità
- **Pianificazione**: Percorsi ottimali

### Ingegneria
- **Ottimizzazione**: Minimi e massimi
- **Simulazione**: Sistemi dinamici
- **CAD**: Modellazione 3D

## 🚀 Funzionalità Avanzate

### Performance
- **Lazy loading**: Caricamento on-demand
- **Code splitting**: Bundle ottimizzato
- **60 FPS**: Animazioni fluide
- **Responsive**: Adattamento mobile

### Interattività
- **Real-time**: Aggiornamenti istantanei
- **Parametri dinamici**: Modifica in tempo reale
- **Visual feedback**: Indicatori visivi
- **Multi-touch**: Supporto touch

### Estensibilità
- **Modulare**: Componenti riutilizzabili
- **Configurabile**: Parametri personalizzabili
- **Scalabile**: Facile aggiunta funzioni
- **Documentato**: Codice ben commentato

## 🔧 Configurazione e Uso

### Installazione Dipendenze
```bash
npm install @react-three/fiber @react-three/drei three
```

### Utilizzo Componente
```tsx
import MathRoboticsDemo from '@/components/ThreeJS/MathRoboticsDemo';

export default function Page() {
  return <MathRoboticsDemo />;
}
```

### Personalizzazione
```tsx
// Modifica parametri default
const customParameters = {
  resolution: 100,
  range: 5,
  colors: ['#ff6b6b', '#4ecdc4', '#ffd93d']
};
```

## 📊 Metriche Performance

- **Build Time**: ~16 secondi
- **Bundle Size**: ~2.57 MB
- **First Load**: ~2.57 MB
- **FPS**: 60 (target)
- **Memory**: Ottimizzato per garbage collection

## 🎯 Roadmap Futuro

### Funzionalità Pianificate
- [ ] **Cinematica inversa** per robot
- [ ] **Machine Learning** per controllo
- [ ] **Simulazione fisica** avanzata
- [ ] **Export/Import** configurazioni
- [ ] **Realtà aumentata** (AR)
- [ ] **Realtà virtuale** (VR)

### Miglioramenti Tecnici
- [ ] **WebGL 2.0** per performance
- [ ] **Web Workers** per calcoli
- [ ] **PWA** per offline
- [ ] **Multiplayer** collaborativo
- [ ] **API REST** per dati
- [ ] **Database** per salvataggi

## 📖 Risorse e Riferimenti

### Documentazione
- [Three.js Documentation](https://threejs.org/docs/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [@react-three/drei](https://github.com/pmndrs/drei)

### Tutorial
- [Three.js Fundamentals](https://threejs.org/manual/)
- [React Three Fiber Guide](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)
- [Mathematical Visualization](https://observablehq.com/@d3/gallery)

### Esempi
- [Three.js Examples](https://threejs.org/examples/)
- [React Three Fiber Examples](https://codesandbox.io/examples/package/@react-three/fiber)
- [Mathematical Art](https://www.shadertoy.com/)

## 🤝 Contributi

Per contribuire al progetto:

1. **Fork** del repository
2. **Branch** per feature
3. **Commit** con messaggi chiari
4. **Pull Request** con descrizione
5. **Test** per nuove funzionalità

## 📄 Licenza

Questo progetto è rilasciato sotto licenza MIT. Vedi il file `LICENSE` per dettagli.

---

**Sviluppato con ❤️ per l'educazione matematica e robotica**
