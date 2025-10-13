# 📁 Struttura Directory `/src` - Documentazione Completa

## 📋 Panoramica

La directory `src` contiene l'intera architettura del progetto Next.js, organizzata in modo modulare e scalabile. La struttura segue le best practices di Next.js 13+ con App Router e separazione tra frontend pubblico e dashboard privata.

## 🏗️ Architettura Generale

```
src/
├── app/                    # Next.js App Router (pagine e API)
├── components/             # Componenti React riutilizzabili
├── config/                 # Configurazioni globali
├── contexts/               # React Context per stato globale
├── hooks/                  # Custom React Hooks
├── lib/                    # Librerie e utilità
├── sanity/                 # Configurazione CMS Sanity
├── services/               # Servizi e logica business
├── styles/                 # Stili globali
├── types/                  # Definizioni TypeScript
└── utils/                  # Funzioni di utilità
```

## 📱 Directory `app/` - Next.js App Router

### 🎯 Route Groups
Il progetto utilizza **route groups** per separare frontend pubblico e dashboard privata:

#### `(public)/` - Frontend Pubblico
```
app/(public)/
├── page.tsx                    # Homepage principale
├── about/page.tsx              # Pagina About
├── blog/
│   ├── page.tsx                # Lista blog
│   └── [slug]/page.tsx         # Singolo articolo
├── contact/page.tsx            # Pagina contatti
├── legal/
│   ├── page.tsx                # Lista documenti legali
│   └── [slug]/page.tsx         # Singolo documento
├── pricing/page.tsx            # Pagina prezzi
├── projects/
│   ├── page.tsx                # Lista progetti
│   └── [slug]/page.tsx         # Singolo progetto
├── services/
│   ├── page.tsx                # Lista servizi
│   ├── [slug]/page.tsx         # Singolo servizio
│   └── [slug]/projects/page.tsx # Progetti per servizio
└── shop/
    ├── page.tsx                # Catalogo prodotti
    ├── cart/page.tsx           # Carrello
    ├── checkout/page.tsx       # Checkout
    ├── order/[orderNumber]/page.tsx # Dettaglio ordine
    └── success/page.tsx        # Conferma acquisto
```

#### `(dashboard)/` - Dashboard Privata
```
app/(dashboard)/
├── api/                        # API Routes per dashboard
│   ├── create-checkout-session/route.ts
│   ├── create-portal-session/route.ts
│   ├── create-subscription-session/route.ts
│   ├── payment/create-payment-intent/route.ts
│   ├── test-stripe/route.ts
│   └── webhook/route.ts
├── dashboard/page.tsx          # Dashboard principale
└── threejs/page.tsx            # Pagina Three.js
```

#### File Globali App
```
app/
├── layout.tsx                  # Layout root dell'applicazione
├── providers.tsx               # Provider globali (Context, etc.)
└── studio/                     # Sanity Studio
    ├── [[...tool]]/
    │   ├── page.tsx
    │   └── sanity.config.ts.tsx
    └── layout.tsx
```

## 🧩 Directory `components/` - Componenti React

### 📊 Organizzazione per Categoria

#### 🏠 Componenti Pubblici
```
components/
├── About/                      # Sezioni About
│   ├── AboutSectionOne.tsx
│   └── AboutSectionTwo.tsx
├── Blog/                       # Componenti Blog
│   ├── index.tsx
│   ├── RelatedPost.tsx
│   ├── SharePost.tsx
│   ├── SingleBlog.tsx
│   └── TagButton.tsx
├── Contact/                    # Componenti Contatti
│   ├── index.tsx
│   └── NewsLatterBox.tsx
├── Features/                   # Componenti Features
│   ├── index.tsx
│   └── SingleFeature.tsx
├── Footer/index.tsx            # Footer
├── Header/index.tsx            # Header
├── Hero/index.tsx              # Hero Section
├── Navigation/HomeButton.tsx   # Navigazione
├── Projects/                   # Componenti Progetti
│   ├── index.tsx
│   └── SingleProject.tsx
├── Services/index.tsx          # Componenti Servizi
├── Testimonials/               # Componenti Testimonial
│   ├── index.tsx
│   └── SingleTestimonial.tsx
└── ScrollToTop/index.tsx       # Scroll to Top
```

#### 🛒 Componenti E-commerce
```
components/Shop/
├── CartIcon.tsx                # Icona carrello
├── CheckoutWithPayment.tsx     # Checkout con pagamenti
├── CustomerPortal.tsx          # Portale cliente
├── index.tsx                   # Shop principale
├── MiniCart.tsx                # Mini carrello
├── OrderReview.tsx             # Rassegna ordine
├── PaymentForm.tsx             # Form pagamento
├── PaymentMethodSelector.tsx   # Selezione metodo pagamento
├── SimpleStripeCheckout.tsx    # Checkout Stripe semplice
├── SingleProduct.tsx           # Singolo prodotto
├── StripeCheckout.tsx          # Checkout Stripe completo
├── StripeProvider.tsx          # Provider Stripe
└── SubscriptionPlans.tsx       # Piani abbonamento
```

#### 🎛️ Componenti Dashboard
```
components/Dashboard/            # 101 componenti dashboard
├── AIManagement.tsx            # Gestione AI
├── AllSectionsTest.tsx         # Test tutte le sezioni
├── BusinessPlanManagement.tsx  # Gestione business plan
├── CalendarManagement.tsx      # Gestione calendario
├── DashboardTotale.tsx         # Dashboard principale
├── FinancialManagement.tsx     # Gestione finanziaria
├── MainDashboard.tsx           # Layout dashboard principale
├── MarketingView.tsx           # Vista marketing
├── ProjectManagement.tsx       # Gestione progetti
├── SidebarNavigation.tsx       # Navigazione sidebar
├── TaskManagement.tsx          # Gestione task
├── WarehouseManagement.tsx     # Gestione magazzino
└── ... (altri 89 componenti)
```

#### 🎨 Componenti Three.js
```
components/ThreeJS/
├── AdvancedMathVisualization.tsx    # Visualizzazione matematica avanzata
├── MathRoboticsDemo.tsx             # Demo matematica e robotica
├── ProductionLineSimulation.tsx     # Simulazione catena produzione
├── RoboticsApplications.tsx         # Applicazioni robotiche
├── RobotProgrammingInterface.tsx    # Interfaccia programmazione robot
└── ThreeJSAnimation.tsx             # Animazione Three.js base
```

#### 🔧 Componenti Comuni
```
components/Common/
├── Breadcrumb.tsx              # Breadcrumb navigazione
├── Notification.tsx            # Notifiche
├── NotificationContainer.tsx   # Container notifiche
├── SanityLink.tsx              # Link Sanity
├── SanityStyledComponent.tsx   # Componenti stilizzati Sanity
├── ScrollUp.tsx                # Scroll up
└── SectionTitle.tsx            # Titoli sezione
```

#### 🔐 Componenti Autenticazione
```
components/Auth/
├── LoginForm.tsx               # Form login
├── LogoutButton.tsx            # Pulsante logout
└── ProtectedRoute.tsx          # Route protette
```

#### 📊 Componenti Analytics
```
components/Analytics/
└── AnalyticsTracker.tsx        # Tracker analytics
```

## ⚙️ Directory `config/` - Configurazioni

```
config/
└── auth.ts                     # Configurazione autenticazione
```

## 🌐 Directory `contexts/` - React Context

```
contexts/
├── AnalyticsContext.tsx        # Context per analytics
├── CartContext.tsx             # Context per carrello
├── DashboardContext.tsx        # Context per dashboard
└── InfoModalContext.tsx        # Context per modali info
```

## 🎣 Directory `hooks/` - Custom Hooks

### 📁 Organizzazione per Categoria
```
hooks/
├── _auth/                      # Hooks per autenticazione
├── _data/                      # Hooks per gestione dati
├── _ui/                        # Hooks per UI
├── README.md                   # Documentazione hooks
├── useAuth.ts                  # Hook autenticazione
├── useClientAnalytics.ts       # Hook analytics client
├── useClientDate.ts            # Hook gestione date
├── useMarketingData.ts         # Hook dati marketing
├── useNotifications.ts         # Hook notifiche
├── useSanityStyles.ts          # Hook stili Sanity
└── useSanityUIComponents.ts    # Hook componenti UI Sanity
```

## 📚 Directory `lib/` - Librerie e Utilità

### 📁 Organizzazione per Categoria
```
lib/
├── _external/                  # Librerie esterne
├── _internal/                  # Librerie interne
├── README.md                   # Documentazione librerie
├── ai-integrations.ts          # Integrazioni AI
├── business-plan-helpers.ts    # Helper business plan
├── marketing.ts                # Libreria marketing
├── supabase.ts                 # Client Supabase
└── translation.ts              # Gestione traduzioni
```

## 🎨 Directory `sanity/` - CMS Sanity

```
sanity/
├── env.ts                      # Variabili ambiente Sanity
├── lib/                        # Librerie Sanity
│   ├── client.ts               # Client Sanity
│   ├── image.ts                # Gestione immagini
│   ├── live.ts                 # Live preview
│   └── queries.ts              # Query Sanity
├── schemaTypes/                # Tipi schema Sanity
│   ├── about.ts                # Schema About
│   ├── blockContent.ts         # Schema contenuto blocco
│   ├── contact.ts              # Schema contatti
│   ├── feature.ts              # Schema features
│   ├── hero.ts                 # Schema hero
│   ├── index.ts                # Indice schemi
│   ├── post.ts                 # Schema post
│   ├── product.ts              # Schema prodotto
│   ├── project.ts              # Schema progetto
│   ├── service.ts              # Schema servizio
│   ├── siteSettings.ts         # Schema impostazioni sito
│   └── testimonial.ts          # Schema testimonial
└── structure.ts                # Struttura Sanity Studio
```

## 🔧 Directory `services/` - Servizi Business

### 📁 Organizzazione per Categoria
```
services/
├── _external/                  # Servizi esterni
├── _internal/                  # Servizi interni
├── README.md                   # Documentazione servizi
├── analyticsService.ts         # Servizio analytics
├── marketingService.ts         # Servizio marketing
├── mockDataService.ts          # Servizio dati mock
├── orderService.ts             # Servizio ordini
├── sanityDataService.ts        # Servizio dati Sanity
└── sanitySync.ts               # Sincronizzazione Sanity
```

## 🎨 Directory `styles/` - Stili

```
styles/
└── index.css                   # Stili globali CSS
```

## 📝 Directory `types/` - Definizioni TypeScript

### 📁 Organizzazione per Categoria
```
types/
├── _api/                       # Tipi per API
├── _data/                      # Tipi per dati
├── _ui/                        # Tipi per UI
├── README.md                   # Documentazione tipi
├── blog.ts                     # Tipi blog
├── feature.ts                  # Tipi features
├── menu.ts                     # Tipi menu
├── order.ts                    # Tipi ordini
├── product.ts                  # Tipi prodotti
├── project.ts                  # Tipi progetti
└── testimonial.ts              # Tipi testimonial
```

## 🛠️ Directory `utils/` - Funzioni di Utilità

### 📁 Organizzazione per Categoria
```
utils/
├── _env/                       # Utilità ambiente
├── _validation/                # Utilità validazione
├── README.md                   # Documentazione utilità
└── envCheck.ts                 # Controllo variabili ambiente
```

## 🎯 Convenzioni e Best Practices

### 📁 Naming Conventions
- **PascalCase**: Componenti React (`UserProfile.tsx`)
- **camelCase**: Hooks, servizi, utilità (`useAuth.ts`)
- **kebab-case**: Route dinamiche (`[slug]/page.tsx`)
- **snake_case**: File di configurazione (`sanity.config.ts`)

### 🏗️ Organizzazione
- **Route Groups**: `(public)` e `(dashboard)` per separazione
- **Directory Categorizzate**: `_auth`, `_data`, `_ui` per organizzazione
- **README.md**: Documentazione in ogni directory principale
- **Index Files**: Esportazioni centralizzate dove necessario

### 🔧 Architettura
- **Separation of Concerns**: Logica separata per categoria
- **Reusability**: Componenti riutilizzabili e modulari
- **Type Safety**: TypeScript per type checking
- **Performance**: Lazy loading e code splitting

## 📊 Statistiche Struttura

### 📁 Conteggio File per Directory
- **app/**: 25+ file (pagine e API)
- **components/**: 150+ file (componenti React)
- **contexts/**: 4 file (React Context)
- **hooks/**: 8+ file (Custom Hooks)
- **lib/**: 6+ file (Librerie)
- **sanity/**: 15+ file (CMS)
- **services/**: 7+ file (Servizi)
- **types/**: 8+ file (TypeScript)
- **utils/**: 2+ file (Utilità)

### 🎯 Tipi di File
- **React Components**: `.tsx` (componenti UI)
- **TypeScript**: `.ts` (logica, tipi, utilità)
- **CSS**: `.css` (stili)
- **Configuration**: `.ts` (configurazioni)

## 🚀 Scalabilità e Manutenibilità

### ✅ Punti di Forza
- **Modularità**: Struttura modulare e organizzata
- **Separazione**: Frontend pubblico e dashboard privata
- **Type Safety**: TypeScript per robustezza
- **Documentazione**: README in ogni directory
- **Best Practices**: Convenzioni standard Next.js

### 🔄 Estensibilità
- **Nuovi Componenti**: Facile aggiunta in directory appropriate
- **Nuove Route**: Aggiunta in route groups esistenti
- **Nuovi Servizi**: Integrazione in directory services
- **Nuovi Tipi**: Estensione in directory types

---

**Struttura progettata per scalabilità, manutenibilità e sviluppo efficiente** 🏗️
