"use client";

import Image from "next/image";
import Link from "next/link";
import { safeFetch } from '@/sanity/lib/client';
import { heroQuery, siteSettingsQuery } from '@/sanity/lib/queries';
import { getImageUrl, getTextValue } from '@/sanity/lib/image';
import { useSanityUIComponents } from '@/hooks/useSanityUIComponents';
import SanityStyledComponent from '@/components/Common/SanityStyledComponent';
import SanityLink from '@/components/Common/SanityLink';
import { useState, useEffect, type ReactElement } from 'react';

const DEFAULT_SOCIAL_URLS = {
  linkedin: 'https://www.linkedin.com/company/owltech-engineering/',
  instagram: 'https://www.instagram.com/owltech.it/',
  youtube: 'https://www.youtube.com/@OWLTECHENGINEERING',
} as const;

type SocialLinkKey = keyof typeof DEFAULT_SOCIAL_URLS;

type SocialLinkConfig = {
  key: SocialLinkKey;
  label: string;
  Icon: () => ReactElement;
};

const LinkedInIcon: SocialLinkConfig['Icon'] = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" className="fill-current">
    <path d="M15.3 0H.7C.3 0 0 .3 0 .7v14.7c0 .3.3.6.7.6h14.7c.4 0 .7-.3.7-.7V.7c0-.4-.3-.7-.7-.7zM4.7 13.6H2.4V6h2.4v7.6h-.1zM3.6 5c-.8 0-1.4-.7-1.4-1.4 0-.8.6-1.4 1.4-1.4.8 0 1.4.6 1.4 1.4-.1.7-.7 1.4-1.4 1.4zm10.9 8.6h-2.4V9.9c0-.9 0-2-1.2-2s-1.4 1-1.4 2v3.8H6.7V6h2.3v1h.1c.3-.6 1.1-1.2 2.2-1.2 2.4 0 2.8 1.6 2.8 3.6v4.2h.1z" />
  </svg>
);

const InstagramIcon: SocialLinkConfig['Icon'] = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" className="fill-current">
    <path d="M8 2.2c2.1 0 2.4.01 3.2.06.8.05 1.3.2 1.6.4.4.2.7.5.9.9.2.3.4.8.4 1.6.1.8.1 1.1.1 3.2s0 2.4-.1 3.2c-.1.8-.2 1.3-.4 1.6-.2.4-.5.7-.9.9-.3.2-.8.4-1.6.4-.8.1-1.1.1-3.2.1s-2.4 0-3.2-.1c-.8-.1-1.3-.2-1.6-.4-.4-.2-.7-.5-.9-.9-.2-.3-.4-.8-.4-1.6-.1-.8-.1-1.1-.1-3.2s0-2.4.1-3.2c.1-.8.2-1.3.4-1.6.2-.4.5-.7.9-.9.3-.2.8-.4 1.6-.4.8-.1 1.1-.1 3.2-.1zm0-1.4c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm0 6.6c-1.4 0-2.6-1.2-2.6-2.6s1.2-2.6 2.6-2.6 2.6 1.2 2.6 2.6-1.2 2.6-2.6 2.6zm5.3-6.7c0 .5-.4.9-.9.9s-.9-.4-.9-.9.4-.9.9-.9.9.4.9.9z" />
  </svg>
);

const YouTubeIcon: SocialLinkConfig['Icon'] = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" className="fill-current">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const SOCIAL_LINKS_CONFIG: ReadonlyArray<SocialLinkConfig> = [
  { key: 'linkedin', label: 'LinkedIn', Icon: LinkedInIcon },
  { key: 'instagram', label: 'Instagram', Icon: InstagramIcon },
  { key: 'youtube', label: 'YouTube', Icon: YouTubeIcon },
];

const Hero = () => {
  const [hero, setHero] = useState(null);
  const [siteSettings, setSiteSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const { getComponent } = useSanityUIComponents();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [heroData, siteSettingsData] = await Promise.all([
          safeFetch(heroQuery),
          safeFetch(siteSettingsQuery),
        ]);
        setHero(heroData);
        setSiteSettings(siteSettingsData);
      } catch (error) {
        console.error('Error fetching hero section data:', error);
        setHero(null);
        setSiteSettings(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get UI components for Hero section
  const heroSectionComponent = getComponent('HeroSection');
  const heroTitleComponent = getComponent('HeroTitle');
  const heroDescriptionComponent = getComponent('HeroDescription');
  const primaryButtonComponent = getComponent('PrimaryButton');
  const secondaryButtonComponent = getComponent('SecondaryButton');

  const resolvedSocialLinks = SOCIAL_LINKS_CONFIG
    .map(({ key, label, Icon }) => {
      const href = siteSettings?.socialLinks?.[key] || DEFAULT_SOCIAL_URLS[key];
      if (!href) return null;
      return { key, label, Icon, href };
    })
    .filter(Boolean) as Array<SocialLinkConfig & { href: string }>;

  if (loading) {
    return (
      <section className="relative z-10 overflow-hidden pb-16 pt-[120px] md:pb-[120px] md:pt-[150px] xl:pb-[160px] xl:pt-[180px] 2xl:pb-[200px] 2xl:pt-[210px] min-h-screen flex items-center">
        <div className="container">
          <div className="-mx-4 flex flex-wrap items-center">
            <div className="w-full px-4 lg:w-1/2">
              <div className="space-y-6">
                <div className="h-10 w-3/4 rounded bg-white/[0.12]" />
                <div className="h-4 w-full rounded bg-white/[0.08]" />
                <div className="h-4 w-5/6 rounded bg-white/[0.08]" />
                <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                  <div className="h-12 w-40 rounded bg-white/[0.12]" />
                  <div className="h-12 w-40 rounded bg-white/[0.06]" />
                </div>
                <div className="flex items-center gap-4 pt-6">
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <div key={idx} className="h-10 w-10 rounded-full bg-white/[0.08]" />
                  ))}
                </div>
              </div>
            </div>
            <div className="w-full px-4 lg:w-1/2">
              <div className="relative mx-auto max-w-[700px] lg:max-w-[800px] xl:max-w-[900px] lg:mr-0">
                <div className="aspect-square w-full rounded-3xl bg-white/[0.06]" />
              </div>
            </div>
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
                    
                    {/* Social Links */}
                    <div className="mt-8 flex items-center space-x-4">
                      <p className="text-sm font-medium text-black/70">Seguici:</p>
                      <div className="flex items-center space-x-3">
                        {resolvedSocialLinks.map(({ key, href, label, Icon }) => (
                          <Link
                            key={key}
                            href={href}
                            prefetch={false}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white/20 hover:bg-primary/20 backdrop-blur-sm flex h-10 w-10 items-center justify-center rounded-full text-black hover:text-primary transition-all duration-300 hover:scale-110 border border-black/10"
                            aria-label={label}
                          >
                            <Icon />
                          </Link>
                        ))}
                      </div>
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
                    
                    {/* Social Links */}
                    <div className="mt-8 flex items-center space-x-4">
                      <p className="text-sm font-medium text-black/70">Seguici:</p>
                      <div className="flex items-center space-x-3">
                        {resolvedSocialLinks.map(({ key, href, label, Icon }) => (
                          <Link
                            key={key}
                            href={href}
                            prefetch={false}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white/20 hover:bg-primary/20 backdrop-blur-sm flex h-10 w-10 items-center justify-center rounded-full text-black hover:text-primary transition-all duration-300 hover:scale-110 border border-black/10"
                            aria-label={label}
                          >
                            <Icon />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="w-full px-4 lg:w-1/2">
              <div className="wow fadeInUp" data-wow-delay=".4s">
                <div className="relative mx-auto max-w-[700px] lg:max-w-[800px] xl:max-w-[900px] lg:mr-0 group">
                  {hero?.heroImage ? (
                    <div className="relative overflow-hidden rounded-3xl shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:shadow-primary/50 group-hover:shadow-3xl">
                      <Image
                        src={getImageUrl(hero.heroImage)}
                        alt="Hero Image"
                        width={900}
                        height={900}
                        className="mx-auto max-w-full lg:mr-0 transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  ) : (
                    <div className="relative mx-auto max-w-[700px] lg:max-w-[800px] xl:max-w-[900px] lg:mr-0 overflow-hidden rounded-3xl shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:shadow-primary/50 group-hover:shadow-3xl">
                      <Image
                        src="/images/hero/hero-image.svg"
                        alt="Hero Image"
                        width={900}
                        height={900}
                        className="mx-auto max-w-full lg:mr-0 transition-transform duration-500 group-hover:scale-110"
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
