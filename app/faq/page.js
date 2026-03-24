import Link from 'next/link'
import Image from 'next/image'
import { supabaseServer } from '@/lib/supabaseServer'
import { getSiteImages } from '@/lib/getSiteImages'
import FadeUp from '@/components/ui/FadeUp'
import FaqAccordion from '@/components/faq/FaqAccordion'
import ContactForm from '@/components/ui/ContactForm'
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

      {/* Getting here */}
      <section className="bg-[var(--cream)] border-t border-[var(--border)] py-16 lg:py-20 px-6 lg:px-10">
        <div className="max-w-3xl mx-auto">
          <FadeUp>
            <p className="eyebrow mb-8">Getting here</p>
          </FadeUp>
          <div className="flex flex-col divide-y divide-[var(--border)]">
            {[
              {
                q: 'How far is Rixey Manor from Washington DC?',
                a: 'About 60 miles — roughly an hour via I-66 west to Route 29 south, or Route 66 to Route 211. The drive is straightforward and scenic once you\'re past Gainesville. Most DC and Northern Virginia couples find it an easy trip for a full weekend.',
              },
              {
                q: 'Where exactly is Rixey Manor?',
                a: 'Rixey Manor is at 9155 Pleasant Hill Lane, Rixeyville, Virginia 22737 — in Culpeper County, in the Blue Ridge foothills of Northern Virginia. Culpeper town is about 10–15 minutes away and Warrenton is about 25–30 minutes. GPS directions work reliably.',
              },
              {
                q: 'How far is Rixey Manor from Warrenton, Culpeper, and Fredericksburg?',
                a: 'Culpeper is the closest town — about 10–15 minutes away. Warrenton is about 25–30 minutes. Fredericksburg is about 50 minutes. Most guests from Northern Virginia, the Shenandoah Valley, and the Richmond area find the drive straightforward.',
              },
              {
                q: 'What is the closest airport to Rixey Manor?',
                a: 'Dulles International (IAD) is the closest at about 55 miles — roughly an hour\'s drive. Reagan National (DCA) is about 70 miles. Richmond International (RIC) is about 95 miles for guests coming from the south.',
              },
              {
                q: 'Is Rixey Manor near Charlottesville?',
                a: 'Yes — about 60 miles, an hour\'s drive east on Route 29 north through Culpeper. Charlottesville guests regularly make the trip, and it\'s a common route for guests coming from UVA or the Shenandoah Valley.',
              },
              {
                q: 'Is there lodging nearby for wedding guests who can\'t stay on the estate?',
                a: 'Yes — and this is one of the things couples are often relieved to hear. Culpeper is only 10–15 minutes from the estate. The Holiday Inn Express and Hampton Inn are both right there, along with a growing number of boutique stays and Airbnbs in the area. Guests can attend a late reception and be in their room in 15 minutes. We share a full accommodation guide with every couple after they book.',
              },
            ].map(({ q, a }) => (
              <FadeUp key={q}>
                <div className="py-7">
                  <h3
                    className="text-[17px] text-[var(--ink)] mb-3 leading-snug"
                    style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}
                  >
                    {q}
                  </h3>
                  <p className="body-copy text-[15px]">{a}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Contact form */}
      <section className="bg-[var(--warm-white)] border-t border-[var(--border)] py-16 lg:py-20 px-6 lg:px-10">
        <div className="max-w-2xl">
          <FadeUp>
            <p className="eyebrow mb-5">Have a question before you visit?</p>
            <h2
              className="text-[26px] lg:text-[32px] leading-[1.15] text-[var(--ink)] mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Ask us anything.
            </h2>
            <p className="body-copy mb-8">
              Not quite ready to book a tour but want to ask something first? We reply within 24 hours.
              Or call / text us at <a href="tel:+15402124545" className="text-link">(540) 212-4545</a>.
            </p>
            <ContactForm />
          </FadeUp>
        </div>
      </section>

      {/* Still have questions */}
      <section className="bg-[var(--cream)] py-16 lg:py-20 px-6 lg:px-10 border-t border-[var(--border)]">
        <div className="max-w-xl">
          <FadeUp>
            <p className="eyebrow mb-5">Ready to see it?</p>
            <h2
              className="text-[26px] lg:text-[32px] leading-[1.15] text-[var(--ink)] mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              The fastest answer is a tour.
            </h2>
            <p className="body-copy mb-8">
              Most couples know within the first 10 minutes. Tours are free and Isadora gives them herself.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Link href="/pricing#book-tour" className="btn-primary">Book a Tour</Link>
              <a href="tel:+15402124545" className="btn-outline-white !text-[var(--ink-mid)] !border-[var(--border)] hover:!border-[var(--sage)] hover:!bg-transparent">(540) 212-4545</a>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  )
}
