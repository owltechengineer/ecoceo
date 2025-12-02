"use client";

import { safeFetch } from '@/sanity/lib/client';
import { serviceBySlugQuery, projectsByServiceQuery } from '@/sanity/lib/queries';
import { getImageUrl, getTextValue } from '@/sanity/lib/image';
import { useSanityUIComponents } from '@/hooks/useSanityUIComponents';
import SanityStyledComponent from '@/components/Common/SanityStyledComponent';
import Breadcrumb from "@/components/Common/Breadcrumb";
import { PortableText } from '@portabletext/react';
import SingleProject from '@/components/Projects/SingleProject';
import Link from 'next/link';
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
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(true);
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

  useEffect(() => {
    const fetchProjects = async () => {
      if (slug) {
        try {
          const projectsData = await safeFetch(projectsByServiceQuery, { serviceSlug: slug });
          setProjects(projectsData || []);
        } catch (error) {
          console.error('Error fetching projects:', error);
          setProjects([]);
        } finally {
          setProjectsLoading(false);
        }
      }
    };

    if (slug) {
      fetchProjects();
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
          pageName={getTextValue(service.name) || getTextValue(service.title)}
          description={getTextValue(service.description) || getTextValue(service.shortDescription)}
        />
      </div>

      {/* Service Content */}
      <div className="text-white">
        <section className="py-16 lg:py-20">
          <div className="container max-w-7xl">
            {/* Header con immagine e titolo */}
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-2 mb-16">
              {/* Service Image */}
              <div className="wow fadeInUp" data-wow-delay=".2s">
                <div className="relative mx-auto max-w-[500px] lg:mr-0">
                  {service.image ? (
                    <Image
                      src={getImageUrl(service.image)}
                      alt={getTextValue(service.name) || getTextValue(service.title)}
                      width={600}
                      height={400}
                      className="mx-auto max-w-full lg:mr-0 rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500 text-4xl">💼</span>
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
                  {getTextValue(service.name) || getTextValue(service.title)}
                </SanityStyledComponent>

                {/* Descrizione breve */}
                {(service.description || service.shortDescription) && (
                  <div className="mb-8">
                    <p className="text-xl text-white/90 leading-relaxed font-medium">
                      {getTextValue(service.description) || getTextValue(service.shortDescription)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Sezioni Contenuto Personalizzate - Larghezza piena */}
            {service.sections && service.sections.length > 0 ? (
              <div className="mb-12 space-y-16 w-full">
                {service.sections.map((section, index) => (
                  <div key={index} className="border-t border-white/10 pt-12 w-full">
                        {/* Titolo sezione */}
                        {section.title && (
                          <h2 className="text-3xl font-bold text-white mb-8">
                            {section.title}
                          </h2>
                        )}
                        
                        {/* Layout: Testo sopra, Immagini sotto */}
                        {section.layout === 'text-top' && (
                          <>
                            {section.content && (
                              <div className="mb-8 prose prose-invert prose-lg max-w-none w-full">
                                <div className="text-white/80 leading-relaxed">
                                  <PortableText value={section.content} />
                                </div>
                              </div>
                            )}
                            {section.images && section.images.length > 0 && (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                                {section.images.map((img, imgIndex) => (
                                  <div 
                                    key={imgIndex} 
                                    className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
                                  >
                                    <div className="relative w-full aspect-square">
                                      <Image
                                        src={getImageUrl(img)}
                                        alt={img.alt || `${section.title || 'Sezione'} - Immagine ${imgIndex + 1}`}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                      />
                                    </div>
                                    {img.caption && (
                                      <p className="mt-2 text-sm text-white/60 text-center">{img.caption}</p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </>
                        )}
                        
                        {/* Layout: Immagini sopra, Testo sotto */}
                        {section.layout === 'images-top' && (
                          <>
                            {section.images && section.images.length > 0 && (
                              <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                                {section.images.map((img, imgIndex) => (
                                  <div 
                                    key={imgIndex} 
                                    className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
                                  >
                                    <div className="relative w-full aspect-square">
                                      <Image
                                        src={getImageUrl(img)}
                                        alt={img.alt || `${section.title || 'Sezione'} - Immagine ${imgIndex + 1}`}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                      />
                                    </div>
                                    {img.caption && (
                                      <p className="mt-2 text-sm text-white/60 text-center">{img.caption}</p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                            {section.content && (
                              <div className="prose prose-invert prose-lg max-w-none w-full">
                                <div className="text-white/80 leading-relaxed">
                                  <PortableText value={section.content} />
                                </div>
                              </div>
                            )}
                          </>
                        )}
                        
                        {/* Layout: Testo e Immagini Separate (side by side) */}
                        {section.layout === 'separate' && (
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {section.content && (
                              <div className="prose prose-invert prose-lg max-w-none w-full">
                                <div className="text-white/80 leading-relaxed">
                                  <PortableText value={section.content} />
                                </div>
                              </div>
                            )}
                            {section.images && section.images.length > 0 && (
                              <div className="grid grid-cols-1 gap-6 w-full">
                                {section.images.map((img, imgIndex) => (
                                  <div 
                                    key={imgIndex} 
                                    className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 w-full"
                                  >
                                    <div className="relative w-full aspect-video">
                                      <Image
                                        src={getImageUrl(img)}
                                        alt={img.alt || `${section.title || 'Sezione'} - Immagine ${imgIndex + 1}`}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                                      />
                                    </div>
                                    {img.caption && (
                                      <p className="mt-2 text-sm text-white/60">{img.caption}</p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Layout: Solo Testo */}
                        {section.layout === 'text-only' && section.content && (
                          <div className="prose prose-invert prose-lg max-w-none w-full">
                            <div className="text-white/80 leading-relaxed">
                              <PortableText value={section.content} />
                            </div>
                          </div>
                        )}
                        
                        {/* Layout: Solo Immagini */}
                        {section.layout === 'images-only' && section.images && section.images.length > 0 && (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                            {section.images.map((img, imgIndex) => (
                              <div 
                                key={imgIndex} 
                                className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
                              >
                                <div className="relative w-full aspect-square">
                                  <Image
                                    src={getImageUrl(img)}
                                    alt={img.alt || `${section.title || 'Sezione'} - Immagine ${imgIndex + 1}`}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                  />
                                </div>
                                {img.caption && (
                                  <p className="mt-2 text-sm text-white/60 text-center">{img.caption}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    {/* Fallback: Descrizione completa legacy */}
                    {service.fullDescription && (
                      <div className="mb-8 prose prose-invert prose-lg max-w-none">
                        <div className="text-white/80 leading-relaxed">
                          <PortableText value={service.fullDescription} />
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div className="flex flex-col sm:flex-row gap-4">
                    <a
                    href="/contact"
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
            </section>

        {/* Progetti Collegati */}
        {projects.length > 0 && (
          <section className="py-16 lg:py-20 border-t border-white/10">
            <div className="container">
              <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold text-white mb-4 sm:text-4xl lg:text-5xl">
                  Progetti Realizzati
                </h2>
                <p className="text-white/70 text-lg max-w-2xl mx-auto">
                  Scopri i progetti che abbiamo realizzato per questo servizio
                </p>
              </div>

              {projectsLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                  <p className="text-white/80">Caricamento progetti...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {projects.map((project, index) => (
                    <SingleProject key={project._id} project={project} index={index} />
                  ))}
                </div>
              )}

              {projects.length > 0 && (
                <div className="mt-12 text-center">
                  <Link
                    href={`/services/${slug}/projects`}
                    className="inline-flex items-center justify-center rounded-sm bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 text-base font-semibold duration-300 ease-in-out border border-white/20"
                  >
                    Vedi tutti i progetti
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
                  </Link>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default ServicePage;
