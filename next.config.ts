// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', 
      },
      {
        protocol: 'https',
        hostname: 'mrdqsyihkarznjjpoyif.supabase.co', 
      },
      {
        protocol: 'https',
        hostname: 'images.remotePatterns', 
      },
    ],
  },
}

export default nextConfig