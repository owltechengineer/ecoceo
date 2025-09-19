export function checkEnvironmentVariables() {
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ];

  const missingVars: string[] = [];
  const presentVars: { [key: string]: string } = {};

  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (!value) {
      missingVars.push(varName);
    } else {
      presentVars[varName] = value.substring(0, 20) + '...'; // Mostra solo i primi 20 caratteri per sicurezza
    }
  });

  return {
    isValid: missingVars.length === 0,
    missingVars,
    presentVars,
    message: missingVars.length === 0 
      ? 'Tutte le variabili d\'ambiente sono configurate correttamente'
      : `Variabili mancanti: ${missingVars.join(', ')}`
  };
}

export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return {
    url: url || '',
    key: key || '',
    isConfigured: !!(url && key),
    urlValid: url ? url.startsWith('https://') : false
  };
}
