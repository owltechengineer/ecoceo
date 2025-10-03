"use client";

import { useState } from 'react';

export type PaymentMethod = 'stripe' | 'stripe_checkout' | 'paypal' | 'bank_transfer';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
}

const PaymentMethodSelector = ({ selectedMethod, onMethodChange }: PaymentMethodSelectorProps) => {
  const paymentMethods = [
    {
      id: 'stripe_checkout' as PaymentMethod,
      name: 'Stripe Checkout',
      description: 'Pagamento sicuro con reindirizzamento a Stripe',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
        </svg>
      ),
      popular: true,
    },
    {
      id: 'stripe' as PaymentMethod,
      name: 'Carta di Credito/Debito (Embedded)',
      description: 'Visa, Mastercard, American Express - Pagamento integrato',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
        </svg>
      ),
      popular: false,
    },
    {
      id: 'paypal' as PaymentMethod,
      name: 'PayPal',
      description: 'Paga con il tuo account PayPal',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.067 8.478c.492.315.844.825.844 1.478 0 .653-.352 1.163-.844 1.478-.492.315-1.163.478-1.844.478H18v-2.956h.223c.681 0 1.352.163 1.844.478zM7.067 8.478c.492.315.844.825.844 1.478 0 .653-.352 1.163-.844 1.478-.492.315-1.163.478-1.844.478H5v-2.956h.223c.681 0 1.352.163 1.844.478z"/>
        </svg>
      ),
      popular: false,
    },
    {
      id: 'bank_transfer' as PaymentMethod,
      name: 'Bonifico Bancario',
      description: 'Trasferimento bancario diretto',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      ),
      popular: false,
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Scegli il Metodo di Pagamento
      </h3>
      
      <div className="space-y-3">
        {paymentMethods.map((method) => (
          <label
            key={method.id}
            className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedMethod === method.id
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method.id}
              checked={selectedMethod === method.id}
              onChange={() => onMethodChange(method.id)}
              className="sr-only"
            />
            
            <div className="flex items-center space-x-3 flex-1">
              <div className={`p-2 rounded-lg ${
                selectedMethod === method.id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                {method.icon}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">{method.name}</span>
                  {method.popular && (
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      Popolare
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">{method.description}</p>
              </div>
            </div>
            
            {selectedMethod === method.id && (
              <div className="absolute top-4 right-4 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </label>
        ))}
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-blue-900">Pagamento Sicuro</h4>
            <p className="text-sm text-blue-700 mt-1">
              Tutti i pagamenti sono protetti da crittografia SSL e conformi agli standard PCI DSS.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
