/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ✅ This line disables lint errors during build
    ignoreDuringBuilds: true,
  },
  // any other config...
};

export default nextConfig;
