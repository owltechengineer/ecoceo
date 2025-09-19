"use client";

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  lookup_key: string;
  popular?: boolean;
}

const SubscriptionPlans = () => {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const plans: SubscriptionPlan[] = [
    {
      id: 'basic',
      name: 'Piano Base',
      price: 9.99,
      interval: 'month',
      lookup_key: 'price_basic_monthly',
      features: [
        'Accesso base ai contenuti',
        'Supporto email',
        'Aggiornamenti mensili',
        '1 progetto attivo'
      ]
    },
    {
      id: 'pro',
      name: 'Piano Pro',
      price: 19.99,
      interval: 'month',
      lookup_key: 'price_pro_monthly',
      popular: true,
      features: [
        'Tutto del piano base',
        'Supporto prioritario',
        'Aggiornamenti settimanali',
        '5 progetti attivi',
        'Analytics avanzate',
        'API access'
      ]
    },
    {
      id: 'enterprise',
      name: 'Piano Enterprise',
      price: 49.99,
      interval: 'month',
      lookup_key: 'price_enterprise_monthly',
      features: [
        'Tutto del piano pro',
        'Supporto dedicato 24/7',
        'Aggiornamenti in tempo reale',
        'Progetti illimitati',
        'Analytics personalizzate',
        'Integrazione personalizzata',
        'SLA garantito'
      ]
    }
  ];

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    setIsLoading(plan.id);

    try {
      // Create subscription session
      const response = await fetch('/api/create-subscription-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lookup_key: plan.lookup_key,
          customerEmail: 'customer@example.com', // Replace with actual customer email
          metadata: {
            planId: plan.id,
            planName: plan.name,
          },
        }),
      });

      const { sessionId, error } = await response.json();

      if (error) {
        throw new Error(error);
      }

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (stripe) {
        const { error: stripeError } = await stripe.redirectToCheckout({
          sessionId,
        });

        if (stripeError) {
          throw new Error(stripeError.message);
        }
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Errore durante la creazione dell\'abbonamento');
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="py-16 bg-gradient-to-b from-white via-orange-100 to-orange-400">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Scegli il Tuo Piano
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Seleziona il piano che meglio si adatta alle tue esigenze. 
            Puoi cambiare piano in qualsiasi momento.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-lg overflow-hidden ${
                plan.popular ? 'ring-2 ring-primary scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Più Popolare
                  </span>
                </div>
              )}

              <div className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-primary">
                      €{plan.price}
                    </span>
                    <span className="text-gray-600">/{plan.interval}</span>
                  </div>
                  <p className="text-gray-600">
                    Fatturazione {plan.interval === 'month' ? 'mensile' : 'annuale'}
                  </p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={isLoading === plan.id}
                  className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
                    isLoading === plan.id
                      ? 'bg-gray-400 cursor-not-allowed'
                      : plan.popular
                      ? 'bg-primary hover:bg-primary/90'
                      : 'bg-gray-800 hover:bg-gray-900'
                  }`}
                >
                  {isLoading === plan.id ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Elaborazione...
                    </span>
                  ) : (
                    `Abbonati a ${plan.name}`
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Domande sui Piani?
            </h3>
            <p className="text-gray-600 mb-6">
              Non sei sicuro di quale piano scegliere? Contattaci e ti aiuteremo 
              a trovare la soluzione perfetta per le tue esigenze.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                Contattaci
              </button>
              <button className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                Leggi FAQ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
