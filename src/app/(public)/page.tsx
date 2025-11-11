"use client";

import Hero from "@/components/Hero";
import AboutSectionOne from "@/components/About/AboutSectionOne";
import Testimonials from "@/components/Testimonials";
import Blog from "@/components/Blog";
import Services from "@/components/Services";
import MechanicalDivider from "@/components/Common/MechanicalDivider";
import Projects from "@/components/Projects";
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
              <p className="text-white/90 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                Strategie, design e sviluppo per far crescere il tuo brand online con strumenti su misura.
              </p>
            </div>
            <Services />
          </div>
        </section>
      </div>

      {/* Mechanical Divider */}
      <MechanicalDivider />

      {/* Projects Section */}
      <div className="text-white">
        <section className="py-16 lg:py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="mb-6 text-4xl font-extrabold sm:text-5xl lg:text-6xl xl:text-7xl bg-gradient-to-r from-white via-white to-white/90 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]">
                I Nostri Progetti
              </h2>
              <p className="text-white/90 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                Esperienze su misura per marchi che vogliono distinguersi nel digitale.
              </p>
            </div>
            <Projects homepage />
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
              <p className="text-white/90 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                Un team multidisciplinare che unisce creatività e tecnologia per trasformare idee in esperienze digitali.
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
              <p className="text-white/90 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                Risultati concreti raccontati da chi ha scelto di lavorare con noi.
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
              <p className="text-white/90 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                Idee, strumenti e trend per restare al passo con l’innovazione digitale.
              </p>
            </div>
            <Blog homepage={true} />
          </div>
        </section>
      </div>

      {/* Mechanical Divider */}
      <MechanicalDivider />
    </>
  );
};

export default HomePage;
