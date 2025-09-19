"use client";

import dynamic from 'next/dynamic';
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import { CartProvider } from "@/contexts/CartContext";
import { AnalyticsProvider } from "@/contexts/AnalyticsContext";
import "../styles/index.css";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { client } from '@/sanity/lib/client';
import { siteSettingsQuery } from '@/sanity/lib/queries';


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
  const [siteSettings, setSiteSettings] = useState(null);


  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        const settings = await client.fetch(siteSettingsQuery);
        setSiteSettings(settings);
        

      } catch (error) {
        console.error('Error fetching site settings:', error);
      }
    };

    if (!isStudioPage && !isDashboardPage) {
      fetchSiteSettings();
    }
  }, [isStudioPage, isDashboardPage]);

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
      <body 
        className={`${inter.className}`}
        style={{
          fontFamily: siteSettings?.typography?.bodyFont || 'Inter',
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0),
            linear-gradient(135deg, #f97316 0%, #dc2626 15%, #991b1b 30%, #1f2937 55%, #4b5563 80%, #d1d5db 100%)
          `,
          backgroundSize: '20px 20px, 200% 200%',
          backgroundPosition: '0 0, 0% 0%',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
          animation: 'gradientMove 25s ease-in-out infinite'
        }}
      >
        <Providers>
          <CartProvider>
            <AnalyticsProvider>
              {!isStudioPage && !isDashboardPage && <Header siteSettings={siteSettings} />}
              {children}
              {!isStudioPage && !isDashboardPage && <Footer />}
              {!isStudioPage && !isDashboardPage && <ScrollToTop />}
            </AnalyticsProvider>
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}

