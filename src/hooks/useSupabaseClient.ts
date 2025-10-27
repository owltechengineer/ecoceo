'use client';

import { useEffect, useState } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseClient } from '@/lib/supabase';

// Hook personalizzato per gestire il client Supabase
export const useSupabaseClient = () => {
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

  return { client, loading, error };
};

// Hook per gestire l'autenticazione
export const useSupabaseAuth = () => {
  const { client, loading, error } = useSupabaseClient();
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    if (!client) return;

    // Ottieni l'utente corrente
    const getUser = async () => {
      try {
        const { data: { user }, error } = await client.auth.getUser();
        if (error) throw error;
        setUser(user);
      } catch (err) {
        console.error('Errore nel recupero dell\'utente:', err);
      } finally {
        setAuthLoading(false);
      }
    };

    getUser();

    // Ascolta i cambiamenti di autenticazione
    const { data: { subscription } } = client.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setAuthLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [client]);

  return {
    client,
    user,
    loading: loading || authLoading,
    error
  };
};
