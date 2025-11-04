"use client";

import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';
import { StripeProductWithPrice } from '@/types/stripeProduct';

interface SingleProductProps {
  product: StripeProductWithPrice;
  index: number;
}

const SingleProduct = ({ product, index }: SingleProductProps) => {
  const { addItem, getItemQuantity } = useCart();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const currentQuantity = getItemQuantity(product.id);
  const isInStock = product.stock ? product.stock > 0 : true; // Default to true if stock not specified

  const handleAddToCart = async () => {
    if (!isInStock) return;
    
    setIsAddingToCart(true);
    try {
      addItem(product, 1);
      // Simulate a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300));
    } finally {
      setIsAddingToCart(false);
    }
  };

  const formatPrice = (priceInCents: number) => {
    const priceInEuros = priceInCents / 100;
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
    }).format(priceInEuros);
  };

  const discountPercentage = product.comparePrice 
    ? Math.round(((product.comparePrice - (product.price.unit_amount / 100)) / product.comparePrice) * 100)
    : 0;

  return (
    <div className="w-full">
      <div className="wow fadeInUp" data-wow-delay={`${index * 100}ms`}>
        <div className="group relative overflow-hidden rounded-lg bg-white/30 backdrop-blur/30 backdrop-blur shadow-lg duration-300 hover:shadow-xl dark:bg-dark dark:hover:shadow-gray-dark">
          <Link href={`/shop/${product.id}`}>
            <div className="relative block aspect-[4/3] overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No image</span>
                </div>
              )}
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.featured && (
                  <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    In Evidenza
                  </span>
                )}
                {discountPercentage > 0 && (
                  <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    -{discountPercentage}%
                  </span>
                )}
                {!isInStock && (
                  <span className="bg-blue-500/200 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Esaurito
                  </span>
                )}
              </div>
            </div>
          </Link>
          
          <div className="p-8 sm:p-10 md:p-8 lg:p-10 xl:p-8 2xl:p-10">
            <div className="mb-4">
              <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                {product.category || 'Generale'}
              </span>
            </div>
            
            <h3 className="mb-4 block text-xl font-bold text-black hover:text-primary dark:text-white dark:hover:text-primary sm:text-2xl">
              <Link href={`/shop/${product.id}`}>
                {product.name}
              </Link>
            </h3>
            
            <p className="mb-6 border-b border-body-color border-opacity-10 pb-6 text-base font-medium leading-relaxed text-body-color dark:border-white dark:border-opacity-10 dark:text-body-color-dark">
              {product.metadata.shortDescription || product.description || 'Descrizione non disponibile'}
            </p>
            
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(product.price.unit_amount)}
                </span>
                {product.comparePrice && product.comparePrice > (product.price.unit_amount / 100) && (
                  <span className="text-lg text-gray-500 line-through">
                    {formatPrice(product.comparePrice * 100)}
                  </span>
                )}
              </div>
              
              {isInStock && product.stock && (
                <span className="text-sm text-green-600 font-medium">
                  {product.stock} disponibili
                </span>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <button
                onClick={handleAddToCart}
                disabled={!isInStock || isAddingToCart}
                className={`flex-1 mr-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isInStock && !isAddingToCart
                    ? 'bg-primary text-white hover:bg-primary/90'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isAddingToCart ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Aggiungendo...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                    </svg>
                    {isInStock ? 'Aggiungi al Carrello' : 'Non Disponibile'}
                  </span>
                )}
              </button>
              
              {currentQuantity > 0 && (
                <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {currentQuantity} nel carrello
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
