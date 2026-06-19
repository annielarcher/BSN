import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { Analytics } from "@vercel/analytics/next";
import { ImageAssets } from '@/lib/placeholder-images';

const title = 'Banda Sinfônica Nacional';
const description = 'Excelência e inovação na música sinfônica brasileira. Sob a direção de Geyzi Moreira e a regência do maestro Alexandre Rocha.';
const imageUrl = '/og-image.png';

const siteUrl = 'https://bandasinfonicanacional.com.br';

export const metadata: Metadata = {
  // Adiciona a URL base para todas as URLs relativas
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: `%s | ${title}`,
  },
  description: description,
  keywords: [
    'Banda Sinfônica Nacional', 
    'BSN',
    'orquestra', 
    'música sinfônica', 
    'concerto', 
    'música clássica', 
    'banda de concerto',
    'Geyzi Moreira', 
    'Alexandre Rocha',
    'Rio de Janeiro',
    'música brasileira'
  ],
  authors: [{ name: 'Banda Sinfônica Nacional' }],
  creator: 'Banda Sinfônica Nacional',
  publisher: 'Banda Sinfônica Nacional',
  alternates: {
    canonical: '/',
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
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: title,
    description: description,
    url: siteUrl, // Adiciona a URL canônica
    siteName: title,
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: title,
    description: description,
    images: [imageUrl],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MusicGroup",
              "name": "Banda Sinfônica Nacional",
              "alternateName": "BSN",
              "url": "https://bandasinfonicanacional.com.br",
              "image": "https://i.ibb.co/RT04KgYz/BSN-logo-no-BG.png",
              "description": "Banda Sinfônica civil sediada no Rio de Janeiro, com repertório de música clássica e popular brasileira.",
              "foundingLocation": {
                "@type": "Place",
                "name": "Rio de Janeiro, Brasil"
              },
              "founder": {
                "@type": "Person",
                "name": "Geyzi Moreira"
              },
              "genre": [
                "Música Clássica",
                "Música Instrumental Brasileira",
                "Trilhas Sonoras"
              ],
              "sameAs": [
                "https://www.instagram.com/bandasinfonicanacionalbr",
                "https://youtube.com/@bandasinfonicanacional"
              ]
            })
          }}
        />
      </head>
      <body className={cn('font-body antialiased min-h-screen flex flex-col bg-background')}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
