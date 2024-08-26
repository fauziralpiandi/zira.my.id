import { site } from 'app/utils/config'

// Alright, folks! Here we go, creating a sitemap.
// Think of it as our website's treasure map for search engines!
export default async function sitemap() {
  let routes = [''].map((route) => ({
    url: `${site.baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  // Now, let's return our routes. This is basically saying,
  // "Hey search engines, check this out!"
  return routes
}
