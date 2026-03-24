import Link from 'next/link'
import Image from 'next/image'
import { supabaseServer } from '@/lib/supabaseServer'
import { getSiteImages } from '@/lib/getSiteImages'
import FadeUp from '@/components/ui/FadeUp'
import FaqAccordion from '@/components/faq/FaqAccordion'
import { getOgImage } from '@/lib/getPageSeo'
const supabase = supabaseServer()

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const ogImage = await getOgImage('faq')
  return {
    title: { absolute: 'Wedding Venue FAQ — Rixey Manor' },
    description: 'Answers to everything about this Northern Virginia estate wedding venue in Culpeper County: catering, capacity, pets, accessibility, vendor policy, inclusions, and how a full Rixey weekend works.',
    alternates: { canonical: 'https://www.rixeymanor.com/faq' },
    openGraph: {
      title: 'Wedding Venue FAQ — Rixey Manor',
      description: 'Answers to everything about this Northern Virginia estate wedding venue in Culpeper County: catering, capacity, pets, accessibility, vendor policy, inclusions, and how a full Rixey weekend works.',
      url: 'https://www.rixeymanor.com/faq',
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630 }] }),
    },
  }
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Rixey Manor', item: 'https://www.rixeymanor.com' },
    { '@type': 'ListItem', position: 2, name: 'FAQ', item: 'https://www.rixeymanor.com/faq' },
  ],
}

async function getManorImage() {
  const images = await getSiteImages(['faq-banner'])
  return images['faq-banner']
}

async function getFaqs() {
  const { data } = await supabase
    .from('faqs')
    .select('*')
    .eq('active', true)
    .order('sort_order')
  return data || []
}

function buildFaqSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  }
}

export default async function FaqPage() {
  const [faqs, manorImage] = await Promise.all([getFaqs(), getManorImage()])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqSchema(faqs)) }}
      />

      {/* Hero */}
      <section className="bg-[var(--cream)] pt-40 pb-16 lg:pt-48 lg:pb-20 px-6 lg:px-10">
        <div className="max-w-3xl">
          <FadeUp>
            <p className="eyebrow mb-6">FAQ</p>
            <h1
              className="text-[42px] lg:text-[56px] leading-[1.05] text-[var(--ink)] mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Questions,<br />
              <em>answered honestly.</em>
            </h1>
            <p className="body-copy max-w-xl">
              {faqs.length > 0 ? `${faqs.length} questions` : 'Questions'} covering everything from capacity and pricing to vendors,
              pets, and what happens when it rains. If something isn't here, call or text us.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Manor image */}
      {manorImage && (
        <div className="relative w-full h-[35vh] lg:h-[50vh] overflow-hidden">
          <Image
            src={manorImage.url}
            alt={manorImage.alt_text || 'Rixey Manor estate'}
            fill
            className="object-cover"
            style={{ objectPosition: manorImage.object_position || 'center 60%' }}
            sizes="100vw"
          />
        </div>
      )}

      {/* FAQ body */}
      <section className="bg-[var(--warm-white)] py-16 lg:py-24 px-6 lg:px-10">
        <div className="max-w-3xl mx-auto">
          <FaqAccordion faqs={faqs} />
        </div>
      </section>

      {/* Still have questions */}
      <section className="bg-[var(--cream)] py-16 lg:py-20 px-6 lg:px-10 border-t border-[var(--border)]">
        <div className="max-w-xl">
          <FadeUp>
            <p className="eyebrow mb-5">Still have questions?</p>
            <h2
              className="text-[26px] lg:text-[32px] leading-[1.15] text-[var(--ink)] mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              The fastest answer is a phone call.
            </h2>
            <p className="body-copy mb-8">
              We're a small team and we pick up. If you'd rather text, that works too.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Link href="/pricing#book-tour" className="btn-primary">Book a Tour</Link>
              <a href="tel:+15402124545" className="btn-outline-white !text-[var(--ink-mid)] !border-[var(--border)] hover:!border-[var(--sage)] hover:!bg-transparent">(540) 212-4545</a>
              <Link href="/pricing#calculator" className="btn-outline-white !text-[var(--ink-mid)] !border-[var(--border)] hover:!border-[var(--sage)] hover:!bg-transparent">
                Build your estimate
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  )
}
