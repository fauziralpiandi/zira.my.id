import type { MetadataRoute } from 'next';

export default function Robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/*',
      disallow: '/api/*',
    },
    sitemap: 'https://zira.my.id/sitemap.xml',
  };
}
