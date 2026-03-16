import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { getSiteImages } from '@/lib/getSiteImages'
import { getOgImage } from '@/lib/getPageSeo'
import FadeUp from '@/components/ui/FadeUp'
import AvailabilityCalendar from '@/components/availability/AvailabilityCalendar'
import FinalCTA from '@/components/home/FinalCTA'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const ogImage = await getOgImage('availability')
  return {
    title: { absolute: 'Wedding Date Availability — Rixey Manor' },
    description: 'Check which weekends are still available at Rixey Manor. 24 months of availability shown. One wedding per weekend, exclusive use.',
    alternates: { canonical: 'https://www.rixeymanor.com/availability' },
    openGraph: {
      title: 'Wedding Date Availability — Rixey Manor',
      description: 'Check which weekends are still available at Rixey Manor. 24 months shown. One wedding per weekend.',
      url: 'https://www.rixeymanor.com/availability',
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630 }] }),
    },
  }
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Rixey Manor', item: 'https://www.rixeymanor.com' },
    { '@type': 'ListItem', position: 2, name: 'Availability', item: 'https://www.rixeymanor.com/availability' },
  ],
}

async function getPageData() {
  const [{ data: bookedDates }, { data: content }, seasonImages] = await Promise.all([
    supabase.from('booked_dates').select('id, start_date, end_date').order('start_date'),
    supabase.from('site_content').select('key, value').eq('key', 'calendly_url').single(),
    getSiteImages(['availability-hero', 'availability-spring', 'availability-summer', 'availability-fall', 'availability-winter']),
  ])

  return {
    bookedDates: bookedDates || [],
    calendlyUrl: content?.value || '',
    heroImage: seasonImages['availability-hero'] || seasonImages['availability-fall'] || null,
    images: {
      spring: seasonImages['availability-spring'],
      summer: seasonImages['availability-summer'],
      fall:   seasonImages['availability-fall'],
      winter: seasonImages['availability-winter'],
    },
  }
}

const SEASONS = [
  {
    key: 'spring',
    label: 'Spring',
    months: 'March — May',
    heading: <>Fresh. Vibrant.<br /><em>Books up fast.</em></>,
    copy: [
      "Virginia spring is the second most sought-after season here — and it earns it. The lake path clears in March, wildflowers come through April, and by May the whole property is a kind of green that photographs never quite capture. The light is soft. There\u2019s still a chill in the evening that makes everything feel alive.",
      'Spring couples tend to be decisive. They know what they want, they move on it, and they get a date that summer and fall couples end up wishing they had taken. The grounds are coming into themselves. If you want something that feels like a specific, unrepeatable moment — spring is that.',
    ],
  },
  {
    key: 'summer',
    label: 'Summer',
    months: 'June — August',
    heading: <>Slower. Warmer.<br /><em>Entirely its own thing.</em></>,
    copy: [
      'Summer at Rixey is quieter than you might expect — and that is mostly the heat. Virginia summers are warm in a way that slows everything down, which is not a bad thing for a wedding. Evenings stretch long, the ceremony site faces west, and the light in June is something photographers do not stop talking about.',
      'Summer dates are the most available of the peak seasons, which means more flexibility on date and usually on price. If you have always wanted a long, unhurried, golden-hour kind of wedding — the kind where nobody is in a rush to get inside — summer is genuinely worth considering.',
    ],
  },
  {
    key: 'fall',
    label: 'Fall',
    months: 'September — November',
    heading: <>The one couples<br /><em>plan around.</em></>,
    copy: [
      'Fall is the one. The Blue Ridge peaks behind the rooftop around October, the ceremony lake site is framed by colour, and the air has that exact quality that makes everything feel more immediate. Virginia autumn is the season couples plan around — and for very good reason.',
      'October Saturdays book earliest and hold their price. The light in September and October is specific and irreplaceable. If you have a fall date in mind, check it sooner than you think you need to. There are only so many of them and they go before almost anything else.',
    ],
  },
  {
    key: 'winter',
    label: 'Winter',
    months: 'December — February',
    heading: <>Quiet. Intimate.<br /><em>Entirely yours.</em></>,
    copy: [
      'Winter at Rixey is a different kind of wedding. Quieter. More contained. Snow is possible but rarely a logistical problem — the manor stays warm, the ballroom is made for candlelight, and the grounds look extraordinary when it does come. Off-peak pricing applies, which is genuinely significant.',
      'Winter couples tend to want something specific and smaller, and they usually get a weekend that feels entirely their own. No competition for the property, no urgency around the season. Just the estate, your people, and the particular stillness of Virginia in January or February.',
    ],
  },
]

export default async function AvailabilityPage() {
  const { bookedDates, calendlyUrl, heroImage, images } = await getPageData()

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Hero */}
      <section className="relative min-h-[55vh] lg:min-h-[65vh] flex items-end overflow-hidden bg-[var(--ink)]">
        {heroImage && (
          <Image
            src={heroImage.url}
            alt={heroImage.alt_text || 'Rixey Manor'}
            fill
            className="object-cover"
            style={{ objectPosition: heroImage.object_position || 'center center' }}
            sizes="100vw"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)]/70 via-[var(--ink)]/20 to-transparent" />
        <div className="relative z-10 px-6 lg:px-10 pb-16 lg:pb-20 pt-40 max-w-3xl">
          <FadeUp>
            <p className="eyebrow mb-6" style={{ color: 'rgba(255,255,255,0.65)' }}>Availability</p>
            <h1
              className="text-[42px] lg:text-[58px] leading-[1.05] text-white mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Is your date free?<br />
              <em>See for yourself.</em>
            </h1>
            <p className="max-w-xl text-[17px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)', fontFamily: 'var(--font-body)' }}>
              Two years shown below. Dates that are already booked are marked.
              Everything else is open — weekdays included.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Season divider */}
      <section className="bg-[var(--cream)] py-16 lg:py-20 px-6 lg:px-10 border-t border-[var(--border)]">
        <div className="max-w-3xl mx-auto text-center">
          <FadeUp>
            <p className="eyebrow mb-6">The seasons at Rixey</p>
            <h2
              className="text-[28px] lg:text-[38px] leading-[1.15] text-[var(--ink)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Every season here is worth marrying in.<br />
              <em>They're just different.</em>
            </h2>
          </FadeUp>
        </div>
      </section>

      {/* Season sections */}
      {SEASONS.map((season, i) => {
        const img = images[season.key]
        const imageLeft = i % 2 === 0

        return (
          <section
            key={season.key}
            id={`season-${season.key}`}
            className="bg-[var(--warm-white)] py-20 lg:py-28 px-6 lg:px-10 border-t border-[var(--border)]"
          >
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">

              {/* Image */}
              {img && (
                <FadeUp delay={imageLeft ? 0 : 100} className={imageLeft ? '' : 'lg:order-last'}>
                  <div className="relative w-full aspect-[4/3] overflow-hidden">
                    <Image
                      src={img.url}
                      alt={img.alt_text || `Rixey Manor in ${season.label}`}
                      fill
                      className="object-cover"
                      style={{ objectPosition: img.object_position || 'center center' }}
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                </FadeUp>
              )}

              {/* Text */}
              <FadeUp delay={imageLeft ? 100 : 0} className={!imageLeft && !img ? 'lg:col-span-2 max-w-2xl' : ''}>
                <p className="eyebrow mb-4">{season.label} &nbsp;·&nbsp; {season.months}</p>
                <h2
                  className="text-[26px] lg:text-[34px] leading-[1.15] text-[var(--ink)] mb-8"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {season.heading}
                </h2>
                <div className="flex flex-col gap-4">
                  {season.copy.map((p, j) => (
                    <p key={j} className="body-copy">{p}</p>
                  ))}
                </div>
              </FadeUp>

            </div>
          </section>
        )
      })}

      {/* Calendar */}
      <section className="bg-[var(--warm-white)] py-16 lg:py-24 px-6 lg:px-10 border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto">
          <AvailabilityCalendar bookedDates={bookedDates} calendlyUrl={calendlyUrl} />
        </div>
      </section>

      <FinalCTA calendlyUrl={calendlyUrl} />
    </>
  )
}
