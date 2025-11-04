"use client";

import { useCart } from '@/contexts/CartContext';
import Breadcrumb from "@/components/Common/Breadcrumb";
import CustomerPortal from "@/components/Shop/CustomerPortal";
import Link from 'next/link';
import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const OrderSuccessContent = () => {
  const { clearCart } = useCart();
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber');
  const sessionId = searchParams.get('session_id');

  // Clear cart after successful order (only once)
  useEffect(() => {
    const hasCleared = sessionStorage.getItem('cartCleared');
    if (!hasCleared) {
      clearCart();
      sessionStorage.setItem('cartCleared', 'true');
    }
  }, [clearCart]);

  return (
    <>
      {/* Breadcrumb Section */}
      <div className="text-white">
        <Breadcrumb
          pageName="Ordine Completato"
          description="Grazie per il tuo acquisto!"
        />
      </div>

      {/* Success Content */}
      <div className="text-white">
        <section className="py-16 lg:py-20">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center">
              {/* Success Icon */}
              <div className="mb-8">
                <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              {/* Success Message */}
              <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl mb-4">
                Ordine Completato!
              </h1>
              {orderNumber && (
                <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-4 mb-6">
                  <p className="text-green-300 font-medium">
                    Numero Ordine: <span className="font-bold">{orderNumber}</span>
                  </p>
                  <p className="text-green-200 text-sm mt-1">
                    Conserva questo numero per il tracking del tuo ordine
                  </p>
                </div>
              )}

              {sessionId && (
                <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-4 mb-6">
                  <p className="text-blue-300 font-medium">
                    Pagamento completato con successo!
                  </p>
                  <p className="text-blue-200 text-sm mt-1">
                    Session ID: <span className="font-mono text-xs">{sessionId}</span>
                  </p>
                </div>
              )}
              <p className="text-white/80 text-lg mb-8">
                Grazie per il tuo acquisto. Il tuo ordine è stato ricevuto e verrà elaborato al più presto.
              </p>

              {/* Order Details */}
              <div className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-xl font-bold text-white mb-4">
                  Cosa succede ora?
                </h2>
                <div className="space-y-4 text-left">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-300 text-sm font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Conferma Email</h3>
                      <p className="text-white/70 text-sm">Riceverai un&apos;email di conferma con i dettagli del tuo ordine.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-300 text-sm font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Elaborazione</h3>
                      <p className="text-white/70 text-sm">Il tuo ordine verrà elaborato e preparato per la spedizione.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-300 text-sm font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Spedizione</h3>
                      <p className="text-white/70 text-sm">Riceverai un&apos;email con il numero di tracking quando l&apos;ordine verrà spedito.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Portal for Stripe Checkout */}
              {sessionId && (
                <div className="mb-8">
                  <CustomerPortal sessionId={sessionId} />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Continua lo Shopping
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center bg-white/20 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Torna alla Home
                </Link>
              </div>

              {/* Contact Info */}
              <div className="mt-12 p-6 bg-white/10 backdrop-blur/30 rounded-lg">
                <h3 className="font-semibold text-white mb-2">
                  Hai domande?
                </h3>
                <p className="text-white/70 text-sm mb-4">
                  Se hai bisogno di assistenza, non esitare a contattarci.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contattaci
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

const OrderSuccessPage = () => {
  return (
    <Suspense fallback={<div>Caricamento...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
};

export default OrderSuccessPage;
