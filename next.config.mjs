/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Remove static export for Vercel deployment
  // output: 'export',
  // trailingSlash: true,
  // basePath: process.env.NODE_ENV === 'production' ? '/portfolio-1' : '',
  // assetPrefix: process.env.NODE_ENV === 'production' ? '/portfolio-1/' : '',
}

export default nextConfig
