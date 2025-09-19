import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

// Verifica se Sanity è configurato correttamente
const isSanityConfigured = () => {
  return projectId && dataset && projectId !== 'default-project' && dataset !== 'production';
};

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
  perspective: 'published', // Only fetch published content
  stega: false, // Disable stega for now to avoid patch issues
})

// Create a more robust client for queries that might fail
export const safeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
  stega: false,
})

// Helper function to safely fetch data with better error handling
export const safeFetch = async (query: string, params?: any) => {
  try {
    // Controlla se Sanity è configurato
    if (!isSanityConfigured()) {
      console.warn('Sanity non configurato correttamente, restituisco dati vuoti');
      return [];
    }
    
    const result = await safeClient.fetch(query, params);
    return result;
  } catch (error) {
    console.error('Sanity fetch error:', error);
    console.error('Query:', query);
    console.error('Params:', params);
    
    // In produzione, restituisci array vuoto invece di null
    if (process.env.NODE_ENV === 'production') {
      return [];
    }
    
    return null;
  }
}

// Funzione per verificare la connessione Sanity
export const checkSanityConnection = async () => {
  try {
    if (!isSanityConfigured()) {
      return { connected: false, error: 'Sanity non configurato' };
    }
    
    const result = await safeClient.fetch('*[_type == "project"][0]');
    return { connected: true, error: null };
  } catch (error) {
    return { connected: false, error: error.message };
  }
}
