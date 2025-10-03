"use client";

import { useEffect, useState } from 'react';
import { safeFetch } from '@/sanity/lib/client';
import { siteSettingsQuery } from '@/sanity/lib/queries';
import Link from 'next/link';
import Breadcrumb from "@/components/Common/Breadcrumb";

const LegalPage = () => {
  const [siteSettings, setSiteSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const settings = await safeFetch(siteSettingsQuery);
        setSiteSettings(settings);
      } catch (error) {
        console.error('Error fetching site settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const legalPages = [];
  
  if (siteSettings?.legal?.privacyPolicy) {
    legalPages.push({
      title: siteSettings.legal.privacyPolicy.title,
      slug: siteSettings.legal.privacyPolicy.slug?.current || 'privacy-policy',
      description: 'Learn about how we collect, use, and protect your personal information.',
      lastUpdated: siteSettings.legal.privacyPolicy.lastUpdated,
    });
  }
  
  if (siteSettings?.legal?.termsOfService) {
    legalPages.push({
      title: siteSettings.legal.termsOfService.title,
      slug: siteSettings.legal.termsOfService.slug?.current || 'terms-of-service',
      description: 'Read our terms of service and conditions of use.',
      lastUpdated: siteSettings.legal.termsOfService.lastUpdated,
    });
  }
  
  if (siteSettings?.legal?.cookiePolicy) {
    legalPages.push({
      title: siteSettings.legal.cookiePolicy.title,
      slug: siteSettings.legal.cookiePolicy.slug?.current || 'cookie-policy',
      description: 'Understand how we use cookies and similar technologies.',
      lastUpdated: siteSettings.legal.cookiePolicy.lastUpdated,
    });
  }

  return (
    <>
      <Breadcrumb
        pageName="Legal Information"
        description="Important legal documents and policies"
      />

      <section className="pb-16">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Legal Information
              </h2>
              <p className="text-gray-600 text-lg">
                Please review our legal documents and policies to understand how we operate and protect your rights.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {legalPages.map((page, index) => (
                <div
                  key={index}
                  className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-lg shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-shadow duration-300"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {page.title}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {page.description}
                  </p>
                  {page.lastUpdated && (
                    <p className="text-sm text-gray-500 mb-6">
                      Last updated: {new Date(page.lastUpdated).toLocaleDateString()}
                    </p>
                  )}
                  <Link
                    href={`/legal/${page.slug}`}
                    className="inline-block bg-gradient-to-r from-gray-900 to-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-500 transition-all duration-300"
                  >
                    Read More
                  </Link>
                </div>
              ))}
            </div>

            {legalPages.length === 0 && (
              <div className="text-center py-16">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  No Legal Pages Available
                </h3>
                <p className="text-gray-600">
                  Legal pages will appear here once they are configured in Sanity Studio.
                </p>
              </div>
            )}

            <div className="mt-16 pt-8 border-t border-gray-200">
              <div className="text-center">
                <p className="text-gray-600">
                  If you have any questions about our legal documents, please contact us at{' '}
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
