"use client";

import { safeFetch } from '@/sanity/lib/client';
import { productsQuery } from '@/sanity/lib/queries';
import { useSanityUIComponents } from '@/hooks/useSanityUIComponents';
import SanityStyledComponent from '@/components/Common/SanityStyledComponent';
import SingleProduct from './SingleProduct';
import { useState, useEffect } from 'react';
import { Product, ProductGridProps } from '@/types/product';

const Shop = ({ products: initialProducts, title, subtitle }: ProductGridProps) => {
  const [products, setProducts] = useState<Product[]>(initialProducts || []);
  const [loading, setLoading] = useState(true);
  const { getComponent } = useSanityUIComponents();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Fetching products...');
        const productsData = await safeFetch(productsQuery);
        console.log('Products fetched:', productsData);
        console.log('Products count:', productsData?.length || 0);
        setProducts(productsData || []);
      } catch (error) {
        console.error('Error fetching products data:', error);
        console.error('Error details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Get UI components for Shop section
  const shopSectionComponent = getComponent('ShopSection');
  const shopTitleComponent = getComponent('ShopTitle');
  const shopSubtitleComponent = getComponent('ShopSubtitle');

  if (loading) {
    return (
      <div className="text-center py-12">
        <p>Caricamento prodotti...</p>
        <div className="mt-4">
          <button 
            onClick={() => window.location.href = '/studio'}
            className="inline-block bg-primary text-white px-6 py-3 rounded hover:bg-primary/80 transition"
          >
            Vai a Sanity Studio
          </button>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-4">Nessun prodotto disponibile</h3>
        <p className="text-gray-600 mb-6">Al momento non ci sono prodotti nel negozio.</p>
        <button 
          onClick={() => window.location.href = '/studio'}
          className="inline-block bg-primary text-white px-6 py-3 rounded hover:bg-primary/80 transition"
        >
          Vai a Sanity Studio
        </button>
      </div>
    );
  }

  return (
    <SanityStyledComponent
      component={shopSectionComponent}
      componentName="ShopSection"
    >
      <div className="container">
        {(title || subtitle) && (
          <div className="text-center mb-16">
            {title && (
              <SanityStyledComponent
                component={shopTitleComponent}
                componentName="ShopTitle"
                as="h2"
                className="text-3xl font-bold text-black sm:text-4xl lg:text-5xl mb-4"
              >
                {title}
              </SanityStyledComponent>
            )}
            {subtitle && (
              <SanityStyledComponent
                component={shopSubtitleComponent}
                componentName="ShopSubtitle"
                as="p"
                className="text-black/80 text-lg max-w-2xl mx-auto"
              >
                {subtitle}
              </SanityStyledComponent>
            )}
          </div>
        )}
        
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <SingleProduct key={product._id} product={product} index={index} />
          ))}
        </div>
      </div>
    </SanityStyledComponent>
  );
};

export default Shop;
