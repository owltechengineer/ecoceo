"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Breadcrumb from "@/components/Common/Breadcrumb";
import CustomerPortal from "@/components/Shop/CustomerPortal";
import Link from 'next/link';

const SubscriptionSuccessContent = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [subscriptionDetails, setSubscriptionDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      // Here you could fetch subscription details from your backend
      // For now, we'll just simulate loading
      setTimeout(() => {
        setSubscriptionDetails({
          id: 'sub_' + Math.random().toString(36).substr(2, 9),
          status: 'active',
          plan: 'Piano Pro',
          nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('it-IT'),
        });
        setLoading(false);
      }, 1000);
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-lg text-gray-600">Caricamento dettagli abbonamento...</p>
      </div>
    );
  }

  return (
    <>
      {/* Breadcrumb Section */}
      <div className="bg-gradient-to-b from-gray-800 via-gray-400 to-white text-black">
        <Breadcrumb
          pageName="Abbonamento Attivato"
          description="Il tuo abbonamento è stato attivato con successo"
        />
      </div>

      {/* Success Content */}
      <div className="bg-gradient-to-b from-white via-orange-100 to-orange-400 text-black">
        <section className="py-16 lg:py-20">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              {/* Success Message */}
              <div className="text-center mb-12">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Abbonamento Attivato!
                </h1>
                <p className="text-xl text-gray-600">
                  Grazie per esserti abbonato. Il tuo piano è ora attivo.
                </p>
              </div>

              {/* Subscription Details */}
              {subscriptionDetails && (
                <div className="bg-white/30 backdrop-blurrounded-2xl shadow-lg p-8 mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Dettagli Abbonamento
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">
                        Piano
                      </h3>
                      <p className="text-lg font-semibold text-gray-900">
                        {subscriptionDetails.plan}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">
                        Status
                      </h3>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {subscriptionDetails.status}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">
                        ID Abbonamento
                      </h3>
                      <p className="text-sm font-mono text-gray-900">
                        {subscriptionDetails.id}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">
                        Prossima Fatturazione
                      </h3>
                      <p className="text-lg font-semibold text-gray-900">
                        {subscriptionDetails.nextBilling}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Customer Portal */}
              {sessionId && (
                <div className="mb-8">
                  <CustomerPortal sessionId={sessionId} />
                </div>
              )}

              {/* Next Steps */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">
                  Prossimi Passi
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-sm font-bold">1</span>
                    </div>
                    <div className="ml-3">
                      <h4 className="font-medium text-blue-900">Riceverai un'email di conferma</h4>
                      <p className="text-blue-700 text-sm">Controlla la tua casella email per i dettagli dell'abbonamento.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-sm font-bold">2</span>
                    </div>
                    <div className="ml-3">
                      <h4 className="font-medium text-blue-900">Accedi alle funzionalità premium</h4>
                      <p className="text-blue-700 text-sm">Ora puoi utilizzare tutte le funzionalità del tuo piano.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-sm font-bold">3</span>
                    </div>
                    <div className="ml-3">
                      <h4 className="font-medium text-blue-900">Gestisci il tuo abbonamento</h4>
                      <p className="text-blue-700 text-sm">Usa il portale cliente per gestire fatturazione e impostazioni.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Vai alla Dashboard
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center bg-gray-100 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Torna alla Home
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

const SubscriptionSuccessPage = () => {
  return (
    <Suspense fallback={
      <div className="text-center py-16">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-lg text-gray-600">Caricamento...</p>
      </div>
    }>
      <SubscriptionSuccessContent />
    </Suspense>
  );
};

export default SubscriptionSuccessPage;
