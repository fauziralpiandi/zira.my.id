import type { MetadataRoute } from 'next';

export default function Manifest(): MetadataRoute.Manifest {
  return {
    name: 'Fauzira Alpiandi',
    short_name: 'Fauzira Alpiandi',
    description: 'All Cruise, No Breaks \u007E Y Nada Más.',
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
