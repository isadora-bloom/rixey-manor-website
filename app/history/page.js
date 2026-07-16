import Image from 'next/image'
import { getSiteImages } from '@/lib/getSiteImages'
import { getOgImage } from '@/lib/getPageSeo'
import { supabaseServer } from '@/lib/supabaseServer'
import FadeUp from '@/components/ui/FadeUp'
import AnchorNav from '@/components/layout/AnchorNav'
import ManorHistory from '@/components/history/ManorHistory'
import OwnerStory from '@/components/venue/OwnerStory'
import FullTeam from '@/components/history/FullTeam'
import FinalCTA from '@/components/home/FinalCTA'
const supabase = supabaseServer()

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const ogImage = await getOgImage('history')
  const title = 'Our History & Team — A 1801 Virginia Estate — Rixey Manor'
  const description = "The story of Rixey Manor: a working Virginia farmhouse whose famous columned front was added in the early 1900s for Margaret Rixey's wedding to Jim Dyer, its ties to Eppa Rixey and Marymount University, and how Isadora Martin-Dye restored the derelict estate into an inclusive Northern Virginia wedding venue. Meet the team who run your day."
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: 'https://www.rixeymanor.com/history' },
    openGraph: {
      title,
      description,
      url: 'https://www.rixeymanor.com/history',
      images: [{ url: ogImage || '/assets/hero-main.webp', width: 1200, height: 630 }],
    },
  }
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Rixey Manor', item: 'https://www.rixeymanor.com' },
    { '@type': 'ListItem', position: 2, name: 'History & Team', item: 'https://www.rixeymanor.com/history' },
  ],
}

// AboutPage node — tells search/AI this page IS the authoritative story of the
// entity "Rixey Manor", and hangs the named historical facts off it.
const aboutSchema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'The History of Rixey Manor',
  url: 'https://www.rixeymanor.com/history',
  about: {
    '@type': 'WeddingVenue',
    name: 'Rixey Manor',
    url: 'https://www.rixeymanor.com',
    foundingDate: '2014',
    yearBuilt: '1801',
    founder: { '@type': 'Person', name: 'Isadora Martin-Dye' },
    address: {
      '@type': 'PostalAddress',
      streetAddress: '9155 Pleasant Hill Lane',
      addressLocality: 'Rixeyville',
      addressRegion: 'VA',
      postalCode: '22737',
      addressCountry: 'US',
    },
  },
}

const HISTORY_ANCHORS = [
  { label: 'The Estate', href: '#heritage' },
  { label: 'Our Story',  href: '#story' },
  { label: 'The Team',   href: '#team' },
]

async function getHistoryData() {
  const [{ data: content }, siteImages] = await Promise.all([
    supabase.from('site_content').select('key, value').in('key', ['calendly_url']),
    getSiteImages([
      'history-hero', 'hero-venue',
      'history-farmhouse', 'history-pig-farm', 'history-construction',
      'history-margaret-wedding', 'history-anniversary',
      'history-family', 'history-coat-of-arms',
      'venue-team-isadora', 'venue-team-grace', 'history-team-bartenders',
    ]),
  ])

  const siteContent = (content || []).reduce((acc, row) => {
    acc[row.key] = row.value
    return acc
  }, {})

  return {
    heroImage: siteImages['history-hero'] || siteImages['hero-venue'] || null,
    historyImages: {
      'history-farmhouse':        siteImages['history-farmhouse'],
      'history-pig-farm':         siteImages['history-pig-farm'],
      'history-construction':     siteImages['history-construction'],
      'history-margaret-wedding': siteImages['history-margaret-wedding'],
      'history-anniversary':      siteImages['history-anniversary'],
      'history-family':           siteImages['history-family'],
      'history-coat-of-arms':     siteImages['history-coat-of-arms'],
    },
    isadoraImage: siteImages['venue-team-isadora'] || null,
    teamImages: {
      'venue-team-grace':        siteImages['venue-team-grace'],
      'history-team-bartenders': siteImages['history-team-bartenders'],
    },
    calendlyUrl: siteContent.calendly_url || '',
  }
}

export default async function HistoryPage() {
  const { heroImage, historyImages, isadoraImage, teamImages, calendlyUrl } = await getHistoryData()

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }} />

      {/* Hero */}
      <section className="bg-[var(--cream)] pt-40 pb-16 lg:pt-48 lg:pb-20 px-6 lg:px-10">
        <div className="max-w-3xl">
          <FadeUp>
            <p className="eyebrow mb-6">Our History &amp; Team</p>
            <h1
              className="text-[42px] lg:text-[58px] leading-[1.05] text-[var(--ink)] mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              A farmhouse, a wedding,<br />
              <em>and a house worth saving.</em>
            </h1>
            <p className="body-copy max-w-xl">
              Rixey Manor has been standing since 1801. What follows is where it came from,
              why the front you picture is younger than it looks, the family whose name it
              still carries, and the people who look after it now.
            </p>
          </FadeUp>
        </div>
      </section>

      <AnchorNav items={HISTORY_ANCHORS} />

      {heroImage && (
        <div className="relative w-full h-[40vh] lg:h-[55vh] overflow-hidden">
          <Image
            src={heroImage.url}
            alt={heroImage.alt_text || 'Rixey Manor, a historic Virginia estate'}
            fill
            className="object-cover"
            style={{ objectPosition: heroImage.object_position || 'center center' }}
            sizes="100vw"
          />
        </div>
      )}

      <ManorHistory images={historyImages} />
      <OwnerStory image={isadoraImage} />
      <FullTeam teamImages={teamImages} />
      <FinalCTA calendlyUrl={calendlyUrl} />
    </>
  )
}
