import { WebsiteAnalytics, Conversion, ShopOrder, ContactRequest } from '@/contexts/DashboardContext';

// Servizio per tracciare analytics del sito
export class AnalyticsService {
  private static instance: AnalyticsService;
  private sessionId: string;
  private visitorId: string;

  private constructor() {
    this.sessionId = this.generateSessionId();
    this.visitorId = this.getOrCreateVisitorId();
  }

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getOrCreateVisitorId(): string {
    // Controlla se siamo nel browser
    if (typeof window === 'undefined') {
      return `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    let visitorId = localStorage.getItem('visitor_id');
    if (!visitorId) {
      visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('visitor_id', visitorId);
    }
    return visitorId;
  }

  private getDeviceType(): 'desktop' | 'mobile' | 'tablet' {
    const userAgent = navigator.userAgent;
    if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
      return /iPad/.test(userAgent) ? 'tablet' : 'mobile';
    }
    return 'desktop';
  }

  private getSource(): 'direct' | 'organic' | 'social' | 'email' | 'referral' | 'paid' {
    if (typeof window === 'undefined') return 'direct';
    
    const referrer = document.referrer;
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.has('utm_source')) {
      const source = urlParams.get('utm_source')?.toLowerCase();
      if (source?.includes('google') || source?.includes('bing')) return 'organic';
      if (source?.includes('facebook') || source?.includes('instagram') || source?.includes('twitter')) return 'social';
      if (source?.includes('email') || source?.includes('newsletter')) return 'email';
      if (source?.includes('adwords') || source?.includes('ads')) return 'paid';
      return 'referral';
    }
    
    if (!referrer) return 'direct';
    if (referrer.includes('google') || referrer.includes('bing')) return 'organic';
    if (referrer.includes('facebook') || referrer.includes('instagram') || referrer.includes('twitter')) return 'social';
    if (referrer.includes('email') || referrer.includes('newsletter')) return 'email';
    return 'referral';
  }

  // Traccia una visita alla pagina
  trackPageView(page: string = (typeof window !== 'undefined' ? window.location.pathname : '/')): WebsiteAnalytics {
    const analytics: Omit<WebsiteAnalytics, 'id'> = {
      date: new Date().toISOString().split('T')[0],
      visits: 1,
      uniqueVisitors: 1,
      pageViews: 1,
      bounceRate: 0,
      avgSessionDuration: 0,
      source: this.getSource(),
      page,
      device: this.getDeviceType(),
      location: navigator.language || 'it-IT',
      timestamp: new Date().toISOString(),
    };

    // Salva in localStorage per aggregazione
    this.saveAnalytics(analytics);
    
    return analytics as WebsiteAnalytics;
  }

  // Traccia una conversione
  trackConversion(
    type: Conversion['type'],
    value: number = 0,
    page: string = (typeof window !== 'undefined' ? window.location.pathname : '/'),
    notes: string = ''
  ): Conversion {
    const conversion: Omit<Conversion, 'id'> = {
      visitorId: this.visitorId,
      type,
      source: this.getSource(),
      page,
      value,
      status: 'pending',
      createdAt: new Date().toISOString(),
      notes,
    };

    // Salva in localStorage
    this.saveConversion(conversion);
    
    return conversion as Conversion;
  }

  // Traccia un ordine dello shop
  trackShopOrder(
    orderData: Omit<ShopOrder, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>
  ): ShopOrder {
    const order: Omit<ShopOrder, 'id'> = {
      ...orderData,
      orderNumber: `ORD-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Salva in localStorage
    this.saveShopOrder(order);
    
    return order as ShopOrder;
  }

  // Traccia una richiesta di contatto
  trackContactRequest(
    requestData: Omit<ContactRequest, 'id' | 'createdAt' | 'updatedAt'>
  ): ContactRequest {
    const request: Omit<ContactRequest, 'id'> = {
      ...requestData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Salva in localStorage
    this.saveContactRequest(request);
    
    return request as ContactRequest;
  }

  // Calcola metriche aggregate
  getAggregatedAnalytics(period: 'today' | 'week' | 'month' = 'today'): {
    totalVisits: number;
    uniqueVisitors: number;
    totalPageViews: number;
    avgBounceRate: number;
    avgSessionDuration: number;
    conversionRate: number;
    totalConversions: number;
    totalOrders: number;
    totalRevenue: number;
    totalContactRequests: number;
  } {
    const analytics = this.getAnalytics(period);
    const conversions = this.getConversions(period);
    const orders = this.getShopOrders(period);
    const requests = this.getContactRequests(period);

    const totalVisits = analytics.reduce((sum, a) => sum + a.visits, 0);
    const uniqueVisitors = analytics.reduce((sum, a) => sum + a.uniqueVisitors, 0);
    const totalPageViews = analytics.reduce((sum, a) => sum + a.pageViews, 0);
    const avgBounceRate = analytics.length > 0 
      ? analytics.reduce((sum, a) => sum + a.bounceRate, 0) / analytics.length 
      : 0;
    const avgSessionDuration = analytics.length > 0 
      ? analytics.reduce((sum, a) => sum + a.avgSessionDuration, 0) / analytics.length 
      : 0;

    const totalConversions = conversions.length;
    const conversionRate = totalVisits > 0 ? (totalConversions / totalVisits) * 100 : 0;
    
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const totalContactRequests = requests.length;

    return {
      totalVisits,
      uniqueVisitors,
      totalPageViews,
      avgBounceRate,
      avgSessionDuration,
      conversionRate,
      totalConversions,
      totalOrders,
      totalRevenue,
      totalContactRequests,
    };
  }

  // Calcola funnel di conversione
  getConversionFunnel(period: 'today' | 'week' | 'month' = 'today'): {
    visits: number;
    conversions: number;
    orders: number;
    revenue: number;
    contactRequests: number;
    funnelSteps: Array<{
      step: string;
      count: number;
      percentage: number;
    }>;
  } {
    const analytics = this.getAnalytics(period);
    const conversions = this.getConversions(period);
    const orders = this.getShopOrders(period);
    const requests = this.getContactRequests(period);

    const visits = analytics.reduce((sum, a) => sum + a.visits, 0);
    const totalConversions = conversions.length;
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const totalRequests = requests.length;

    const funnelSteps = [
      { step: 'Visite', count: visits, percentage: 100 },
      { step: 'Conversioni', count: totalConversions, percentage: visits > 0 ? (totalConversions / visits) * 100 : 0 },
      { step: 'Ordini', count: totalOrders, percentage: totalConversions > 0 ? (totalOrders / totalConversions) * 100 : 0 },
      { step: 'Richieste Contatto', count: totalRequests, percentage: visits > 0 ? (totalRequests / visits) * 100 : 0 },
    ];

    return {
      visits,
      conversions: totalConversions,
      orders: totalOrders,
      revenue: totalRevenue,
      contactRequests: totalRequests,
      funnelSteps,
    };
  }

  // Metodi di salvataggio in localStorage
  private saveAnalytics(analytics: Omit<WebsiteAnalytics, 'id'>): void {
    if (typeof window === 'undefined') return;
    
    const key = `analytics_${analytics.date}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.push({ ...analytics, id: Date.now().toString() });
    localStorage.setItem(key, JSON.stringify(existing));
  }

  private saveConversion(conversion: Omit<Conversion, 'id'>): void {
    if (typeof window === 'undefined') return;
    
    const key = 'conversions';
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.push({ ...conversion, id: Date.now().toString() });
    localStorage.setItem(key, JSON.stringify(existing));
  }

  private saveShopOrder(order: Omit<ShopOrder, 'id'>): void {
    if (typeof window === 'undefined') return;
    
    const key = 'shop_orders';
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.push({ ...order, id: Date.now().toString() });
    localStorage.setItem(key, JSON.stringify(existing));
  }

  private saveContactRequest(request: Omit<ContactRequest, 'id'>): void {
    if (typeof window === 'undefined') return;
    
    const key = 'contact_requests';
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.push({ ...request, id: Date.now().toString() });
    localStorage.setItem(key, JSON.stringify(existing));
  }

  // Metodi di recupero da localStorage
  private getAnalytics(period: 'today' | 'week' | 'month'): WebsiteAnalytics[] {
    if (typeof window === 'undefined') return [];
    
    const today = new Date();
    const analytics: WebsiteAnalytics[] = [];
    
    if (period === 'today') {
      const key = `analytics_${today.toISOString().split('T')[0]}`;
      const data = JSON.parse(localStorage.getItem(key) || '[]');
      analytics.push(...data);
    } else {
      // Per week e month, recupera tutti i dati e filtra
      const keys = Object.keys(localStorage).filter(k => k.startsWith('analytics_'));
      keys.forEach(key => {
        const data = JSON.parse(localStorage.getItem(key) || '[]');
        analytics.push(...data);
      });
    }
    
    // Filtra per periodo
    return this.filterAnalyticsByPeriod(analytics, period);
  }

  private filterAnalyticsByPeriod(analytics: WebsiteAnalytics[], period: 'today' | 'week' | 'month'): WebsiteAnalytics[] {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return analytics.filter(item => {
      const itemDate = new Date(item.date);
      
      if (period === 'today') {
        return itemDate >= today;
      } else if (period === 'week') {
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return itemDate >= weekAgo;
      } else { // month
        const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
        return itemDate >= monthAgo;
      }
    });
  }

  private getConversions(period: 'today' | 'week' | 'month'): Conversion[] {
    if (typeof window === 'undefined') return [];
    
    const data = JSON.parse(localStorage.getItem('conversions') || '[]');
    return this.filterByPeriod(data, period);
  }

  private getShopOrders(period: 'today' | 'week' | 'month'): ShopOrder[] {
    if (typeof window === 'undefined') return [];
    
    const data = JSON.parse(localStorage.getItem('shop_orders') || '[]');
    return this.filterByPeriod(data, period);
  }

  private getContactRequests(period: 'today' | 'week' | 'month'): ContactRequest[] {
    if (typeof window === 'undefined') return [];
    
    const data = JSON.parse(localStorage.getItem('contact_requests') || '[]');
    return this.filterByPeriod(data, period);
  }

  private filterByPeriod<T extends { createdAt: string }>(data: T[], period: 'today' | 'week' | 'month'): T[] {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return data.filter(item => {
      const itemDate = new Date(item.createdAt);
      
      if (period === 'today') {
        return itemDate >= today;
      } else if (period === 'week') {
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return itemDate >= weekAgo;
      } else { // month
        const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
        return itemDate >= monthAgo;
      }
    });
  }
}

// Hook per usare il servizio analytics
export const useAnalytics = () => {
  return AnalyticsService.getInstance();
};
