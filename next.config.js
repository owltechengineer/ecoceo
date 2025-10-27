/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // swcMinify rimosso (deprecato in Next.js 15)
  // Configurazione immagini per Sanity CDN
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
  // Disabilita React DevTools in produzione per evitare errori
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'react-dom/client': 'react-dom/client',
      };
    }
    return config;
  },
  // Configurazione per evitare errori di compatibilità
  experimental: {
    // esmExternals rimosso (non raccomandato)
    optimizePackageImports: ['@supabase/supabase-js'],
  },
  // Headers per migliorare la compatibilità
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;