import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
  perspective: 'published', // Only fetch published content
  stega: false, // Disable stega for now to avoid patch issues
  token: process.env.SANITY_API_TOKEN, // Add API token for authentication
})

// Create a more robust client for queries that might fail
export const safeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
  stega: false,
  token: process.env.SANITY_API_TOKEN, // Add API token for authentication
})

// Helper function to safely fetch data
export const safeFetch = async (query: string, params?: any) => {
  // Check if Sanity is properly configured
  if (!projectId || projectId === 'your_sanity_project_id' || !dataset || !process.env.SANITY_API_TOKEN) {
    console.warn('Sanity non configurato correttamente (manca projectId, dataset o token), ritorno null');
    return null;
  }

  try {
    return await safeClient.fetch(query, params);
  } catch (error) {
    console.warn('Sanity fetch error (using fallback):', error);
    return null;
  }
}
