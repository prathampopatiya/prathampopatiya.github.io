/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // For GitHub Pages deployment
  basePath: process.env.NODE_ENV === 'production' ? '' : '',
  trailingSlash: true,
}

export default nextConfig
