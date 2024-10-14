import type { MetadataRoute } from 'next'

import { my, site } from '~/constant'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: my.fullName,
    short_name: my.nickName,
    description: site.description,
    start_url: '/',
    display: 'standalone',
    icons: [
      {
        src: 'icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  }
}
