import { type MetadataRoute } from 'next';

import { constant } from '~/lib/constant';

export default function Robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${constant.baseUrl}/sitemap.xml`,
  };
}
