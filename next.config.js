/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ottimizzazioni per il build
  experimental: {
    optimizePackageImports: ['@sanity/image-url', 'next-sanity'],
  },
  
  // Compressione e ottimizzazioni
  compress: true,
  
  // Disabilita temporaneamente alcune regole ESLint per il build
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Ottimizzazioni per le immagini
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  
  // Ottimizzazioni per il bundle
  webpack: (config, { dev, isServer }) => {
    // Ottimizzazioni solo per il build di produzione
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          sanity: {
            test: /[\\/]node_modules[\\/]@sanity[\\/]/,
            name: 'sanity',
            chunks: 'all',
          },
        },
      };
    }
    
    return config;
  },
};

module.exports = nextConfig;
