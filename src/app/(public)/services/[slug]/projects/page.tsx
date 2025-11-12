"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { safeFetch } from '@/sanity/lib/client';
import { projectsByServiceQuery, serviceBySlugQuery } from '@/sanity/lib/queries';
import { getTextValue } from '@/sanity/lib/image';
import { useSanityUIComponents } from '@/hooks/useSanityUIComponents';
import SanityStyledComponent from '@/components/Common/SanityStyledComponent';
import Breadcrumb from "@/components/Common/Breadcrumb";
import Projects from "@/components/Projects";
import Link from 'next/link';

const ServiceProjectsPage = () => {
  const params = useParams();
  const serviceSlug = params.slug as string;
  const [service, setService] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getComponent } = useSanityUIComponents();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [serviceData, projectsData] = await Promise.all([
          safeFetch(serviceBySlugQuery, { slug: serviceSlug }),
          safeFetch(projectsByServiceQuery, { serviceSlug })
        ]);
        
        setService(serviceData);
        setProjects(projectsData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (serviceSlug) {
      fetchData();
    }
  }, [serviceSlug]);

  // Get UI components for Service Projects section
  const serviceProjectsTitleComponent = getComponent('ServiceProjectsTitle');
  const serviceProjectsSubtitleComponent = getComponent('ServiceProjectsSubtitle');

  if (loading) {
    return (
      <div className="text-center py-12">
        <p>Caricamento progetti del servizio...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-4">Servizio non trovato</h3>
        <p className="text-gray-600 mb-6">Il servizio che stai cercando non esiste.</p>
        <Link
          href="/services"
          className="inline-block bg-primary text-white px-6 py-3 rounded hover:bg-primary/80 transition"
        >
          Torna ai Servizi
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Breadcrumb Section - Gradiente da grigio scuro a bianco */}
      <div>
        <Breadcrumb
          pageName={`Progetti - ${getTextValue(service.name)}`}
          description={`Scopri i progetti realizzati per il servizio ${getTextValue(service.name)}`}
        />
      </div>

      {/* Service Projects Content - Gradiente da bianco ad arancione intenso */}
      <div className="bg-gradient-to-b from-white via-orange-100 to-orange-400 text-black">
        <section className="py-16 lg:py-20">
          <div className="container">
            <div className="text-center mb-16">
              <SanityStyledComponent
                component={serviceProjectsTitleComponent}
                componentName="ServiceProjectsTitle"
                as="h1"
                className="text-3xl font-bold text-black sm:text-4xl lg:text-5xl mb-4"
              >
                Progetti - {getTextValue(service.name)}
              </SanityStyledComponent>
              
              <SanityStyledComponent
                component={serviceProjectsSubtitleComponent}
                componentName="ServiceProjectsSubtitle"
                as="p"
                className="text-black/80 text-lg max-w-2xl mx-auto mb-8"
              >
                {getTextValue(service.shortDescription)}
              </SanityStyledComponent>
              
              <Link
                href={`/services/${serviceSlug}`}
                className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Torna al servizio
              </Link>
            </div>
            
            {projects.length > 0 ? (
              <Projects 
                projects={projects}
                title={`Progetti Realizzati per ${getTextValue(service.name)}`}
                subtitle={`Scopri i nostri lavori per il servizio ${getTextValue(service.name)}`}
              />
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-4">Nessun progetto disponibile</h3>
                <p className="text-gray-600 mb-6">
                  Al momento non ci sono progetti pubblicati per questo servizio.
                </p>
                <Link
                  href="/projects"
                  className="inline-block bg-primary text-white px-6 py-3 rounded hover:bg-primary/80 transition"
                >
                  Vedi tutti i progetti
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default ServiceProjectsPage;
