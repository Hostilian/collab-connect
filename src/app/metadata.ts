export const metadata = {
  title: "Courier Connect — Instant delivery quotes",
  description: "Book local deliveries in seconds and let vetted couriers keep 70% of every job.",
  manifest: '/manifest.json',
  themeColor: '#f97316',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Courier Connect',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/icons/icon-192x192.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://courier-connect.io',
    title: 'Courier Connect — Instant delivery quotes',
    description: 'Book local deliveries in seconds and keep couriers paid fairly.',
    siteName: 'Courier Connect',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Courier Connect',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Courier Connect — Instant delivery quotes',
    description: 'Book local deliveries in seconds and let couriers keep 70%.',
    images: ['/og-image.png'],
    creator: '@courierconnect',
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
