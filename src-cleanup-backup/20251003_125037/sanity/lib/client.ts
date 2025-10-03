import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

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

// Helper function to safely fetch data
export const safeFetch = async (query: string, params?: any) => {
  try {
    return await safeClient.fetch(query, params);
  } catch (error) {
    console.error('Sanity fetch error:', error);
    return null;
  }
}
