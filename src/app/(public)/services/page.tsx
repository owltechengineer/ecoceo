"use client";

import { safeFetch } from '@/sanity/lib/client';
import { servicesQuery } from '@/sanity/lib/queries';
import { getImageUrl, getTextValue } from '@/sanity/lib/image';
import { useSanityUIComponents } from '@/hooks/useSanityUIComponents';
import SanityStyledComponent from '@/components/Common/SanityStyledComponent';
import Breadcrumb from "@/components/Common/Breadcrumb";
import ServiceCTA from "@/components/Services/ServiceCTA";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getComponent } = useSanityUIComponents();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const servicesData = await safeFetch(servicesQuery);
        setServices(servicesData || []);
      } catch (error) {
        console.error('Error fetching services:', error);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Get UI components for Services page
  const servicesPageComponent = getComponent('ServicesPage');
  const serviceCardComponent = getComponent('ServiceCard');
  const serviceTitleComponent = getComponent('ServiceTitle');
  const serviceDescriptionComponent = getComponent('ServiceDescription');

  if (loading) {
    return (
      <>
        {/* Loading Section */}
        <div className="text-white">
          <Breadcrumb
            pageName="I Nostri Servizi"
            description="Caricamento servizi..."
          />
          <section className="py-16 lg:py-20">
            <div className="container">
              <div className="text-center py-12">
                <p>Caricamento servizi...</p>
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
          pageName="I Nostri Servizi"
          description="Scopri tutti i nostri servizi professionali per digitalizzare e far crescere il tuo business"
        />
      </div>

      {/* Services Content */}
      <div className="text-white">
        <section className="py-16 lg:py-20">
          <div className="container">
            {services.length > 0 ? (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                {services.map((service, index) => (
                  <SanityStyledComponent
                    key={service._id || index}
                    component={serviceCardComponent}
                    componentName="ServiceCard"
                    className="h-full"
                  >
                    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/15 bg-white/[0.06] transition-all duration-300 hover:-translate-y-1 hover:border-primary/30">
                      <div className="relative h-48 w-full overflow-hidden bg-black/30">
                        {service.image ? (
                          <Image
                            src={getImageUrl(service.image)}
                            alt={getTextValue(service.name)}
                            fill
                            className="object-cover object-center transition-transform duration-500 hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-white/50 text-sm">
                            Immagine non disponibile
                          </div>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col gap-5 p-6">
                        <SanityStyledComponent
                          component={serviceTitleComponent}
                          componentName="ServiceTitle"
                          as="h3"
                          className="text-xl font-semibold text-white"
                        >
                          {getTextValue(service.name)}
                        </SanityStyledComponent>

                        <SanityStyledComponent
                          component={serviceDescriptionComponent}
                          componentName="ServiceDescription"
                          as="p"
                          className="text-sm text-white/70 leading-relaxed"
                        >
                          {getTextValue(service.shortDescription)}
                        </SanityStyledComponent>

                        {service.features && service.features.length > 0 && (
                          <ul className="space-y-2 text-sm text-white/60">
                            {service.features.slice(0, 3).map((feature, featureIndex) => (
                              <li key={featureIndex} className="flex items-start gap-2">
                                <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                                <span>{getTextValue(feature)}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        <div className="mt-auto flex items-center justify-between pt-4">
                          <Link
                            href={service.url || `/services/${service.slug?.current}`}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                          >
                            Scopri di più
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>

                          <Link
                            href={`/contact?service=${service.slug?.current || service._id}&type=preventivo`}
                            className="text-sm font-semibold text-white/70 underline-offset-4 hover:text-white hover:underline"
                          >
                            Richiedi preventivo
                          </Link>
                        </div>
                      </div>
                    </article>
                  </SanityStyledComponent>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-3">Nessun servizio disponibile</h3>
                <p className="text-white/70 mb-6">Non ci sono servizi attivi al momento.</p>
                <Link
                  href="/studio"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-white transition-colors hover:bg-primary/80"
                >
                  Vai a Sanity Studio
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            )}

            <div className="mt-16">
              <ServiceCTA
                title="Pronto per iniziare il tuo progetto?"
                subtitle="Richiedi un preventivo gratuito e senza impegno per uno dei nostri servizi professionali."
                shuffle
                limit={3}
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ServicesPage;
