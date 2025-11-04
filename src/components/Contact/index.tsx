"use client";

import { safeFetch } from '@/sanity/lib/client';
import { contactQuery, serviceBySlugQuery, siteSettingsQuery } from '@/sanity/lib/queries';
import { useSanityUIComponents } from '@/hooks/useSanityUIComponents';
import SanityStyledComponent from '@/components/Common/SanityStyledComponent';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const ContactFormContent = () => {
  const [contact, setContact] = useState(null);
  const [siteSettings, setSiteSettings] = useState(null);
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const { getComponent } = useSanityUIComponents();

  const serviceSlug = searchParams?.get('service');
  const requestType = searchParams?.get('type'); // 'preventivo' o 'quotazione'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contactData, settingsData, serviceData] = await Promise.all([
          safeFetch(contactQuery),
          safeFetch(siteSettingsQuery),
          serviceSlug ? safeFetch(serviceBySlugQuery, { slug: serviceSlug }).catch(() => null) : Promise.resolve(null)
        ]);
        
        setContact(contactData);
        setSiteSettings(settingsData);
        setService(serviceData);
      } catch (error) {
        console.error('Error fetching contact data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [serviceSlug]);

  // Get UI components for Contact section
  const contactSectionComponent = getComponent('ContactSection');
  const contactFormComponent = getComponent('ContactForm');
  const contactInputComponent = getComponent('ContactInput');
  const contactTextareaComponent = getComponent('ContactTextarea');
  const submitButtonComponent = getComponent('SubmitButton');

  // Precompile subject and message based on service and type
  const getSubject = () => {
    if (service && requestType) {
      const serviceName = service.name || 'Servizio';
      if (requestType === 'preventivo') {
        return `Richiesta Preventivo - ${serviceName}`;
      } else if (requestType === 'quotazione') {
        return `Richiesta Quotazione - ${serviceName}`;
      }
    }
    return '';
  };

  const getMessage = () => {
    if (service && requestType) {
      const serviceName = service.name || 'Servizio';
      if (requestType === 'preventivo') {
        return `Salve,\n\nsono interessato/a a ricevere un preventivo per il servizio "${serviceName}".\n\nVi prego di contattarmi al più presto.\n\nCordiali saluti.`;
      } else if (requestType === 'quotazione') {
        return `Salve,\n\nvorrei ricevere una quotazione dettagliata per il servizio "${serviceName}".\n\nVi prego di fornirmi tutte le informazioni necessarie.\n\nCordiali saluti.`;
      }
    }
    return '';
  };

  // Usa siteSettings per i contatti (come nel footer), altrimenti fallback su contact
  const contactEmail = siteSettings?.contactInfo?.email || contact?.contactInfo?.email || 'info@yourdomain.com';
  const contactPhone = siteSettings?.contactInfo?.phone || contact?.contactInfo?.phone || '+39 123 456 789';
  const contactAddress = siteSettings?.contactInfo?.address || contact?.contactInfo?.address || 'Roma, Italia';

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-white/80 text-lg">Caricamento form di contatto...</p>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-4 text-white">Contact Section</h3>
        <p className="text-white/80 mb-6">Create your contact form in Sanity Studio to get started.</p>
        <button 
          onClick={() => window.location.href = '/studio'}
          className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/80 transition shadow-lg"
        >
          Go to Sanity Studio
        </button>
      </div>
    );
  }

  const defaultSubject = getSubject();
  const defaultMessage = getMessage();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formObject: any = {};
    formData.forEach((value, key) => {
      formObject[key] = value;
    });

    // Usa l'email dal footer/siteSettings
    const mailtoLink = `mailto:${contactEmail}?subject=${encodeURIComponent(formObject.subject || defaultSubject)}&body=${encodeURIComponent(formObject.message || defaultMessage)}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="flex flex-wrap lg:justify-between">
      {/* Contact Form */}
      <div className="w-full lg:w-1/2 xl:w-6/12">
        <SanityStyledComponent
          component={contactFormComponent}
          componentName="ContactForm"
          as="div"
          className="wow fadeInUp mb-12 rounded-xl bg-white/30 backdrop-blur-xl shadow-2xl p-8 dark:bg-dark dark:shadow-gray-dark sm:p-10 lg:px-12 xl:p-14"
        >
          {/* Alert per servizio selezionato */}
          {service && requestType && (
            <div className={`mb-6 p-4 rounded-lg border-l-4 ${
              requestType === 'preventivo' 
                ? 'bg-blue-500/20 border-blue-500 text-blue-100' 
                : 'bg-green-500/20 border-green-500 text-green-100'
            }`}>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-semibold">
                    {requestType === 'preventivo' ? 'Richiesta Preventivo' : 'Richiesta Quotazione'}
                  </p>
                  <p className="text-sm opacity-90">Servizio: {service.name}</p>
                </div>
              </div>
            </div>
          )}

          <h2 className="mb-8 text-3xl font-bold text-white">
            {service && requestType 
              ? requestType === 'preventivo' ? 'Richiedi Preventivo' : 'Richiedi Quotazione'
              : 'Invia un Messaggio'
            }
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <SanityStyledComponent
                component={contactInputComponent}
                componentName="ContactInput"
                as="input"
                type="text"
                name="name"
                placeholder="Il tuo nome"
                required
                className="w-full rounded-lg border border-white/30 bg-white/20 backdrop-blur-sm px-6 py-4 text-base text-white placeholder-white/60 outline-none transition-all duration-300 focus:border-primary focus:bg-white/30 dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:focus:border-primary dark:focus:bg-[#242A38]"
              />
            </div>
            <div className="mb-6">
              <SanityStyledComponent
                component={contactInputComponent}
                componentName="ContactInput"
                as="input"
                type="email"
                name="email"
                placeholder="La tua email"
                required
                className="w-full rounded-lg border border-white/30 bg-white/20 backdrop-blur-sm px-6 py-4 text-base text-white placeholder-white/60 outline-none transition-all duration-300 focus:border-primary focus:bg-white/30 dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:focus:border-primary dark:focus:bg-[#242A38]"
              />
            </div>
            <div className="mb-6">
              <SanityStyledComponent
                component={contactInputComponent}
                componentName="ContactInput"
                as="input"
                type="text"
                name="subject"
                placeholder="Oggetto"
                defaultValue={defaultSubject}
                required
                className="w-full rounded-lg border border-white/30 bg-white/20 backdrop-blur-sm px-6 py-4 text-base text-white placeholder-white/60 outline-none transition-all duration-300 focus:border-primary focus:bg-white/30 dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:focus:border-primary dark:focus:bg-[#242A38]"
              />
            </div>
            <div className="mb-6">
              <SanityStyledComponent
                component={contactTextareaComponent}
                componentName="ContactTextarea"
                as="textarea"
                name="message"
                rows={6}
                placeholder="Il tuo messaggio"
                defaultValue={defaultMessage}
                required
                className="w-full resize-none rounded-lg border border-white/30 bg-white/20 backdrop-blur-sm px-6 py-4 text-base text-white placeholder-white/60 outline-none transition-all duration-300 focus:border-primary focus:bg-white/30 dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:focus:border-primary dark:focus:bg-[#242A38]"
              />
            </div>
            <div>
              <SanityStyledComponent
                component={submitButtonComponent}
                componentName="SubmitButton"
                as="button"
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-primary via-primary/90 to-primary px-9 py-4 text-base font-bold text-white shadow-xl hover:shadow-2xl hover:shadow-primary/50 duration-300 hover:bg-primary/90 hover:scale-105 transform transition-all"
              >
                {service && requestType 
                  ? requestType === 'preventivo' ? 'Invia Richiesta Preventivo' : 'Invia Richiesta Quotazione'
                  : 'Invia Messaggio'
                }
              </SanityStyledComponent>
            </div>
          </form>
        </SanityStyledComponent>
      </div>

      {/* Contact Information */}
      <div className="w-full px-4 lg:w-1/2 xl:w-5/12">
        <div className="wow fadeInUp rounded-xl bg-white/30 backdrop-blur-xl shadow-2xl p-8 dark:bg-dark dark:shadow-gray-dark sm:p-10 lg:px-12 xl:p-14">
          <h3 className="mb-8 text-2xl font-bold text-white">
            Hai Bisogno di Aiuto?
          </h3>
          <p className="mb-8 text-base text-white/90">
            Il nostro team di supporto ti risponderà il prima possibile via email.
          </p>
          
          {/* Email */}
          <div className="mb-8 flex w-full max-w-[370px]">
            <div className="mr-6 flex h-[60px] w-full max-w-[60px] items-center justify-center overflow-hidden rounded-xl bg-primary/20 backdrop-blur-sm text-primary">
              <svg
                width="28"
                height="26"
                viewBox="0 0 28 26"
                className="fill-current"
              >
                <path d="M25.6 2.688C24.634.986 22.77 0 20.72 0H7.28C5.23 0 3.366.986 2.4 2.688L.24 6.876C.086 7.18 0 7.508 0 7.84v15.36C0 24.026 1.974 26 4.4 26h19.2c2.426 0 4.4-1.974 4.4-4.4V7.84c0-.332-.086-.66-.24-.964L25.6 2.688zM7.28 2.24h13.44c.89 0 1.71.448 2.2 1.2L24.48 6.4H3.52L5.08 3.44c.49-.752 1.31-1.2 2.2-1.2zM24 23.2c0 1.214-.986 2.2-2.2 2.2H6.2c-1.214 0-2.2-.986-2.2-2.2V8.48h20V23.2z" />
              </svg>
            </div>
            <div className="w-full">
              <h4 className="mb-1 text-xl font-bold text-white">
                Email
              </h4>
              <a href={`mailto:${contactEmail}`} className="text-base text-white/80 hover:text-orange-300 transition duration-300">
                {contactEmail}
              </a>
            </div>
          </div>

          {/* Location */}
          {contactAddress && (
            <div className="mb-8 flex w-full max-w-[370px]">
              <div className="mr-6 flex h-[60px] w-full max-w-[60px] items-center justify-center overflow-hidden rounded-xl bg-primary/20 backdrop-blur-sm text-primary">
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
                <h4 className="mb-1 text-xl font-bold text-white">
                  Sede
                </h4>
                <p className="text-base text-white/80">
                  {contactAddress}
                </p>
              </div>
            </div>
          )}

          {/* Phone */}
          {contactPhone && (
            <div className="flex w-full max-w-[370px]">
              <div className="mr-6 flex h-[60px] w-full max-w-[60px] items-center justify-center overflow-hidden rounded-xl bg-primary/20 backdrop-blur-sm text-primary">
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
                <h4 className="mb-1 text-xl font-bold text-white">
                  Telefono
                </h4>
                <a href={`tel:${contactPhone}`} className="text-base text-white/80 hover:text-orange-300 transition duration-300">
                  {contactPhone}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Contact = () => {
  return (
    <Suspense fallback={
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-white/80 text-lg">Caricamento form...</p>
      </div>
    }>
      <ContactFormContent />
    </Suspense>
  );
};

export default Contact;
