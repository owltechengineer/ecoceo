"use client";

import Image from "next/image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { faQuoteLeft } from '@fortawesome/free-solid-svg-icons';
import { safeFetch } from '@/sanity/lib/client';
import { testimonialsQuery } from '@/sanity/lib/queries';
import { getImageUrl, getTextValue } from '@/sanity/lib/image';
import { useSanityUIComponents } from '@/hooks/useSanityUIComponents';
import SanityStyledComponent from '@/components/Common/SanityStyledComponent';
import { useState, useEffect } from 'react';

const SingleTestimonial = ({ testimonial, index, homepage = false }) => {
  const { getComponent } = useSanityUIComponents();
  const testimonialCardComponent = getComponent('TestimonialCard');
  const testimonialContentComponent = getComponent('TestimonialContent');
  const testimonialAuthorComponent = getComponent('TestimonialAuthor');

  const stars = testimonial.star || 5;

  // Versione homepage: card moderna
  if (homepage) {
    return (
      <div className="wow fadeInUp" data-wow-delay={`${index * 100}ms`}>
        <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white/40 via-white/30 to-white/20 backdrop-blur-xl shadow-2xl duration-500 hover:shadow-primary/20 hover:scale-[1.02] transition-all h-full flex flex-col border border-white/20 p-8">
          {/* Quote Icon */}
          <div className="absolute top-6 right-6 opacity-20 group-hover:opacity-30 transition-opacity">
            <FontAwesomeIcon icon={faQuoteLeft} className="w-12 h-12 text-primary" />
          </div>

          {/* Stars Rating */}
          <div className="flex gap-1 mb-6 z-10">
            {[...Array(5)].map((_, i) => (
              <FontAwesomeIcon
                key={i}
                icon={i < stars ? faStarSolid : faStarRegular}
                className={`w-5 h-5 ${i < stars ? 'text-yellow-400' : 'text-white/30'}`}
              />
            ))}
          </div>

          {/* Content */}
          <SanityStyledComponent
            component={testimonialContentComponent}
            componentName="TestimonialContent"
            as="p"
            className="mb-8 text-base leading-relaxed text-white/90 flex-grow relative z-10"
          >
            "{getTextValue(testimonial.content)}"
          </SanityStyledComponent>

          {/* Author */}
          <div className="flex items-center gap-4 mt-auto pt-6 border-t border-white/20">
            <div className="relative h-14 w-14 overflow-hidden rounded-full ring-2 ring-primary/50 group-hover:ring-primary transition-all">
              {testimonial.image ? (
                <Image
                  src={getImageUrl(testimonial.image)}
                  alt={getTextValue(testimonial.name)}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/30 via-primary/20 to-transparent flex items-center justify-center">
                  <span className="text-white text-lg font-bold">
                    {getTextValue(testimonial.name)?.charAt(0)?.toUpperCase() || 'A'}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-grow">
              <SanityStyledComponent
                component={testimonialAuthorComponent}
                componentName="TestimonialAuthor"
                as="h3"
                className="text-lg font-bold text-white mb-1"
              >
                {getTextValue(testimonial.name)}
              </SanityStyledComponent>
              <p className="text-sm text-white/70">
                {getTextValue(testimonial.designation)}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Versione classica
  return (
    <SanityStyledComponent
      component={testimonialCardComponent}
      componentName="TestimonialCard"
      className="w-full"
    >
      <div className="wow fadeInUp" data-wow-delay={`${index * 100}ms`}>
        <div className="group/tes relative rounded-sm bg-white/30 backdrop-blur/30 backdrop-blurp-8 shadow-testimonial dark:bg-dark lg:px-12 xl:p-14">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-full">
                {testimonial.image ? (
                  <Image
                    src={getImageUrl(testimonial.image)}
                    alt={getTextValue(testimonial.name)}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">
                      {getTextValue(testimonial.name)?.charAt(0) || 'A'}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <SanityStyledComponent
                  component={testimonialAuthorComponent}
                  componentName="TestimonialAuthor"
                  as="h3"
                  className="text-xl font-semibold text-dark dark:text-white"
                >
                  {getTextValue(testimonial.name)}
                </SanityStyledComponent>
                <p className="text-sm text-body-color">{getTextValue(testimonial.designation)}</p>
              </div>
            </div>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <FontAwesomeIcon
                  key={i}
                  icon={i < stars ? faStarSolid : faStarRegular}
                  className={`w-4 h-4 ${i < stars ? 'text-yellow-500' : 'text-gray-300'}`}
                />
              ))}
            </div>
          </div>
          <SanityStyledComponent
            component={testimonialContentComponent}
            componentName="TestimonialContent"
            as="p"
            className="mt-8 text-base leading-relaxed text-body-color dark:text-body-color-dark"
          >
            "{getTextValue(testimonial.content)}"
          </SanityStyledComponent>
        </div>
      </div>
    </SanityStyledComponent>
  );
};

const Testimonials = ({ homepage = false }) => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getComponent } = useSanityUIComponents();

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const testimonialsData = await safeFetch(testimonialsQuery);
        setTestimonials(testimonialsData || []);
      } catch (error) {
        console.error('Error fetching testimonials data:', error);
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-white/80 text-lg">Caricamento testimonianze...</p>
      </div>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-4 text-white">Sezione Testimonianze</h3>
        <p className="text-white/80 mb-6">Crea le tue testimonianze in Sanity Studio per iniziare.</p>
        <button 
          onClick={() => window.location.href = '/studio'}
          className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/80 transition shadow-lg"
        >
          Vai a Sanity Studio
        </button>
      </div>
    );
  }

  // Per homepage: mostra massimo 3 testimonianze
  const displayedTestimonials = homepage ? testimonials.slice(0, 3) : testimonials;

  // Layout per homepage: 3 colonne su desktop, 2 su tablet, 1 su mobile
  // Layout classico: 3 colonne su desktop, 2 su tablet, 1 su mobile
  const gridCols = homepage 
    ? "grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
    : "grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3";

  return (
    <>
      <div className={gridCols}>
        {displayedTestimonials.map((testimonial, index) => (
          <SingleTestimonial 
            key={testimonial._id || index} 
            testimonial={testimonial} 
            index={index}
            homepage={homepage}
          />
        ))}
      </div>

      {/* CTA per homepage */}
      {homepage && testimonials.length > 3 && (
        <div className="text-center mt-12">
          <a
            href="#contact"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-primary via-primary/90 to-primary text-white py-4 px-8 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105 transform"
          >
            <span>Diventa anche tu nostro cliente</span>
            <FontAwesomeIcon icon={faQuoteLeft} className="w-5 h-5" />
          </a>
        </div>
      )}
    </>
  );
};

export default Testimonials;
