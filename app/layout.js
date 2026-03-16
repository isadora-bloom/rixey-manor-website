import { Playfair_Display, Lora, Jost } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import SiteChrome from '@/components/layout/SiteChrome'
import SchemaMarkup from '@/components/SchemaMarkup'
import { supabase } from '@/lib/supabase'

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
})

const lora = Lora({
  variable: '--font-lora',
  subsets: ['latin'],
  display: 'swap',
})

const jost = Jost({
  variable: '--font-jost',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  metadataBase: new URL('https://www.rixeymanor.com'),
  title: {
    default: 'Rixey Manor | Historic Estate Wedding Venue | Rixeyville, Virginia',
    template: '%s | Rixey Manor',
  },
  description: 'A historic estate built in 1801 in Northern Virginia, 60 miles from Washington DC. Exclusive use wedding venue on 30 acres — one wedding per weekend, overnight lodging, no required vendors, BYOB.',
  openGraph: {
    siteName: 'Rixey Manor',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rixey Manor | Historic Estate Wedding Venue | Rixeyville, Virginia',
    description: 'A historic estate built in 1801 in Northern Virginia, 60 miles from Washington DC. Exclusive use, one wedding per weekend, overnight lodging, no required vendors, BYOB.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

async function getCalendlyUrl() {
  const { data } = await supabase
    .from('site_content')
    .select('value')
    .eq('key', 'calendly_url')
    .single()
  return data?.value || ''
}

export default async function RootLayout({ children }) {
  const calendlyUrl = await getCalendlyUrl()
  return (
    <html lang="en" className={`${playfair.variable} ${lora.variable} ${jost.variable}`}>
      <head>
        <link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet" />
      </head>
      <body>
        <SchemaMarkup />
        <SiteChrome calendlyUrl={calendlyUrl}>
          {children}
        </SiteChrome>
        <Script
          src="https://assets.calendly.com/assets/external/widget.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  )
}
