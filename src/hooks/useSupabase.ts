import { useMemo } from 'react'
import { getSupabaseClient, getSupabaseAdminClient, getSupabaseSecretClient } from '@/lib/supabase'
import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Hook per ottenere il client Supabase principale
 * Utilizza il pattern singleton per evitare multiple istanze
 */
export const useSupabase = (): SupabaseClient => {
  return useMemo(() => getSupabaseClient(), [])
}

/**
 * Hook per ottenere il client Supabase admin
 * Utilizza il pattern singleton per evitare multiple istanze
 */
export const useSupabaseAdmin = (): SupabaseClient => {
  return useMemo(() => getSupabaseAdminClient(), [])
}

/**
 * Hook per ottenere il client Supabase secret
 * Utilizza il pattern singleton per evitare multiple istanze
 */
export const useSupabaseSecret = (): SupabaseClient => {
  return useMemo(() => getSupabaseSecretClient(), [])
}

/**
 * Hook combinato che restituisce tutti i client Supabase
 */
export const useSupabaseClients = () => {
  const supabase = useSupabase()
  const supabaseAdmin = useSupabaseAdmin()
  const supabaseSecret = useSupabaseSecret()

  return useMemo(() => ({
    supabase,
    supabaseAdmin,
    supabaseSecret
  }), [supabase, supabaseAdmin, supabaseSecret])
}
