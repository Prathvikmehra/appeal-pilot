/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    outputFileTracingIncludes: {
      '/api/extract': ['./public/samples/**/*'],
    },
  },
};

export default nextConfig;
