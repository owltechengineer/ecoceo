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
        const aboutData = await safeFetch(aboutQuery);
        setAbout(aboutData);
      } catch (error) {
        console.error('Error fetching about data:', error);
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
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-4">About Section</h3>
        <p className="text-gray-600 mb-6">Create your about section content in Sanity Studio to get started.</p>
        <button 
          onClick={() => window.location.href = '/studio'}
          className="inline-block bg-primary text-white px-6 py-3 rounded hover:bg-primary/80 transition"
        >
          Go to Sanity Studio
        </button>
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
