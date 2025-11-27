/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable typed routes to avoid symlink issues
  typedRoutes: false,
  
  // Image optimization configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  
  // Optimize for serverless deployment on Vercel
  serverExternalPackages: ['sharp', 'bcrypt'],
  
  // Production optimizations
  eslint: {
    // Only run linting during development
    ignoreDuringBuilds: true,
  },
  
  typescript: {
    // Run type checking separately in CI/CD
    ignoreBuildErrors: false,
  },
  
  // Webpack configuration for browser polyfills
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        buffer: require.resolve('buffer'),
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        util: require.resolve('util'),
        url: require.resolve('url'),
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  
  // Experimental features for better performance
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
}

module.exports = nextConfig