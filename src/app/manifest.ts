import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SkillSwap Dashboard',
    short_name: 'SkillSwap',
    description: 'Peer-to-peer skill exchange platform built with Liquid Glass UI',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#22d3ee',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icons/icon-maskable-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
