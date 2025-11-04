"use client";

import { useCart } from '@/contexts/CartContext';
import Breadcrumb from "@/components/Common/Breadcrumb";
import Link from 'next/link';
import { useState } from 'react';

const CartPage = () => {
  const { state, updateQuantity, removeItem, clearCart } = useCart();
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    setIsUpdating(productId);
    try {
      updateQuantity(productId, newQuantity);
      // Simulate a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300));
    } finally {
      setIsUpdating(null);
    }
  };

  const getProductId = (product: any) => {
    return (product as any)._id || (product as any).id;
  };

  const getProductName = (product: any) => {
    return product.name || product.title || 'Prodotto';
  };

  const getProductDescription = (product: any) => {
    return product.metadata?.shortDescription || product.shortDescription || product.description || '';
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

  const getProductComparePrice = (product: any) => {
    if (product.comparePrice) {
      return typeof product.comparePrice === 'number' ? product.comparePrice : product.comparePrice;
    }
    return null;
  };

  const getProductImage = (product: any) => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    if (product.mainImage) {
      // For Sanity products - handle both string and object
      if (typeof product.mainImage === 'string') {
        return product.mainImage;
      }
      // If it's a Sanity image object, you might need to process it
      return '/placeholder-product.jpg';
    }
    return '/placeholder-product.jpg';
  };

  if (state.items.length === 0) {
    return (
      <>
        {/* Breadcrumb Section */}
        <div className="text-white">
          <Breadcrumb
            pageName="Carrello"
            description="Il tuo carrello è vuoto"
          />
        </div>

        {/* Empty Cart Content */}
        <div className="text-white">
          <section className="py-16 lg:py-20">
            <div className="container">
              <div className="text-center py-12">
                <div className="mb-8">
                  <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-white mb-4">
                  Il tuo carrello è vuoto
                </h1>
                <p className="text-white/80 text-lg mb-8 max-w-md mx-auto">
                  Sembra che tu non abbia ancora aggiunto nessun prodotto al carrello.
                </p>
                <Link
                  href="/shop"
                  className="inline-flex items-center bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Inizia a fare shopping
                </Link>
              </div>
            </div>
          </section>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Breadcrumb Section */}
      <div className="text-white">
        <Breadcrumb
          pageName="Carrello"
          description={`${state.itemCount} articoli nel carrello`}
        />
      </div>

      {/* Cart Content */}
      <div className="text-white">
        <section className="py-16 lg:py-20">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl mb-4">
                  Il tuo Carrello
                </h1>
                <p className="text-white/80 text-lg">
                  {state.itemCount} articoli nel carrello
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2">
                  <div className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-white">
                        Prodotti ({state.items.length})
                      </h2>
                      <button
                        onClick={clearCart}
                        className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                      >
                        Svuota carrello
                      </button>
                    </div>

                    <div className="space-y-6">
                      {state.items.map((item) => {
                        const productId = getProductId(item.product);
                        const productName = getProductName(item.product);
                        const productDescription = getProductDescription(item.product);
                        const productPrice = getProductPrice(item.product);
                        const productComparePrice = getProductComparePrice(item.product);
                        const productImage = getProductImage(item.product);

                        return (
                          <div key={productId} className="flex items-center gap-4 p-4 border border-white/20 rounded-lg bg-white/10">
                            {/* Product Image */}
                            <div className="flex-shrink-0">
                              <img
                                src={productImage}
                                alt={productName}
                                className="w-20 h-20 object-cover rounded-lg"
                              />
                            </div>

                            {/* Product Details */}
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-semibold text-white truncate">
                                {productName}
                              </h3>
                              {productDescription && (
                                <p className="text-white/70 text-sm truncate">
                                  {productDescription}
                                </p>
                              )}
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-lg font-bold text-primary">
                                  {formatPrice(productPrice)}
                                </span>
                                {productComparePrice && productComparePrice > productPrice && (
                                  <span className="text-sm text-white/50 line-through">
                                    {formatPrice(productComparePrice)}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleQuantityChange(productId, item.quantity - 1)}
                                disabled={isUpdating === productId}
                                className="w-8 h-8 flex items-center justify-center border border-white/30 rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                              </button>
                              
                              <span className="w-12 text-center font-medium text-white">
                                {isUpdating === productId ? (
                                  <svg className="animate-spin h-4 w-4 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                ) : (
                                  item.quantity
                                )}
                              </span>
                              
                              <button
                                onClick={() => handleQuantityChange(productId, item.quantity + 1)}
                                disabled={isUpdating === productId}
                                className="w-8 h-8 flex items-center justify-center border border-white/30 rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                              </button>
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={() => removeItem(productId)}
                              className="text-red-400 hover:text-red-300 p-2 transition-colors"
                              title="Rimuovi dal carrello"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-lg shadow-lg p-6 sticky top-4">
                    <h2 className="text-xl font-bold text-white mb-6">
                      Riepilogo Ordine
                    </h2>

                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between">
                        <span className="text-white/80">Subtotale:</span>
                        <span className="font-medium text-white">{formatPrice(state.total)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/80">Spese di imballo:</span>
                        <span className="font-medium text-green-400">€{Math.max(state.total * 0.005, 2).toFixed(2)}</span>
                      </div>
                      <div className="border-t border-white/20 pt-4">
                        <div className="flex justify-between">
                          <span className="text-lg font-bold text-white">Totale:</span>
                          <span className="text-lg font-bold text-primary">{formatPrice(state.total + Math.max(state.total * 0.005, 2))}</span>
                        </div>
                      </div>
                    </div>

                    <Link
                      href="/shop/checkout"
                      className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary/90 transition-colors text-center block"
                    >
                      Procedi al Checkout
                    </Link>

                    <Link
                      href="/shop"
                      className="w-full mt-4 bg-white/20 text-white py-3 px-6 rounded-lg font-semibold hover:bg-white/30 transition-colors text-center block"
                    >
                      Continua lo Shopping
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default CartPage;
