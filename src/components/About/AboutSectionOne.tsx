"use client";

import Image from "next/image";
import SectionTitle from "../Common/SectionTitle";
import { safeFetch } from '@/sanity/lib/client';
import { aboutQuery } from '@/sanity/lib/queries';
import { getImageUrl, getTextValue } from '@/sanity/lib/image';
import { useSanityUIComponents } from '@/hooks/useSanityUIComponents';
import SanityStyledComponent from '@/components/Common/SanityStyledComponent';
import { useState, useEffect } from 'react';

const checkIcon = (
  <svg width="16" height="13" viewBox="0 0 16 13" className="fill-current">
    <path d="M5.8535 12.6631C5.65824 12.8584 5.34166 12.8584 5.1464 12.6631L0.678505 8.1952C0.483242 7.99994 0.483242 7.68336 0.678505 7.4881L2.32921 5.83739C2.52467 5.64193 2.84166 5.64216 3.03684 5.83791L5.14622 7.95354C5.34147 8.14936 5.65859 8.14952 5.85403 7.95388L13.3797 0.420561C13.575 0.22513 13.8917 0.225051 14.087 0.420383L15.7381 2.07143C15.9333 2.26669 15.9333 2.58327 15.7381 2.77854L5.8535 12.6631Z" />
  </svg>
);

const AboutSectionOne = () => {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);
  const { getComponent } = useSanityUIComponents();

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        // Check if Sanity environment variables are configured
        const hasSanityConfig = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && 
                               process.env.NEXT_PUBLIC_SANITY_DATASET;
        
        if (!hasSanityConfig) {
          console.warn('Sanity environment variables not configured. Using fallback content.');
          setAbout(null);
          setLoading(false);
          return;
        }

        const aboutData = await safeFetch(aboutQuery);
        setAbout(aboutData);
      } catch (error) {
        console.error('Error fetching about data:', error);
        setAbout(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAbout();
  }, []);

  // Get UI components for About section
  const aboutSectionComponent = getComponent('AboutSection');
  const aboutTitleComponent = getComponent('AboutTitle');
  const aboutDescriptionComponent = getComponent('AboutDescription');
  const aboutFeatureComponent = getComponent('AboutFeature');

  const List = ({ text, icon }) => (
    <SanityStyledComponent
      component={aboutFeatureComponent}
      componentName="AboutFeature"
      as="p"
      className="text-body-color mb-5 flex items-center text-lg font-medium"
    >
      <span className="bg-primary/10 text-primary mr-4 flex h-[30px] w-[30px] items-center justify-center rounded-md">
        {icon || checkIcon}
      </span>
      {getTextValue(text)}
    </SanityStyledComponent>
  );

  if (loading) {
    return (
      <div className="text-center py-12">
        <p>Caricamento sezione About...</p>
      </div>
    );
  }

  if (!about) {
    return (
      <div className="border-b border-body-color/[.15] pb-16 dark:border-white/[.15] md:pb-20 lg:pb-28">
        <div className="container">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-2">
            <div className="wow fadeInUp" data-wow-delay=".1s">
              <h2 className="mb-5 text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight lg:text-2xl xl:text-3xl">
                Chi Siamo
              </h2>
              <p className="mb-5 text-base leading-relaxed text-body-color sm:text-lg sm:leading-relaxed">
                Siamo un team di professionisti esperti e appassionati, uniti dalla passione per la tecnologia e dall'obiettivo comune di creare soluzioni digitali che facciano la differenza.
              </p>
              <p className="mb-8 text-base leading-relaxed text-body-color sm:text-lg sm:leading-relaxed">
                La nostra missione è quella di aiutare le aziende a crescere nel mondo digitale attraverso soluzioni innovative e personalizzate. Crediamo che ogni business abbia un potenziale unico che può essere espresso attraverso la tecnologia.
              </p>
              
              <div className="mb-8 flex flex-col space-y-4">
                <div className="flex items-center">
                  <span className="bg-primary/10 text-primary mr-4 flex h-[30px] w-[30px] items-center justify-center rounded-md">
                    <svg width="16" height="13" viewBox="0 0 16 13" className="fill-current">
                      <path d="M5.8535 12.6631C5.65824 12.8584 5.34166 12.8584 5.1464 12.6631L0.678894 8.19561C0.48263 7.99934 0.48263 7.68276 0.678894 7.4875L1.8535 6.31288C2.04876 6.11762 2.36534 6.11762 2.5606 6.31288L5.5 9.25228L13.4394 1.31288C13.6347 1.11762 13.9512 1.11762 14.1465 1.31288L15.3211 2.4875C15.5164 2.68276 15.5164 2.99934 15.3211 3.19461L5.8535 12.6631Z" />
                    </svg>
                  </span>
                  <p className="text-body-color mb-0 flex items-center text-lg font-medium">
                    Innovazione e Qualità
                  </p>
                </div>
                
                <div className="flex items-center">
                  <span className="bg-primary/10 text-primary mr-4 flex h-[30px] w-[30px] items-center justify-center rounded-md">
                    <svg width="16" height="13" viewBox="0 0 16 13" className="fill-current">
                      <path d="M5.8535 12.6631C5.65824 12.8584 5.34166 12.8584 5.1464 12.6631L0.678894 8.19561C0.48263 7.99934 0.48263 7.68276 0.678894 7.4875L1.8535 6.31288C2.04876 6.11762 2.36534 6.11762 2.5606 6.31288L5.5 9.25228L13.4394 1.31288C13.6347 1.11762 13.9512 1.11762 14.1465 1.31288L15.3211 2.4875C15.5164 2.68276 15.5164 2.99934 15.3211 3.19461L5.8535 12.6631Z" />
                    </svg>
                  </span>
                  <p className="text-body-color mb-0 flex items-center text-lg font-medium">
                    Trasparenza e Affidabilità
                  </p>
                </div>
                
                <div className="flex items-center">
                  <span className="bg-primary/10 text-primary mr-4 flex h-[30px] w-[30px] items-center justify-center rounded-md">
                    <svg width="16" height="13" viewBox="0 0 16 13" className="fill-current">
                      <path d="M5.8535 12.6631C5.65824 12.8584 5.34166 12.8584 5.1464 12.6631L0.678894 8.19561C0.48263 7.99934 0.48263 7.68276 0.678894 7.4875L1.8535 6.31288C2.04876 6.11762 2.36534 6.11762 2.5606 6.31288L5.5 9.25228L13.4394 1.31288C13.6347 1.11762 13.9512 1.11762 14.1465 1.31288L15.3211 2.4875C15.5164 2.68276 15.5164 2.99934 15.3211 3.19461L5.8535 12.6631Z" />
                    </svg>
                  </span>
                  <p className="text-body-color mb-0 flex items-center text-lg font-medium">
                    Supporto Clienti Dedicato
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full px-4 lg:w-1/2">
              <div className="relative mx-auto aspect-25/24 max-w-[500px] lg:mr-0">
                <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white text-2xl">🚀</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Dashboard Aziendale</h3>
                    <p className="text-gray-600 text-sm">
                      Sistema di gestione completo per la tua azienda
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-body-color/[.15] pb-16 dark:border-white/[.15] md:pb-20 lg:pb-28">
      <div className="-mx-4 flex flex-wrap items-center">
        <div className="w-full px-4 lg:w-1/2">
          <SanityStyledComponent
            component={aboutTitleComponent}
            componentName="AboutTitle"
            as="div"
          >
            <SectionTitle
              title={getTextValue(about.title)}
              paragraph={getTextValue(about.description)}
              mb="44px"
            />
          </SanityStyledComponent>

          {about.features && about.features.length > 0 && (
            <div
              className="mb-12 max-w-[570px] lg:mb-0"
              data-wow-delay=".15s"
            >
              <div className="mx-[-12px] flex flex-wrap">
                <div className="w-full px-3 sm:w-1/2 lg:w-full xl:w-1/2">
                  {about.features.slice(0, Math.ceil(about.features.length / 2)).map((feature, index) => (
                    <List key={index} text={feature.title} icon={feature.icon} />
                  ))}
                </div>

                <div className="w-full px-3 sm:w-1/2 lg:w-full xl:w-1/2">
                  {about.features.slice(Math.ceil(about.features.length / 2)).map((feature, index) => (
                    <List key={index} text={feature.title} icon={feature.icon} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {about.stats && about.stats.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mt-8">
              {about.stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-primary">{getTextValue(stat.number)}</div>
                  <div className="text-sm text-gray-600">{getTextValue(stat.label)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="w-full px-4 lg:w-1/2">
          <div className="relative mx-auto aspect-25/24 max-w-[500px] lg:mr-0">
            {about.image ? (
              <Image
                src={getImageUrl(about.image)}
                alt="about-image"
                fill
                className="mx-auto max-w-full drop-shadow-three dark:drop-shadow-none lg:mr-0"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Add an image in Sanity Studio</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSectionOne;
