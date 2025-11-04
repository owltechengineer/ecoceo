"use client";

import Hero from "@/components/Hero";
import AboutSectionOne from "@/components/About/AboutSectionOne";
import Testimonials from "@/components/Testimonials";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";
import Services from "@/components/Services";
import Shop from "@/components/Shop";
import MechanicalDivider from "@/components/Common/MechanicalDivider";
import { useState, useEffect } from 'react';
import { safeFetch } from '@/sanity/lib/client';
import { siteSettingsQuery } from '@/sanity/lib/queries';

const HomePage = () => {
  const [siteSettings, setSiteSettings] = useState(null);

  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        const settings = await safeFetch(siteSettingsQuery);
        setSiteSettings(settings);
      } catch (error) {
        console.error('Error fetching site settings:', error);
      }
    };

    fetchSiteSettings();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <div className="text-white">
        <Hero />
      </div>

      {/* Mechanical Divider */}
      <MechanicalDivider />

      {/* Services Section */}
      <div className="text-white">
        <section className="py-16 lg:py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="mb-6 text-4xl font-extrabold sm:text-5xl lg:text-6xl xl:text-7xl bg-gradient-to-r from-white via-white to-white/90 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]">
                I Nostri Servizi
              </h2>
              <p className="text-white/95 text-lg font-medium leading-relaxed sm:text-xl lg:text-2xl max-w-3xl mx-auto drop-shadow-lg">
                Soluzioni complete e personalizzate per trasformare la tua presenza digitale e raggiungere i tuoi obiettivi di business.
              </p>
            </div>
            <Services />
          </div>
        </section>
      </div>

      {/* Mechanical Divider */}
      <MechanicalDivider />

      {/* Products Section */}
      <div className="text-white">
        <section className="py-16 lg:py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="mb-6 text-4xl font-extrabold sm:text-5xl lg:text-6xl xl:text-7xl bg-gradient-to-r from-white via-white to-white/90 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]">
                I Nostri Prodotti
              </h2>
              <p className="text-white/95 text-lg font-medium leading-relaxed sm:text-xl lg:text-2xl max-w-3xl mx-auto drop-shadow-lg">
                Scopri la nostra selezione di prodotti digitali e fisici di alta qualità, progettati per supportare il tuo business.
              </p>
            </div>
            <Shop 
              title="Prodotti in Evidenza"
              subtitle="Scegli tra la nostra selezione di prodotti di alta qualità"
            />
          </div>
        </section>
      </div>

      {/* Mechanical Divider */}
      <MechanicalDivider />

      {/* About Section */}
      <div className="text-white">
        <section className="py-16 lg:py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="mb-6 text-4xl font-extrabold sm:text-5xl lg:text-6xl xl:text-7xl bg-gradient-to-r from-white via-white to-white/90 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]">
                Chi Siamo
              </h2>
              <p className="text-white/95 text-lg font-medium leading-relaxed sm:text-xl lg:text-2xl max-w-3xl mx-auto drop-shadow-lg">
                Scopri la nostra storia, i nostri valori e la passione che ci guida nel creare soluzioni digitali innovative.
              </p>
            </div>
            <AboutSectionOne homepage={true} />
          </div>
        </section>
      </div>

      {/* Mechanical Divider */}
      <MechanicalDivider />

      {/* Testimonials Section */}
      <div className="text-white">
        <section className="py-16 lg:py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="mb-6 text-4xl font-extrabold sm:text-5xl lg:text-6xl xl:text-7xl bg-gradient-to-r from-white via-white to-white/90 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]">
                Cosa Dicono i Nostri Clienti
              </h2>
              <p className="text-white/95 text-lg font-medium leading-relaxed sm:text-xl lg:text-2xl max-w-3xl mx-auto drop-shadow-lg">
                Le testimonianze dei nostri clienti soddisfatti che hanno scelto di lavorare con noi.
              </p>
            </div>
            <Testimonials homepage={true} />
          </div>
        </section>
      </div>

      {/* Mechanical Divider */}
      <MechanicalDivider />

      {/* Blog Section */}
      <div className="text-white">
        <section className="py-16 lg:py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="mb-6 text-4xl font-extrabold sm:text-5xl lg:text-6xl xl:text-7xl bg-gradient-to-r from-white via-white to-white/90 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]">
                Il Nostro Blog
              </h2>
              <p className="text-white/95 text-lg font-medium leading-relaxed sm:text-xl lg:text-2xl max-w-3xl mx-auto drop-shadow-lg">
                Articoli, guide e insights dal mondo del web design e dello sviluppo digitale.
              </p>
            </div>
            <Blog homepage={true} />
          </div>
        </section>
      </div>

      {/* Mechanical Divider */}
      <MechanicalDivider />

      {/* Contact Section */}
      <div className="text-white">
        <section className="py-16 lg:py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="mb-6 text-4xl font-extrabold sm:text-5xl lg:text-6xl xl:text-7xl bg-gradient-to-r from-white via-white to-white/90 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]">
                Contattaci
              </h2>
              <p className="text-white/95 text-lg font-medium leading-relaxed sm:text-xl lg:text-2xl max-w-3xl mx-auto drop-shadow-lg">
                Siamo qui per aiutarti a realizzare i tuoi progetti digitali. Contattaci per una consulenza gratuita.
              </p>
            </div>
            <Contact />
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
