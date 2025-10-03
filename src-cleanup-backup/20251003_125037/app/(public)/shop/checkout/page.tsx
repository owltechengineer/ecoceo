"use client";

import { useCart } from '@/contexts/CartContext';
import Breadcrumb from "@/components/Common/Breadcrumb";
import Link from 'next/link';
import { useState } from 'react';
import CheckoutWithPayment from '@/components/Shop/CheckoutWithPayment';
import { Customer, ShippingAddress } from '@/types/order';

interface CheckoutForm {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Shipping Address
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

type CheckoutStep = 'form' | 'payment';

const CheckoutPage = () => {
  const { state } = useCart();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('form');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  const [formData, setFormData] = useState<CheckoutForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Italia',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors([]);

    // Simple validation
    const errors: string[] = [];
    
    if (!formData.firstName.trim()) errors.push('Il nome è obbligatorio');
    if (!formData.lastName.trim()) errors.push('Il cognome è obbligatorio');
    if (!formData.email.trim()) errors.push('L\'email è obbligatoria');
    if (!formData.phone.trim()) errors.push('Il telefono è obbligatorio');
    if (!formData.address.trim()) errors.push('L\'indirizzo è obbligatorio');
    if (!formData.city.trim()) errors.push('La città è obbligatoria');
    if (!formData.postalCode.trim()) errors.push('Il CAP è obbligatorio');

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setCurrentStep('payment');
  };

  const handleBackToForm = () => {
    setCurrentStep('form');
  };

  if (state.items.length === 0) {
    return (
      <>
        <div className="bg-gradient-to-b from-gray-800 via-gray-400 to-white text-black">
          <Breadcrumb
            pageName="Checkout"
            description="Il tuo carrello è vuoto"
          />
        </div>

        <div className="bg-gradient-to-b from-white via-orange-100 to-orange-400 text-black">
          <section className="py-16 lg:py-20">
            <div className="container">
              <div className="text-center py-12">
                <h1 className="text-3xl font-bold text-black mb-4">
                  Carrello vuoto
                </h1>
                <p className="text-black/80 text-lg mb-8">
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
      {/* Breadcrumb Section */}
      <div className="bg-gradient-to-b from-gray-800 via-gray-400 to-white text-black">
        <Breadcrumb
          pageName="Checkout"
          description="Completa il tuo ordine"
        />
      </div>

      {/* Checkout Content */}
      <div className="bg-gradient-to-b from-white via-orange-100 to-orange-400 text-black">
        <section className="py-16 lg:py-20">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-black sm:text-4xl lg:text-5xl mb-4">
                  Checkout
                </h1>
                <p className="text-black/80 text-lg">
                  Completa il tuo ordine inserendo i dati di spedizione e pagamento
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Checkout Content */}
                <div className="lg:col-span-2 space-y-8">
                  {currentStep === 'form' && (
                    <>
                      {/* Validation Errors */}
                      {validationErrors.length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <h3 className="text-red-800 font-medium mb-2">Errori di validazione:</h3>
                          <ul className="text-red-700 text-sm space-y-1">
                            {validationErrors.map((error, index) => (
                              <li key={index}>• {error}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <form onSubmit={handleFormSubmit} className="space-y-8">
                        {/* Personal Information */}
                        <div className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-lg shadow-lg p-6">
                          <h2 className="text-xl font-bold text-black mb-6">
                            Informazioni Personali
                          </h2>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nome *
                              </label>
                              <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Cognome *
                              </label>
                              <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email *
                              </label>
                              <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Telefono *
                              </label>
                              <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-lg shadow-lg p-6">
                          <h2 className="text-xl font-bold text-black mb-6">
                            Indirizzo di Spedizione
                          </h2>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Indirizzo *
                              </label>
                              <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                              />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Città *
                                </label>
                                <input
                                  type="text"
                                  name="city"
                                  value={formData.city}
                                  onChange={handleInputChange}
                                  required
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  CAP *
                                </label>
                                <input
                                  type="text"
                                  name="postalCode"
                                  value={formData.postalCode}
                                  onChange={handleInputChange}
                                  required
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Paese *
                                </label>
                                <input
                                  type="text"
                                  name="country"
                                  value={formData.country}
                                  onChange={handleInputChange}
                                  required
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Next Step Button */}
                        <div className="flex justify-end">
                          <button
                            type="submit"
                            className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                          >
                            Procedi al Pagamento
                          </button>
                        </div>
                      </form>
                    </>
                  )}

                  {currentStep === 'payment' && (
                    <CheckoutWithPayment
                      customer={{
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        email: formData.email,
                        phone: formData.phone,
                      }}
                      shippingAddress={{
                        address: formData.address,
                        city: formData.city,
                        postalCode: formData.postalCode,
                        country: formData.country,
                      }}
                      onBack={handleBackToForm}
                    />
                  )}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-lg shadow-lg p-6 sticky top-4">
                    <h2 className="text-xl font-bold text-black mb-6">
                      Riepilogo Ordine
                    </h2>

                    {/* Order Items */}
                    <div className="space-y-4 mb-6">
                      {state.items.map((item) => (
                        <div key={item.product._id} className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-xs text-gray-500">IMG</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-black truncate">
                              {item.product.title}
                            </h4>
                            <p className="text-xs text-gray-600">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <span className="text-sm font-medium">
                            €{(item.product.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Order Totals */}
                    <div className="border-t pt-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotale:</span>
                        <span className="font-medium">€{state.total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Spese di spedizione:</span>
                        <span className="font-medium">€5.00</span>
                      </div>
                      <div className="border-t pt-3">
                        <div className="flex justify-between">
                          <span className="text-lg font-bold text-black">Totale:</span>
                          <span className="text-lg font-bold text-primary">€{(state.total + 5).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {currentStep === 'form' && (
                      <Link
                        href="/shop/cart"
                        className="w-full mt-6 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-center block"
                      >
                        Torna al Carrello
                      </Link>
                    )}
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
