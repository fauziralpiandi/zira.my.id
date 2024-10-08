import type { MetadataRoute } from 'next'

import { site } from 'app/site'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.title,
    short_name: site.title,
    description: site.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#111111',
    icons: [
      {
        src: 'icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  }
}
