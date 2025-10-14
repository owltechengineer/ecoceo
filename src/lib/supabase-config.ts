/**
 * Configurazione centralizzata per Supabase
 * Questo file gestisce la configurazione e previene multiple istanze
 */

// Configurazione delle variabili d'ambiente
export const SUPABASE_CONFIG = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://febpscjreqtxxpvjlqxd.supabase.co',
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_l6xuRDnwya9ZoT_A56e5-w_KxOq3JKO',
  serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlYnBzY2pyZXF0eHhwdmpscXhkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTMwODIzOSwiZXhwIjoyMDc0ODg0MjM5fQ.8eA4iuQxNFNfgMnLl2VOQmZaNDjATSyZJmZadrshtbY',
  secretKey: process.env.SUPABASE_SECRET_KEY || 'sb_secret_Z7l9wY0V8-3iiqBM3Kw8IQ_ejR7prq9'
} as const;

// Opzioni di configurazione per i client
export const SUPABASE_CLIENT_OPTIONS = {
  main: {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  },
  admin: {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  },
  secret: {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  }
} as const;

// Warning per sviluppatori
if (typeof window !== 'undefined') {
  console.warn(
    '🚨 IMPORTANTE: Per evitare multiple istanze di GoTrueClient, usa sempre i hook useSupabase() invece di importare direttamente i client Supabase.'
  );
}
