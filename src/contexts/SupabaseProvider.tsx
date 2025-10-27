'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseClient } from '@/lib/supabase';

interface SupabaseContextType {
  client: SupabaseClient | null;
  loading: boolean;
  error: string | null;
}

const SupabaseContext = createContext<SupabaseContextType>({
  client: null,
  loading: true,
  error: null,
});

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabase deve essere usato all\'interno di SupabaseProvider');
  }
  return context;
};

interface SupabaseProviderProps {
  children: React.ReactNode;
}

export const SupabaseProvider: React.FC<SupabaseProviderProps> = ({ children }) => {
  const [client, setClient] = useState<SupabaseClient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const supabaseClient = getSupabaseClient();
      setClient(supabaseClient);
      setError(null);
    } catch (err) {
      console.error('Errore nell\'inizializzazione di Supabase:', err);
      setError(err instanceof Error ? err.message : 'Errore sconosciuto');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <SupabaseContext.Provider value={{ client, loading, error }}>
      {children}
    </SupabaseContext.Provider>
  );
};
