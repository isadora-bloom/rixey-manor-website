import Link from 'next/link'
import Image from 'next/image'
import { getSiteImages } from '@/lib/getSiteImages'
import FadeUp from '@/components/ui/FadeUp'
import { getOgImage } from '@/lib/getPageSeo'

export const dynamic = 'force-dynamic'

const META = {
  title: 'Inclusive Wedding Venue, Northern Virginia | LGBTQ+, Disabled, Chronic Illness, Neurodivergent | Rixey Manor',
  description: "Rixey Manor plans every wedding around the couple. LGBTQ+ couples and families, disabled couples, couples with chronic illness or ongoing medical needs, and neurodivergent couples are named and protected in every contract. What we commit to is written in.",
  url: 'https://www.rixeymanor.com/inclusion',
}

export async function generateMetadata() {
  const ogImage = await getOgImage('inclusion')
  return {
    title: { absolute: META.title },
    description: META.description,
    alternates: { canonical: META.url },
    openGraph: {
      title: META.title,
      description: META.description,
      url: META.url,
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630 }] }),
    },
  }
}

// Schemas — breadcrumb + FAQ. The FAQ entries answer real, high-intent
// queries (LGBTQ+, chronic illness, ADA, neurodivergent) so they're eligible
// for rich results and AI engines can quote them directly.
const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Rixey Manor', item: 'https://www.rixeymanor.com' },
    { '@type': 'ListItem', position: 2, name: 'Inclusion', item: META.url },
  ],
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is Rixey Manor LGBTQ+ friendly?',
      acceptedAnswer: { '@type': 'Answer', text: "Yes. LGBTQ+ couples and families are welcomed and protected at Rixey Manor by name, in writing, in every contract. Our intake forms use Partner 1 and Partner 2, our getting-ready spaces are couple's suites, our team uses 'wedding party' not 'bridal party', and we use the words you use for your wedding, your partner or partners, and your family. The coordinator briefs every vendor on the names, pronouns and roles that matter — yours, your wedding party's and your family's — ahead of the day, so nobody is misnamed in front of your guests. On request we can connect you with past LGBTQ+ couples who are happy to share their experience." },
    },
    {
      '@type': 'Question',
      name: 'Does Rixey Manor accommodate couples with chronic illness or ongoing medical needs?',
      acceptedAnswer: { '@type': 'Answer', text: "Yes — and the same applies to medical needs in the wedding party or family. Chronic illness, pregnancy, recovery, unpredictable flares, medication schedules, dietary needs that cannot slip — Rixey plans around all of it. Food and medication windows sit on the day-of timeline alongside the ceremony and first dance. A private space is reserved for the whole day at no additional charge, no questions asked when the couple, a wedding-party member or a guest needs to use it. The bar and catering teams are briefed on what matters without medical detail leaving the office. The couple decides what to disclose to guests, vendors, and family. If a condition is new to the venue, the team asks you first, not Google." },
    },
    {
      '@type': 'Question',
      name: 'Is Rixey Manor accessible for disabled couples and guests?',
      acceptedAnswer: { '@type': 'Answer', text: "The ballroom, the main-floor restrooms, the patio, and the lakeside ceremony lawn are step-free and ADA-compliant. Accessible parking is held adjacent to the entrance with a level path to the door. The coordinator walks the full route with any couple or guest who wants it mapped, photographed, or measured in advance. The historic upstairs bedrooms and the rooftop are reached by stairs only — this is named upfront in the first tour and in writing so it never becomes a day-of surprise. Mobility, sensory, Deaf/hard-of-hearing, blind/low-vision, and any access need not listed here — tell us and we build the day around your answer. Service animals are welcome." },
    },
    {
      '@type': 'Question',
      name: 'Does Rixey Manor accommodate neurodivergent couples?',
      acceptedAnswer: { '@type': 'Answer', text: "Yes, and it is a named operational commitment in every contract — for the couple, their wedding party, family and guests. Autistic, ADHD, AuDHD, sensory-sensitive, anxious, or simply wired differently than weddings tend to be built for. Planning starts by asking what celebrating actually looks like for you and what would reduce anxiety for the people standing closest to you on the day. The commitment is to listen and adapt, not to apply a template. Possible adaptations include agendas ahead of planning meetings, written summaries after conversations, communication synced across text and email, shorter sessions and more check-ins, DJ lighting reviewed in advance, a quiet space held open throughout the event, built-in breaks across the day. Nothing on the day is locked: a pre-agreed signal lets the coordinator pause, cut, or end any moment without making it a conversation in front of guests." },
    },
    {
      '@type': 'Question',
      name: 'What does the Rixey Manor anti-hate-speech clause cover?',
      acceptedAnswer: { '@type': 'Answer', text: "Every Rixey Manor contract carries a zero-tolerance clause on hate speech and harassment, with no exceptions, covering sexual orientation, gender identity and expression, race, religion, disability, national origin, age, and pregnancy. It applies to every person on the property during the booking — guests, vendors and family. Alongside it sits an anti-abuse clause protecting every couple and guest from abusive behaviour at the event." },
    },
  ],
}

// The four named communities. Order: LGBTQ+, chronic illness, disabled,
// neurodivergent. Identity-first language as the lead per the largest
// cross-disability preference survey (Sharif et al., ACM ASSETS '22) and
// ASAN's identity-first guidance. Each section names concrete operational
// markers couples in that community actively scan for.
const COMMUNITIES = [
  {
    slug: 'lgbtq',
    title: 'LGBTQ+ couples and families',
    body: [
      "You are welcomed and protected at Rixey Manor by name, in writing. Our intake forms use Partner 1 and Partner 2, our getting-ready spaces are couple's suites, our team uses “wedding party” not “bridal party”, and we use the words you use for your wedding, your partner or partners, and your family.",
      "Our coordinator briefs every vendor on the names, pronouns and roles that matter — yours, your wedding party's, your family's — ahead of the day, so nobody is misnamed in front of your guests. On request, we can connect you with past LGBTQ+ couples who are happy to share what working with us was like.",
    ],
  },
  {
    slug: 'chronic-illness',
    title: 'Couples with chronic illness or ongoing medical needs',
    body: [
      "Chronic illness, pregnancy, recovery, unpredictable flares, medication schedules, dietary needs that can’t slip — for you, or for someone in your wedding party or family. We plan around all of it. Food and medication windows go on the day-of timeline alongside the ceremony and first dance. A private space is reserved for the whole day at no additional charge, no questions asked when you or a guest needs to use it.",
      "We brief the bar and the catering team on what matters without medical detail leaving our office. You decide what to disclose to guests, vendors and even your own family — we follow your lead. If your condition is new to us, we ask you first, not Google.",
    ],
  },
  {
    slug: 'disabled',
    title: 'Disabled couples and couples with disabilities',
    body: [
      "The ballroom, the main-floor restrooms, the patio, and the lakeside ceremony lawn are step-free and ADA-compliant. Accessible parking is held adjacent to the entrance with a level path to the door. Our coordinator walks the full route with any couple, family member, wedding-party member or guest who wants it mapped, photographed, or measured in advance.",
      "The historic upstairs bedrooms and the rooftop are reached by stairs only. We name this in your first tour and in writing so it never becomes a day-of surprise. Mobility, sensory, Deaf/hard-of-hearing, blind/low-vision, or any access need not listed here — yours or anyone in your party's — tell us, and we build the day around the answer rather than the other way round. Service animals are welcome with a designated relief area and water. We use the words you use for yourself.",
    ],
  },
  {
    slug: 'neurodivergent',
    title: 'Neurodivergent couples',
    body: [
      "Autistic, ADHD, AuDHD, sensory-sensitive, anxious, or simply wired differently than weddings tend to be built for. We start by asking what celebrating actually looks like for you — and, where it matters, for the people standing closest to you on the day. What does a good day feel like in your body, for your brain, with your people?",
      "From there, we adapt to whatever actually reduces the anxiety in the room. That might mean agendas ahead of planning meetings, written summaries after conversations, communication synced across text and email, shorter sessions and more check-ins, DJ lighting reviewed in advance, a quiet space held open throughout the event, built-in breaks across the day — or some combination we work out together. We don't assume the same things help everyone. We listen, we try, and we change course when something isn't working.",
      "Nothing on the day is locked. If you, your partner, or anyone in your wedding party needs to leave the room, shorten the speeches, cut the dancing, or end early, that decision is yours and the coordinator carries it out without making it a conversation in front of your guests. A pre-agreed signal works if speaking out loud doesn’t.",
    ],
  },
]

// These are EXAMPLES of adaptations we've made when they would help — not a
// universal checklist we run on every wedding. The point of the list is to
// show range, not to promise we'll do every item on every booking. Anchored
// in adaptive language ("when …", "if …") rather than declarative practice.
const PRACTICE_BULLETS = [
  'Asking, at the start, how you and the people closest to you process information best.',
  "Sending agendas ahead of planning meetings when that lowers the load.",
  'Writing up summaries after conversations when memory feels unreliable or shared notes help.',
  "Syncing communication across text, email and video so the people who don't read every email still get the update.",
  "Shorter sessions, more check-ins, or a slower planning pace when that's what helps.",
  'Pre-ceremony time with guests when nerves need to settle before the formal moments begin.',
  'Built-in breaks across the day when standing through hours at a stretch is too much.',
  'Reviewing DJ lighting in advance when strobes or sudden changes are a problem.',
  'Holding a quiet space open throughout the event so anyone in your party can step out.',
  'Mapping medication, food and rest into the day timeline when that timing matters.',
  'Briefing vendors on what matters to you, your wedding party and your guests, without oversharing.',
]

// Contract commitments rewritten from principles into verifiable, operational
// actions. The anti-hate-speech clause enumerates protected classes by name
// rather than relying on "zero tolerance" alone — the safety signal couples
// actually scan for.
const CONTRACT_COMMITMENTS = [
  "Explicit welcome and protection for LGBTQ+ couples and families, including pronoun and name use on all paperwork, vendor briefings, signage, and seating, with a named coordinator accountable.",
  "Chronic-illness and medical-needs planning: a private space reserved for the couple for the whole day at no additional charge, dietary requirements communicated to catering in writing at least 14 days before the event, and couple-controlled disclosure to guests, vendors and family.",
  "ADA accessibility: step-free access to the ballroom, main-floor restrooms, patio, and ceremony lawn; accessible parking adjacent to the entrance with a level path; coordinator walk-through offered to any guest in advance.",
  "Neurodivergent inclusion, written into how we operate: a commitment to ask what reduces anxiety for you, your wedding party and your guests — and to adapt to whichever combination of agendas, written summaries, communication syncing, slower pacing, lighting review, quiet space, breaks or pre-agreed pause-or-end signals actually helps. The commitment is to listen and adjust, not to apply a template.",
  "A commitment to ask you, not Google, when a need is new to us — and to connect you with community-expert consultants we trust where it would help, rather than refer you elsewhere.",
  "An anti-abuse clause protecting every couple and guest on the property from abusive behaviour during the booking.",
  "A zero-tolerance anti-hate-speech and anti-harassment clause covering sexual orientation, gender identity and expression, race, religion, disability, national origin, age, and pregnancy. No exceptions, applied to every person on the property — guests, vendors and family alike.",
]

async function getBannerImage() {
  const images = await getSiteImages(['inclusion-banner'])
  return images['inclusion-banner']
}

export default async function InclusionPage() {
  const bannerImage = await getBannerImage()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <section className="bg-[var(--cream)] pt-40 pb-16 lg:pt-48 lg:pb-20 px-6 lg:px-10">
        <div className="max-w-3xl">
          <FadeUp>
            <p className="eyebrow mb-6">Inclusion · how we plan</p>
            <h1
              className="text-[42px] lg:text-[58px] leading-[1.05] text-[var(--ink)] mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Built for <em>every couple.</em>
            </h1>
            <p className="body-copy max-w-xl mb-3">
              An inclusive, accessible, neurodivergent-affirming wedding venue in Northern Virginia.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Banner image (optional — wired through site_images: inclusion-banner) */}
      {bannerImage && (
        <div className="relative w-full h-[40vh] lg:h-[52vh] overflow-hidden">
          <Image
            src={bannerImage.url}
            alt={bannerImage.alt_text || 'Couples celebrating at Rixey Manor'}
            fill
            className="object-cover"
            style={{ objectPosition: bannerImage.object_position || 'center center' }}
            sizes="100vw"
            priority
          />
        </div>
      )}

      {/* Opening prose */}
      <section className="bg-[var(--warm-white)] py-20 lg:py-24 px-6 lg:px-10">
        <div className="max-w-3xl mx-auto">
          <FadeUp>
            <p className="body-copy text-[18px] mb-6">
              Every couple deserves a wedding that actually fits them. Not the version the wedding
              industry assumes you want. Not a day spent managing overwhelm, masking, or apologising
              for needing things to be different. The real thing. Your people, your pace, your
              celebration.
            </p>
            <p className="body-copy text-[18px] mb-6">
              At Rixey Manor we have always worked this way. What's new is that it's in your contract.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Who we plan with — four named communities, each on its own anchor */}
      <section id="communities" className="bg-[var(--cream)] py-20 lg:py-28 px-6 lg:px-10 border-t border-[var(--border)]">
        <div className="max-w-3xl mx-auto">
          <FadeUp>
            <p className="eyebrow mb-6">Who we plan with</p>
            <h2
              className="text-[30px] lg:text-[38px] leading-[1.1] text-[var(--ink)] mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Named, in writing, with specifics.
            </h2>
            <p className="body-copy mb-14 max-w-2xl">
              The wedding industry has a tidy script. A lot of couples don't fit it. Below is who we
              explicitly plan with, what we already do, and what we ask when something is new to us.
              These aren't add-ons or favours. They're how we plan every wedding.
            </p>
          </FadeUp>

          <div className="flex flex-col gap-10">
            {COMMUNITIES.map((c, i) => (
              <FadeUp key={c.slug} delay={i * 70}>
                <div id={c.slug} className="border-t border-[var(--border)] pt-8 scroll-mt-32">
                  <h3
                    className="text-[22px] lg:text-[24px] leading-snug text-[var(--ink)] italic mb-4"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {c.title}
                  </h3>
                  {c.body.map((para, j) => (
                    <p key={j} className="body-copy mb-3 last:mb-0">{para}</p>
                  ))}
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* We adapt and we learn — the meta-commitment that ties the four together.
          Soft version (no financial commitment): we ask you first, not Google, and
          we connect you with community-expert consultants we trust where helpful. */}
      <section className="bg-[var(--warm-white)] py-20 lg:py-24 px-6 lg:px-10 border-t border-[var(--border)]">
        <div className="max-w-3xl mx-auto">
          <FadeUp>
            <p className="eyebrow mb-6">Where we don't know yet</p>
            <h2
              className="text-[28px] lg:text-[34px] leading-[1.1] text-[var(--ink)] mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              We adapt, and we learn.
            </h2>
            <p className="body-copy mb-4">
              The four groups above cover most of the couples — and the families, wedding parties and
              guests around them — who have ever told us a one-size-fits-all wedding doesn't work for
              them. If your situation is new to us, we say so. We ask you first, not Google. Where it
              would help, we connect you with community-expert consultants and planners we trust, so
              the answer comes from someone who actually lives it.
            </p>
            <p className="body-copy">
              We don't promise to run the same set of practices on every wedding. We promise to ask
              what reduces the anxiety in the room and to adapt to that — for the couple, for the
              family, for the wedding party, and for the guests. We would rather get it right than
              pretend.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* What that means in practice */}
      <section className="bg-[var(--cream)] py-20 lg:py-24 px-6 lg:px-10 border-t border-[var(--border)]">
        <div className="max-w-3xl mx-auto">
          <FadeUp>
            <p className="eyebrow mb-6">In practice</p>
            <h2
              className="text-[28px] lg:text-[34px] leading-[1.1] text-[var(--ink)] mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              What that looks like on the ground.
            </h2>
            <p className="body-copy mb-8">
              Every couple starts in the same place. We ask what celebrating actually looks like for
              you and the people standing closest to you on the day. From there, we adapt to whatever
              reduces anxiety for the people in the room — couple, family, wedding party, guests.
              None of the items below are universal practice. They're things we have done for past
              couples when those things would have helped:
            </p>
          </FadeUp>

          <FadeUp delay={80}>
            <ul className="flex flex-col gap-3">
              {PRACTICE_BULLETS.map((b, i) => (
                <li
                  key={i}
                  className="body-copy pl-6 relative before:content-[''] before:absolute before:left-0 before:top-[0.65em] before:w-2 before:h-2 before:rounded-full before:bg-[var(--forest)]"
                >
                  {b}
                </li>
              ))}
            </ul>
          </FadeUp>

          <FadeUp delay={150}>
            <p className="body-copy mt-10 italic text-[var(--ink)]">
              These aren't add-ons or favours. They're how we plan every wedding.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* What's in your contract */}
      <section id="contract-commitments" className="bg-[var(--warm-white)] py-20 lg:py-24 px-6 lg:px-10 border-t border-[var(--border)]">
        <div className="max-w-3xl mx-auto">
          <FadeUp>
            <p className="eyebrow mb-6">In writing</p>
            <h2
              className="text-[28px] lg:text-[34px] leading-[1.1] text-[var(--ink)] mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              What's in your contract.
            </h2>
            <p className="body-copy mb-8">
              Every Rixey Manor contract now formally commits to the following:
            </p>
          </FadeUp>

          <FadeUp delay={80}>
            <ol className="flex flex-col gap-4 list-decimal pl-6 marker:text-[var(--forest)] marker:font-medium">
              {CONTRACT_COMMITMENTS.map((c, i) => (
                <li key={i} className="body-copy pl-2">{c}</li>
              ))}
            </ol>
          </FadeUp>

          <FadeUp delay={150}>
            <p className="body-copy mt-10 italic text-[var(--ink)]">
              You should know who you're working with before you sign anything. Now you do.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* A note from Isadora */}
      <section className="bg-[var(--cream)] py-20 lg:py-28 px-6 lg:px-10 border-t border-[var(--border)]">
        <div className="max-w-3xl mx-auto">
          <FadeUp>
            <p className="eyebrow mb-6">A note from Isadora</p>
            <p className="body-copy text-[18px] mb-6">
              After a decade of weddings here, what I have noticed is that the couples who need the
              most from us are usually the ones who ask for the least, because they've been
              conditioned to apologise for it.
            </p>
            <p className="body-copy text-[18px]">
              You don't need to apologise here. Tell us what you need. We'll build the day around it.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Tail CTA */}
      <section className="bg-[var(--warm-white)] py-16 lg:py-20 px-6 lg:px-10 border-t border-[var(--border)]">
        <div className="max-w-3xl mx-auto text-center">
          <FadeUp>
            <p className="eyebrow mb-4">Talk to us</p>
            <p className="body-copy mb-6 max-w-2xl mx-auto">
              The easiest way to start is to tell us what would help. Reach out, or come walk the
              grounds and meet the team who'd run your day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/pricing#book-tour" className="btn-primary">
                Book a tour
              </Link>
              <a href="mailto:info@rixeymanor.com" className="text-link">
                Or email info@rixeymanor.com
              </a>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  )
}
