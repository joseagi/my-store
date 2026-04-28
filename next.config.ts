// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'images.unsplash.com' },
      { hostname: 'lh3.googleusercontent.com' },
      { hostname: '*.supabase.co' },
    ],
  },
}

export default nextConfig