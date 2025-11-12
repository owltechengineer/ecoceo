"use client";

import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';

const MiniCart = () => {
  const { state, removeItem, updateQuantity } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  // Close cart when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const getProductId = (product: any) => {
    return (product as any)._id || (product as any).id;
  };

  const getProductName = (product: any) => {
    return product.name || product.title || 'Prodotto';
  };

  const getProductPrice = (product: any) => {
    if (typeof product.price === 'number') {
      return product.price;
    }
    if (product.price?.unit_amount) {
      return product.price.unit_amount / 100;
    }
    return 0;
  };

  const getProductImage = (product: any) => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    if (product.mainImage) {
      // For Sanity products
      return typeof product.mainImage === 'string' ? product.mainImage : '/placeholder-product.jpg';
    }
    return '/placeholder-product.jpg';
  };

  return (
    <div className="relative" ref={cartRef}>
      {/* Cart Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative inline-flex items-center justify-center p-2 text-white hover:text-blue-300 transition-colors duration-200"
        aria-label={state.itemCount > 0 
          ? `Carrello: ${state.itemCount} ${state.itemCount === 1 ? 'articolo' : 'articoli'}` 
          : 'Apri carrello'}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls={isOpen ? "cart-dropdown" : undefined}
      >
        <FontAwesomeIcon icon={faCartShopping} className="w-6 h-6" aria-hidden="true" />
        
        {state.itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-sm" aria-hidden="true">
            {state.itemCount > 99 ? '99+' : state.itemCount}
          </span>
        )}
      </button>

      {/* Mini Cart Dropdown */}
      {isOpen && (
        <div 
          id="cart-dropdown"
          className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
          role="region"
          aria-label="Carrello della spesa"
          aria-labelledby="cart-heading"
          aria-live="polite"
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900" id="cart-heading">
                Carrello ({state.itemCount})
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Chiudi carrello"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {state.items.length === 0 ? (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
                <p className="text-gray-500">Il carrello è vuoto</p>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="max-h-64 overflow-y-auto space-y-3 mb-4">
                  {state.items.map((item) => {
                    const productId = getProductId(item.product);
                    const productName = getProductName(item.product);
                    const productPrice = getProductPrice(item.product);
                    const productImage = getProductImage(item.product);

                    return (
                      <div key={productId} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <img
                          src={productImage}
                          alt={productName}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {productName}
                          </h4>
                          <p className="text-xs text-gray-600">
                            {formatPrice(productPrice)} x {item.quantity}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleQuantityChange(productId, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-200 transition-colors"
                            aria-label={`Diminuisci quantità di ${productName}`}
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="w-8 text-center text-sm font-medium text-gray-900" aria-label={`Quantità: ${item.quantity}`}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(productId, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-200 transition-colors"
                            aria-label={`Aumenta quantità di ${productName}`}
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Cart Total */}
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Totale:</span>
                    <span className="font-bold text-blue-600">{formatPrice(state.total)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Link
                    href="/shop/cart"
                    onClick={() => setIsOpen(false)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors text-center block"
                  >
                    Vedi Carrello
                  </Link>
                  <Link
                    href="/shop/checkout"
                    onClick={() => setIsOpen(false)}
                    className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md font-medium hover:bg-gray-200 transition-colors text-center block"
                  >
                    Checkout
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MiniCart;
