export const metadata = {
  title: 'CollabConnect - Connect and Collaborate',
  description: 'Find and connect with collaborators around the world',
  manifest: '/manifest.json',
  themeColor: '#3b82f6',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'CollabConnect',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/icons/icon-192x192.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://collab-connect.com',
    title: 'CollabConnect - Connect and Collaborate',
    description: 'Find and connect with collaborators around the world',
    siteName: 'CollabConnect',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CollabConnect',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CollabConnect - Connect and Collaborate',
    description: 'Find and connect with collaborators around the world',
    images: ['/og-image.png'],
    creator: '@collabconnect',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};
