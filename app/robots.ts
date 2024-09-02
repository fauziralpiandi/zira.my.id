import { site } from 'app/utils/constant'

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
