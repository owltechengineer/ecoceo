"use client";

import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faFileAlt } from "@fortawesome/free-solid-svg-icons";
import { safeFetch } from "@/sanity/lib/client";
import { servicesQuery } from "@/sanity/lib/queries";
import { getImageUrl, getTextValue } from "@/sanity/lib/image";
import { useState, useEffect } from "react";

interface ServiceCTAProps {
  title?: string;
  subtitle?: string;
  serviceId?: string;
  shuffle?: boolean;
  limit?: number;
}

const ServiceCTA = ({
  title = "Servizi su misura per la tua crescita",
  subtitle = "Dalla prototipazione al go-to-market: affianciamo il tuo business con un supporto end-to-end.",
  serviceId,
  shuffle = false,
  limit,
}: ServiceCTAProps) => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const servicesData = await safeFetch(servicesQuery);
        let processedServices = servicesData || [];

        if (shuffle && processedServices.length > 0) {
          processedServices = [...processedServices].sort(() => Math.random() - 0.5);
        }

        setServices(processedServices);
      } catch (error) {
        console.error("Error fetching services:", error);
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

  let displayedServices = serviceId
    ? services.filter((s: any) => s._id === serviceId || s.slug?.current === serviceId)
    : services;

  if (limit && limit > 0) {
    displayedServices = displayedServices.slice(0, limit);
  }

  if (displayedServices.length === 0) {
    return null;
  }

  return (
    <div className="rounded-3xl border border-white/15 bg-white/[0.03] p-8 md:p-10">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            Servizi end-to-end
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-base text-white/80 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        <div className="w-full lg:w-auto rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4 text-sm text-white/80">
          Risposta entro 24 ore • Preventivo su misura • Nessun impegno
        </div>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {displayedServices.map((service: any, index: number) => (
          <Link
            key={service._id || index}
            href={`/contact?service=${service.slug?.current || service._id}&type=preventivo`}
            data-track="cta"
            data-cta-type="preventivo-page"
            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/15 bg-white/[0.05] transition-all duration-300 hover:-translate-y-1 hover:border-primary/40"
          >
            <div className="relative h-40 w-full overflow-hidden bg-black/30">
              {service.image ? (
                <Image
                  src={getImageUrl(service.image)}
                  alt={getTextValue(service.name)}
                  fill
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-white/50 text-sm">
                  Immagine non disponibile
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col gap-3 p-6">
              <h3 className="text-lg font-semibold text-white">
                {getTextValue(service.name)}
              </h3>
              {service.shortDescription && (
                <p className="text-sm text-white/70 leading-relaxed line-clamp-3">
                  {getTextValue(service.shortDescription)}
                </p>
              )}

              <div className="mt-auto flex items-center gap-2 text-sm font-semibold text-primary">
                <span>Richiedi preventivo</span>
                <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-6 text-white md:flex-row">
        <div className="space-y-1 text-center md:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            Pronto a partire?
          </p>
          <h3 className="text-lg font-semibold text-white">
            Richiedi una consulenza dedicata con il nostro team tecnico
          </h3>
        </div>

        <div className="flex flex-col items-center gap-3 md:flex-row">
          <Link
            href="/contact"
            data-track="cta"
            data-cta-type="preventivo-generale"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105"
          >
            <FontAwesomeIcon icon={faFileAlt} className="w-5 h-5" />
            <span>Richiedi preventivo gratuito</span>
            <FontAwesomeIcon icon={faArrowRight} className="w-5 h-5" />
          </Link>
          <p className="text-xs text-white/60">
            Risposta in 24h • Nessun impegno • Supporto personalizzato
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServiceCTA;
