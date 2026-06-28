import { Playfair_Display, Lora, Jost } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import SiteChrome from '@/components/layout/SiteChrome'
import SchemaMarkup from '@/components/SchemaMarkup'
import { supabaseServer } from '@/lib/supabaseServer'
const supabase = supabaseServer()

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
        <Script id="clarity-init" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script","w0v3ezs3ab");`}
        </Script>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-F42M0XMRVC"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-F42M0XMRVC');
          `}
        </Script>
        <Script
          src="https://assets.calendly.com/assets/external/widget.js"
          strategy="lazyOnload"
        />

        {/* Bloom House pixel config. Runs before the pixel loads so it can
            (a) unify the visitor id — the Bloom pixel keys web_visits on
            `bloom_visitor_id`, but the site's own attribution layer
            (lib/visitor.js) keys on `rixey_vid`. We seed bloom_visitor_id
            from rixey_vid (generating a shared id if neither exists) so a
            pixel pageview and a later calculator submission stitch to the
            SAME couple in Bloom. (b) set the per-venue ingest key + endpoint.
            Key is public by design (mig 309) — safe to embed. */}
        <Script id="bloom-pixel-config" strategy="beforeInteractive">
          {`(function(){
            try{
              function rc(n){var m=document.cookie.match(new RegExp('(?:^|; )'+n+'=([^;]*)'));return m?decodeURIComponent(m[1]):null}
              function wc(n,v){document.cookie=n+'='+encodeURIComponent(v)+'; Max-Age=31536000; Path=/; SameSite=Lax'}
              var id=rc('rixey_vid');
              if(!id){try{id=localStorage.getItem('rixey_vid')}catch(e){}}
              if(!id){id=(window.crypto&&window.crypto.randomUUID)?window.crypto.randomUUID():'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c){var r=Math.random()*16|0,v=c==='x'?r:(r&0x3|0x8);return v.toString(16)})}
              wc('rixey_vid',id);try{localStorage.setItem('rixey_vid',id)}catch(e){}
              wc('bloom_visitor_id',id);
            }catch(e){}
            window.BLOOM_PIXEL_KEY=${JSON.stringify(process.env.NEXT_PUBLIC_BLOOM_PIXEL_KEY || '4114bda6-34be-40cb-bdef-dfbb01b0f52f')};
            window.BLOOM_PIXEL_ENDPOINT=${JSON.stringify(process.env.NEXT_PUBLIC_BLOOM_PIXEL_ENDPOINT || 'https://app.thebloomhouse.ai/api/v1/visit')};
          })();`}
        </Script>
        <Script src="/bloom-pixel.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}
