import { getStripeInstance } from '@/lib/stripe';

export interface StripeProduct {
  id: string;
  name: string;
  description?: string;
  images: string[];
  metadata: {
    category?: string;
    weight?: string;
    dimensions?: string;
    shortDescription?: string;
    featured?: string;
    order?: string;
  };
  active: boolean;
  created: number;
  updated: number;
}

export interface StripePrice {
  id: string;
  product: string;
  unit_amount: number;
  currency: string;
  active: boolean;
  type: 'one_time' | 'recurring';
  metadata: {
    comparePrice?: string;
    stock?: string;
  };
}

export interface StripeProductWithPrice extends StripeProduct {
  price: StripePrice;
  comparePrice?: number;
  stock?: number;
  featured: boolean;
  order: number;
  category?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
}

class StripeProductService {
  private getStripeInstance() {
    return getStripeInstance();
  }

  /**
   * Ottiene tutti i prodotti attivi da Stripe
   */
  async getAllProducts(): Promise<StripeProductWithPrice[]> {
    const stripe = this.getStripeInstance();
    if (!stripe) {
      throw new Error('Stripe instance not available');
    }

    try {
      // Ottieni tutti i prodotti attivi
      const products = await stripe.products.list({
        active: true,
        expand: ['data.default_price'],
        limit: 100
      });

      // Ottieni tutti i prezzi per i prodotti
      const prices = await stripe.prices.list({
        active: true,
        limit: 100
      });

      // Combina prodotti e prezzi
      const productsWithPrices: StripeProductWithPrice[] = products.data.map(product => {
        const productPrices = prices.data.filter(price => price.product === product.id);
        const defaultPrice = productPrices.find(price => price.id === product.default_price) || productPrices[0];

        if (!defaultPrice) {
          console.warn(`No price found for product ${product.id}`);
          return null;
        }

        return this.mapStripeProductToInternal(product, defaultPrice);
      }).filter(Boolean) as StripeProductWithPrice[];

      // Ordina per metadata.order o per nome
      return productsWithPrices.sort((a, b) => {
        const orderA = parseInt(a.metadata.order || '999');
        const orderB = parseInt(b.metadata.order || '999');
        if (orderA !== orderB) return orderA - orderB;
        return a.name.localeCompare(b.name);
      });

    } catch (error) {
      console.error('Error fetching products from Stripe:', error);
      throw new Error('Failed to fetch products from Stripe');
    }
  }

  /**
   * Ottiene i prodotti in evidenza
   */
  async getFeaturedProducts(): Promise<StripeProductWithPrice[]> {
    const allProducts = await this.getAllProducts();
    return allProducts.filter(product => product.featured);
  }

  /**
   * Ottiene un prodotto per ID
   */
  async getProductById(id: string): Promise<StripeProductWithPrice | null> {
    const stripe = this.getStripeInstance();
    if (!stripe) {
      throw new Error('Stripe instance not available');
    }

    try {
      const product = await stripe.products.retrieve(id, {
        expand: ['default_price']
      });

      if (!product.active) return null;

      const prices = await stripe.prices.list({
        product: id,
        active: true,
        limit: 1
      });

      const price = prices.data[0];
      if (!price) return null;

      return this.mapStripeProductToInternal(product, price);
    } catch (error) {
      console.error(`Error fetching product ${id} from Stripe:`, error);
      return null;
    }
  }

  /**
   * Cerca prodotti per categoria
   */
  async getProductsByCategory(category: string): Promise<StripeProductWithPrice[]> {
    const allProducts = await this.getAllProducts();
    return allProducts.filter(product => 
      product.metadata.category?.toLowerCase() === category.toLowerCase()
    );
  }

  /**
   * Cerca prodotti per nome o descrizione
   */
  async searchProducts(query: string): Promise<StripeProductWithPrice[]> {
    const allProducts = await this.getAllProducts();
    const searchTerm = query.toLowerCase();
    
    return allProducts.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.description?.toLowerCase().includes(searchTerm) ||
      product.metadata.shortDescription?.toLowerCase().includes(searchTerm)
    );
  }

  /**
   * Mappa un prodotto Stripe al formato interno
   */
  private mapStripeProductToInternal(product: any, price: any): StripeProductWithPrice {
    return {
      id: product.id,
      name: product.name,
      description: product.description || '',
      images: product.images || [],
      metadata: product.metadata || {},
      active: product.active,
      created: product.created,
      updated: product.updated,
      price: {
        id: price.id,
        product: price.product,
        unit_amount: price.unit_amount,
        currency: price.currency,
        active: price.active,
        type: price.type,
        metadata: price.metadata || {}
      },
      comparePrice: price.metadata?.comparePrice ? parseFloat(price.metadata.comparePrice) : undefined,
      stock: price.metadata?.stock ? parseInt(price.metadata.stock) : undefined,
      featured: product.metadata?.featured === 'true',
      order: parseInt(product.metadata?.order || '999'),
      category: product.metadata?.category,
      weight: product.metadata?.weight ? parseFloat(product.metadata.weight) : undefined,
      dimensions: product.metadata?.dimensions ? JSON.parse(product.metadata.dimensions) : undefined
    };
  }

  /**
   * Crea un nuovo prodotto su Stripe
   */
  async createProduct(productData: {
    name: string;
    description?: string;
    images?: string[];
    metadata?: Record<string, string>;
    price: number;
    currency?: string;
  }): Promise<StripeProductWithPrice> {
    const stripe = this.getStripeInstance();
    if (!stripe) {
      throw new Error('Stripe instance not available');
    }

    try {
      // Crea il prodotto
      const product = await stripe.products.create({
        name: productData.name,
        description: productData.description,
        images: productData.images,
        metadata: productData.metadata || {},
        active: true
      });

      // Crea il prezzo
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: Math.round(productData.price * 100), // Converti in centesimi
        currency: productData.currency || 'eur',
        active: true
      });

      return this.mapStripeProductToInternal(product, price);
    } catch (error) {
      console.error('Error creating product in Stripe:', error);
      throw new Error('Failed to create product in Stripe');
    }
  }

  /**
   * Aggiorna un prodotto su Stripe
   */
  async updateProduct(id: string, updates: {
    name?: string;
    description?: string;
    images?: string[];
    metadata?: Record<string, string>;
    active?: boolean;
  }): Promise<StripeProductWithPrice | null> {
    const stripe = this.getStripeInstance();
    if (!stripe) {
      throw new Error('Stripe instance not available');
    }

    try {
      const product = await stripe.products.update(id, updates);
      
      // Ottieni il prezzo associato
      const prices = await stripe.prices.list({
        product: id,
        active: true,
        limit: 1
      });

      const price = prices.data[0];
      if (!price) return null;

      return this.mapStripeProductToInternal(product, price);
    } catch (error) {
      console.error(`Error updating product ${id} in Stripe:`, error);
      throw new Error('Failed to update product in Stripe');
    }
  }

  /**
   * Elimina un prodotto da Stripe
   */
  async deleteProduct(id: string): Promise<boolean> {
    const stripe = this.getStripeInstance();
    if (!stripe) {
      throw new Error('Stripe instance not available');
    }

    try {
      await stripe.products.update(id, { active: false });
      return true;
    } catch (error) {
      console.error(`Error deleting product ${id} from Stripe:`, error);
      throw new Error('Failed to delete product from Stripe');
    }
  }
}

export const stripeProductService = new StripeProductService();
export default stripeProductService;
