import type { MetadataRoute } from 'next';

export default function Manifest(): MetadataRoute.Manifest {
  return {
    name: 'Fauzira Alpiandi',
    short_name: 'Fauzira Alpiandi',
    description: 'A software engineer and writer building better experiences',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#0a0a0a',
    icons: [{ src: '/imgs/logo.svg', type: 'image/svg+xml', sizes: 'any' }],
  };
}
