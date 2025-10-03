"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { safeFetch } from '@/sanity/lib/client';
import { siteSettingsQuery } from '@/sanity/lib/queries';
import { PortableText } from '@portabletext/react';
import { getImageUrl } from '@/sanity/lib/image';
import Image from 'next/image';
import Link from 'next/link';

const LegalPage = () => {
  const params = useParams();
  const [siteSettings, setSiteSettings] = useState(null);
  const [legalContent, setLegalContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const settings = await safeFetch(siteSettingsQuery);
        setSiteSettings(settings);
        
        // Find the legal content based on slug
        const slug = params.slug as string;
        let content = null;
        
        if (settings?.legal) {
          if (slug === 'privacy-policy' && settings.legal.privacyPolicy) {
            content = settings.legal.privacyPolicy;
          } else if (slug === 'terms-of-service' && settings.legal.termsOfService) {
            content = settings.legal.termsOfService;
          } else if (slug === 'cookie-policy' && settings.legal.cookiePolicy) {
            content = settings.legal.cookiePolicy;
          }
        }
        
        setLegalContent(content);
      } catch (error) {
        console.error('Error fetching legal content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!legalContent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Page Not Found</h1>
          <p className="text-gray-600">The legal page you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Breadcrumb */}
      <section className="relative z-10 overflow-hidden pt-28 lg:pt-32">
        <div className="container">
          <div className="-mx-4 flex flex-wrap items-center">
            <div className="w-full px-4 md:w-8/12 lg:w-7/12">
              <div className="mb-8 max-w-[570px] md:mb-0 lg:mb-12">
                <h1 className="mb-5 text-3xl font-bold text-black dark:text-white sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                  {legalContent.title}
                </h1>
                <p className="text-base font-medium leading-relaxed text-body-color">
                  Legal information and policies
                </p>
              </div>
            </div>
            <div className="w-full px-4 md:w-4/12 lg:w-5/12">
              <div className="text-center md:text-right">
                <ul className="flex items-center md:justify-end">
                  <li className="flex items-center">
                    <Link
                      href="/"
                      className="pr-1 text-base font-medium text-body-color hover:text-primary"
                    >
                      Home
                    </Link>
                    <span className="mr-3 block h-2 w-2 rotate-45 border-r-2 border-t-2 border-body-color"></span>
                  </li>
                  <li className="flex items-center">
                    <Link
                      href="/legal"
                      className="pr-1 text-base font-medium text-body-color hover:text-primary"
                    >
                      Legal
                    </Link>
                    <span className="mr-3 block h-2 w-2 rotate-45 border-r-2 border-t-2 border-body-color"></span>
                  </li>
                  <li className="text-base font-medium text-primary">
                    {legalContent.title}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-16">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            {/* Last Updated */}
            {legalContent.lastUpdated && (
              <div className="text-center mb-8">
                <p className="text-gray-600 text-lg">
                  Last updated: {new Date(legalContent.lastUpdated).toLocaleDateString()}
                </p>
              </div>
            )}

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              {legalContent.content && (
                <PortableText
                  value={legalContent.content}
                  components={{
                    types: {
                      image: ({ value }) => (
                        <div className="my-8">
                          <Image
                            src={getImageUrl(value)}
                            alt={value.alt || 'Legal document image'}
                            width={800}
                            height={600}
                            className="rounded-lg shadow-lg mx-auto"
                          />
                        </div>
                      ),
                    },
                    block: {
                      h1: ({ children }) => (
                        <h1 className="text-3xl font-bold text-gray-800 mt-8 mb-4">{children}</h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-3">{children}</h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-xl font-bold text-gray-800 mt-4 mb-2">{children}</h3>
                      ),
                      normal: ({ children }) => (
                        <p className="text-gray-700 mb-4 leading-relaxed">{children}</p>
                      ),
                    },
                    list: {
                      bullet: ({ children }) => (
                        <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>
                      ),
                      number: ({ children }) => (
                        <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>
                      ),
                    },
                    listItem: ({ children }) => (
                      <li className="text-gray-700">{children}</li>
                    ),
                  }}
                />
              )}
            </div>

            {/* Footer */}
            <div className="mt-16 pt-8 border-t border-gray-200">
              <div className="text-center">
                <p className="text-gray-600">
                  If you have any questions about this {legalContent.title.toLowerCase()}, please contact us at{' '}
                  <a 
                    href={`mailto:${siteSettings?.contactInfo?.email || 'info@company.com'}`}
                    className="text-orange-500 hover:text-orange-600 font-semibold"
                  >
                    {siteSettings?.contactInfo?.email || 'info@company.com'}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LegalPage;
