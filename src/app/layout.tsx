"use client";

import dynamic from 'next/dynamic';
import Script from 'next/script';
import { Inter } from "next/font/google";
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
// Prevent Font Awesome from adding its CSS since we did it manually above
config.autoAddCss = false;
import { Providers } from "./providers";
import { CartProvider } from "@/contexts/CartContext";
import { AnalyticsProvider } from "@/contexts/AnalyticsContext";
import "../styles/index.css";
import "../styles/sanity-global.css";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { client } from '@/sanity/lib/client';
import { siteSettingsQuery } from '@/sanity/lib/queries';
import { disableReactDevTools, useReactDevToolsErrorHandler } from '@/utils/devtools';
import { SupabaseProvider } from '@/contexts/SupabaseProvider';


// Lazy load components
const Header = dynamic(() => import("@/components/Header"), { ssr: true });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: true });
const ScrollToTop = dynamic(() => import("@/components/ScrollToTop"), { ssr: false });

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isStudioPage = pathname?.startsWith('/studio');
  const isDashboardPage = pathname?.startsWith('/dashboard');
  const isClientAreaPage = pathname?.startsWith('/area-clienti');
  const [siteSettings, setSiteSettings] = useState(null);


  useEffect(() => {
    // Gestisce errori di React DevTools
    useReactDevToolsErrorHandler();
    
    // Disabilita React DevTools in produzione
    disableReactDevTools();

    const fetchSiteSettings = async () => {
      try {
        const settings = await client.fetch(siteSettingsQuery);
        setSiteSettings(settings);
        

      } catch (error) {
        console.error('Error fetching site settings:', error);
      }
    };

    if (!isStudioPage && !isDashboardPage && !isClientAreaPage) {
      fetchSiteSettings();
    }
  }, [isStudioPage, isDashboardPage, isClientAreaPage]);

  return (
    <html suppressHydrationWarning lang="en">
      <head>
        {siteSettings?.favicon && (
          <link rel="icon" href={siteSettings.favicon} />
        )}
        {siteSettings?.description && (
          <meta name="description" content={siteSettings.description} />
        )}

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes gradientMove {
            0% {
              background-position: 0 0, 0% 0%;
            }
            50% {
              background-position: 0 0, 100% 100%;
            }
            100% {
              background-position: 0 0, 0% 0%;
            }
          }
        `}} />
        {/* Load Google Fonts based on typography settings */}
        {siteSettings?.typography?.headingFont && (
          <link
            href={`https://fonts.googleapis.com/css2?family=${siteSettings.typography.headingFont}:wght@400;500;600;700&display=swap`}
            rel="stylesheet"
          />
        )}
        {siteSettings?.typography?.bodyFont && siteSettings.typography.bodyFont !== siteSettings.typography.headingFont && (
          <link
            href={`https://fonts.googleapis.com/css2?family=${siteSettings.typography.bodyFont}:wght@400;500;600&display=swap`}
            rel="stylesheet"
          />
        )}
      </head>
      {/* Google Analytics */}
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-2LJXM74D45"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-2LJXM74D45');
          `,
        }}
      />
      <body 
        className={`${inter.className}`}
        style={{
          fontFamily: siteSettings?.typography?.bodyFont || 'Inter',
          backgroundColor: isStudioPage ? '#1a1a1a' : undefined,
          color: isStudioPage ? '#ffffff' : undefined,
          backgroundImage: isStudioPage ? 'none' : `
            radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0),
            linear-gradient(135deg, #f97316 0%, #dc2626 15%, #991b1b 30%, #1f2937 55%, #4b5563 80%, #d1d5db 100%)
          `,
          backgroundSize: isStudioPage ? 'auto' : '20px 20px, 200% 200%',
          backgroundPosition: isStudioPage ? 'auto' : '0 0, 0% 0%',
          backgroundAttachment: isStudioPage ? 'auto' : 'fixed',
          minHeight: '100vh',
          animation: isStudioPage ? 'none' : 'gradientMove 25s ease-in-out infinite'
        }}
      >
        <Providers>
          <SupabaseProvider>
            <CartProvider>
              <AnalyticsProvider>
                {!isStudioPage && !isDashboardPage && !isClientAreaPage && <Header siteSettings={siteSettings} />}
                {children}
                {!isStudioPage && !isDashboardPage && !isClientAreaPage && <Footer />}
                {!isStudioPage && !isDashboardPage && !isClientAreaPage && <ScrollToTop />}
              </AnalyticsProvider>
            </CartProvider>
          </SupabaseProvider>
        </Providers>
      </body>
    </html>
  );
}

