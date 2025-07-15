/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ⚠️ Ye line must hai!
    ignoreDuringBuilds: true,
  },
  // agar tu koi aur config use kar raha hai toh woh bhi yahin likhna
};

export default nextConfig;
export const config = {
  runtime: 'edge',
};
export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 60; // seconds
export const preferredRegion = 'auto'; // or specify a region like 'us-east1'
export const fetchCache = 'force-no-store'; // disable fetch cache