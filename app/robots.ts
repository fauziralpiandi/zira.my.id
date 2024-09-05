import { site } from 'app/lib/constant'

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*', // Come one, Come all!
      },
    ],
    sitemap: `${site.baseUrl}/sitemap.xml`,
    host: site.domain,
  }
}
