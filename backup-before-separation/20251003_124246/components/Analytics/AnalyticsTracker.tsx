'use client';

import { useEffect, useRef } from 'react';
import { useAnalytics as useAnalyticsService } from '@/services/analyticsService';
import { useAnalytics } from '@/contexts/AnalyticsContext';

interface AnalyticsTrackerProps {
  children: React.ReactNode;
}

export default function AnalyticsTracker({ children }: AnalyticsTrackerProps) {
  const analyticsService = useAnalyticsService();
  const { addWebsiteAnalytics, addConversion, addShopOrder, addContactRequest } = useAnalytics();
  const sessionStartTime = useRef<number>(Date.now());
  const pageViews = useRef<number>(0);

  useEffect(() => {
    // Traccia visita alla pagina
    const trackPageView = () => {
      pageViews.current++;
      const analyticsData = analyticsService.trackPageView();
      addWebsiteAnalytics(analyticsData);
    };

    // Traccia quando l'utente lascia la pagina
    const trackPageExit = () => {
      const sessionDuration = Date.now() - sessionStartTime.current;
      // Aggiorna la durata della sessione
      console.log(`Session duration: ${sessionDuration}ms, Page views: ${pageViews.current}`);
    };

    // Traccia eventi di conversione
    const trackConversionEvents = () => {
      // Traccia click su form di contatto
      const contactForms = document.querySelectorAll('form[data-track="contact"]');
      contactForms.forEach(form => {
        form.addEventListener('submit', (e) => {
          const formData = new FormData(form as HTMLFormElement);
          const email = formData.get('email') as string;
          const name = formData.get('name') as string;
          
          analyticsService.trackConversion('contact', 0, window.location.pathname, `Contact form: ${name} (${email})`);
        });
      });

      // Traccia click su pulsanti CTA
      const ctaButtons = document.querySelectorAll('[data-track="cta"]');
      ctaButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          const buttonText = (e.target as HTMLElement).textContent || '';
          const buttonType = (e.target as HTMLElement).getAttribute('data-cta-type') || 'general';
          
          analyticsService.trackConversion('lead', 0, window.location.pathname, `CTA: ${buttonText} (${buttonType})`);
        });
      });

      // Traccia download di file
      const downloadLinks = document.querySelectorAll('a[data-track="download"]');
      downloadLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          const fileName = (e.target as HTMLElement).getAttribute('data-file-name') || '';
          analyticsService.trackConversion('download', 0, window.location.pathname, `Download: ${fileName}`);
        });
      });

      // Traccia iscrizioni newsletter
      const newsletterForms = document.querySelectorAll('form[data-track="newsletter"]');
      newsletterForms.forEach(form => {
        form.addEventListener('submit', (e) => {
          const formData = new FormData(form as HTMLFormElement);
          const email = formData.get('email') as string;
          
          analyticsService.trackConversion('signup', 0, window.location.pathname, `Newsletter signup: ${email}`);
        });
      });
    };

    // Inizializza tracking
    trackPageView();
    trackConversionEvents();

    // Event listeners per tracking
    window.addEventListener('beforeunload', trackPageExit);
    window.addEventListener('pagehide', trackPageExit);

    // Traccia scroll depth
    let maxScrollDepth = 0;
    const trackScroll = () => {
      const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth;
        
        // Traccia milestone di scroll
        if (maxScrollDepth >= 25 && maxScrollDepth < 50) {
          analyticsService.trackConversion('lead', 0, window.location.pathname, 'Scroll depth: 25%');
        } else if (maxScrollDepth >= 50 && maxScrollDepth < 75) {
          analyticsService.trackConversion('lead', 0, window.location.pathname, 'Scroll depth: 50%');
        } else if (maxScrollDepth >= 75) {
          analyticsService.trackConversion('lead', 0, window.location.pathname, 'Scroll depth: 75%');
        }
      }
    };

    window.addEventListener('scroll', trackScroll);

    // Traccia tempo sulla pagina
    const trackTimeOnPage = () => {
      const timeOnPage = Date.now() - sessionStartTime.current;
      
      // Traccia milestone di tempo
      if (timeOnPage >= 30000 && timeOnPage < 60000) { // 30 secondi
        analyticsService.trackConversion('lead', 0, window.location.pathname, 'Time on page: 30s');
      } else if (timeOnPage >= 60000 && timeOnPage < 120000) { // 1 minuto
        analyticsService.trackConversion('lead', 0, window.location.pathname, 'Time on page: 1m');
      } else if (timeOnPage >= 120000) { // 2 minuti
        analyticsService.trackConversion('lead', 0, window.location.pathname, 'Time on page: 2m');
      }
    };

    const timeInterval = setInterval(trackTimeOnPage, 30000); // Controlla ogni 30 secondi

    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', trackPageExit);
      window.removeEventListener('pagehide', trackPageExit);
      window.removeEventListener('scroll', trackScroll);
      clearInterval(timeInterval);
    };
  }, [analyticsService, addWebsiteAnalytics, addConversion]);

  return <>{children}</>;
}

// Hook per tracciare conversioni manualmente
export const useConversionTracking = () => {
  const analyticsService = useAnalyticsService();
  const { addConversion, addShopOrder, addContactRequest } = useAnalytics();

  const trackConversion = (
    type: 'lead' | 'signup' | 'download' | 'contact' | 'purchase',
    value: number = 0,
    notes: string = ''
  ) => {
    const conversion = analyticsService.trackConversion(type, value, window.location.pathname, notes);
    addConversion(conversion);
    return conversion;
  };

  const trackShopOrder = (orderData: any) => {
    const order = analyticsService.trackShopOrder(orderData);
    addShopOrder(order);
    return order;
  };

  const trackContactRequest = (requestData: any) => {
    const request = analyticsService.trackContactRequest(requestData);
    addContactRequest(request);
    return request;
  };

  return {
    trackConversion,
    trackShopOrder,
    trackContactRequest,
  };
};
