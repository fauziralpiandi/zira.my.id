import type { MetadataRoute } from 'next';
import { constant } from '@/lib/constant';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/stories', '/notes', '/misc'];
  const sitemap = routes.map(route => ({
    url: `${constant.baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return sitemap;
}
