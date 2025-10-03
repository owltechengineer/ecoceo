"use client";

import { safeFetch } from '@/sanity/lib/client';
import { featuresQuery } from '@/sanity/lib/queries';
import { getImageUrl, getTextValue } from '@/sanity/lib/image';
import { useSanityUIComponents } from '@/hooks/useSanityUIComponents';
import SanityStyledComponent from '@/components/Common/SanityStyledComponent';
import { useState, useEffect } from 'react';

const Features = () => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getComponent } = useSanityUIComponents();

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const featuresData = await safeFetch(featuresQuery);
        setFeatures(featuresData);
      } catch (error) {
        console.error('Error fetching features data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatures();
  }, []);

  // Get UI components for Features section
  const featuresSectionComponent = getComponent('FeaturesSection');
  const featureCardComponent = getComponent('FeatureCard');
  const featureTitleComponent = getComponent('FeatureTitle');
  const featureDescriptionComponent = getComponent('FeatureDescription');

  if (loading) {
    return (
      <div className="text-center py-12">
        <p>Caricamento features...</p>
      </div>
    );
  }

  if (!features || features.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-4">Features Section</h3>
        <p className="text-gray-600 mb-6">Create your features in Sanity Studio to get started.</p>
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
    <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
      {features.map((feature, index) => (
        <SanityStyledComponent
          key={feature._id || index}
          component={featureCardComponent}
          componentName="FeatureCard"
          className="w-full"
        >
          <div className="wow fadeInUp" data-wow-delay={`${index * 100}ms`}>
            <div className="group mb-8 flex h-[70px] w-[70px] items-center justify-center rounded-md bg-primary bg-opacity-10 text-primary">
              {feature.icon ? (
                <span className="text-3xl">{getTextValue(feature.icon)}</span>
              ) : (
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 36 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.5 25.5C20.4036 25.5 26 19.9036 26 13C26 6.09644 20.4036 0.5 13.5 0.5C6.59644 0.5 1 6.09644 1 13C1 19.9036 6.59644 25.5 13.5 25.5Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M35 35L26 26"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <SanityStyledComponent
              component={featureTitleComponent}
              componentName="FeatureTitle"
              as="h3"
              className="mb-5 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl"
            >
              {getTextValue(feature.title)}
            </SanityStyledComponent>
            <SanityStyledComponent
              component={featureDescriptionComponent}
              componentName="FeatureDescription"
              as="p"
              className="text-base text-body-color dark:text-body-color-dark"
            >
              {getTextValue(feature.paragraph)}
            </SanityStyledComponent>
          </div>
        </SanityStyledComponent>
      ))}
    </div>
  );
};

export default Features;
