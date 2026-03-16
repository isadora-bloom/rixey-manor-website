import Image from 'next/image'
import FadeUp from '@/components/ui/FadeUp'

function Quote({ quote, name, photo, photoAlt, large = false }) {
  return (
    <div className="flex flex-col gap-4">
      <blockquote
        className={`font-[family-name:var(--font-display)] italic text-[var(--ink)] leading-[1.5] ${
          large ? 'text-[22px] lg:text-[26px]' : 'text-[18px] lg:text-[20px]'
        }`}
        style={{ fontFamily: 'var(--font-display)' }}
      >
        &ldquo;{quote}&rdquo;
      </blockquote>
      <div className="flex items-center gap-3">
        {photo && (
          <Image
            src={photo}
            alt={photoAlt || `${name} wedding at Rixey Manor`}
            width={48}
            height={48}
            className="rounded-full w-12 h-12 object-cover"
          />
        )}
        <p
          className="text-[12px] tracking-[0.15em] uppercase text-[var(--ink-light)]"
          style={{ fontFamily: 'var(--font-ui)' }}
        >
          — {name}
        </p>
      </div>
    </div>
  )
}

export default function TestimonialsSection({ testimonials = [] }) {
  // Use seeded quotes as fallback if DB not yet populated
  const defaultQuotes = [
    {
      id: '1',
      couple_names: 'Caitlin',
      quote: "The venue is breathtaking both in person and in our pictures. Our guests still say it was the best wedding and venue they've seen. If you're anxious about planning and you want a flawless wedding experience, book Rixey Manor. It's the best decision you'll make.",
      photo_url: null,
      photo_alt: null,
    },
    {
      id: '2',
      couple_names: 'Sarai',
      quote: "The venue itself is gorgeous but the team at Rixey Manor is something so special. These people make dreams come true and my husband and I, along with our families, are so grateful for them.",
      photo_url: null,
      photo_alt: null,
    },
    {
      id: '3',
      couple_names: 'Apeksha',
      quote: "We recently had our Indian-American fusion wedding at Rixey Manor, and it was beyond perfect. From the stunning grounds to the exceptional service — and even a double rainbow — every detail was beautifully executed.",
      photo_url: null,
      photo_alt: null,
    },
    {
      id: '4',
      couple_names: 'Lauren',
      quote: "I can't say enough good things about Isadora and the team — do yourself a favour and go look at this place. So many of our guests (and we made them all drive from New Jersey) were so impressed and complimentary.",
      photo_url: null,
      photo_alt: null,
    },
  ]

  const quotes = testimonials.length > 0 ? testimonials : defaultQuotes

  const [q1, q2, q3, q4] = quotes

  return (
    <section className="section-warm-white py-24 lg:py-32 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">

        <FadeUp>
          <p className="eyebrow mb-16">What couples say</p>
        </FadeUp>

        {/* Asymmetric grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

          {/* Left column */}
          <div className="flex flex-col gap-16">
            {q1 && (
              <FadeUp delay={0}>
                <Quote
                  quote={q1.quote}
                  name={q1.couple_names}
                  photo={q1.photo_url}
                  photoAlt={q1.photo_alt}
                  large
                />
              </FadeUp>
            )}
            {q2 && (
              <FadeUp delay={100}>
                <Quote
                  quote={q2.quote}
                  name={q2.couple_names}
                  photo={q2.photo_url}
                  photoAlt={q2.photo_alt}
                />
              </FadeUp>
            )}
          </div>

          {/* Right column — offset down on desktop */}
          <div className="flex flex-col gap-16 lg:mt-20">
            {q3 && (
              <FadeUp delay={150}>
                <Quote
                  quote={q3.quote}
                  name={q3.couple_names}
                  photo={q3.photo_url}
                  photoAlt={q3.photo_alt}
                />
              </FadeUp>
            )}
            {q4 && (
              <FadeUp delay={200}>
                <Quote
                  quote={q4.quote}
                  name={q4.couple_names}
                  photo={q4.photo_url}
                  photoAlt={q4.photo_alt}
                />
              </FadeUp>
            )}
          </div>
        </div>

        {/* The Knot credential */}
        <FadeUp delay={250}>
          <div className="mt-20 pt-10 border-t border-[var(--border)] flex items-center gap-3">
            <a
              href="https://www.theknot.com/marketplace/rixey-manor"
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline group inline-flex items-center gap-2"
            >
              <span className="text-[var(--rose)] text-[13px] tracking-wide">★★★★★</span>
              <p
                className="text-[12px] tracking-[0.15em] uppercase text-[var(--ink-light)] group-hover:text-[var(--ink)] transition-colors"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                The Knot Hall of Fame &nbsp;·&nbsp; 220+ Five-Star Reviews
              </p>
            </a>
          </div>
        </FadeUp>

      </div>
    </section>
  )
}
