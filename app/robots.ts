import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/superadmin/', '/api/', '/form/', '/auth/', '/update-password/'],
    },
    sitemap: 'https://www.genestac.com/sitemap.xml',
  }
}
