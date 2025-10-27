// Utility per gestire le React DevTools
export const disableReactDevTools = () => {
  // Disabilita React DevTools in produzione
  if (process.env.NODE_ENV === 'production') {
    // Rimuove il supporto per React DevTools
    if (typeof window !== 'undefined') {
      // @ts-ignore
      window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
        inject: () => {},
        onCommitFiberRoot: () => {},
        onCommitFiberUnmount: () => {},
      };
    }
  }
};

// Funzione per gestire errori di compatibilità
export const handleReactDevToolsError = (error: Error) => {
  // Ignora errori di React DevTools
  if (error.message.includes('Invalid argument not valid semver')) {
    console.warn('React DevTools compatibility warning (ignored):', error.message);
    return true;
  }
  return false;
};

// Hook per gestire errori di React DevTools
export const useReactDevToolsErrorHandler = () => {
  if (typeof window !== 'undefined') {
    const originalConsoleError = console.error;
    console.error = (...args) => {
      const error = args[0];
      if (error instanceof Error && handleReactDevToolsError(error)) {
        return; // Ignora l'errore
      }
      originalConsoleError.apply(console, args);
    };
  }
};
