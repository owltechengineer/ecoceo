"use client";

import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from '@/sanity/lib/image';
import { safeFetch } from '@/sanity/lib/client';
import { siteSettingsQuery } from '@/sanity/lib/queries';
import { useState, useEffect } from 'react';

const Footer = () => {
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
      <footer className="relative z-10 text-white pt-4 pb-4 backdrop-blur-[8px]" style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div className="container">
          <div className="-mx-4 flex flex-wrap items-center justify-between py-4">
            {/* Logo e descrizione - più piccoli */}
            <div className="w-full px-4 md:w-1/3 lg:w-1/4">
              <Link href="/" className="mb-2 inline-block">
                {siteSettings?.logo ? (
                  <Image
                    src={getImageUrl(siteSettings.logo)}
                    alt="logo"
                    width={100}
                    height={22}
                    className="h-auto w-auto dark:hidden"
                  />
                ) : (
                  <Image
                    src="/images/logo/logo-2.svg"
                    alt="logo"
                    width={100}
                    height={22}
                    className="h-auto w-auto dark:hidden"
                  />
                )}
                {siteSettings?.logoDark ? (
                  <Image
                    src={getImageUrl(siteSettings.logoDark)}
                    alt="logo"
                    width={100}
                    height={22}
                    className="hidden h-auto w-auto dark:block"
                  />
                ) : (
                  <Image
                    src="/images/logo/logo.svg"
                    alt="logo"
                    width={100}
                    height={22}
                    className="hidden h-auto w-auto dark:block"
                  />
                )}
              </Link>
            </div>

            {/* Quick Links - più compatti */}
            <div className="w-full px-4 md:w-1/3 lg:w-1/6">
              <h3 className="text-white mb-2 text-sm font-semibold">
                {siteSettings?.footer?.quickLinksTitle || "Link"}
              </h3>
              <ul className="space-y-1">
                {siteSettings?.footer?.quickLinks ? (
                  siteSettings.footer.quickLinks.slice(0, 4).map((link, index) => (
                    <li key={index}>
                      <Link
                        href={link.url}
                        className="text-gray-300 hover:text-orange-300 text-xs transition duration-300"
                      >
                        {link.title}
                      </Link>
                    </li>
                  ))
                ) : (
                  <>
                    <li>
                      <Link href="/about" className="text-gray-300 hover:text-orange-300 text-xs transition duration-300">
                        Chi Siamo
                      </Link>
                    </li>
                    <li>
                      <Link href="/contact" className="text-gray-300 hover:text-orange-300 text-xs transition duration-300">
                        Contatti
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* Contatti - compatti */}
            <div className="w-full px-4 md:w-1/3 lg:w-1/4">
              <h3 className="text-white mb-2 text-sm font-semibold">
                Contatti
              </h3>
              <div className="space-y-1">
                {siteSettings?.contactInfo?.email && (
                  <div className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 28 19" className="fill-current text-white/70">
                      <path d="M25.3636 0H2.63636C1.18182 0 0 1.16785 0 2.6052V15.3948C0 16.8322 1.18182 18 2.63636 18H25.3636C26.8182 18 28 16.8322 28 15.3948V2.6052C28 1.16785 26.8182 0 25.3636 0ZM25.3636 1.3831C25.5909 1.3831 25.7727 1.56241 25.7727 1.79366V4.64002L14 10.1192L2.22727 4.64002V1.79366C2.22727 1.56241 2.40909 1.3831 2.63636 1.3831H25.3636ZM25.3636 16.6169H2.63636C2.40909 16.6169 2.22727 16.4376 2.22727 16.2064V6.67667L13.3182 11.7947C13.7727 12.0434 14.2273 12.0434 14.6818 11.7947L25.7727 6.67667V16.2064C25.7727 16.4376 25.5909 16.6169 25.3636 16.6169Z" />
                    </svg>
                    <a href={`mailto:${siteSettings.contactInfo.email}`} className="text-gray-300 hover:text-orange-300 text-xs transition duration-300">
                      {siteSettings.contactInfo.email}
                    </a>
                  </div>
                )}
                {siteSettings?.contactInfo?.phone && (
                  <div className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 20 29" className="fill-current text-white/70">
                      <path d="M10 0C4.486 0 0 4.486 0 10c0 5.515 4.486 10 10 10s10-4.485 10-10C20 4.486 15.514 0 10 0zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
                    </svg>
                    <a href={`tel:${siteSettings.contactInfo.phone}`} className="text-gray-300 hover:text-orange-300 text-xs transition duration-300">
                      {siteSettings.contactInfo.phone}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Social Links - più piccoli */}
            <div className="w-full px-4 md:w-1/3 lg:w-1/6">
              <h3 className="text-white mb-2 text-sm font-semibold">Seguici</h3>
              <div className="flex items-center space-x-2">
                <Link
                  href="https://www.linkedin.com/company/owltech-engineering/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/20 hover:bg-white/30 flex h-8 w-8 items-center justify-center rounded-full text-white hover:text-orange-300 transition duration-300"
                  aria-label="LinkedIn"
                >
                  <svg width="12" height="12" viewBox="0 0 16 16" className="fill-current">
                    <path d="M15.3 0H.7C.3 0 0 .3 0 .7v14.7c0 .3.3.6.7.6h14.7c.4 0 .7-.3.7-.7V.7c0-.4-.3-.7-.7-.7zM4.7 13.6H2.4V6h2.4v7.6h-.1zM3.6 5c-.8 0-1.4-.7-1.4-1.4 0-.8.6-1.4 1.4-1.4.8 0 1.4.6 1.4 1.4-.1.7-.7 1.4-1.4 1.4zm10.9 8.6h-2.4V9.9c0-.9 0-2-1.2-2s-1.4 1-1.4 2v3.8H6.7V6h2.3v1h.1c.3-.6 1.1-1.2 2.2-1.2 2.4 0 2.8 1.6 2.8 3.6v4.2h.1z" />
                  </svg>
                </Link>
                <Link
                  href="https://www.instagram.com/owltech.it/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/20 hover:bg-white/30 flex h-8 w-8 items-center justify-center rounded-full text-white hover:text-orange-300 transition duration-300"
                  aria-label="Instagram"
                >
                  <svg width="12" height="12" viewBox="0 0 16 16" className="fill-current">
                    <path d="M8 2.2c2.1 0 2.4.01 3.2.06.8.05 1.3.2 1.6.4.4.2.7.5.9.9.2.3.4.8.4 1.6.1.8.1 1.1.1 3.2s0 2.4-.1 3.2c-.1.8-.2 1.3-.4 1.6-.2.4-.5.7-.9.9-.3.2-.8.4-1.6.4-.8.1-1.1.1-3.2.1s-2.4 0-3.2-.1c-.8-.1-1.3-.2-1.6-.4-.4-.2-.7-.5-.9-.9-.2-.3-.4-.8-.4-1.6-.1-.8-.1-1.1-.1-3.2s0-2.4.1-3.2c.1-.8.2-1.3.4-1.6.2-.4.5-.7.9-.9.3-.2.8-.4 1.6-.4.8-.1 1.1-.1 3.2-.1zm0-1.4c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm0 6.6c-1.4 0-2.6-1.2-2.6-2.6s1.2-2.6 2.6-2.6 2.6 1.2 2.6 2.6-1.2 2.6-2.6 2.6zm5.3-6.7c0 .5-.4.9-.9.9s-.9-.4-.9-.9.4-.9.9-.9.9.4.9.9z" />
                  </svg>
                </Link>
                <Link
                  href="https://www.youtube.com/@OWLTECHENGINEERING"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/20 hover:bg-white/30 flex h-8 w-8 items-center justify-center rounded-full text-white hover:text-orange-300 transition duration-300"
                  aria-label="YouTube"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" className="fill-current">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Bar - compatta */}
        <div className="border-t border-gray-300/30 py-3">
          <div className="container">
            <div className="-mx-4 flex flex-wrap items-center justify-between">
              <div className="w-full px-4 md:w-1/2">
                <p className="text-white text-xs text-center md:text-left">
                  &copy; {new Date().getFullYear()} {siteSettings?.title || "Your Company"}. {siteSettings?.footer?.copyrightText || "All rights reserved."}
                </p>
              </div>
              <div className="w-full px-4 md:w-1/2">
                <p className="text-white text-xs text-center md:text-right">
                  {siteSettings?.footer?.developerCredit?.text || "Designed and Developed by"}{" "}
                  <Link
                    href={siteSettings?.footer?.developerCredit?.companyUrl || "https://owltech.it"}
                    className="text-white hover:text-orange-300 font-semibold transition duration-300"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {siteSettings?.footer?.developerCredit?.companyName || "OWLTECH.IT"}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
