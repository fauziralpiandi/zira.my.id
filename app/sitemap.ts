import { site } from '~/constant'

export default async function sitemap() {
  return [
    {
      url: site.baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]
}
