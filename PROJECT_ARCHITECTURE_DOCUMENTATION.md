# 🏗️ DOCUMENTAZIONE COMPLETA ARCHITETTURA PROGETTO

## 📋 INDICE
1. [Panoramica Generale](#panoramica-generale)
2. [Architettura del Sistema](#architettura-del-sistema)
3. [Configurazione Database](#configurazione-database)
4. [API e Backend](#api-e-backend)
5. [Frontend e Componenti](#frontend-e-componenti)
6. [Sistema di Autenticazione](#sistema-di-autenticazione)
7. [Integrazione Pagamenti](#integrazione-pagamenti)
8. [Gestione Stato](#gestione-stato)
9. [Performance e Ottimizzazioni](#performance-e-ottimizzazioni)
10. [Roadmap Miglioramenti](#roadmap-miglioramenti)

---

## 🎯 PANORAMICA GENERALE

### **Tipo di Progetto**
- **Framework**: Next.js 15.4.6 con App Router
- **Linguaggio**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **CMS**: Sanity.io
- **Pagamenti**: Stripe
- **3D Graphics**: Three.js + React Three Fiber

### **Scopo del Sistema**
Sistema di gestione aziendale completo che include:
- Dashboard operativa
- Gestione task e calendario
- Marketing e lead management
- Gestione progetti
- Magazzino e inventario
- Sistema finanziario
- Animazioni 3D interattive

---

## 🏛️ ARCHITETTURA DEL SISTEMA

### **Struttura Directory**
```
src/
├── app/                    # App Router (Next.js 13+)
│   ├── api/               # API Routes
│   ├── dashboard/         # Dashboard pages
│   └── threejs/           # Three.js animation page
├── components/            # Componenti React
│   ├── Dashboard/         # Componenti dashboard
│   ├── Auth/             # Autenticazione
│   ├── ThreeJS/          # Animazioni 3D
│   └── Navigation/        # Navigazione
├── hooks/                # Custom hooks
├── lib/                  # Utilities e configurazioni
└── sanity/               # Configurazione Sanity
```

### **Pattern Architetturali**
1. **Component-Based Architecture**: Componenti modulari e riutilizzabili
2. **Custom Hooks**: Logica business separata dalla UI
3. **API Routes**: Backend integrato in Next.js
4. **Server-Side Rendering**: SEO e performance ottimizzate
5. **Client-Side State Management**: React hooks + Context

---

## 🗄️ CONFIGURAZIONE DATABASE

### **Supabase Setup**
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### **Tabelle Principali**

#### **1. Task Management**
```sql
-- task_calendar_tasks
CREATE TABLE task_calendar_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('pending', 'in-progress', 'completed')),
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  due_date TIMESTAMP,
  assigned_to TEXT,
  user_id TEXT DEFAULT 'default-user',
  created_at TIMESTAMP DEFAULT NOW()
);

-- task_calendar_appointments
CREATE TABLE task_calendar_appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  user_id TEXT DEFAULT 'default-user',
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### **2. Marketing System**
```sql
-- campaigns
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('active', 'paused', 'completed')),
  budget DECIMAL(10,2),
  spent DECIMAL(10,2) DEFAULT 0,
  leads INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  user_id TEXT DEFAULT 'default-user'
);

-- marketing_leads
CREATE TABLE marketing_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  source TEXT,
  status TEXT CHECK (status IN ('new', 'contacted', 'qualified', 'converted')),
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'hot')),
  notes TEXT,
  user_id TEXT DEFAULT 'default-user'
);
```

#### **3. Financial Management**
```sql
-- financial_transactions
CREATE TABLE financial_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT CHECK (type IN ('income', 'expense')),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  category TEXT,
  date DATE NOT NULL,
  user_id TEXT DEFAULT 'default-user'
);
```

### **Relazioni Database**
- **One-to-Many**: User → Tasks, Campaigns, Leads
- **Many-to-Many**: Tasks ↔ Projects (tramite junction table)
- **Self-Referencing**: Tasks possono avere subtask

---

## 🔌 API E BACKEND

### **API Routes Structure**
```
app/api/
├── webhook/              # Stripe webhooks
├── create-checkout-session/  # Stripe checkout
├── create-portal-session/    # Stripe billing portal
├── create-subscription-session/  # Stripe subscriptions
└── payment/
    └── create-payment-intent/  # Stripe payments
```

### **Pattern API Implementation**

#### **1. Stripe Integration**
```typescript
// app/api/create-checkout-session/route.ts
export async function POST(request: NextRequest) {
  try {
    const { priceId, customerId } = await request.json();
    
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}
```

#### **2. Database Operations**
```typescript
// Pattern per operazioni CRUD
export async function createTask(taskData: TaskData) {
  const { data, error } = await supabase
    .from('task_calendar_tasks')
    .insert([taskData])
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function getTasks(filters?: TaskFilters) {
  let query = supabase.from('task_calendar_tasks').select('*');
  
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data;
}
```

### **Error Handling Pattern**
```typescript
// Middleware per gestione errori
export function withErrorHandling(handler: Function) {
  return async (req: NextRequest, res: NextResponse) => {
    try {
      return await handler(req, res);
    } catch (error) {
      console.error('API Error:', error);
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      );
    }
  };
}
```

---

## 🎨 FRONTEND E COMPONENTI

### **Component Architecture**

#### **1. Dashboard Components**
```typescript
// components/Dashboard/DashboardTotale.tsx
export default function DashboardTotale() {
  const [stats, setStats] = useState<DashboardStats>({});
  const [quickTasks, setQuickTasks] = useState<any[]>([]);
  
  // Custom hooks per data fetching
  const { data: tasks, loading } = useTasks();
  const { data: campaigns } = useCampaigns();
  
  // State management locale
  const handleQuickTaskSubmit = async (formData) => {
    // Logica per creare task veloce
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
      {/* Componenti dashboard */}
    </div>
  );
}
```

#### **2. Custom Hooks Pattern**
```typescript
// hooks/useTasks.ts
export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const loadTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('task_calendar_tasks')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setTasks(data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadTasks();
  }, []);
  
  return { tasks, loading, refetch: loadTasks };
}
```

### **State Management Strategy**

#### **1. Local State (useState)**
- Componenti semplici
- Stato temporaneo
- Form data

#### **2. Context API**
```typescript
// contexts/AuthContext.tsx
export const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  
  const login = async (email, password) => {
    // Supabase auth logic
  };
  
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

#### **3. Server State (Supabase)**
- Dati persistenti
- Cache automatica
- Real-time updates

---

## 🔐 SISTEMA DI AUTENTICAZIONE

### **Supabase Auth Integration**
```typescript
// components/Auth/ProtectedRoute.tsx
export default function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);
  
  if (loading) return <LoadingSpinner />;
  if (!user) return <LoginForm />;
  
  return children;
}
```

### **Auth Patterns**
1. **Route Protection**: Wrapper component per pagine protette
2. **Session Management**: Automatico tramite Supabase
3. **User Context**: Global state per user data
4. **Role-Based Access**: Preparato per implementazione ruoli

---

## 💳 INTEGRAZIONE PAGAMENTI

### **Stripe Configuration**
```typescript
// lib/stripe.ts
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
});

// Webhook handling
export async function handleStripeWebhook(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;
  
  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    
    switch (event.type) {
      case 'checkout.session.completed':
        // Handle successful payment
        break;
      case 'customer.subscription.updated':
        // Handle subscription changes
        break;
    }
  } catch (error) {
    console.error('Webhook error:', error);
  }
}
```

### **Payment Flow**
1. **Product Selection** → Pricing page
2. **Checkout Session** → Stripe Checkout
3. **Payment Processing** → Stripe handles payment
4. **Webhook Notification** → Update database
5. **User Access** → Grant premium features

---

## ⚡ PERFORMANCE E OTTIMIZZAZIONI

### **Current Optimizations**

#### **1. Next.js Optimizations**
- **App Router**: Routing moderno e performante
- **Static Generation**: Pagine pre-renderizzate
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatico per route

#### **2. Database Optimizations**
- **Indexing**: Indici su campi frequentemente query
- **Connection Pooling**: Supabase gestisce automaticamente
- **Query Optimization**: Select specifici, non SELECT *

#### **3. Frontend Optimizations**
- **Lazy Loading**: Componenti caricati on-demand
- **Memoization**: React.memo per componenti pesanti
- **Virtual Scrolling**: Per liste lunghe (da implementare)

### **Performance Monitoring**
```typescript
// utils/performance.ts
export function measurePerformance(name: string, fn: Function) {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  
  console.log(`${name} took ${end - start} milliseconds`);
  return result;
}

// Usage
const expensiveOperation = measurePerformance('Data Processing', () => {
  return processLargeDataset(data);
});
```

---

## 🚀 ROADMAP MIGLIORAMENTI

### **🔧 Ottimizzazioni Immediate (1-2 settimane)**

#### **1. Database Performance**
```sql
-- Aggiungere indici per query frequenti
CREATE INDEX idx_tasks_user_status ON task_calendar_tasks(user_id, status);
CREATE INDEX idx_tasks_due_date ON task_calendar_tasks(due_date);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_leads_priority ON marketing_leads(priority);
```

#### **2. Caching Strategy**
```typescript
// lib/cache.ts
import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export async function getCachedData(key: string, fetcher: Function, ttl = 300) {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);
  
  const data = await fetcher();
  await redis.setex(key, ttl, JSON.stringify(data));
  return data;
}

// Usage
const tasks = await getCachedData('user_tasks', () => loadTasks(), 600);
```

#### **3. API Rate Limiting**
```typescript
// middleware/rateLimit.ts
import { NextRequest } from 'next/server';

const rateLimit = new Map();

export function rateLimitMiddleware(req: NextRequest) {
  const ip = req.ip || 'unknown';
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 100;
  
  const requests = rateLimit.get(ip) || [];
  const validRequests = requests.filter((time: number) => now - time < windowMs);
  
  if (validRequests.length >= maxRequests) {
    return new Response('Too Many Requests', { status: 429 });
  }
  
  validRequests.push(now);
  rateLimit.set(ip, validRequests);
}
```

### **📈 Miglioramenti Medi (1-2 mesi)**

#### **1. Real-time Features**
```typescript
// hooks/useRealtime.ts
export function useRealtimeSubscription(table: string, callback: Function) {
  useEffect(() => {
    const subscription = supabase
      .channel(`${table}_changes`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table },
        callback
      )
      .subscribe();
      
    return () => subscription.unsubscribe();
  }, [table, callback]);
}

// Usage in components
useRealtimeSubscription('task_calendar_tasks', (payload) => {
  setTasks(prev => [...prev, payload.new]);
});
```

#### **2. Advanced State Management**
```typescript
// lib/store.ts - Zustand implementation
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface AppState {
  tasks: Task[];
  campaigns: Campaign[];
  user: User | null;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        tasks: [],
        campaigns: [],
        user: null,
        addTask: (task) => set(state => ({ tasks: [...state.tasks, task] })),
        updateTask: (id, updates) => set(state => ({
          tasks: state.tasks.map(task => 
            task.id === id ? { ...task, ...updates } : task
          )
        })),
        deleteTask: (id) => set(state => ({
          tasks: state.tasks.filter(task => task.id !== id)
        })),
      }),
      { name: 'app-storage' }
    )
  )
);
```

#### **3. Advanced Analytics**
```typescript
// lib/analytics.ts
export class Analytics {
  static track(event: string, properties?: Record<string, any>) {
    // Google Analytics 4
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event, properties);
    }
    
    // Custom analytics
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, properties, timestamp: Date.now() })
    });
  }
  
  static trackUserAction(action: string, context: string) {
    this.track('user_action', { action, context });
  }
  
  static trackPerformance(metric: string, value: number) {
    this.track('performance', { metric, value });
  }
}
```

### **🎯 Miglioramenti Avanzati (3-6 mesi)**

#### **1. Microservices Architecture**
```
Current: Monolithic Next.js App
Target: Microservices + API Gateway

Services:
├── auth-service/          # Authentication & Authorization
├── task-service/          # Task & Project Management
├── marketing-service/     # Campaigns & Leads
├── financial-service/     # Payments & Accounting
├── notification-service/  # Email & Push Notifications
└── analytics-service/     # Data Analytics & Reporting
```

#### **2. Advanced Database Design**
```sql
-- Partitioning per tabelle grandi
CREATE TABLE task_calendar_tasks_2024 PARTITION OF task_calendar_tasks
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

-- Materialized Views per analytics
CREATE MATERIALIZED VIEW dashboard_stats AS
SELECT 
  DATE_TRUNC('day', created_at) as date,
  COUNT(*) as total_tasks,
  COUNT(*) FILTER (WHERE status = 'completed') as completed_tasks
FROM task_calendar_tasks
GROUP BY DATE_TRUNC('day', created_at);

-- Refresh automatico
CREATE OR REPLACE FUNCTION refresh_dashboard_stats()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW dashboard_stats;
END;
$$ LANGUAGE plpgsql;
```

#### **3. AI/ML Integration**
```typescript
// lib/ai.ts
export class AIAssistant {
  static async generateTaskSuggestions(userId: string) {
    const userTasks = await getUserTasks(userId);
    const patterns = await analyzeTaskPatterns(userTasks);
    
    return await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: "Analyze user task patterns and suggest new tasks"
      }, {
        role: "user", 
        content: `User tasks: ${JSON.stringify(patterns)}`
      }]
    });
  }
  
  static async predictTaskCompletion(taskId: string) {
    // ML model per predire completion time
    const features = await extractTaskFeatures(taskId);
    return await this.mlModel.predict(features);
  }
}
```

#### **4. Advanced Security**
```typescript
// middleware/security.ts
export function securityMiddleware(req: NextRequest) {
  // CORS configuration
  const corsHeaders = {
    'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
  
  // Rate limiting per IP
  const rateLimit = new Map();
  const ip = req.ip;
  const now = Date.now();
  
  // Security headers
  const securityHeaders = {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000',
  };
  
  return new Response(null, {
    status: 200,
    headers: { ...corsHeaders, ...securityHeaders }
  });
}
```

### **🔮 Future Features (6+ mesi)**

#### **1. Mobile App (React Native)**
- Condivisione codice con Next.js
- Offline-first architecture
- Push notifications
- Biometric authentication

#### **2. Advanced Analytics Dashboard**
- Real-time metrics
- Predictive analytics
- Custom reports
- Data visualization

#### **3. Enterprise Features**
- Multi-tenant architecture
- SSO integration
- Advanced permissions
- Audit logging

#### **4. AI-Powered Features**
- Smart task scheduling
- Automated lead scoring
- Predictive maintenance
- Natural language queries

---

## 🛠️ TOOLS E TECNOLOGIE RACCOMANDATE

### **Development Tools**
```json
{
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0",
    "husky": "^8.0.0",
    "lint-staged": "^15.0.0"
  }
}
```

### **Monitoring & Analytics**
- **Sentry**: Error tracking
- **Vercel Analytics**: Performance monitoring
- **Google Analytics 4**: User behavior
- **PostHog**: Product analytics

### **Testing Strategy**
```typescript
// Jest + Testing Library setup
describe('Dashboard Component', () => {
  it('should render tasks correctly', async () => {
    render(<DashboardTotale />);
    expect(screen.getByText('Attività di Oggi')).toBeInTheDocument();
  });
  
  it('should handle task creation', async () => {
    const mockCreateTask = jest.fn();
    render(<DashboardTotale onCreateTask={mockCreateTask} />);
    
    fireEvent.click(screen.getByText('Crea Task'));
    expect(mockCreateTask).toHaveBeenCalled();
  });
});
```

---

## 📊 METRICHE E MONITORAGGIO

### **Key Performance Indicators**
1. **Page Load Time**: < 2s
2. **Time to Interactive**: < 3s
3. **Database Query Time**: < 100ms
4. **API Response Time**: < 200ms
5. **Error Rate**: < 1%

### **Monitoring Setup**
```typescript
// lib/monitoring.ts
export class PerformanceMonitor {
  static trackPageLoad(page: string) {
    if (typeof window !== 'undefined') {
      window.performance.mark(`${page}-start`);
      window.addEventListener('load', () => {
        window.performance.mark(`${page}-end`);
        window.performance.measure(
          `${page}-load-time`,
          `${page}-start`,
          `${page}-end`
        );
      });
    }
  }
  
  static trackDatabaseQuery(query: string, duration: number) {
    console.log(`DB Query: ${query} took ${duration}ms`);
    // Send to monitoring service
  }
}
```

---

## 🎯 CONCLUSIONI

### **Punti di Forza Attuali**
✅ Architettura moderna con Next.js 15
✅ Database ben strutturato con Supabase
✅ Componenti modulari e riutilizzabili
✅ Integrazione pagamenti funzionante
✅ Sistema responsive ottimizzato

### **Aree di Miglioramento**
🔧 Performance optimization
🔧 Real-time features
🔧 Advanced caching
🔧 Security hardening
🔧 Testing coverage

### **Prossimi Passi Raccomandati**
1. **Implementare caching** (Redis)
2. **Aggiungere real-time updates**
3. **Migliorare security** (rate limiting, headers)
4. **Implementare testing** (Jest, Cypress)
5. **Aggiungere monitoring** (Sentry, Analytics)

---

*Documento aggiornato: $(date)*
*Versione: 1.0*
*Autore: AI Assistant*
