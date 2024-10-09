import { site } from '@/constant'

export default async function sitemap() {
  const routes = [''].map((route) => ({
    url: `${site.baseUrl}${route}`,
    lastModified: new Date().toISOString(),
  }))

  return routes
}
