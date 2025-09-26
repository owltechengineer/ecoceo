"use client";

import { safeFetch } from '@/sanity/lib/client';
import { servicesQuery } from '@/sanity/lib/queries';
import { getImageUrl, getTextValue } from '@/sanity/lib/image';
import { useSanityUIComponents } from '@/hooks/useSanityUIComponents';
import SanityStyledComponent from '@/components/Common/SanityStyledComponent';
import Breadcrumb from "@/components/Common/Breadcrumb";
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
            {/* Page Header */}
            <div className="text-center mb-16">
              <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl mb-4">
                I Nostri Servizi
              </h1>
              <p className="text-white/80 text-lg max-w-2xl mx-auto">
                Soluzioni complete e personalizzate per trasformare la tua presenza digitale e raggiungere i tuoi obiettivi di business.
              </p>
            </div>

            {/* Services Grid */}
            {services.length > 0 ? (
              <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
                {services.map((service, index) => (
                  <SanityStyledComponent
                    key={service._id || index}
                    component={serviceCardComponent}
                    componentName="ServiceCard"
                    className="w-full"
                  >
                    <div className="wow fadeInUp" data-wow-delay={`${index * 100}ms`}>
                      <div className="group relative overflow-hidden rounded-sm bg-white/30 backdrop-blurshadow-one duration-300 hover:shadow-two dark:bg-dark dark:hover:shadow-gray-dark">
                        {/* Service Image */}
                        <div className="relative h-48 overflow-hidden">
                          {service.image ? (
                            <Image
                              src={getImageUrl(service.image)}
                              alt={getTextValue(service.name)}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500 text-6xl">{service.icon || "💼"}</span>
                            </div>
                          )}
                        </div>

                        <div className="p-8">
                          {/* Service Icon */}
                          <div className="mb-6 flex h-[70px] w-[70px] items-center justify-center rounded-md bg-primary bg-opacity-10 text-4xl">
                            {service.icon || "💼"}
                          </div>
                          
                          <SanityStyledComponent
                            component={serviceTitleComponent}
                            componentName="ServiceTitle"
                            as="h3"
                            className="mb-4 text-xl font-bold text-dark dark:text-white"
                          >
                            {getTextValue(service.name)}
                          </SanityStyledComponent>
                          
                          <SanityStyledComponent
                            component={serviceDescriptionComponent}
                            componentName="ServiceDescription"
                            as="p"
                            className="mb-6 text-base text-body-color dark:text-body-color-dark"
                          >
                            {getTextValue(service.shortDescription)}
                          </SanityStyledComponent>

                          {service.features && service.features.length > 0 && (
                            <div className="mb-6">
                              <ul className="space-y-2">
                                {service.features.slice(0, 3).map((feature, featureIndex) => (
                                  <li key={featureIndex} className="flex items-center text-sm text-body-color dark:text-body-color-dark">
                                    <svg
                                      className="mr-2 h-4 w-4 text-primary"
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
                            </div>
                          )}

                          <Link
                            href={service.url || `/services/${service.slug?.current}`}
                            className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-200"
                          >
                            Scopri di più
                            <svg
                              className="ml-1 h-4 w-4"
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
                          </Link>
                        </div>
                      </div>
                    </div>
                  </SanityStyledComponent>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-4">Nessun Servizio Disponibile</h3>
                <p className="text-gray-600 mb-6">Non ci sono servizi attivi al momento.</p>
                <button 
                  onClick={() => window.location.href = '/studio'}
                  className="inline-block bg-primary text-white px-6 py-3 rounded hover:bg-primary/80 transition"
                >
                  Vai a Sanity Studio
                </button>
              </div>
            )}

            {/* CTA Section */}
            <div className="mt-16 text-center">
              <div className="rounded-sm bg-primary bg-opacity-5 p-8 dark:bg-opacity-10">
                <h2 className="mb-4 text-2xl font-bold text-black dark:text-white">
                  Hai un Progetto Specifico?
                </h2>
                <p className="mb-6 text-body-color dark:text-body-color-dark">
                  Contattaci per discutere delle tue esigenze e trovare la soluzione perfetta per il tuo business.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-sm bg-primary px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:bg-primary/90"
                  >
                    Contattaci Ora
                  </a>
                  <a
                    href="/about"
                    className="inline-flex items-center justify-center rounded-sm border border-primary px-8 py-4 text-base font-semibold text-primary duration-300 ease-in-out hover:bg-primary hover:text-white"
                  >
                    Chi Siamo
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

export default ServicesPage;
