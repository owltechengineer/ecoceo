"use client";

import { safeFetch } from '@/sanity/lib/client';
import { testimonialsQuery } from '@/sanity/lib/queries';
import { getImageUrl, getTextValue } from '@/sanity/lib/image';
import { useSanityUIComponents } from '@/hooks/useSanityUIComponents';
import SanityStyledComponent from '@/components/Common/SanityStyledComponent';
import { useState, useEffect } from 'react';

const SingleTestimonial = ({ testimonial, index }) => {
  const { getComponent } = useSanityUIComponents();
  const testimonialCardComponent = getComponent('TestimonialCard');
  const testimonialContentComponent = getComponent('TestimonialContent');
  const testimonialAuthorComponent = getComponent('TestimonialAuthor');

  return (
    <SanityStyledComponent
      component={testimonialCardComponent}
      componentName="TestimonialCard"
      className="w-full"
    >
      <div className="wow fadeInUp" data-wow-delay={`${index * 100}ms`}>
        <div className="group/tes relative rounded-sm bg-white/30 backdrop-blurp-8 shadow-testimonial dark:bg-dark lg:px-12 xl:p-14">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-full">
                {testimonial.image ? (
                  <img
                    src={getImageUrl(testimonial.image)}
                    alt={getTextValue(testimonial.name)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">{getTextValue(testimonial.name)?.charAt(0)}</span>
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
                <span key={i} className="text-yellow-500">
                  {i < (testimonial.star || 5) ? "★" : "☆"}
                </span>
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

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getComponent } = useSanityUIComponents();

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const testimonialsData = await safeFetch(testimonialsQuery);
        setTestimonials(testimonialsData);
      } catch (error) {
        console.error('Error fetching testimonials data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Get UI components for Testimonials section
  const testimonialsSectionComponent = getComponent('TestimonialsSection');

  if (loading) {
    return (
      <div className="text-center py-12">
        <p>Caricamento testimonials...</p>
      </div>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-4">Testimonials Section</h3>
        <p className="text-gray-600 mb-6">Create your testimonials in Sanity Studio to get started.</p>
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
      {testimonials.map((testimonial, index) => (
        <SingleTestimonial 
          key={testimonial._id || index} 
          testimonial={testimonial} 
          index={index}
        />
      ))}
    </div>
  );
};

export default Testimonials;
