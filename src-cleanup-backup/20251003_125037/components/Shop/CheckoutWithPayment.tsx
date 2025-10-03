"use client";

import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import PaymentMethodSelector, { PaymentMethod } from './PaymentMethodSelector';
import PaymentForm from './PaymentForm';
import StripeProvider from './StripeProvider';
import StripeCheckout from './StripeCheckout';
import SimpleStripeCheckout from './SimpleStripeCheckout';
import OrderReview from './OrderReview';
import { Customer, ShippingAddress } from '@/types/order';

interface CheckoutWithPaymentProps {
  customer: Customer;
  shippingAddress: ShippingAddress;
  onBack: () => void;
}

const CheckoutWithPayment = ({ customer, shippingAddress, onBack }: CheckoutWithPaymentProps) => {
  const { state } = useCart();
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('stripe_checkout');
  const [clientSecret, setClientSecret] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create payment intent when component mounts
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await fetch('/api/payment/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: state.total + 5, // Add shipping cost
            currency: 'eur',
            metadata: {
              customerEmail: customer.email,
              orderNumber: `ORD-${Date.now()}`,
            },
          }),
        });

        const data = await response.json();

        if (data.error) {
          setError(data.error);
        } else {
          setClientSecret(data.clientSecret);
        }
      } catch (err) {
        console.error('Error creating payment intent:', err);
        setError('Errore nella creazione del pagamento');
      }
    };

    if (selectedMethod === 'stripe') {
      createPaymentIntent();
    }
  }, [state.total, customer.email, selectedMethod]);

  const handlePaymentSuccess = async (paymentIntent: any) => {
    try {
      // Here you would typically save the order to your database
      // For now, we'll just redirect to success page
      const orderNumber = `ORD-${Date.now()}`;
      router.push(`/shop/success?orderNumber=${orderNumber}`);
    } catch (err) {
      console.error('Error processing successful payment:', err);
      setError('Errore nell\'elaborazione del pagamento');
    }
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handlePayPalPayment = () => {
    // Implement PayPal payment logic
    alert('PayPal integration coming soon!');
  };

  const handleBankTransfer = () => {
    // Show bank transfer details
    alert('Dettagli bonifico bancario:\n\nIBAN: IT60 X054 2811 1010 0000 0123 456\nBanca: Example Bank\nCausale: Ordine ' + Date.now());
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="text-lg font-medium text-red-800">Errore di Pagamento</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
        <button
          onClick={() => setError(null)}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Riprova
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Payment Method Selection */}
      <PaymentMethodSelector
        selectedMethod={selectedMethod}
        onMethodChange={setSelectedMethod}
      />

      {/* Order Review */}
      <div className="bg-blue-500/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Riepilogo Ordine
        </h3>
        <OrderReview
          customer={customer}
          shippingAddress={shippingAddress}
          cartItems={state.items}
          orderSummary={{
            subtotal: state.total,
            shippingCost: 5,
            total: state.total + 5,
            shippingMethod: { 
              id: 'standard',
              name: 'Spedizione Standard', 
              cost: 5, 
              estimatedDays: '3-5 giorni',
              description: 'Spedizione standard con consegna in 3-5 giorni lavorativi'
            }
          }}
          onEdit={onBack}
        />
      </div>

                      {/* Payment Form */}
                {selectedMethod === 'stripe_checkout' && (
                  <SimpleStripeCheckout
                    customerEmail={customer.email}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                )}

      {selectedMethod === 'stripe' && clientSecret && (
        <StripeProvider clientSecret={clientSecret}>
          <PaymentForm
            clientSecret={clientSecret}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
            isProcessing={isProcessing}
            setIsProcessing={setIsProcessing}
          />
        </StripeProvider>
      )}

      {selectedMethod === 'paypal' && (
        <div className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Pagamento con PayPal
          </h3>
          <p className="text-gray-600 mb-4">
            Verrai reindirizzato a PayPal per completare il pagamento.
          </p>
          <button
            onClick={handlePayPalPayment}
            disabled={isProcessing}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {isProcessing ? 'Elaborazione...' : 'Paga con PayPal'}
          </button>
        </div>
      )}

      {selectedMethod === 'bank_transfer' && (
        <div className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Bonifico Bancario
          </h3>
          <div className="bg-blue-500/20 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Dettagli Bancari:</h4>
            <div className="space-y-2 text-sm">
              <p><strong>IBAN:</strong> IT60 X054 2811 1010 0000 0123 456</p>
              <p><strong>Banca:</strong> Example Bank</p>
              <p><strong>Beneficiario:</strong> Your Company Name</p>
              <p><strong>Causale:</strong> Ordine {Date.now()}</p>
            </div>
          </div>
          <p className="text-gray-600 mb-4">
            Il tuo ordine verrà elaborato dopo la ricezione del bonifico (1-3 giorni lavorativi).
          </p>
          <button
            onClick={handleBankTransfer}
            className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Conferma Ordine
          </button>
        </div>
      )}

      {/* Back Button */}
      <div className="flex justify-center">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-800 transition"
        >
          ← Torna indietro
        </button>
      </div>
    </div>
  );
};

export default CheckoutWithPayment;
