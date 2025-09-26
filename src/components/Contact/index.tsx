"use client";

import { safeFetch } from '@/sanity/lib/client';
import { contactQuery } from '@/sanity/lib/queries';
import { useSanityUIComponents } from '@/hooks/useSanityUIComponents';
import SanityStyledComponent from '@/components/Common/SanityStyledComponent';
import { useState, useEffect } from 'react';

const Contact = () => {
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const { getComponent } = useSanityUIComponents();

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const contactData = await safeFetch(contactQuery);
        setContact(contactData);
      } catch (error) {
        console.error('Error fetching contact data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, []);

  // Get UI components for Contact section
  const contactSectionComponent = getComponent('ContactSection');
  const contactFormComponent = getComponent('ContactForm');
  const contactInputComponent = getComponent('ContactInput');
  const contactTextareaComponent = getComponent('ContactTextarea');
  const submitButtonComponent = getComponent('SubmitButton');

  if (loading) {
    return (
      <div className="text-center py-12">
        <p>Caricamento contact form...</p>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-4">Contact Section</h3>
        <p className="text-gray-600 mb-6">Create your contact form in Sanity Studio to get started.</p>
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
    <div className="flex flex-wrap lg:justify-between">
      {/* Contact Form */}
      <div className="w-full lg:w-1/2 xl:w-6/12">
        <SanityStyledComponent
          component={contactFormComponent}
          componentName="ContactForm"
          as="div"
          className="wow fadeInUp mb-12 rounded-sm bg-white/30 backdrop-blurp-8 shadow-three dark:bg-dark dark:shadow-gray-dark sm:p-10 lg:px-12 xl:p-14"
        >
          <h2 className="mb-8 text-3xl font-bold text-dark dark:text-white">
            Invia un Messaggio
          </h2>
          <form>
            <div className="mb-6">
              <SanityStyledComponent
                component={contactInputComponent}
                componentName="ContactInput"
                as="input"
                type="text"
                placeholder="Il tuo nome"
                className="w-full rounded-sm border border-stroke bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:focus:border-primary dark:focus:bg-[#242A38]"
              />
            </div>
            <div className="mb-6">
              <SanityStyledComponent
                component={contactInputComponent}
                componentName="ContactInput"
                as="input"
                type="email"
                placeholder="La tua email"
                className="w-full rounded-sm border border-stroke bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:focus:border-primary dark:focus:bg-[#242A38]"
              />
            </div>
            <div className="mb-6">
              <SanityStyledComponent
                component={contactInputComponent}
                componentName="ContactInput"
                as="input"
                type="text"
                placeholder="Oggetto"
                className="w-full rounded-sm border border-stroke bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:focus:border-primary dark:focus:bg-[#242A38]"
              />
            </div>
            <div className="mb-6">
              <SanityStyledComponent
                component={contactTextareaComponent}
                componentName="ContactTextarea"
                as="textarea"
                rows={6}
                placeholder="Il tuo messaggio"
                className="w-full resize-none rounded-sm border border-stroke bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:focus:border-primary dark:focus:bg-[#242A38]"
              />
            </div>
            <div>
              <SanityStyledComponent
                component={submitButtonComponent}
                componentName="SubmitButton"
                as="button"
                type="submit"
                className="rounded-sm bg-primary px-9 py-4 text-base font-medium text-white shadow-submit duration-300 hover:bg-primary/90 dark:shadow-submit-dark"
              >
                Invia Messaggio
              </SanityStyledComponent>
            </div>
          </form>
        </SanityStyledComponent>
      </div>

      {/* Contact Information */}
      <div className="w-full px-4 lg:w-1/2 xl:w-5/12">
        <div className="wow fadeInUp rounded-sm bg-white/30 backdrop-blurp-8 shadow-three dark:bg-dark dark:shadow-gray-dark sm:p-10 lg:px-12 xl:p-14">
          <h3 className="mb-8 text-2xl font-bold text-dark dark:text-white">
            Hai Bisogno di Aiuto?
          </h3>
          <p className="mb-8 text-base text-body-color dark:text-body-color-dark">
            Il nostro team di supporto ti risponderà il prima possibile via email.
          </p>
          
          {/* Email */}
          <div className="mb-8 flex w-full max-w-[370px]">
            <div className="mr-6 flex h-[60px] w-full max-w-[60px] items-center justify-center overflow-hidden rounded bg-primary bg-opacity-5 text-primary dark:bg-opacity-10">
              <svg
                width="28"
                height="26"
                viewBox="0 0 28 26"
                className="fill-current"
              >
                <path d="M25.6 2.688C24.634.986 22.77 0 20.72 0H7.28C5.23 0 3.366.986 2.4 2.688L.24 6.876C.086 7.18 0 7.508 0 7.84v15.36C0 24.026 1.974 26 4.4 26h19.2c2.426 0 4.4-1.974 4.4-4.4V7.84c0-.332-.086-.66-.24-.964L25.6 2.688zM7.28 2.24h13.44c.89 0 1.71.448 2.2 1.2L24.48 6.4H3.52L5.08 3.44c.49-.752 1.31-1.2 2.2-1.2zM24 23.2c0 1.214-.986 2.2-2.2 2.2H6.2c-1.214 0-2.2-.986-2.2-2.2V8.48h20V23.2z" />
                <path d="M14 12.8C-1.214 0-2.2.986-2.2 2.2s.986 2.2 2.2 2.2 2.2-.986 2.2-2.2-.986-2.2-2.2-2.2z" />
              </svg>
            </div>
            <div className="w-full">
              <h4 className="mb-1 text-xl font-bold text-dark dark:text-white">
                Email
              </h4>
              <p className="text-base text-body-color dark:text-body-color-dark">
                info@yourdomain.com
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="mb-8 flex w-full max-w-[370px]">
            <div className="mr-6 flex h-[60px] w-full max-w-[60px] items-center justify-center overflow-hidden rounded bg-primary bg-opacity-5 text-primary dark:bg-opacity-10">
              <svg
                width="24"
                height="29"
                viewBox="0 0 24 29"
                className="fill-current"
              >
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22c-5.514 0-10-4.486-10-10S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
                <path d="M12 6c-3.314 0-6 2.686-6 6s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6zm0 10c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4z" />
              </svg>
            </div>
            <div className="w-full">
              <h4 className="mb-1 text-xl font-bold text-dark dark:text-white">
                Sede
              </h4>
              <p className="text-base text-body-color dark:text-body-color-dark">
                Roma, Italia
              </p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex w-full max-w-[370px]">
            <div className="mr-6 flex h-[60px] w-full max-w-[60px] items-center justify-center overflow-hidden rounded bg-primary bg-opacity-5 text-primary dark:bg-opacity-10">
              <svg
                width="20"
                height="29"
                viewBox="0 0 20 29"
                className="fill-current"
              >
                <path d="M10 0C4.486 0 0 4.486 0 10c0 5.515 4.486 10 10 10s10-4.485 10-10C20 4.486 15.514 0 10 0zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
                <path d="M10 4c-3.314 0-6 2.686-6 6s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6zm0 10c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4z" />
              </svg>
            </div>
            <div className="w-full">
              <h4 className="mb-1 text-xl font-bold text-dark dark:text-white">
                Telefono
              </h4>
              <p className="text-base text-body-color dark:text-body-color-dark">
                +39 123 456 789
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
