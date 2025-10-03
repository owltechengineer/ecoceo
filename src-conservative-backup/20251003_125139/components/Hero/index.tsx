"use client";

import Image from "next/image";
import { safeFetch } from '@/sanity/lib/client';
import { heroQuery } from '@/sanity/lib/queries';
import { getImageUrl, getTextValue } from '@/sanity/lib/image';
import { useSanityUIComponents } from '@/hooks/useSanityUIComponents';
import SanityStyledComponent from '@/components/Common/SanityStyledComponent';
import SanityLink from '@/components/Common/SanityLink';
import { useState, useEffect } from 'react';

const Hero = () => {
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);
  const { getComponent } = useSanityUIComponents();

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const heroData = await safeFetch(heroQuery);
        setHero(heroData);
      } catch (error) {
        console.error('Error fetching hero data:', error);
        setHero(null);
      } finally {
        setLoading(false);
      }
    };

    fetchHero();
  }, []);

  // Get UI components for Hero section
  const heroSectionComponent = getComponent('HeroSection');
  const heroTitleComponent = getComponent('HeroTitle');
  const heroDescriptionComponent = getComponent('HeroDescription');
  const primaryButtonComponent = getComponent('PrimaryButton');
  const secondaryButtonComponent = getComponent('SecondaryButton');

  if (loading) {
    return (
      <section className="relative z-10 overflow-hidden pb-16 pt-[120px] md:pb-[120px] md:pt-[150px] xl:pb-[160px] xl:pt-[180px] 2xl:pb-[200px] 2xl:pt-[210px]">
        <div className="container">
          <div className="text-center">
            <p>Caricamento Hero...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <SanityStyledComponent
        component={heroSectionComponent}
        componentName="HeroSection"
        as="section"
        id="home"
        className="relative z-10 overflow-hidden pb-16 pt-[120px] md:pb-[120px] md:pt-[150px] xl:pb-[160px] xl:pt-[180px] 2xl:pb-[200px] 2xl:pt-[210px] min-h-screen flex items-center"
        style={hero?.backgroundImage ? {
          backgroundImage: `url(${getImageUrl(hero.backgroundImage)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        } : {}}
      >
        <div className="container">
          <div className="-mx-4 flex flex-wrap items-center">
            {/* Left Column - Text Content */}
            <div className="w-full px-4 lg:w-1/2">
              <div className="wow fadeInUp" data-wow-delay=".2s">
                {!hero ? (
                  <>
                    <SanityStyledComponent
                      component={heroTitleComponent}
                      componentName="HeroTitle"
                      as="h1"
                      className="mb-5 text-3xl font-bold leading-tight text-black sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight lg:text-6xl lg:leading-tight xl:text-7xl xl:leading-tight"
                    >
                      Welcome to Our Platform
                    </SanityStyledComponent>
                    
                    <SanityStyledComponent
                      component={heroDescriptionComponent}
                      componentName="HeroDescription"
                      as="p"
                      className="mb-12 text-base leading-relaxed text-black/80 sm:text-lg md:text-xl lg:text-2xl"
                    >
                      Create your hero section content in Sanity Studio to get started. Add compelling text and images to engage your visitors.
                    </SanityStyledComponent>
                    
                    <div className="flex flex-col items-start justify-start space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                      <SanityStyledComponent
                        component={primaryButtonComponent}
                        componentName="PrimaryButton"
                        as="div"
                        className="rounded-xs bg-primary px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:opacity-80 cursor-pointer"
                        onClick={() => window.location.href = '/studio'}
                      >
                        Go to Sanity Studio
                      </SanityStyledComponent>
                    </div>
                  </>
                ) : (
                  <>
                    <SanityStyledComponent
                      component={heroTitleComponent}
                      componentName="HeroTitle"
                      as="h1"
                      className="mb-5 text-3xl font-bold leading-tight text-black sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight lg:text-6xl lg:leading-tight xl:text-7xl xl:leading-tight"
                    >
                      {getTextValue(hero.title)}
                    </SanityStyledComponent>
                    
                    <SanityStyledComponent
                      component={heroDescriptionComponent}
                      componentName="HeroDescription"
                      as="p"
                      className="mb-12 text-base leading-relaxed text-black/80 sm:text-lg md:text-xl lg:text-2xl"
                    >
                      {getTextValue(hero.paragraph)}
                    </SanityStyledComponent>
                    
                    <div className="flex flex-col items-start justify-start space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                      {hero.primaryButton && (
                        <SanityStyledComponent
                          component={primaryButtonComponent}
                          componentName="PrimaryButton"
                          as="div"
                          className="rounded-xs bg-primary px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:opacity-80 cursor-pointer"
                          onClick={() => window.location.href = getTextValue(hero.primaryButton.url)}
                        >
                          {getTextValue(hero.primaryButton.text)}
                        </SanityStyledComponent>
                      )}
                      {hero.secondaryButton && (
                        <SanityStyledComponent
                          component={secondaryButtonComponent}
                          componentName="SecondaryButton"
                          as="div"
                          className="inline-block rounded-xs border border-primary px-8 py-4 text-base font-semibold text-primary duration-300 ease-in-out hover:bg-primary hover:text-white cursor-pointer"
                          onClick={() => window.location.href = getTextValue(hero.secondaryButton.url)}
                        >
                          {getTextValue(hero.secondaryButton.text)}
                        </SanityStyledComponent>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="w-full px-4 lg:w-1/2">
              <div className="wow fadeInUp" data-wow-delay=".4s">
                <div className="relative mx-auto max-w-[500px] lg:mr-0">
                  {hero?.heroImage ? (
                    <Image
                      src={getImageUrl(hero.heroImage)}
                      alt="Hero Image"
                      width={600}
                      height={600}
                      className="mx-auto max-w-full lg:mr-0"
                    />
                  ) : (
                    <div className="relative mx-auto max-w-[500px] lg:mr-0">
                      <Image
                        src="/images/hero/hero-image.svg"
                        alt="Hero Image"
                        width={600}
                        height={600}
                        className="mx-auto max-w-full lg:mr-0"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SanityStyledComponent>
    </>
  );
};

export default Hero;
