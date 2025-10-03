import { WebsiteAnalytics, Conversion, ShopOrder, ContactRequest } from '@/contexts/DashboardContext';

// Servizio per generare dati di esempio
export class MockDataService {
  
  // Genera dati analytics per gli ultimi giorni
  static generateMockAnalytics(days: number = 7): WebsiteAnalytics[] {
    const analytics: WebsiteAnalytics[] = [];
    const today = new Date();
    
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const visits = Math.floor(Math.random() * 500) + 100;
      const uniqueVisitors = Math.floor(visits * 0.8);
      const pageViews = Math.floor(visits * 2.5);
      const bounceRate = Math.random() * 30 + 15;
      const avgSessionDuration = Math.floor(Math.random() * 300) + 60;
      
      const sources: Array<'direct' | 'organic' | 'social' | 'email' | 'referral' | 'paid'> = [
        'direct', 'organic', 'social', 'email', 'referral', 'paid'
      ];
      const devices: Array<'desktop' | 'mobile' | 'tablet'> = ['desktop', 'mobile', 'tablet'];
      const pages = ['/', '/about', '/services', '/contact', '/blog', '/shop'];
      
      analytics.push({
        id: `analytics_${i}`,
        date: date.toISOString().split('T')[0],
        visits,
        uniqueVisitors,
        pageViews,
        bounceRate,
        avgSessionDuration,
        source: sources[Math.floor(Math.random() * sources.length)],
        page: pages[Math.floor(Math.random() * pages.length)],
        device: devices[Math.floor(Math.random() * devices.length)],
        location: 'it-IT',
        timestamp: date.toISOString(),
      });
    }
    
    return analytics;
  }

  // Genera conversioni di esempio
  static generateMockConversions(count: number = 20): Conversion[] {
    const conversions: Conversion[] = [];
    const today = new Date();
    
    const types: Array<'lead' | 'signup' | 'download' | 'contact' | 'purchase'> = [
      'lead', 'signup', 'download', 'contact', 'purchase'
    ];
    const statuses: Array<'pending' | 'qualified' | 'converted' | 'lost'> = [
      'pending', 'qualified', 'converted', 'lost'
    ];
    const pages = ['/', '/about', '/services', '/contact', '/blog', '/shop'];
    
    for (let i = 0; i < count; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      
      conversions.push({
        id: `conversion_${i}`,
        visitorId: `visitor_${Math.floor(Math.random() * 1000)}`,
        type: types[Math.floor(Math.random() * types.length)],
        source: 'organic',
        page: pages[Math.floor(Math.random() * pages.length)],
        value: Math.floor(Math.random() * 1000),
        status: statuses[Math.floor(Math.random() * statuses.length)],
        createdAt: date.toISOString(),
        convertedAt: Math.random() > 0.5 ? new Date(date.getTime() + Math.random() * 86400000).toISOString() : undefined,
        notes: `Conversion ${i + 1} - ${types[Math.floor(Math.random() * types.length)]}`,
      });
    }
    
    return conversions;
  }

  // Genera ordini shop di esempio
  static generateMockShopOrders(count: number = 15): ShopOrder[] {
    const orders: ShopOrder[] = [];
    const today = new Date();
    
    const statuses: Array<'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'> = [
      'pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'
    ];
    const paymentMethods: Array<'card' | 'paypal' | 'bank_transfer' | 'crypto'> = [
      'card', 'paypal', 'bank_transfer', 'crypto'
    ];
    const paymentStatuses: Array<'pending' | 'paid' | 'failed' | 'refunded'> = [
      'pending', 'paid', 'failed', 'refunded'
    ];
    
    const productNames = [
      'Prodotto A', 'Prodotto B', 'Prodotto C', 'Prodotto D', 'Prodotto E',
      'Servizio Web', 'Consulenza', 'Corso Online', 'E-book', 'Template'
    ];
    
    const customerNames = [
      'Mario Rossi', 'Anna Bianchi', 'Luca Verdi', 'Sofia Neri', 'Giuseppe Gialli',
      'Laura Viola', 'Roberto Blu', 'Elena Rosa', 'Marco Verde', 'Chiara Arancione'
    ];
    
    for (let i = 0; i < count; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      
      const numProducts = Math.floor(Math.random() * 3) + 1;
      const products = [];
      let subtotal = 0;
      
      for (let j = 0; j < numProducts; j++) {
        const price = Math.floor(Math.random() * 200) + 50;
        const quantity = Math.floor(Math.random() * 3) + 1;
        const total = price * quantity;
        subtotal += total;
        
        products.push({
          id: `product_${j}`,
          name: productNames[Math.floor(Math.random() * productNames.length)],
          price,
          quantity,
          total,
        });
      }
      
      const tax = subtotal * 0.22;
      const shipping = Math.random() > 0.5 ? 0 : Math.floor(Math.random() * 20) + 5;
      const total = subtotal + tax + shipping;
      
      orders.push({
        id: `order_${i}`,
        orderNumber: `ORD-${Date.now()}-${i}`,
        customerId: `customer_${Math.floor(Math.random() * 1000)}`,
        customerName: customerNames[Math.floor(Math.random() * customerNames.length)],
        customerEmail: `customer${i}@example.com`,
        customerPhone: `+39 ${Math.floor(Math.random() * 900000000) + 100000000}`,
        products,
        subtotal,
        tax,
        shipping,
        total,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        paymentStatus: paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)],
        shippingAddress: {
          street: `Via Roma ${Math.floor(Math.random() * 100) + 1}`,
          city: 'Milano',
          state: 'MI',
          zipCode: '20100',
          country: 'Italia',
        },
        createdAt: date.toISOString(),
        updatedAt: date.toISOString(),
        conversionId: Math.random() > 0.3 ? `conversion_${Math.floor(Math.random() * 20)}` : undefined,
      });
    }
    
    return orders;
  }

  // Genera richieste contatto di esempio
  static generateMockContactRequests(count: number = 25): ContactRequest[] {
    const requests: ContactRequest[] = [];
    const today = new Date();
    
    const statuses: Array<'new' | 'contacted' | 'qualified' | 'converted' | 'lost'> = [
      'new', 'contacted', 'qualified', 'converted', 'lost'
    ];
    const priorities: Array<'low' | 'medium' | 'high' | 'urgent'> = [
      'low', 'medium', 'high', 'urgent'
    ];
    const sources: Array<'contact_form' | 'email' | 'phone' | 'chat' | 'social' | 'referral'> = [
      'contact_form', 'email', 'phone', 'chat', 'social', 'referral'
    ];
    
    const names = [
      'Marco Bianchi', 'Laura Rossi', 'Giuseppe Verdi', 'Elena Neri', 'Roberto Gialli',
      'Chiara Viola', 'Antonio Blu', 'Maria Rosa', 'Paolo Verde', 'Lucia Arancione',
      'Francesco Bianchi', 'Sara Rossi', 'Alessandro Verdi', 'Valentina Neri', 'Davide Gialli'
    ];
    
    const subjects = [
      'Richiesta Preventivo', 'Informazioni Prodotto', 'Supporto Tecnico', 'Collaborazione',
      'Partnership', 'Demo Prodotto', 'Prezzi Servizi', 'Assistenza', 'Feedback', 'Suggerimenti'
    ];
    
    const messages = [
      'Sono interessato ai vostri servizi. Potete inviarmi un preventivo?',
      'Vorrei sapere di più sul vostro prodotto. È disponibile una demo?',
      'Ho un problema con il prodotto acquistato. Potete aiutarmi?',
      'Siamo un\'azienda che cerca partner per progetti digitali.',
      'Siamo interessati a una partnership commerciale. Possiamo parlare?',
      'Vorrei vedere una demo del vostro software.',
      'Quali sono i prezzi dei vostri servizi?',
      'Ho bisogno di assistenza tecnica.',
      'Volevo dare un feedback sul vostro servizio.',
      'Ho alcuni suggerimenti per migliorare il prodotto.'
    ];
    
    for (let i = 0; i < count; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      
      requests.push({
        id: `request_${i}`,
        name: names[Math.floor(Math.random() * names.length)],
        email: `contact${i}@example.com`,
        phone: `+39 ${Math.floor(Math.random() * 900000000) + 100000000}`,
        company: Math.random() > 0.5 ? `Azienda ${Math.floor(Math.random() * 100) + 1}` : undefined,
        subject: subjects[Math.floor(Math.random() * subjects.length)],
        message: messages[Math.floor(Math.random() * messages.length)],
        source: sources[Math.floor(Math.random() * sources.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        assignedTo: Math.random() > 0.7 ? `user_${Math.floor(Math.random() * 5) + 1}` : undefined,
        tags: ['web', 'marketing', 'support'].slice(0, Math.floor(Math.random() * 3) + 1),
        createdAt: date.toISOString(),
        updatedAt: date.toISOString(),
        conversionId: Math.random() > 0.4 ? `conversion_${Math.floor(Math.random() * 20)}` : undefined,
        notes: `Richiesta ${i + 1} - ${subjects[Math.floor(Math.random() * subjects.length)]}`,
      });
    }
    
    return requests;
  }

  // Carica tutti i dati di esempio nel localStorage
  static loadMockData() {
    const analytics = this.generateMockAnalytics(30); // 30 giorni
    const conversions = this.generateMockConversions(50);
    const orders = this.generateMockShopOrders(30);
    const requests = this.generateMockContactRequests(40);
    
    // Salva analytics per data
    analytics.forEach(analytics => {
      const key = `analytics_${analytics.date}`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.push(analytics);
      localStorage.setItem(key, JSON.stringify(existing));
    });
    
    // Salva altri dati
    localStorage.setItem('conversions', JSON.stringify(conversions));
    localStorage.setItem('shop_orders', JSON.stringify(orders));
    localStorage.setItem('contact_requests', JSON.stringify(requests));
    
    console.log('Mock data loaded successfully!');
    console.log(`- Analytics: ${analytics.length} records`);
    console.log(`- Conversions: ${conversions.length} records`);
    console.log(`- Shop Orders: ${orders.length} records`);
    console.log(`- Contact Requests: ${requests.length} records`);
  }

  // Pulisce tutti i dati mock
  static clearMockData() {
    // Rimuovi analytics
    const keys = Object.keys(localStorage).filter(k => k.startsWith('analytics_'));
    keys.forEach(key => localStorage.removeItem(key));
    
    // Rimuovi altri dati
    localStorage.removeItem('conversions');
    localStorage.removeItem('shop_orders');
    localStorage.removeItem('contact_requests');
    
    console.log('Mock data cleared successfully!');
  }
}
