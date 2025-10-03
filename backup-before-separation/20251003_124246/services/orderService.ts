import { client } from '@/sanity/lib/client';
import { Order, OrderItem, Customer, ShippingAddress, ShippingMethod } from '@/types/order';
import { CartItem } from '@/types/product';

// Generate unique order number
export const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substr(2, 5).toUpperCase();
  return `ORD-${timestamp.slice(-6)}-${random}`;
};

// Calculate shipping cost based on method and order total
export const calculateShippingCost = (method: string, subtotal: number): number => {
  switch (method) {
    case 'standard':
      return subtotal >= 50 ? 0 : 5.99; // Free shipping over €50
    case 'express':
      return 12.99;
    case 'pickup':
      return 0;
    default:
      return 5.99;
  }
};

// Available shipping methods
export const shippingMethods: ShippingMethod[] = [
  {
    id: 'standard',
    name: 'Spedizione Standard',
    cost: 5.99,
    estimatedDays: '3-5 giorni lavorativi',
    description: 'Consegna standard con corriere'
  },
  {
    id: 'express',
    name: 'Spedizione Espressa',
    cost: 12.99,
    estimatedDays: '1-2 giorni lavorativi',
    description: 'Consegna rapida con corriere espresso'
  },
  {
    id: 'pickup',
    name: 'Ritiro in Negozio',
    cost: 0,
    estimatedDays: 'Immediato',
    description: 'Ritiro gratuito presso il nostro negozio'
  }
];

// Validate customer information
export const validateCustomer = (customer: Customer): string[] => {
  const errors: string[] = [];
  
  if (!customer.firstName?.trim()) errors.push('Nome è obbligatorio');
  if (!customer.lastName?.trim()) errors.push('Cognome è obbligatorio');
  if (!customer.email?.trim()) errors.push('Email è obbligatoria');
  if (!customer.phone?.trim()) errors.push('Telefono è obbligatorio');
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (customer.email && !emailRegex.test(customer.email)) {
    errors.push('Email non valida');
  }
  
  return errors;
};

// Validate shipping address
export const validateShippingAddress = (address: ShippingAddress): string[] => {
  const errors: string[] = [];
  
  if (!address.address?.trim()) errors.push('Indirizzo è obbligatorio');
  if (!address.city?.trim()) errors.push('Città è obbligatoria');
  if (!address.postalCode?.trim()) errors.push('CAP è obbligatorio');
  if (!address.country?.trim()) errors.push('Paese è obbligatorio');
  
  return errors;
};

// Validate payment information
export const validatePayment = (paymentData: any): string[] => {
  const errors: string[] = [];
  
  if (!paymentData.cardName?.trim()) errors.push('Nome sulla carta è obbligatorio');
  if (!paymentData.cardNumber?.trim()) errors.push('Numero carta è obbligatorio');
  if (!paymentData.cardExpiry?.trim()) errors.push('Data scadenza è obbligatoria');
  if (!paymentData.cardCvc?.trim()) errors.push('CVC è obbligatorio');
  
  // Basic card number validation (16 digits)
  const cardNumberRegex = /^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/;
  if (paymentData.cardNumber && !cardNumberRegex.test(paymentData.cardNumber.replace(/\s/g, ''))) {
    errors.push('Numero carta non valido');
  }
  
  // Basic expiry validation (MM/YY format) - more flexible
  if (paymentData.cardExpiry) {
    const expiry = paymentData.cardExpiry.trim();
    // Accept formats: MM/YY, MM-YY, MMYY
    const expiryRegex = /^(0[1-9]|1[0-2])[\/\-]?([0-9]{2})$/;
    if (!expiryRegex.test(expiry)) {
      errors.push('Data scadenza non valida (formato MM/YY, es: 12/25)');
    } else {
      // Additional validation: check if card is not expired
      const [month, year] = expiry.replace(/[\/\-]/, '').match(/(\d{2})(\d{2})/).slice(1);
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100; // Get last 2 digits
      const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11
      
      const cardYear = parseInt(year);
      const cardMonth = parseInt(month);
      
      if (cardYear < currentYear || (cardYear === currentYear && cardMonth < currentMonth)) {
        errors.push('La carta di credito è scaduta');
      }
    }
  }
  
  // Basic CVC validation (3-4 digits)
  const cvcRegex = /^\d{3,4}$/;
  if (paymentData.cardCvc && !cvcRegex.test(paymentData.cardCvc)) {
    errors.push('CVC non valido');
  }
  
  return errors;
};

// Convert cart items to order items
export const convertCartItemsToOrderItems = (cartItems: CartItem[]): OrderItem[] => {
  return cartItems.map(item => ({
    productId: item.product._id,
    productTitle: item.product.title,
    quantity: item.quantity,
    price: item.product.price,
    total: item.product.price * item.quantity
  }));
};

// Create order in Sanity
export const createOrder = async (orderData: Omit<Order, '_id' | 'createdAt' | 'updatedAt'>): Promise<Order> => {
  try {
    const order = {
      ...orderData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log('Creating order with data:', order);

    // Temporarily disabled - order schema removed
    // const result = await client.create({
    //   _type: 'order',
    //   ...order
    // });
    
    // For now, just return a mock result
    const result = {
      _id: `order_${Date.now()}`,
      ...order
    };

    console.log('Order created successfully:', result);
    return result;
  } catch (error) {
    console.error('Error creating order in Sanity:', error);
    throw new Error(`Errore nella creazione dell'ordine: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`);
  }
};

// Send order confirmation email
export const sendOrderConfirmationEmail = async (order: Order): Promise<boolean> => {
  try {
    // Here you would integrate with your email service (SendGrid, Mailgun, etc.)
    // For now, we'll simulate the email sending
    
    const emailData = {
      to: order.customer.email,
      subject: `Conferma Ordine #${order.orderNumber}`,
      template: 'order-confirmation',
      data: {
        orderNumber: order.orderNumber,
        customerName: `${order.customer.firstName} ${order.customer.lastName}`,
        orderDate: new Date(order.createdAt || '').toLocaleDateString('it-IT'),
        total: order.total,
        items: order.items,
        shippingAddress: order.shippingAddress
      }
    };

    console.log('Sending order confirmation email:', emailData);
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return true;
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return false;
  }
};

// Generate order receipt HTML
export const generateOrderReceipt = (order: Order): string => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Ricevuta Ordine #${order.orderNumber}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 30px; }
        .order-info { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .items-table th, .items-table td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        .total { font-weight: bold; font-size: 18px; text-align: right; }
        .address { background: #f8f9fa; padding: 15px; border-radius: 8px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Ricevuta Ordine</h1>
          <h2>#${order.orderNumber}</h2>
          <p>Data: ${new Date(order.createdAt || '').toLocaleDateString('it-IT')}</p>
        </div>
        
        <div class="order-info">
          <h3>Informazioni Cliente</h3>
          <p><strong>Nome:</strong> ${order.customer.firstName} ${order.customer.lastName}</p>
          <p><strong>Email:</strong> ${order.customer.email}</p>
          <p><strong>Telefono:</strong> ${order.customer.phone}</p>
        </div>
        
        <div class="address">
          <h3>Indirizzo di Spedizione</h3>
          <p>${order.shippingAddress.address}</p>
          <p>${order.shippingAddress.postalCode} ${order.shippingAddress.city}</p>
          <p>${order.shippingAddress.country}</p>
        </div>
        
        <table class="items-table">
          <thead>
            <tr>
              <th>Prodotto</th>
              <th>Quantità</th>
              <th>Prezzo</th>
              <th>Totale</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td>${item.productTitle}</td>
                <td>${item.quantity}</td>
                <td>${formatPrice(item.price)}</td>
                <td>${formatPrice(item.total)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="total">
          <p>Subtotale: ${formatPrice(order.subtotal)}</p>
          <p>Spese di spedizione: ${formatPrice(order.shippingCost)}</p>
          <p><strong>Totale: ${formatPrice(order.total)}</strong></p>
        </div>
        
        <div style="margin-top: 30px; text-align: center; color: #666;">
          <p>Grazie per il tuo acquisto!</p>
          <p>Per qualsiasi domanda, contattaci all'indirizzo support@tuosito.com</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
