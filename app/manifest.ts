import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'QuickReply',
    short_name: 'QuickReply',
    description: 'A mobile-first snippet manager for solopreneurs and online sellers.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F7F7FB',
    theme_color: '#FF4D3D',
    share_target: {
      action: '/',
      method: 'GET',
      params: {
        title: 'title',
        text: 'text',
        url: 'url',
      },
    },
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
