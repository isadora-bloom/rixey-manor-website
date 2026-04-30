import Image from 'next/image'
import FadeUp from '@/components/ui/FadeUp'
import CalendlyPopupButton from '@/components/ui/CalendlyPopupButton'
import AdaptiveCopy from '@/components/AdaptiveCopy'

export default function FinalCTA({ calendlyUrl = '' }) {
  return (
    <section className="relative py-28 lg:py-40 px-6 lg:px-10 overflow-hidden bg-[var(--cream)] border-t border-[var(--border)]">

      {/* Sketch watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.05]">
        <Image
          src="/assets/rixey-manor-logo.png"
          alt=""
          width={800}
          height={667}
          className="object-contain w-[600px] lg:w-[750px]"
        />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <FadeUp>
          <AdaptiveCopy
            as="p"
            className="eyebrow mb-6"
            defaultContent="Your wedding at Rixey Manor"
            byRole={{
              couple:        "Your wedding at Rixey Manor",
              parent:        "Their wedding at Rixey Manor",
              friend_family: "Their wedding at Rixey Manor",
              planner:       "Your couple's wedding at Rixey Manor",
              browsing:      "Weddings at Rixey Manor",
            }}
          />
          <h2
            className="text-[42px] lg:text-[56px] leading-[1.05] text-[var(--ink)] mb-8"
            style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}
          >
            Come and see it<br />for yourself.
          </h2>
          <AdaptiveCopy
            as="p"
            className="text-[17px] lg:text-[18px] leading-[1.75] text-[var(--ink-light)] mb-12 max-w-lg mx-auto"
            style={{ fontFamily: 'var(--font-body)' }}
            defaultContent="We want to learn about your wedding as much as tell you about the venue. That takes about an hour."
            byRole={{
              couple:        "We want to learn about your wedding as much as tell you about the venue. That takes about an hour.",
              parent:        "We want to learn about your child's wedding as much as tell you about the venue. That takes about an hour.",
              friend_family: "We want to learn about their wedding as much as tell you about the venue. That takes about an hour.",
              planner:       "We want to learn about your couple's wedding as much as tell you about the venue. That takes about an hour.",
              browsing:      "We want to learn about you as much as tell you about the venue. That takes about an hour.",
            }}
          />

          <div className="flex flex-col items-center gap-6">
            <CalendlyPopupButton url={calendlyUrl} className="btn-primary">
              Book a tour
            </CalendlyPopupButton>

            <a
              href="tel:+15402124545"
              className="flex flex-col items-center gap-1 group"
            >
              <span
                className="text-[var(--ink-light)] text-[16px] group-hover:text-[var(--ink)] transition-colors duration-200"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Or call us: (540) 212-4545
              </span>
              <span
                className="text-[11px] tracking-[0.2em] uppercase text-[var(--rose)]"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Yes, you can text.
              </span>
            </a>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
