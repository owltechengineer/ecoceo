"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { getImageUrl } from '@/sanity/lib/image';

import { safeFetch } from '@/sanity/lib/client';
import { navbarServicesQuery } from '@/sanity/lib/queries';
import MiniCart from '@/components/Shop/MiniCart';

interface HeaderProps {
  siteSettings?: any;
}

const Header = ({ siteSettings }: HeaderProps) => {
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const servicesData = await safeFetch(navbarServicesQuery);
        setServices(servicesData || []);
      } catch (error) {
        console.error('Error fetching services:', error);
        setServices([]);
      }
    };

    fetchServices();
  }, []);



  return (
    <>
      <header
        className={`header top-0 left-0 z-20 flex w-full items-center ${
          isSticky ? "!fixed !z-[9999] shadow-sticky backdrop-blur-sm !transition text-white" : "absolute bg-transparent text-black"
        }`}
        style={{
          fontFamily: siteSettings?.typography?.headingFont || 'Inter',
          ...(isSticky && {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          })
        }}
      >
        <div className="container">
          <div className="relative -mx-4 flex items-center justify-between">
            <div className="w-72 max-w-full px-4 xl:mr-12">
              <Link href="/" className="header-logo block w-full py-3 group">
                {siteSettings?.logo ? (
                  <Image
                    src={getImageUrl(siteSettings.logo)}
                    alt="logo"
                    width={180}
                    height={40}
                    className="w-full dark:hidden transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-lg"
                  />
                ) : (
                  <Image
                    src="/images/logo/logo-2.svg"
                    alt="logo"
                    width={180}
                    height={40}
                    className="w-full dark:hidden transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-lg"
                  />
                )}
                {siteSettings?.logoDark ? (
                  <Image
                    src={getImageUrl(siteSettings.logoDark)}
                    alt="logo"
                    width={180}
                    height={40}
                    className="hidden w-full dark:block transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-lg"
                  />
                ) : (
                  <Image
                    src="/images/logo/logo.svg"
                    alt="logo"
                    width={180}
                    height={40}
                    className="hidden w-full dark:block transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-lg"
                  />
                )}
              </Link>
            </div>
            <div className="flex w-full items-center justify-between px-4">
              <div>
                <button
                  id="navbarToggler"
                  aria-label="Mobile Menu"
                  className="ring-primary absolute top-1/2 right-4 block translate-y-[-50%] rounded-lg px-3 py-[6px] focus:ring-2 lg:hidden"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <span className="relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white/30 backdrop-blur/30 backdrop-blur"></span>
                  <span className="relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white/30 backdrop-blur/30 backdrop-blur"></span>
                  <span className="relative my-1.5 block h-0.5 w-[30px] bg-black transition-all duration-300 dark:bg-white/30 backdrop-blur/30 backdrop-blur"></span>
                </button>
                <nav
                  id="navbarCollapse"
                  className={`navbar border-body-color/50 dark:border-body-color/20 dark:bg-dark absolute right-0 z-30 w-[280px] rounded-lg border-[.5px] bg-white/30 backdrop-blur/30 backdrop-blur px-6 py-4 duration-300 lg:visible lg:static lg:w-auto lg:border-none lg:!bg-transparent lg:p-0 lg:opacity-100 ${
                    isMobileMenuOpen ? "visible top-full opacity-100" : "invisible top-[120%] opacity-0"
                  }`}
                >
                  <ul className="block lg:flex lg:space-x-4">
                    <li className="group relative">
                      <Link
                        href="/"
                        className="group px-3 md:px-4 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-xs decoration-transparent md:text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-red-500 hover:to-orange-500 border border-orange-400/30 backdrop-blur h-8 md:h-9 w-auto shadow-lg"
                      >
                        Home
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          className="lucide lucide-home transition duration-300 group-hover:translate-x-0.5"
                        >
                          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                          <polyline points="9,22 9,12 15,12 15,22"></polyline>
                        </svg>
                      </Link>
                    </li>
                    {services.length > 0 && (
                      <li className="group relative">
                        <div className="relative">
                          <button
                            className="group px-3 md:px-4 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-xs decoration-transparent md:text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-red-500 hover:to-orange-500 border border-orange-400/30 backdrop-blur h-8 md:h-9 w-auto shadow-lg"
                            onMouseEnter={() => setIsServicesDropdownOpen(true)}
                            onMouseLeave={() => setIsServicesDropdownOpen(false)}
                          >
                            Servizi
                            <svg
                              className="ml-1 h-4 w-4 transition-transform duration-200"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </button>
                          {/* Dropdown Menu */}
                          <div
                            className={`absolute left-0 mt-2 w-64 rounded-md bg-white/30 backdrop-blur/30 backdrop-blur shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-200 lg:block ${
                              isServicesDropdownOpen ? "opacity-100 visible" : "opacity-0 invisible"
                            }`}
                            onMouseEnter={() => setIsServicesDropdownOpen(true)}
                            onMouseLeave={() => setIsServicesDropdownOpen(false)}
                          >
                            <div className="py-1">
                              <Link
                                href="/services"
                                className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150 border-b border-gray-100"
                              >
                                <div className="font-medium text-dark dark:text-white">Tutti i Servizi</div>
                              </Link>
                              {services.map((service, index) => (
                                <Link
                                  key={service._id || index}
                                  href={service.url || `/services/${service.slug?.current}`}
                                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                                >
                                  <div className="font-medium text-dark dark:text-white">{service.name}</div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      </li>
                    )}
                    <li className="group relative">
                      <Link
                        href="/about"
                        className="group px-3 md:px-4 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-xs decoration-transparent md:text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-red-500 hover:to-orange-500 border border-orange-400/30 backdrop-blur h-8 md:h-9 w-auto shadow-lg"
                      >
                        About
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          className="lucide lucide-user transition duration-300 group-hover:translate-x-0.5"
                        >
                          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      </Link>
                    </li>
                    <li className="group relative">
                      <Link
                        href="/shop"
                        className="group px-3 md:px-4 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-xs decoration-transparent md:text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-red-500 hover:to-orange-500 border border-orange-400/30 backdrop-blur h-8 md:h-9 w-auto shadow-lg"
                      >
                        Shop
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          className="lucide lucide-shopping-bag transition duration-300 group-hover:translate-x-0.5"
                        >
                          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                          <line x1="3" x2="21" y1="6" y2="6"></line>
                          <path d="M16 10a4 4 0 0 1-8 0"></path>
                        </svg>
                      </Link>
                    </li>
                    <li className="group relative">
                      <Link
                        href="/projects"
                        className="group px-3 md:px-4 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-xs decoration-transparent md:text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-red-500 hover:to-orange-500 border border-orange-400/30 backdrop-blur h-8 md:h-9 w-auto shadow-lg"
                      >
                        Progetti
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          className="lucide lucide-briefcase transition duration-300 group-hover:translate-x-0.5"
                        >
                          <rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect>
                          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                        </svg>
                      </Link>
                    </li>
                    <li className="group relative">
                      <Link
                        href="/blog"
                        className="group px-3 md:px-4 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-xs decoration-transparent md:text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-red-500 hover:to-orange-500 border border-orange-400/30 backdrop-blur h-8 md:h-9 w-auto shadow-lg"
                      >
                        Blog
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          className="lucide lucide-file-text transition duration-300 group-hover:translate-x-0.5"
                        >
                          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                          <polyline points="14,2 14,8 20,8"></polyline>
                          <line x1="16" x2="8" y1="13" y2="13"></line>
                          <line x1="16" x2="8" y1="17" y2="17"></line>
                          <polyline points="10,9 9,9 8,9"></polyline>
                        </svg>
                      </Link>
                    </li>
                    <li className="group relative">
                      <Link
                        href="/contact"
                        className="group px-3 md:px-4 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-xs decoration-transparent md:text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-red-500 hover:to-orange-500 border border-orange-400/30 backdrop-blur h-8 md:h-9 w-auto shadow-lg"
                      >
                        Support
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          className="lucide lucide-message-circle transition duration-300 group-hover:translate-x-0.5"
                        >
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                      </Link>
                    </li>
                    {/* Dashboard button removed */}
                  </ul>
                  
                  {/* Mobile CTA Buttons */}
                  <div className="mt-6 lg:hidden space-y-3">
                    <Link
                      href="/dashboard"
                      className="group px-3 md:px-4 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-xs decoration-transparent md:text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 text-white bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-900 h-8 md:h-9 w-full shadow-lg"
                    >
                      Dashboard
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="lucide lucide-bar-chart-3 transition duration-300 group-hover:translate-x-0.5"
                      >
                        <path d="M3 3v18h18"></path>
                        <path d="M18 17V9"></path>
                        <path d="M13 17V5"></path>
                        <path d="M8 17v-3"></path>
                      </svg>
                    </Link>
                    <Link
                      href="/client-area"
                      className="group px-3 md:px-4 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-xs decoration-transparent md:text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-red-500 hover:to-orange-500 h-8 md:h-9 w-full shadow-lg"
                    >
                      Area Clienti
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="lucide lucide-arrow-right transition duration-300 group-hover:translate-x-0.5"
                      >
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </Link>
                  </div>
                </nav>
              </div>
              <div className="flex items-center justify-end pr-16 lg:pr-0 gap-4">
                <MiniCart />
                <Link
                  href="/client-area"
                  className="group px-3 md:px-4 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-xs decoration-transparent md:text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-red-500 hover:to-orange-500 h-8 md:h-9 w-auto shadow-lg"
                >
                  Area Clienti
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="lucide lucide-arrow-right transition duration-300 group-hover:translate-x-0.5"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
