'use client';

import { useState, useEffect } from 'react';

/**
 * Hook per gestire le date in modo sicuro per l'hydration
 * Evita i problemi di mismatch tra server e client
 */
export function useClientDate() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const formatDate = (date: Date, options?: Intl.DateTimeFormatOptions) => {
    if (!isClient) return '';
    return date.toLocaleDateString('it-IT', options);
  };

  const formatTime = (date: Date, options?: Intl.DateTimeFormatOptions) => {
    if (!isClient) return '';
    return date.toLocaleTimeString('it-IT', options);
  };

  const formatDateTime = (date: Date, options?: Intl.DateTimeFormatOptions) => {
    if (!isClient) return '';
    return date.toLocaleString('it-IT', options);
  };

  const getCurrentDate = () => {
    if (!isClient) return '';
    return new Date().toLocaleDateString('it-IT');
  };

  const getCurrentTime = () => {
    if (!isClient) return '';
    return new Date().toLocaleTimeString('it-IT');
  };

  const getCurrentDateTime = () => {
    if (!isClient) return '';
    return new Date().toLocaleString('it-IT');
  };

  return {
    isClient,
    formatDate,
    formatTime,
    formatDateTime,
    getCurrentDate,
    getCurrentTime,
    getCurrentDateTime
  };
}
