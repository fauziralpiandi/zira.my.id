import { site } from 'app/utils/constant'

// This is where we tell search engines how to behave.
export default function robots() {
  return {
    rules: [
      {
        userAgent: '*', // come one, come all!
      },
    ],
    sitemap: `${site.baseUrl}/sitemap.xml`,
    host: site.domain, // The home sweet home for my digital guests!
  }
}
