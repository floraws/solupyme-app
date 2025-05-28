import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuración de imágenes
  images: {
    remotePatterns: [], // Para Next.js 15+ usar remotePatterns en lugar de domains
    dangerouslyAllowSVG: false,
    contentDispositionType: 'attachment',
    minimumCacheTTL: 60,
  },

  // Configuración para Next.js 15+
  serverExternalPackages: ['crypto'],
  
  // Configuración de Turbopack (ahora estable en Next.js 15+)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  // Configuración del compilador
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Configuración de Webpack para optimizar el bundle
  webpack: (config, { dev, isServer }) => {
    // Optimizaciones de seguridad
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
            reuseExistingChunk: true,
          },
        },
      };
    }

    return config;
  },

  // Configuración de redirecciones para mayor seguridad
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/login',
        permanent: false,
      },
    ];
  },

  // Variables de entorno públicas seguras
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Configuración de output para producción
  output: 'standalone',

  // Configuración de TypeScript
  typescript: {
    ignoreBuildErrors: false,
  },

  // Configuración de ESLint
  eslint: {
    ignoreDuringBuilds: false,
  },

  // Configuración de reescritura para API
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
};

export default nextConfig;
