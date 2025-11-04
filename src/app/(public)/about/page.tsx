"use client";

import Breadcrumb from "@/components/Common/Breadcrumb";
import ServiceCTA from "@/components/Services/ServiceCTA";
import MechanicalDivider from "@/components/Common/MechanicalDivider";
import { safeFetch } from '@/sanity/lib/client';
import { aboutQuery } from '@/sanity/lib/queries';
import { getImageUrl, getTextValue } from '@/sanity/lib/image';
import Image from "next/image";
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faBullseye, faHeart, faRocket } from '@fortawesome/free-solid-svg-icons';

const AboutPage = () => {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="text-white text-center py-20">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-white/80 text-lg">Caricamento...</p>
      </div>
    );
  }

  return (
    <>
      {/* Breadcrumb Section */}
      <div className="text-white">
        <Breadcrumb
          pageName="Chi Siamo"
          description="Scopri la nostra storia, i nostri valori e la passione che ci guida nel creare soluzioni digitali innovative per il tuo business."
        />
      </div>

      {/* Mechanical Divider */}
      <MechanicalDivider />

      {/* Main About Section */}
      <div className="text-white">
        <section className="py-16 lg:py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="mb-6 text-4xl font-extrabold sm:text-5xl lg:text-6xl xl:text-7xl bg-gradient-to-r from-white via-white to-white/90 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]">
                {about ? getTextValue(about.title) : "La Nostra Storia"}
              </h2>
              <p className="text-white/95 text-lg font-medium leading-relaxed sm:text-xl lg:text-2xl max-w-3xl mx-auto drop-shadow-lg">
                {about ? getTextValue(about.description) : "Siamo un team di professionisti esperti e appassionati, uniti dalla passione per la tecnologia e dall'obiettivo comune di creare soluzioni digitali che facciano la differenza."}
              </p>
            </div>

            {/* About Content Card */}
            <div className="mb-16">
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/40 via-white/30 to-white/20 backdrop-blur-xl shadow-2xl duration-500 hover:shadow-primary/20 transition-all border border-white/20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  {/* Image Section */}
                  <div className="relative h-96 lg:h-auto overflow-hidden">
                    {about?.image ? (
                      <Image
                        src={getImageUrl(about.image)}
                        alt={about ? getTextValue(about.title) : "Chi Siamo"}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10 flex items-center justify-center">
                        <div className="text-center">
                          <FontAwesomeIcon icon={faUsers} className="text-6xl text-white/80 mb-4" />
                          <h3 className="text-2xl font-semibold text-white">La Nostra Azienda</h3>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent"></div>
                  </div>

                  {/* Content Section */}
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    {about && (
                      <>
                        <p className="text-white/90 text-base leading-relaxed mb-8">
                          {getTextValue(about.description)}
                        </p>
                        
                        {/* Stats Grid */}
                        {about.stats && about.stats.length > 0 && (
                          <div className="grid grid-cols-2 gap-4 mb-8">
                            {about.stats.slice(0, 4).map((stat, index) => (
                              <div key={index} className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                                <div className="text-4xl font-bold text-primary mb-2">{getTextValue(stat.number)}</div>
                                <div className="text-sm text-white/80">{getTextValue(stat.label)}</div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Features List */}
                        {about.features && about.features.length > 0 && (
                          <div className="space-y-4">
                            {about.features.slice(0, 4).map((feature, index) => (
                              <div key={index} className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/20 backdrop-blur-sm flex items-center justify-center">
                                  <FontAwesomeIcon icon={faBullseye} className="text-primary w-5 h-5" />
                                </div>
                                <div>
                                  <h4 className="text-lg font-bold text-white mb-1">
                                    {getTextValue(feature.title)}
                                  </h4>
                                  {feature.description && (
                                    <p className="text-white/70 text-sm">
                                      {getTextValue(feature.description)}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Features Cards Grid */}
            {about?.features && about.features.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {about.features.slice(0, 6).map((feature, index) => (
                  <div
                    key={index}
                    className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white/40 via-white/30 to-white/20 backdrop-blur-xl shadow-xl duration-500 hover:shadow-primary/20 hover:scale-[1.02] transition-all h-full flex flex-col border border-white/20 p-6"
                  >
                    <div className="mb-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/20 backdrop-blur-sm text-2xl shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300">
                        {feature.icon || "✨"}
                      </div>
                      <h4 className="text-xl font-bold text-white mb-2">
                        {getTextValue(feature.title)}
                      </h4>
                      {feature.description && (
                        <p className="text-white/80 text-sm leading-relaxed">
                          {getTextValue(feature.description)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Mechanical Divider */}
      <MechanicalDivider />

      {/* Mission, Values, Team Section */}
      <div className="text-white">
        <section className="py-16 lg:py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="mb-6 text-4xl font-extrabold sm:text-5xl lg:text-6xl xl:text-7xl bg-gradient-to-r from-white via-white to-white/90 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]">
                La Nostra Visione
              </h2>
              <p className="text-white/95 text-lg font-medium leading-relaxed sm:text-xl lg:text-2xl max-w-3xl mx-auto drop-shadow-lg">
                Scopri i valori e i principi che guidano il nostro lavoro quotidiano.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Mission */}
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/40 via-white/30 to-white/20 backdrop-blur-xl shadow-xl duration-500 hover:shadow-primary/20 transition-all border border-white/20 p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-primary/20 backdrop-blur-sm flex items-center justify-center">
                    <FontAwesomeIcon icon={faRocket} className="text-primary text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-3">
                      La Nostra Missione
                    </h3>
                  </div>
                </div>
                <p className="text-white/90 text-base leading-relaxed">
                  La nostra missione è quella di aiutare le aziende a crescere nel mondo digitale attraverso soluzioni innovative e personalizzate. Crediamo che ogni business abbia un potenziale unico che può essere espresso attraverso la tecnologia.
                </p>
              </div>

              {/* Values */}
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/40 via-white/30 to-white/20 backdrop-blur-xl shadow-xl duration-500 hover:shadow-primary/20 transition-all border border-white/20 p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-primary/20 backdrop-blur-sm flex items-center justify-center">
                    <FontAwesomeIcon icon={faHeart} className="text-primary text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-3">
                      I Nostri Valori
                    </h3>
                  </div>
                </div>
                <p className="text-white/90 text-base leading-relaxed mb-4">
                  L'innovazione, la qualità e la trasparenza sono i pilastri su cui fondiamo il nostro lavoro. Ogni progetto è un'opportunità per superare le aspettative e creare valore duraturo per i nostri clienti.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span className="text-white/80 text-sm">Innovazione Continua</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span className="text-white/80 text-sm">Qualità Superiore</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span className="text-white/80 text-sm">Trasparenza Totale</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Team */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/40 via-white/30 to-white/20 backdrop-blur-xl shadow-xl duration-500 hover:shadow-primary/20 transition-all border border-white/20 p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-primary/20 backdrop-blur-sm flex items-center justify-center">
                  <FontAwesomeIcon icon={faUsers} className="text-primary text-2xl" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Il Nostro Team
                  </h3>
                </div>
              </div>
              <p className="text-white/90 text-base leading-relaxed">
                Siamo un team di professionisti esperti e appassionati, uniti dalla passione per la tecnologia e dall'obiettivo comune di creare soluzioni digitali che facciano la differenza. Ogni membro del nostro team porta competenze uniche e un impegno costante per l'eccellenza.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Mechanical Divider */}
      <MechanicalDivider />

      {/* Service CTA Section */}
      <div className="text-white">
        <section className="py-16 lg:py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="mb-6 text-4xl font-extrabold sm:text-5xl lg:text-6xl xl:text-7xl bg-gradient-to-r from-white via-white to-white/90 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]">
                I Nostri Servizi
              </h2>
              <p className="text-white/95 text-lg font-medium leading-relaxed sm:text-xl lg:text-2xl max-w-3xl mx-auto drop-shadow-lg">
                Scopri come possiamo aiutarti a raggiungere i tuoi obiettivi di business.
              </p>
            </div>
            <ServiceCTA shuffle={true} />
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutPage;
