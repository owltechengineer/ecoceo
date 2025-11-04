"use client";

import { useCart } from '@/contexts/CartContext';
import Breadcrumb from "@/components/Common/Breadcrumb";
import Link from 'next/link';
import SimpleStripeCheckout from '@/components/Shop/SimpleStripeCheckout';

const CheckoutPage = () => {
  const { state } = useCart();

  const handlePaymentSuccess = (sessionId: string) => {
    window.location.href = `/shop/success?session_id=${sessionId}`;
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    alert('Errore durante il pagamento. Riprova.');
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

  const packagingFee = Math.max(state.total * 0.005, 2);

  if (state.items.length === 0) {
    return (
      <>
        <div className="text-white">
          <Breadcrumb
            pageName="Checkout"
            description="Il tuo carrello è vuoto"
          />
        </div>

        <div className="text-white">
          <section className="py-16 lg:py-20">
            <div className="container">
              <div className="text-center py-12">
                <h1 className="text-3xl font-bold text-white mb-4">
                  Carrello vuoto
                </h1>
                <p className="text-white/80 text-lg mb-8">
                  Non puoi procedere al checkout con un carrello vuoto.
                </p>
                <Link
                  href="/shop"
                  className="inline-flex items-center bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Torna allo Shop
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
      <div className="text-white">
        <Breadcrumb
          pageName="Checkout"
          description="Completa il tuo ordine"
        />
      </div>

      <div className="text-white">
        <section className="py-16 lg:py-20">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl mb-4">
                  Checkout
                </h1>
                <p className="text-white/80 text-lg">
                  Procedi al pagamento sicuro con Stripe
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <div className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-lg shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-white mb-6">
                      Pagamento Sicuro
                    </h2>
                    <p className="text-white/80 mb-6">
                      Clicca il pulsante qui sotto per procedere al pagamento sicuro con Stripe. 
                      Potrai inserire i tuoi dati di spedizione e pagamento direttamente sulla piattaforma Stripe.
                    </p>
                    
                    <SimpleStripeCheckout
                      customerEmail=""
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    />
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <div className="bg-white/30 backdrop-blur/30 backdrop-blur rounded-lg shadow-lg p-6 sticky top-8">
                    <h3 className="text-xl font-bold text-white mb-6">
                      Riepilogo Ordine
                    </h3>

                    <div className="space-y-4 mb-6">
                      {state.items.map((item, index) => {
                        const productId = getProductId(item.product);
                        const productName = getProductName(item.product);
                        const productPrice = getProductPrice(item.product);

                        return (
                          <div key={productId || index} className="flex items-center space-x-3 p-3 bg-white/20 rounded-lg">
                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                              <span className="text-xs text-gray-600">IMG</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white truncate">
                                {productName}
                              </p>
                              <p className="text-sm text-white/70">
                                Qty: {item.quantity}
                              </p>
                            </div>
                            <p className="text-sm font-medium text-white">
                              €{(productPrice * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    <div className="border-t border-white/20 pt-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-white/80">Subtotale:</span>
                        <span className="font-medium text-white">€{state.total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/80">Spese di imballo:</span>
                        <span className="font-medium text-white">€{packagingFee.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-white/20 pt-3">
                        <div className="flex justify-between">
                          <span className="text-lg font-bold text-white">Totale:</span>
                          <span className="text-lg font-bold text-primary">€{(state.total + packagingFee).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                      <Link
                        href="/shop/cart"
                        className="w-full mt-6 bg-white/20 text-white py-3 px-6 rounded-lg font-semibold hover:bg-white/30 transition-colors text-center block"
                      >
                        Torna al Carrello
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

export default CheckoutPage;
