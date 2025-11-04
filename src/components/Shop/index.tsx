"use client";

import SingleProduct from './SingleProduct';
import { useState, useEffect } from 'react';
import { StripeProductWithPrice } from '@/types/stripeProduct';

interface ShopProps {
  products?: StripeProductWithPrice[];
  title?: string;
  subtitle?: string;
}

const Shop = ({ products: initialProducts, title, subtitle }: ShopProps) => {
  const [products, setProducts] = useState<StripeProductWithPrice[]>(initialProducts || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Fetching products from Stripe...');
        const response = await fetch('/api/products');
        const data = await response.json();
        
        if (data.success) {
          console.log('Products fetched:', data.products);
          setProducts(data.products || []);
        } else {
          throw new Error(data.error || 'Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products data:', error);
        setError(error instanceof Error ? error.message : 'Errore nel caricamento prodotti');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-white/80 text-lg">Caricamento prodotti...</p>
        <div className="mt-4">
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="inline-block bg-primary text-white px-6 py-3 rounded hover:bg-primary/80 transition"
          >
            Vai al Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-4">Errore nel caricamento</h3>
        <p className="text-white/80 mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="inline-block bg-primary text-white px-6 py-3 rounded hover:bg-primary/80 transition"
        >
          Riprova
        </button>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-4">Nessun prodotto disponibile</h3>
        <p className="text-white/80 mb-6">Al momento non ci sono prodotti nel negozio.</p>
        <button 
          onClick={() => window.location.href = '/dashboard'}
          className="inline-block bg-primary text-white px-6 py-3 rounded hover:bg-primary/80 transition"
        >
          Vai al Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl mb-4">
          {title || "I Nostri Prodotti"}
        </h2>
        <p className="text-white/80 text-lg max-w-2xl mx-auto">
          {subtitle || "Scegli tra la nostra selezione di prodotti di alta qualità"}
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {products.map((product, index) => (
          <SingleProduct key={product.id} product={product} index={index} />
        ))}
      </div>
    </div>
  );
};

export default Shop;
