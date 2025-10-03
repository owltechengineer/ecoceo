"use client";

import Link from "next/link";
import Image from "next/image";
import { safeFetch } from '@/sanity/lib/client';
import { homepageServicesQuery } from '@/sanity/lib/queries';
import { getImageUrl, getTextValue } from '@/sanity/lib/image';
import { useSanityUIComponents } from '@/hooks/useSanityUIComponents';
import SanityStyledComponent from '@/components/Common/SanityStyledComponent';
import { useState, useEffect } from 'react';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getComponent } = useSanityUIComponents();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const servicesData = await safeFetch(homepageServicesQuery);
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

  // Get UI components for Services section
  const servicesSectionComponent = getComponent('ServicesSection');
  const serviceCardComponent = getComponent('ServiceCard');
  const serviceTitleComponent = getComponent('ServiceTitle');
  const serviceDescriptionComponent = getComponent('ServiceDescription');

  if (loading) {
    return (
      <div className="text-center py-12">
        <p>Caricamento servizi...</p>
      </div>
    );
  }

  if (!services || services.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-4">Sezione Servizi</h3>
        <p className="text-gray-600 mb-6">Crea i tuoi servizi in Sanity Studio per iniziare.</p>
        <button 
          onClick={() => window.location.href = '/studio'}
          className="inline-block bg-primary text-white px-6 py-3 rounded hover:bg-primary/80 transition"
        >
          Vai a Sanity Studio
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
      {services.map((service, index) => (
        <SanityStyledComponent
          key={service._id || index}
          component={serviceCardComponent}
          componentName="ServiceCard"
          className="w-full"
        >
          <div className="wow fadeInUp" data-wow-delay={`${index * 100}ms`}>
            <div className="group relative overflow-hidden rounded-sm bg-white/30 backdrop-blur/30 backdrop-blurshadow-one duration-300 hover:shadow-two dark:bg-dark dark:hover:shadow-gray-dark">
              <div className="p-8">
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
  );
};

export default Services;
