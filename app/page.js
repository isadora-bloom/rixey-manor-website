import { supabaseServer } from '@/lib/supabaseServer'
import { getSiteImages } from '@/lib/getSiteImages'
import { getOgImage } from '@/lib/getPageSeo'

export const dynamic = 'force-dynamic'
import Hero from '@/components/home/Hero'
import OneThingSection from '@/components/home/OneThingSection'
import IncludedStrip from '@/components/home/IncludedStrip'
import PressStrip from '@/components/home/PressStrip'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import SpacesSection from '@/components/home/SpacesSection'
import QuizSection from '@/components/home/QuizSection'
import PricingSignal from '@/components/home/PricingSignal'
import StorySection from '@/components/home/StorySection'
import FinalCTA from '@/components/home/FinalCTA'
import PortalSection from '@/components/home/PortalSection'
import VideoSection from '@/components/ui/VideoSection'
import TikTokMoment from '@/components/home/TikTokMoment'
const supabase = supabaseServer()

export async function generateMetadata() {
  const ogImage = await getOgImage('home')
  return {
    title: { absolute: 'Historic Estate Wedding Venue in Virginia — Rixey Manor' },
    description: 'An 1801 manor in Northern Virginia, 60 miles from DC. Exclusive use, whole weekend, up to 250 guests. No vendor lock-in. Book a tour.',
    alternates: { canonical: 'https://www.rixeymanor.com' },
    openGraph: {
      title: 'Historic Estate Wedding Venue in Virginia — Rixey Manor',
      description: 'An 1801 manor in Northern Virginia, 60 miles from DC. Exclusive use, whole weekend, up to 250 guests. No vendor lock-in. Book a tour.',
      url: 'https://www.rixeymanor.com',
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630 }] }),
    },
  }
}

async function getHomeData() {
  const [
    { data: testimonials },
    { data: press },
    { data: spaces },
    { data: content },
    siteImages,
  ] = await Promise.all([
    supabase.from('homepage_testimonials').select('*'),
    supabase.from('homepage_press').select('*').order('sort_order'),
    supabase.from('spaces').select('*').order('sort_order'),
    supabase.from('site_content').select('key, value').in('key', [
      'quiz_url',
      'calendly_url',
      'pricing_one_day_from',
      'pricing_weekend_from',
      'availability_blurb',
      'feature_video_url',
      'video_terrace',
      'video_real_wedding',
    ]),
    getSiteImages(['hero-homepage', 'home-spaces-ceremony', 'home-spaces-ballroom', 'home-spaces-terrace', 'home-spaces-bar', 'home-team-isadora', 'home-quiz-bg']),
  ])

  const siteContent = (content || []).reduce((acc, row) => {
    acc[row.key] = row.value
    return acc
  }, {})

  return {
    testimonials: testimonials || [],
    press: press || [],
    spaces: spaces || [],
    heroImage: siteImages['hero-homepage'],
    spaceImages: {
      ceremony: siteImages['home-spaces-ceremony'],
      ballroom:  siteImages['home-spaces-ballroom'],
      terrace:   siteImages['home-spaces-terrace'],
      bar:       siteImages['home-spaces-bar'],
    },
    quizBgImage: siteImages['home-quiz-bg'],
    isadoraImage: siteImages['home-team-isadora'],
    siteContent,
    featureVideoUrl:    siteContent.feature_video_url || '',
    terraceVideoUrl:    siteContent.video_terrace || '',
    realWeddingVideoUrl: siteContent.video_real_wedding || '',
  }
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Rixey Manor',
  url: 'https://www.rixeymanor.com',
  logo: 'https://www.rixeymanor.com/assets/rixey-manor-logo.png',
  sameAs: [
    'https://www.instagram.com/rixeymanor',
    'https://www.facebook.com/rixeymanor',
    'https://www.theknot.com/marketplace/rixey-manor',
  ],
}

export default async function HomePage() {
  const {
    testimonials,
    press,
    spaces,
    spaceImages,
    heroImage,
    quizBgImage,
    isadoraImage,
    siteContent,
    featureVideoUrl,
    terraceVideoUrl,
    realWeddingVideoUrl,
  } = await getHomeData()

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <Hero heroImage={heroImage} videoUrl={featureVideoUrl} calendlyUrl={siteContent.calendly_url} />
      <OneThingSection />
      <IncludedStrip />
      <PressStrip press={press} />
      <VideoSection
        videoUrl={featureVideoUrl}
        posterImage={heroImage}
        eyebrow="The estate in motion"
        heading={<>30 seconds.<br /><em>See it before you visit.</em></>}
      />
      <TestimonialsSection testimonials={testimonials} />
      <TikTokMoment
        videoId="7613243160164191519"
        eyebrow="A 2027 bride"
        heading='"I love Rixey Manor."'
        title="Bride vlog — planning a wedding at Rixey Manor"
      />
      <SpacesSection spaces={spaces} spaceImages={spaceImages} />
      <TikTokMoment
        videoId="7565507952648424718"
        eyebrow="Shot on site"
        heading="This lift is life."
        title="Rixey Manor — first dance lift"
      />
      <VideoSection
        videoUrl={terraceVideoUrl}
        eyebrow="The terrace"
        heading={<>The lights that went viral.<br /><em>See why.</em></>}
      />
      <VideoSection
        videoUrl={realWeddingVideoUrl}
        eyebrow="Real Rixey"
        heading={<>A real wedding,<br /><em>start to finish.</em></>}
      />
      <QuizSection quizUrl={siteContent.quiz_url} backgroundImage={quizBgImage} />
      <PricingSignal
        oneDayFrom={siteContent.pricing_one_day_from}
        weekendFrom={siteContent.pricing_weekend_from}
        availabilityBlurb={siteContent.availability_blurb}
        calendlyUrl={siteContent.calendly_url}
      />
      <StorySection isadoraImage={isadoraImage} />
      <PortalSection />
      <FinalCTA calendlyUrl={siteContent.calendly_url} />
    </>
  )
}
