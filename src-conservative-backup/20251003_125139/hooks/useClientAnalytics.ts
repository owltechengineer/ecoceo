'use client';

import { useState, useEffect } from 'react';

export function useClientAnalytics() {
  const [analyticsService, setAnalyticsService] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Importa il servizio analytics solo nel browser
    import('@/services/analyticsService').then(({ useAnalytics }) => {
      setAnalyticsService(useAnalytics());
    });
  }, []);

  return { analyticsService, isClient };
}
