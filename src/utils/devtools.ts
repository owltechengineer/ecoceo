// Utility per disabilitare React DevTools
export const disableReactDevTools = () => {
  // Disabilita React DevTools sempre (sia in produzione che in sviluppo)
  if (typeof window !== 'undefined') {
    // Rimuove completamente il supporto per React DevTools
    try {
      // @ts-ignore
      if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
        // @ts-ignore
        delete window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
      }
      // Impedisce la creazione del hook
      // @ts-ignore
      Object.defineProperty(window, '__REACT_DEVTOOLS_GLOBAL_HOOK__', {
        value: undefined,
        writable: false,
        configurable: false,
        enumerable: false
      });
    } catch (e) {
      // Ignora errori se non può essere eliminato
    }
  }
};
