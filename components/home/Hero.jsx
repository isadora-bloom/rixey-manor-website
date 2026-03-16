import Link from 'next/link'
import Image from 'next/image'
import CalendlyPopupButton from '@/components/ui/CalendlyPopupButton'

export default function Hero({ heroImage, videoUrl, calendlyUrl = '' }) {
  return (
    <section className="relative overflow-hidden">

      {/* ── Mobile layout: image on top, text below ── */}
      <div className="lg:hidden">

        {/* Image — full width, below navbar */}
        <div className="relative w-full mt-20" style={{ height: '62vw', minHeight: '220px', maxHeight: '380px' }}>
          <Image
            src={heroImage?.url || '/assets/hero-main.webp'}
            alt={heroImage?.alt_text || 'Wedding at Rixey Manor'}
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          {/* Bottom fade into cream */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[var(--cream)] to-transparent" />
        </div>

        {/* Text */}
        <div className="bg-[var(--cream)] px-6 pt-8 pb-14">
          <p className="eyebrow mb-5">Est. 1801 &nbsp;·&nbsp; Rixeyville, Virginia</p>
          <h1
            className="text-[40px] sm:text-[52px] leading-[1.05] text-[var(--ink)] mb-5"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            The whole place.<br />
            <em>Just your people.</em><br />
            <em>Entirely yours.</em>
          </h1>
          <p
            className="text-[16px] leading-[1.7] text-[var(--ink-mid)] mb-8 max-w-sm"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            A {new Date().getFullYear() - 1801}-year-old estate wedding venue in Rixeyville, Virginia.
            60 miles from Washington&nbsp;DC.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-3">
            <CalendlyPopupButton url={calendlyUrl} className="btn-primary justify-center">
              Book a Tour
            </CalendlyPopupButton>
            <a
              href="#one-thing"
              className="btn-outline-white justify-center !text-[var(--ink-mid)] !border-[var(--border)] hover:!border-[var(--sage)] hover:!bg-transparent"
            >
              See how it works
            </a>
          </div>
          <a
            href="https://www.theknot.com/marketplace/rixey-manor"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-5 no-underline group"
          >
            <span className="text-[var(--rose)] text-[13px] tracking-wide">★★★★★</span>
            <span
              className="text-[11px] tracking-[0.15em] uppercase text-[var(--ink-light)] group-hover:text-[var(--ink)] transition-colors"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              The Knot Hall of Fame &nbsp;·&nbsp; 220+ Reviews
            </span>
          </a>
        </div>
      </div>

      {/* ── Desktop layout: split panels ── */}
      <div className="hidden lg:flex min-h-[100dvh]">

        {/* Left panel — text */}
        <div className="relative z-10 w-[42%] bg-[var(--cream)] flex flex-col justify-center px-16">

          <div className="relative">
            <p className="eyebrow mb-6">Est. 1801 &nbsp;·&nbsp; Rixeyville, Virginia</p>
            <h1
              className="text-[68px] leading-[1.05] text-[var(--ink)] mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              The whole place.<br />
              <em>Just your people.</em><br />
              <em>Entirely yours.</em>
            </h1>
            <p
              className="text-[17px] leading-[1.7] text-[var(--ink-mid)] mb-10 max-w-sm"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              A {new Date().getFullYear() - 1801}-year-old estate wedding venue in Rixeyville, Virginia.
              60 miles from Washington&nbsp;DC.
            </p>
            <div className="flex items-center gap-4">
              <CalendlyPopupButton url={calendlyUrl} className="btn-primary">
                Book a Tour
              </CalendlyPopupButton>
              <a
                href="#one-thing"
                className="btn-outline-white !text-[var(--ink-mid)] !border-[var(--border)] hover:!border-[var(--sage)] hover:!bg-transparent"
              >
                See how it works
              </a>
            </div>
            <a
              href="https://www.theknot.com/marketplace/rixey-manor"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-5 no-underline group"
            >
              <span className="text-[var(--rose)] text-[13px] tracking-wide">★★★★★</span>
              <span
                className="text-[11px] tracking-[0.15em] uppercase text-[var(--ink-light)] group-hover:text-[var(--ink)] transition-colors"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                The Knot Hall of Fame &nbsp;·&nbsp; 220+ Reviews
              </span>
            </a>
          </div>
        </div>

        {/* Right panel — video or image (desktop) */}
        <div className="absolute right-0 top-0 w-[60%] h-full overflow-hidden">
          {videoUrl ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover object-center"
              poster={heroImage?.url || '/assets/hero-main.webp'}
            >
              <source src={videoUrl} type="video/mp4" />
            </video>
          ) : (
            <Image
              src={heroImage?.url || '/assets/hero-main.webp'}
              alt={heroImage?.alt_text || 'Wedding at Rixey Manor'}
              fill
              className="object-cover object-[center_30%]"
              priority
              sizes="60vw"
            />
          )}
          {/* Edge gradient */}
          <div className="absolute left-0 top-0 h-full w-40 bg-gradient-to-r from-[var(--cream)] to-transparent" />
        </div>

      </div>
    </section>
  )
}
