import { type MetadataRoute } from 'next';
import { constant } from '~/lib/constant';

const { title, description } = constant;

export default function Manifest(): MetadataRoute.Manifest {
  return {
    name: title,
    short_name: title,
    description: description,
    start_url: '/',
    display: 'standalone',
    background_color: '#0c0a09',
    theme_color: '#0c0a09',
    icons: [
      {
        src: '/imgs/logo.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
