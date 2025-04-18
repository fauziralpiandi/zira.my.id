import { type MetadataRoute } from 'next';

import { constant } from '@/lib/constant';

const { title, description } = constant;

export default function Manifest(): MetadataRoute.Manifest {
  return {
    name: title,
    short_name: title,
    description: description,
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#0a0a0a',
    icons: [
      {
        src: '/imgs/logo.svg',
        type: 'image/svg+xml',
        sizes: 'any',
      },
    ],
  };
}
