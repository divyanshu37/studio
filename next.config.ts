import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.BACKEND_URL,
    NEXT_PUBLIC_GOOGLE_PLACES_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY,
  },
  webpack: (config, { isServer }) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    // This is a workaround for a warning in the 'handlebars' library used by a dependency.
    config.module.rules.push({
      test: /node_modules\/handlebars\/lib\/index\.js$/,
      loader: 'string-replace-loader',
      options: {
        search: 'require.extensions',
        replace: 'null',
      },
    });
    return config;
  },
  allowedDevOrigins: [
    'https://9000-firebase-studio-1751933235617.cluster-joak5ukfbnbyqspg4tewa33d24.cloudworkstations.dev',
    'https://6000-firebase-studio-1751933235617.cluster-joak5ukfbnbyqspg4tewa33d24.cloudworkstations.dev'
  ],
};

export default nextConfig;
