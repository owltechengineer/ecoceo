"use client";

import Hero from "@/components/Hero";
import AboutSectionOne from "@/components/About/AboutSectionOne";

import Testimonials from "@/components/Testimonials";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";
import Services from "@/components/Services";
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

      {/* Services Section */}
      <div className="text-white">
        <section className="py-16 lg:py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-white mb-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
                I Nostri Servizi
              </h2>
              <p className="text-white/80 text-base font-medium leading-relaxed sm:text-lg lg:text-xl">
                Soluzioni complete e personalizzate per trasformare la tua presenza digitale e raggiungere i tuoi obiettivi di business.
              </p>
            </div>
            <Services />
          </div>
        </section>
      </div>

      {/* About Section */}
      <div className="text-white">
        <section className="py-16 lg:py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-white mb-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
                Chi Siamo
              </h2>
              <p className="text-white/80 text-base font-medium leading-relaxed sm:text-lg lg:text-xl">
                Scopri la nostra storia, i nostri valori e la passione che ci guida nel creare soluzioni digitali innovative.
              </p>
            </div>
            <AboutSectionOne />
          </div>
        </section>
      </div>



      {/* Testimonials Section */}
      <div className="text-white">
        <section className="py-16 lg:py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-white mb-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
                Cosa Dicono i Nostri Clienti
              </h2>
              <p className="text-white/80 text-base font-medium leading-relaxed sm:text-lg lg:text-xl">
                Le testimonianze dei nostri clienti soddisfatti che hanno scelto di lavorare con noi.
              </p>
            </div>
            <Testimonials />
          </div>
        </section>
      </div>

      {/* Blog Section */}
      <div className="text-white">
        <section className="py-16 lg:py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-white mb-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
                Il Nostro Blog
              </h2>
              <p className="text-white/80 text-base font-medium leading-relaxed sm:text-lg lg:text-xl">
                Articoli, guide e insights dal mondo del web design e dello sviluppo digitale.
              </p>
            </div>
            <Blog />
          </div>
        </section>
      </div>

      {/* Contact Section */}
      <div className="text-white">
        <section className="py-16 lg:py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-white mb-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
                Contattaci
              </h2>
              <p className="text-white/80 text-base font-medium leading-relaxed sm:text-lg lg:text-xl">
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
