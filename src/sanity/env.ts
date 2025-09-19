export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-08-17'

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)

// Funzione migliorata per gestire le variabili d'ambiente
function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    // In produzione, logga l'errore ma non bloccare l'app
    if (process.env.NODE_ENV === 'production') {
      console.error('Sanity configuration error:', errorMessage);
      console.error('Available env vars:', {
        NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
        NEXT_PUBLIC_SANITY_API_VERSION: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
      });
      // Restituisci valori di default per evitare crash
      return (errorMessage.includes('PROJECT_ID') ? 'default-project' : 
              errorMessage.includes('DATASET') ? 'production' : 
              '2025-08-17') as T;
    }
    throw new Error(errorMessage)
  }

  return v
}
