/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize HMR for better performance
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

export default nextConfig;
