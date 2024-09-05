import { site } from 'app/lib/constant'

// Think of it as our website's treasure map for search engines!
export default async function sitemap() {
  let routes = [''].map((route) => ({
    url: `${site.baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return routes // "Hey search engines, check this out!"
}
