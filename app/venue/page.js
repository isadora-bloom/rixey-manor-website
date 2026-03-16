import { supabase } from '@/lib/supabase'
import { getSiteImages } from '@/lib/getSiteImages'
import { getOgImage } from '@/lib/getPageSeo'
import VenueHero from '@/components/venue/VenueHero'
import AnchorNav from '@/components/venue/AnchorNav'
import EstateOverview from '@/components/venue/EstateOverview'
import VenueSpaces from '@/components/venue/VenueSpaces'
import Accommodations from '@/components/venue/Accommodations'
import OwnerStory from '@/components/venue/OwnerStory'
import TeamSection from '@/components/venue/TeamSection'
import Inclusions from '@/components/venue/Inclusions'
import DetailsSection from '@/components/venue/DetailsSection'
import FinalCTA from '@/components/home/FinalCTA'
import VideoSection from '@/components/ui/VideoSection'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const ogImage = await getOgImage('venue')
  return {
    title: { absolute: 'Northern Virginia Wedding Venue — Estate, Spaces & Lodging — Rixey Manor' },
    description: 'A historic estate in Culpeper County, Northern Virginia — ceremony lake views, terrace with clear-span tent, ballroom, 4 manor bedrooms + cottage. One wedding per weekend.',
    alternates: { canonical: 'https://www.rixeymanor.com/venue' },
    openGraph: {
      title: 'Northern Virginia Wedding Venue — Estate, Spaces & Lodging — Rixey Manor',
      description: 'A historic estate in Culpeper County, Northern Virginia — ceremony lake views, terrace with clear-span tent, ballroom, 4 manor bedrooms + cottage. One wedding per weekend.',
      url: 'https://www.rixeymanor.com/venue',
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630 }] }),
    },
  }
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Rixey Manor', item: 'https://www.rixeymanor.com' },
    { '@type': 'ListItem', position: 2, name: 'The Venue', item: 'https://www.rixeymanor.com/venue' },
  ],
}

async function getVenueData() {
  const [
    { data: content },
    siteImages,
  ] = await Promise.all([
    supabase.from('site_content').select('key, value').in('key', ['calendly_url', 'feature_video_url', 'video_venue_tour', 'video_terrace']),
    getSiteImages([
      'hero-venue',
      'venue-spaces-ceremony', 'venue-spaces-ballroom', 'venue-spaces-terrace', 'venue-spaces-rooftop',
      'venue-team-isadora', 'venue-team-grace',
      'venue-room-newlywed', 'venue-room-maple', 'venue-room-mountain', 'venue-room-back', 'venue-room-cottage',
      'venue-inclusions-accent', 'venue-inclusions-2', 'venue-inclusions-3',
    ]),
  ])

  const siteContent = (content || []).reduce((acc, row) => {
    acc[row.key] = row.value
    return acc
  }, {})

  return {
    heroImage: siteImages['hero-venue'],
    spaceImages: {
      ceremony: siteImages['venue-spaces-ceremony'],
      ballroom:  siteImages['venue-spaces-ballroom'],
      terrace:   siteImages['venue-spaces-terrace'],
      rooftop:   siteImages['venue-spaces-rooftop'],
    },
    roomImages: {
      'venue-room-newlywed': siteImages['venue-room-newlywed'],
      'venue-room-maple':    siteImages['venue-room-maple'],
      'venue-room-mountain': siteImages['venue-room-mountain'],
      'venue-room-back':     siteImages['venue-room-back'],
      'venue-room-cottage':  siteImages['venue-room-cottage'],
    },
    teamImages: {
      'venue-team-isadora': siteImages['venue-team-isadora'],
      'venue-team-grace':   siteImages['venue-team-grace'],
    },
    isadoraImage: siteImages['venue-team-isadora'],
    inclusionsImages: [
      siteImages['venue-inclusions-accent'],
      siteImages['venue-inclusions-2'],
      siteImages['venue-inclusions-3'],
    ].filter(Boolean),
    calendlyUrl:     siteContent.calendly_url || '',
    featureVideoUrl: siteContent.feature_video_url || '',
    venueTourUrl:    siteContent.video_venue_tour || '',
    terraceVideoUrl: siteContent.video_terrace || '',
  }
}

export default async function VenuePage() {
  const { heroImage, spaceImages, roomImages, teamImages, isadoraImage, inclusionsImages, calendlyUrl, featureVideoUrl, venueTourUrl, terraceVideoUrl } = await getVenueData()

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <VenueHero heroImage={heroImage} />
      <AnchorNav />
      <EstateOverview />
      <VideoSection
        videoUrl={venueTourUrl || featureVideoUrl}
        posterImage={heroImage}
        autoplay={!!(venueTourUrl || featureVideoUrl) && !(venueTourUrl || featureVideoUrl).includes('youtube') && !(venueTourUrl || featureVideoUrl).includes('vimeo')}
        eyebrow="The estate"
        heading={<>Everything you're imagining,<br /><em>on 30 acres.</em></>}
      />
      <VenueSpaces spaceImages={spaceImages} />
      <VideoSection
        videoUrl={terraceVideoUrl}
        eyebrow="The terrace"
        heading={<>The lights that went viral.<br /><em>See why.</em></>}
      />
      <Accommodations roomImages={roomImages} />
      <OwnerStory image={isadoraImage} />
      <TeamSection teamImages={teamImages} />
      <Inclusions accentImages={inclusionsImages} />
      <DetailsSection />
      <FinalCTA calendlyUrl={calendlyUrl} />
    </>
  )
}
