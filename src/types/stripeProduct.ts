// Re-export dei tipi dal servizio per comodità
export type {
  StripeProduct,
  StripePrice,
  StripeProductWithPrice
} from '@/services/stripeProductService';

// Tipo per il carrello che usa prodotti Stripe
export interface CartItem {
  product: StripeProductWithPrice;
  quantity: number;
}

// Tipo per le opzioni di ricerca prodotti
export interface ProductSearchOptions {
  category?: string;
  search?: string;
  featured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'name' | 'price' | 'created' | 'order';
  sortOrder?: 'asc' | 'desc';
}

// Tipo per i filtri prodotti
export interface ProductFilters {
  categories: string[];
  priceRange: {
    min: number;
    max: number;
  };
  inStock: boolean;
  featured: boolean;
}

// Tipo per le statistiche prodotti
export interface ProductStats {
  total: number;
  featured: number;
  categories: Record<string, number>;
  priceRange: {
    min: number;
    max: number;
  };
}
