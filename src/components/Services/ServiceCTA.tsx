"use client";

import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { safeFetch } from '@/sanity/lib/client';
import { servicesQuery } from '@/sanity/lib/queries';
import { getTextValue } from '@/sanity/lib/image';
import { useState, useEffect } from 'react';

interface ServiceCTAProps {
  title?: string;
  subtitle?: string;
  serviceId?: string; // ID servizio specifico se si vuole evidenziare uno
  shuffle?: boolean; // Se true, randomizza l'ordine dei servizi
  limit?: number; // Limite massimo di servizi da mostrare
}

const ServiceCTA = ({ 
  title = "Hai bisogno di servizi personalizzati?",
  subtitle = "Oltre ai prodotti, offriamo servizi completi per il tuo business. Richiedi un preventivo gratuito!",
  serviceId,
  shuffle = false,
  limit
}: ServiceCTAProps) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const servicesData = await safeFetch(servicesQuery);
        let processedServices = servicesData || [];
        
        // Se shuffle è true, randomizza l'ordine
        if (shuffle && processedServices.length > 0) {
          processedServices = [...processedServices].sort(() => Math.random() - 0.5);
        }
        
        setServices(processedServices);
      } catch (error) {
        console.error('Error fetching services:', error);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [shuffle]);

  if (loading || !services || services.length === 0) {
    return null;
  }

  // Se è specificato un serviceId, mostra solo quello, altrimenti mostra tutti i servizi disponibili
  let displayedServices = serviceId 
    ? services.filter((s: any) => s._id === serviceId || s.slug?.current === serviceId)
    : services; // Mostra tutti i servizi disponibili

  // Applica il limite se specificato
  if (limit && limit > 0) {
    displayedServices = displayedServices.slice(0, limit);
  }

  if (displayedServices.length === 0) {
    return null;
  }

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white/40 via-white/30 to-white/20 backdrop-blur-xl border border-white/20 shadow-xl p-6 md:p-8">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
          {title}
        </h2>
        {subtitle && (
          <p className="text-base text-white/90 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-6 items-stretch">
        {displayedServices.map((service: any, index: number) => (
          <Link
            key={service._id || index}
            href={`/contact?service=${service.slug?.current || service._id}&type=preventivo`}
            data-track="cta"
            data-cta-type="preventivo-page"
            className="group bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg p-4 hover:bg-white/30 hover:border-white/50 transition-all duration-300 hover:scale-105 transform h-full flex flex-col"
          >
            <div className="text-center flex flex-col flex-grow">
              <div className="text-3xl mb-2">{service.icon || "💼"}</div>
              <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2 flex-grow">
                {getTextValue(service.name)}
              </h3>
              <div className="text-primary text-xs font-medium flex items-center justify-center gap-1 group-hover:gap-2 transition-all mt-auto">
                <span>Richiedi</span>
                <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Main CTA Button */}
      <div className="text-center">
        <Link
          href="/contact"
          data-track="cta"
          data-cta-type="preventivo-generale"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-primary via-primary/90 to-primary text-white py-3 px-6 rounded-lg font-bold text-base shadow-lg hover:shadow-xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105 transform"
        >
          <FontAwesomeIcon icon={faFileAlt} className="w-5 h-5" />
          <span>Richiedi Preventivo Gratuito</span>
          <FontAwesomeIcon icon={faArrowRight} className="w-5 h-5" />
        </Link>
        <p className="text-white/70 text-xs mt-3">
          Risposta entro 24 ore • Senza impegno • Preventivo personalizzato
        </p>
      </div>
    </div>
  );
};

export default ServiceCTA;
