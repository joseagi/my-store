import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/',
        '/checkout/',
        '/orders/',
      ],
    },
    sitemap: 'https://my-store-seven-alpha.vercel.app/sitemap.xml',
  }
}