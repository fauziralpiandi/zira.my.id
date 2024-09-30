import type { MetadataRoute } from 'next'

import { site } from 'app/lib/constant'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]
}
