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
    // This is a workaround for a warning in the 'handlebars' library.
    // The library uses a deprecated feature ('require.extensions') that causes a warning in Webpack.
    // This configuration tells Webpack to ignore this specific warning for this specific library.
    config.module.rules.push({
      test: /node_modules\/handlebars\/lib\/index\.js$/,
      loader: 'string-replace-loader',
      options: {
        search: 'require.extensions',
        replace: 'null',
      },
    });

    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
};

export default nextConfig;
