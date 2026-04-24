/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['three'],
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
