import { site } from '~/constant'

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/',
    },
    sitemap: `${site.baseUrl}/sitemap.xml`,
    host: site.host,
  }
}
