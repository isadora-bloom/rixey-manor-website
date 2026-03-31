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

      {/* Last Call 2026 banner */}
      <section className="bg-[var(--cream)] border-b border-[var(--border)] py-10 px-6 lg:px-10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[10px] font-medium tracking-[0.25em] uppercase mb-3" style={{ fontFamily: 'var(--font-ui)', color: 'var(--rose)' }}>
            Last Call 2026
          </p>
          <p className="text-[var(--ink)] mb-3" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px, 3vw, 28px)' }}>
            Four dates left this year.
          </p>
          <p className="text-[var(--ink-light)] mb-5 max-w-lg mx-auto" style={{ fontFamily: 'var(--font-body)', fontSize: 15, lineHeight: 1.7 }}>
            Labor Day weekend &middot; November 14 &middot; December 12 &middot; December 19<br />
            One-day rate from $10,000. Full weekend from $12,000.
          </p>
          <a href="/pricing#calculator" className="btn-primary">See pricing</a>
        </div>
      </section>

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
      <section className="bg-[var(--cream)] border-t border-[var(--border)] py-14 px-6 lg:px-10 text-center">
        <p className="text-[var(--ink)] mb-5" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(18px, 2.5vw, 24px)', fontStyle: 'italic' }}>
          Ready to be next?
        </p>
        <a href="/pricing#book-tour" className="btn-primary">Book a Tour</a>
      </section>
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
      <section className="bg-[var(--warm-white)] border-t border-[var(--border)] py-14 px-6 lg:px-10 text-center">
        <p className="text-[var(--ink)] mb-3" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(18px, 2.5vw, 24px)', fontStyle: 'italic' }}>
          Ready to meet Isadora?
        </p>
        <p className="text-[var(--ink-light)] mb-6" style={{ fontFamily: 'var(--font-body)', fontSize: 15 }}>
          Tours are free. She gives them herself.
        </p>
        <a href="/pricing#book-tour" className="btn-primary">Book your tour</a>
      </section>
      <PortalSection />
      <FinalCTA calendlyUrl={siteContent.calendly_url} />
    </>
  )
}
