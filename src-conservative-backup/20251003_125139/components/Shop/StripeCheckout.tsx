"use client";

import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface StripeCheckoutProps {
  customerEmail: string;
  onSuccess?: (sessionId: string) => void;
  onError?: (error: string) => void;
}

const StripeCheckout = ({ customerEmail, onSuccess, onError }: StripeCheckoutProps) => {
  const { state } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (state.items.length === 0) {
      setError('Il carrello è vuoto');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: state.items,
          customerEmail,
          orderNumber: `ORD-${Date.now()}`,
        }),
      });

      const responseData = await response.json();
      console.log('Stripe API response:', responseData);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${responseData.error || responseData.message || 'Errore sconosciuto'}`);
      }

      const { sessionId, url, error: responseError } = responseData;

      if (responseError) {
        throw new Error(responseError);
      }

      if (!sessionId) {
        throw new Error('Session ID non ricevuto da Stripe');
      }

      // Use direct URL redirect instead of redirectToCheckout
      if (url) {
        console.log('Redirecting to Stripe:', url);
        window.location.href = url;
      } else {
        // Fallback to redirectToCheckout if URL is not provided
        const stripe = await stripePromise;
        if (stripe) {
          const { error: stripeError } = await stripe.redirectToCheckout({
            sessionId,
          });

          if (stripeError) {
            throw new Error(stripeError.message);
          }
        }
      }
    } catch (error) {
      console.error('Checkout error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Errore durante il checkout';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const total = state.total + 5; // Add shipping cost

  return (
    <>
      {/* Error Modal */}
      {error && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-lg p-6 max-w-md w-full">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Errore Checkout</h3>
            </div>
            <p className="text-gray-700 mb-4">{error}</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setError(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Chiudi
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-2xl shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Checkout Sicuro con Stripe
        </h3>
        <p className="text-gray-600">
          Verrai reindirizzato alla pagina di pagamento sicura di Stripe
        </p>
      </div>

      {/* Order Summary */}
      <div className="bg-blue-500/20 rounded-lg p-6 mb-8">
        <h4 className="font-semibold text-gray-900 mb-4">Riepilogo Ordine</h4>
        <div className="space-y-3">
          {state.items.map((item) => (
            <div key={item.product._id} className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-xs text-gray-500">IMG</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{item.product.title}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
              <span className="font-medium">€{(item.product.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          
          <div className="border-t pt-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotale:</span>
              <span>€{state.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Spese di spedizione:</span>
              <span>€5.00</span>
            </div>
            <div className="flex justify-between font-semibold text-lg mt-2 pt-2 border-t">
              <span>Totale:</span>
              <span className="text-primary">€{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Security Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <div>
            <h5 className="text-sm font-medium text-blue-900">Pagamento Sicuro</h5>
            <p className="text-sm text-blue-700 mt-1">
              I tuoi dati di pagamento sono protetti da crittografia SSL e conformi agli standard PCI DSS.
            </p>
          </div>
        </div>
      </div>

                    {/* Debug Button */}
              <button
                onClick={async () => {
                  try {
                    const response = await fetch('/api/test-stripe');
                    const data = await response.json();
                    console.log('Stripe test result:', data);
                    alert(`Stripe Test: ${data.status}\n${data.message}`);
                  } catch (error) {
                    console.error('Test error:', error);
                    alert('Errore nel test Stripe');
                  }
                }}
                className="w-full mb-4 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                🔧 Test Stripe Connection
              </button>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isLoading || state.items.length === 0}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-colors ${
                  isLoading || state.items.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-primary hover:bg-primary/90'
                }`}
              >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Reindirizzamento...
          </span>
        ) : (
          `Paga €${total.toFixed(2)} con Stripe`
        )}
      </button>

      {/* Payment Methods */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500 mb-3">Metodi di pagamento accettati:</p>
        <div className="flex justify-center space-x-4">
          <div className="flex items-center space-x-2">
            <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span className="text-xs text-gray-500">Visa</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span className="text-xs text-gray-500">Mastercard</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span className="text-xs text-gray-500">American Express</span>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default StripeCheckout;
