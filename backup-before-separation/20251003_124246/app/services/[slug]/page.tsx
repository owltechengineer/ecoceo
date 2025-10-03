"use client";

import { safeFetch } from '@/sanity/lib/client';
import { serviceBySlugQuery } from '@/sanity/lib/queries';
import { getImageUrl, getTextValue } from '@/sanity/lib/image';
import { useSanityUIComponents } from '@/hooks/useSanityUIComponents';
import SanityStyledComponent from '@/components/Common/SanityStyledComponent';
import Breadcrumb from "@/components/Common/Breadcrumb";
import { useState, useEffect } from 'react';
import { use } from 'react';
import Image from 'next/image';

interface ServicePageProps {
  params: Promise<{
    slug: string;
  }>;
}

const ServicePage = ({ params }: ServicePageProps) => {
  const { slug } = use(params);
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const { getComponent } = useSanityUIComponents();

  useEffect(() => {
    const fetchService = async () => {
      try {
        const serviceData = await safeFetch(serviceBySlugQuery, { slug });
        setService(serviceData);
      } catch (error) {
        console.error('Error fetching service:', error);
        setService(null);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchService();
    }
  }, [slug]);

  // Get UI components for Service page
  const servicePageComponent = getComponent('ServicePage');
  const serviceTitleComponent = getComponent('ServiceTitle');
  const serviceDescriptionComponent = getComponent('ServiceDescription');
  const serviceFeaturesComponent = getComponent('ServiceFeatures');

  if (loading) {
    return (
      <>
        {/* Loading Section */}
        <div className="text-white">
          <Breadcrumb
            pageName="Servizio"
            description="Caricamento servizio..."
          />
          <section className="py-16 lg:py-20">
            <div className="container">
              <div className="text-center py-12">
                <p>Caricamento servizio...</p>
              </div>
            </div>
          </section>
        </div>
      </>
    );
  }

  if (!service) {
    return (
      <>
        {/* Error Section */}
        <div className="text-white">
          <Breadcrumb
            pageName="Servizio Non Trovato"
            description="Il servizio richiesto non esiste o non è disponibile."
          />
          <section className="py-16 lg:py-20">
            <div className="container">
              <div className="text-center py-12">
                <h1 className="text-3xl font-bold text-white mb-4">
                  Servizio Non Trovato
                </h1>
                <p className="text-white/80 text-lg mb-8">
                  Il servizio che stai cercando non esiste o non è più disponibile.
                </p>
                <a
                  href="/"
                  className="inline-block bg-primary text-white px-8 py-3 rounded hover:bg-primary/80 transition"
                >
                  Torna alla Home
                </a>
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
          pageName={getTextValue(service.name)}
          description={getTextValue(service.shortDescription)}
        />
      </div>

      {/* Service Content */}
      <div className="text-white">
        <section className="py-16 lg:py-20">
          <div className="container">
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-2">
              {/* Service Image */}
              <div className="wow fadeInUp" data-wow-delay=".2s">
                <div className="relative mx-auto max-w-[500px] lg:mr-0">
                  {service.image ? (
                    <Image
                      src={getImageUrl(service.image)}
                      alt={getTextValue(service.name)}
                      width={600}
                      height={400}
                      className="mx-auto max-w-full lg:mr-0 rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500 text-4xl">{service.icon || "💼"}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Service Content */}
              <div className="wow fadeInUp" data-wow-delay=".4s">
                <SanityStyledComponent
                  component={serviceTitleComponent}
                  componentName="ServiceTitle"
                  as="h1"
                  className="mb-6 text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
                >
                  {getTextValue(service.name)}
                </SanityStyledComponent>

                <SanityStyledComponent
                  component={serviceDescriptionComponent}
                  componentName="ServiceDescription"
                  as="p"
                  className="mb-8 text-lg leading-relaxed text-white/80"
                >
                  {getTextValue(service.fullDescription || service.shortDescription)}
                </SanityStyledComponent>

                {service.features && service.features.length > 0 && (
                  <SanityStyledComponent
                    component={serviceFeaturesComponent}
                    componentName="ServiceFeatures"
                    as="div"
                    className="mb-8"
                  >
                    <h3 className="mb-4 text-xl font-bold text-white">
                      Caratteristiche Principali
                    </h3>
                    <ul className="space-y-3">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-white/80">
                          <svg
                            className="mr-3 h-5 w-5 text-primary flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {getTextValue(feature)}
                        </li>
                      ))}
                    </ul>
                  </SanityStyledComponent>
                )}

                <div className="flex flex-col sm:flex-row gap-4">
                  {service.url && (
                    <a
                      href={getTextValue(service.url)}
                      className="inline-flex items-center justify-center rounded-sm bg-primary px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:bg-primary/90"
                    >
                      Richiedi Preventivo
                      <svg
                        className="ml-2 h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </a>
                  )}
                  <a
                    href={`/services/${slug}/projects`}
                    className="inline-flex items-center justify-center rounded-sm bg-gray-800 px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:bg-gray-900"
                  >
                    Vedi i Progetti
                    <svg
                      className="ml-2 h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </a>
                  <a
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-sm border border-primary px-8 py-4 text-base font-semibold text-primary duration-300 ease-in-out hover:bg-primary hover:text-white"
                  >
                    Contattaci
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ServicePage;
