export interface Product {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  shortDescription: string;
  fullDescription?: any[];
  mainImage: {
    asset: {
      _ref: string;
    };
  };
  gallery?: Array<{
    asset: {
      _ref: string;
    };
  }>;
  price: number;
  comparePrice?: number;
  sku?: string;
  stock: number;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  features?: string[];
  tags?: string[];
  featured: boolean;
  isActive: boolean;
  order: number;
  category: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface ProductCategory {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
  description?: string;
  image?: {
    asset: {
      _ref: string;
    };
  };
  isActive: boolean;
  order: number;
}

export interface ProductCardProps {
  product: Product;
  index: number;
}

export interface ProductGridProps {
  products: Product[];
  title?: string;
  subtitle?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}
