import type { MetadataRoute } from 'next'

import { site } from 'app/lib/constant'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/',
    },
    sitemap: `${site.baseUrl}/sitemap.xml`,
    host: site.domain,
  }
}
