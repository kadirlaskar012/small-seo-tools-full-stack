import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Toaster } from '@/components/ui/toaster'
import { getSiteSettings } from '@/lib/db'

const inter = Inter({ subsets: ['latin'] })

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const siteName = settings.find(s => s.key === 'site_name')?.value || 'SEO Tools Pro'
  const siteDescription = settings.find(s => s.key === 'site_description')?.value || 'Free online SEO tools for webmasters and digital marketers'
  
  return {
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description: siteDescription,
    keywords: 'SEO tools, free online tools, text tools, PDF tools, image tools, converter tools',
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
    alternates: {
      canonical: '/',
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: '/',
      title: siteName,
      description: siteDescription,
      siteName: siteName,
    },
    twitter: {
      card: 'summary_large_image',
      title: siteName,
      description: siteDescription,
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
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getSiteSettings()
  const googleAnalytics = settings.find(s => s.key === 'google_analytics_id')?.value
  const googleAdsense = settings.find(s => s.key === 'google_adsense_id')?.value
  const googleVerification = settings.find(s => s.key === 'google_verification')?.value

  return (
    <html lang="en">
      <head>
        {googleVerification && (
          <meta name="google-site-verification" content={googleVerification} />
        )}
        {googleAdsense && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${googleAdsense}`}
            crossOrigin="anonymous"
          />
        )}
        {googleAnalytics && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalytics}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${googleAnalytics}');
                `,
              }}
            />
          </>
        )}
      </head>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}