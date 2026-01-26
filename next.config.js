/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ykqwgyibfllxobccorww.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/period',
        destination: '/periode',
        permanent: true,
      },
      {
        source: '/latihansoal',
        destination: '/latihan',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;