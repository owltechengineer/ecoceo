"use client";

import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faFileAlt, faArrowRight, faInfoCircle, faFolder } from '@fortawesome/free-solid-svg-icons';
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
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="animate-pulse overflow-hidden rounded-xl bg-white/[0.06] backdrop-blur-xl shadow-2xl h-full flex flex-col"
          >
            <div className="relative h-56 w-full bg-white/[0.08]" />
            <div className="flex flex-1 flex-col gap-4 p-8">
              <div className="h-6 w-2/3 rounded bg-white/[0.12]" />
              <div className="h-4 w-full rounded bg-white/[0.08]" />
              <div className="h-4 w-5/6 rounded bg-white/[0.08]" />
              <div className="mt-auto grid grid-cols-2 gap-3 pt-6">
                <div className="h-10 rounded-lg bg-white/[0.12]" />
                <div className="h-10 rounded-lg bg-white/[0.12]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!services || services.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-4 text-white">Sezione Servizi</h3>
        <p className="text-white/80 mb-6">Crea i tuoi servizi in Sanity Studio per iniziare.</p>
        <button 
          onClick={() => window.location.href = '/studio'}
          className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/80 transition shadow-lg"
        >
          Vai a Sanity Studio
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
      {services.map((service, index) => {
        const titleText = getTextValue(service.name)?.trim();
        const candidateDescriptions = [
          getTextValue(service.shortDescription),
          getTextValue(service.description),
          getTextValue(service.summary),
        ].filter((value) => value && value.trim().length > 0);

        const descriptionText =
          candidateDescriptions.find(
            (value) => !titleText || value.trim().toLowerCase() !== titleText.toLowerCase()
          ) || candidateDescriptions[0] || "";

        return (
          <SanityStyledComponent
          key={service._id || index}
          component={serviceCardComponent}
          componentName="ServiceCard"
          className="w-full"
        >
          <div className="wow fadeInUp" data-wow-delay={`${index * 100}ms`}>
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white/40 via-white/30 to-white/20 backdrop-blur-xl shadow-2xl duration-500 hover:shadow-2xl hover:shadow-primary/40 hover:scale-[1.03] hover:-translate-y-2 transition-all border border-white/20 hover:border-primary/40 h-full flex flex-col before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/0 before:via-primary/0 before:to-primary/0 hover:before:from-primary/10 hover:before:via-primary/5 hover:before:to-primary/10 before:transition-all before:duration-500 before:pointer-events-none">
              {/* Service Image Header */}
              <div className="relative h-56 overflow-hidden">
                {service.image ? (
                  <Image
                    src={getImageUrl(service.image)}
                    alt={getTextValue(service.name)}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    priority={index < 3}
                  />
                ) : (
                  <div className="w-full h-full bg-white/5 flex items-center justify-center text-white/50 text-xs uppercase tracking-wide">
                    Immagine
                  </div>
                )}
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500"></div>
                
                {/* Badge in alto a destra */}
                {service.featured && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="bg-primary text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm">
                      ⭐ In Evidenza
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-8 flex-grow flex flex-col">
                {/* Service Title */}
                <SanityStyledComponent
                  component={serviceTitleComponent}
                  componentName="ServiceTitle"
                  as="h3"
                  className="text-2xl font-bold text-white group-hover:text-primary transition-colors duration-300 mb-4 leading-tight"
                >
                  {titleText || "Servizio"}
                </SanityStyledComponent>
                
                {/* Description */}
                <SanityStyledComponent
                  component={serviceDescriptionComponent}
                  componentName="ServiceDescription"
                  as="p"
                  className="mb-6 text-base text-white/90 leading-relaxed flex-grow line-clamp-3"
                >
                  {descriptionText}
                </SanityStyledComponent>

                {/* Features */}
                {service.features && service.features.length > 0 && (
                  <div className="mb-6">
                    <ul className="space-y-2.5">
                      {service.features.slice(0, 3).map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-white/90">
                          <FontAwesomeIcon icon={faCheck} className="mr-3 h-5 w-5 text-black flex-shrink-0" />
                          <span className="line-clamp-1">{getTextValue(feature)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* CTA Buttons */}
                <div className="mt-auto pt-6 space-y-3">
                  {/* Primary CTA - Richiesta Preventivo */}
                  <Link
                    href={`/contact?service=${service.slug?.current || service._id}&type=preventivo`}
                    data-track="cta"
                    data-cta-type="preventivo"
                    className="group/btn w-full bg-gradient-to-r from-primary via-primary/90 to-primary text-white py-4 px-6 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:shadow-primary/50 transition-all duration-300 flex items-center justify-center gap-3 hover:scale-105 transform"
                  >
                    <FontAwesomeIcon icon={faFileAlt} className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                    <span>Richiedi Preventivo</span>
                    <FontAwesomeIcon icon={faArrowRight} className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>

                  {/* Secondary CTAs */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Approfondisci */}
                    <Link
                      href={service.url || `/services/${service.slug?.current}`}
                      data-track="cta"
                      data-cta-type="approfondisci"
                      className="group/btn bg-white/20 backdrop-blur-sm text-white py-3 px-4 rounded-lg font-semibold shadow-lg hover:bg-white/30 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                    >
                      <FontAwesomeIcon icon={faInfoCircle} className="w-4 h-4 text-black" />
                      <span>Approfondisci</span>
                    </Link>

                    {/* Progetti */}
                    <Link
                      href={`/projects${service.slug?.current ? `?service=${service.slug.current}` : ''}`}
                      data-track="cta"
                      data-cta-type="progetti"
                      className="group/btn bg-white/20 backdrop-blur-sm text-white py-3 px-4 rounded-lg font-semibold shadow-lg hover:bg-white/30 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                      aria-label={`Vedi i progetti correlati al servizio ${getTextValue(service.name)}`}
                    >
                      <FontAwesomeIcon icon={faFolder} className="w-4 h-4 text-black" />
                      <span>{`Progetti ${getTextValue(service.name)}`}</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SanityStyledComponent>
        );
      })}
    </div>
  );
};

export default Services;
