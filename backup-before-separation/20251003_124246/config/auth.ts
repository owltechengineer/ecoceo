// Configurazione autenticazione
export const AUTH_CONFIG = {
  // Password predefinita (in produzione dovrebbe essere in una variabile d'ambiente)
  DEFAULT_PASSWORD: 'Dashboard2024!',
  
  // Durata sessione (in millisecondi)
  SESSION_DURATION: 24 * 60 * 60 * 1000, // 24 ore
  
  // Chiavi localStorage
  STORAGE_KEYS: {
    AUTHENTICATED: 'dashboard_authenticated',
    AUTH_TIME: 'dashboard_auth_time'
  },
  
  // Messaggi
  MESSAGES: {
    LOGIN_SUCCESS: 'Accesso effettuato con successo',
    LOGIN_ERROR: 'Password non corretta',
    LOGOUT_SUCCESS: 'Logout effettuato con successo',
    SESSION_EXPIRED: 'Sessione scaduta, effettua nuovamente l\'accesso',
    AUTH_ERROR: 'Errore durante l\'autenticazione'
  }
};

// Funzione per validare la password
export function validatePassword(password: string): boolean {
  // Regole di validazione password
  return password.length >= 6 && password.length <= 50;
}

// Funzione per hash della password (in produzione)
export function hashPassword(password: string): string {
  // In produzione, usa una libreria come bcrypt
  // Per ora, restituiamo la password come stringa semplice
  return password;
}

// Funzione per verificare se la sessione è valida
export function isSessionValid(authTime: number): boolean {
  const now = Date.now();
  return (now - authTime) < AUTH_CONFIG.SESSION_DURATION;
}
