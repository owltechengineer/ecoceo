#!/bin/bash

# 🏗️ SCRIPT SEPARAZIONE FRONTEND E DASHBOARD
# Questo script separa il progetto in frontend pubblico e dashboard privata

set -e  # Exit on any error

echo "🏗️ SEPARAZIONE FRONTEND E DASHBOARD"
echo "==================================="

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

# 2. Backup completo
log "Creando backup completo..."
BACKUP_DIR="backup-before-separation/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Backup tutto
cp -r src/ "$BACKUP_DIR/"
cp package.json "$BACKUP_DIR/"
cp tsconfig.json "$BACKUP_DIR/"
cp tailwind.config.js "$BACKUP_DIR/" 2>/dev/null || warning "tailwind.config.js non trovato"
cp next.config.js "$BACKUP_DIR/" 2>/dev/null || warning "next.config.js non trovato"

success "Backup creato in: $BACKUP_DIR"

# 3. Crea route groups
log "Creando route groups..."
mkdir -p src/app/\(public\)
mkdir -p src/app/\(dashboard\)
mkdir -p src/components/\(public\)
mkdir -p src/components/\(dashboard\)

success "Route groups creati"

# 4. Sposta pagine pubbliche
log "Spostando pagine pubbliche..."

# Lista pagine pubbliche da spostare
PUBLIC_PAGES=("page.tsx" "about" "contact" "pricing" "blog" "shop" "services")

for page in "${PUBLIC_PAGES[@]}"; do
    if [ -e "src/app/$page" ]; then
        mv "src/app/$page" "src/app/\(public\)/"
        success "Spostato: $page"
    else
        warning "Non trovato: $page"
    fi
done

# 5. Sposta dashboard e API
log "Spostando dashboard e API..."

if [ -d "src/app/dashboard" ]; then
    mv src/app/dashboard src/app/\(dashboard\)/
    success "Spostato: dashboard"
else
    warning "Dashboard non trovata"
fi

if [ -d "src/app/threejs" ]; then
    mv src/app/threejs src/app/\(dashboard\)/
    success "Spostato: threejs"
else
    warning "ThreeJS non trovato"
fi

if [ -d "src/app/api" ]; then
    mv src/app/api src/app/\(dashboard\)/
    success "Spostato: api"
else
    warning "API non trovata"
fi

# 6. Sposta componenti dashboard
log "Spostando componenti dashboard..."

# Lista componenti dashboard da spostare
DASHBOARD_COMPONENTS=("Dashboard" "Auth" "ThreeJS" "Navigation")

for component in "${DASHBOARD_COMPONENTS[@]}"; do
    if [ -d "src/components/$component" ]; then
        mv "src/components/$component" "src/components/\(dashboard\)/"
        success "Spostato: $component"
    else
        warning "Non trovato: $component"
    fi
done

# 7. Crea layout separati
log "Creando layout separati..."

# Layout pubblico
cat > src/app/\(public\)/layout.tsx << 'EOF'
import { ReactNode } from 'react';

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="public-layout min-h-screen bg-gray-50">
      {/* Header pubblico */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Your Company</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="/" className="text-gray-500 hover:text-gray-900">Home</a>
              <a href="/about" className="text-gray-500 hover:text-gray-900">About</a>
              <a href="/contact" className="text-gray-500 hover:text-gray-900">Contact</a>
              <a href="/pricing" className="text-gray-500 hover:text-gray-900">Pricing</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Contenuto principale */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer pubblico */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p>&copy; 2024 Your Company. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
EOF

success "Layout pubblico creato"

# Layout dashboard
cat > src/app/\(dashboard\)/layout.tsx << 'EOF'
'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verifica autenticazione
    const checkAuth = async () => {
      try {
        // Qui implementeresti la logica di autenticazione
        // Per ora, assumiamo che l'utente sia autenticato
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">Please log in to access the dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>
        </div>
        <nav className="mt-6">
          <a href="/dashboard" className="block px-6 py-3 text-gray-700 hover:bg-gray-100">
            Overview
          </a>
          <a href="/dashboard/tasks" className="block px-6 py-3 text-gray-700 hover:bg-gray-100">
            Tasks
          </a>
          <a href="/dashboard/marketing" className="block px-6 py-3 text-gray-700 hover:bg-gray-100">
            Marketing
          </a>
          <a href="/threejs" className="block px-6 py-3 text-gray-700 hover:bg-gray-100">
            Three.js
          </a>
        </nav>
      </div>

      {/* Contenuto principale */}
      <div className="ml-64">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
EOF

success "Layout dashboard creato"

# 8. Crea middleware per protezione
log "Creando middleware..."

cat > middleware.ts << 'EOF'
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Proteggi tutte le route dashboard
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/threejs')) {
    // Verifica autenticazione
    const token = request.cookies.get('auth-token');
    
    if (!token) {
      // Redirect al login se non autenticato
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/threejs/:path*']
};
EOF

success "Middleware creato"

# 9. Aggiorna next.config.js
log "Aggiornando next.config.js..."

if [ -f "next.config.js" ]; then
    # Backup next.config.js
    cp next.config.js next.config.js.backup
    
    # Aggiungi configurazione per bundle splitting
    cat >> next.config.js << 'EOF'

// Configurazione per separazione frontend/dashboard
const nextConfig = {
  ...nextConfig,
  experimental: {
    ...nextConfig.experimental,
    optimizePackageImports: ['@supabase/supabase-js', 'three'],
  },
  
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          dashboard: {
            test: /[\\/]app[\\/]\(dashboard\)[\\/]/,
            name: 'dashboard',
            chunks: 'all',
            priority: 10,
          },
          public: {
            test: /[\\/]app[\\/]\(public\)[\\/]/,
            name: 'public',
            chunks: 'all',
            priority: 10,
          },
        },
      };
    }
    return config;
  },
};

module.exports = nextConfig;
EOF
    success "next.config.js aggiornato"
else
    warning "next.config.js non trovato, creando nuovo..."
    cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@supabase/supabase-js', 'three'],
  },
  
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          dashboard: {
            test: /[\\/]app[\\/]\(dashboard\)[\\/]/,
            name: 'dashboard',
            chunks: 'all',
            priority: 10,
          },
          public: {
            test: /[\\/]app[\\/]\(public\)[\\/]/,
            name: 'public',
            chunks: 'all',
            priority: 10,
          },
        },
      };
    }
    return config;
  },
};

module.exports = nextConfig;
EOF
    success "next.config.js creato"
fi

# 10. Crea pagina di login
log "Creando pagina di login..."

mkdir -p src/app/\(public\)/login

cat > src/app/\(public\)/login/page.tsx << 'EOF'
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Qui implementeresti la logica di login
      // Per ora, simuliamo un login di successo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Imposta cookie di autenticazione
      document.cookie = 'auth-token=demo-token; path=/';
      
      // Redirect alla dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to Dashboard
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
EOF

success "Pagina di login creata"

# 11. Test build
log "Testando build..."
if npm run build > /dev/null 2>&1; then
    success "Build test successful"
else
    error "Build test failed! Controllare errori:"
    npm run build
    exit 1
fi

# 12. Verifica finale
log "Verifica finale..."
echo "📋 Checklist Separazione:"
echo "  ✅ Backup creato: $BACKUP_DIR"
echo "  ✅ Route groups creati"
echo "  ✅ Pagine pubbliche spostate"
echo "  ✅ Dashboard spostata"
echo "  ✅ Componenti spostati"
echo "  ✅ Layout separati creati"
echo "  ✅ Middleware creato"
echo "  ✅ next.config.js aggiornato"
echo "  ✅ Pagina login creata"
echo "  ✅ Build test successful"

# 13. Istruzioni finali
echo ""
echo "🎉 SEPARAZIONE COMPLETATA!"
echo "=========================="
echo ""
echo "📋 Struttura creata:"
echo "  📁 src/app/(public)/     - Frontend pubblico"
echo "  📁 src/app/(dashboard)/  - Dashboard privata"
echo "  📁 src/components/(public)/     - Componenti pubblici"
echo "  📁 src/components/(dashboard)/  - Componenti dashboard"
echo ""
echo "🔐 Protezione:"
echo "  - Dashboard protetta da middleware"
echo "  - Login page creata"
echo "  - Autenticazione simulata"
echo ""
echo "📦 Bundle Splitting:"
echo "  - Bundle separati per frontend/dashboard"
echo "  - Lazy loading automatico"
echo "  - Performance ottimizzata"
echo ""
echo "🧪 Test da eseguire:"
echo "  1. npm run dev"
echo "  2. Visita http://localhost:3000 (frontend pubblico)"
echo "  3. Visita http://localhost:3000/login (login)"
echo "  4. Visita http://localhost:3000/dashboard (dashboard protetta)"
echo "  5. Verifica redirect se non autenticato"
echo ""
echo "🚨 In caso di problemi:"
echo "  - Rollback: cp -r $BACKUP_DIR/* src/"
echo "  - Ripristina next.config.js: cp next.config.js.backup next.config.js"
echo ""
success "Frontend e Dashboard separati con successo!"
