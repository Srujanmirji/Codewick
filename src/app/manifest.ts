import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SkillSwap',
    short_name: 'SkillSwap',
    description: 'Peer-to-peer skill exchange platform',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#3B82F6',
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
    ],
  }
}
