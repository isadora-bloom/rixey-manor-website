import Link from 'next/link'
import FadeUp from '@/components/ui/FadeUp'

const HIGHLIGHTS = [
  'Guest list with RSVP, dietary & table assignment',
  'Interactive floor plan & table planner',
  'Budget tracker across every category',
  'Borrow catalog — décor, florals, lighting',
  'Day-of timeline & ceremony order',
  'Sage AI — ask anything, 24/7',
  'Direct coordinator messaging',
]

export default function PortalSection() {
  return (
    <section className="section-warm-white py-24 lg:py-32 px-6 lg:px-10 border-t border-[var(--border)]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">

        <FadeUp>
          <p className="eyebrow mb-6">Included with your booking</p>
          <h2
            className="text-[36px] lg:text-[44px] leading-[1.05] text-[var(--ink)] mb-8"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            We don't hand you<br />a to-do list.<br />
            <em>We plan it with you.</em>
          </h2>
          <div className="flex flex-col gap-5 mb-10">
            <p className="body-copy">
              In the weeks after you book, your coordinator schedules a full onboarding session —
              a real planning meeting where we walk through everything together, learn your wedding,
              and set up your private portal as we go.
            </p>
            <p className="body-copy">
              After that, the portal stays open between you and us. Every vendor you add, every
              guest detail, every change to the timeline — it all lands with your coordinator
              in real time. No chasing emails. No starting from scratch at each meeting.
            </p>
          </div>
          <Link href="/portal" className="text-link">
            See what's included →
          </Link>
        </FadeUp>

        <FadeUp delay={100}>
          <div className="bg-[var(--cream)] p-8 lg:p-10 border border-[var(--border)]">
            <p
              className="text-[11px] tracking-[0.2em] uppercase text-[var(--sage)] mb-6"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              What we set up together
            </p>
            <div className="flex flex-col">
              {HIGHLIGHTS.map(item => (
                <div
                  key={item}
                  className="flex items-center gap-4 py-3 border-b border-[var(--border)] last:border-0"
                >
                  <span className="text-[var(--forest)] text-[13px] shrink-0">✓</span>
                  <span
                    className="text-[14px] text-[var(--ink-mid)]"
                    style={{ fontFamily: 'var(--font-ui)' }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-7 pt-6 border-t border-[var(--border)] flex items-center justify-between">
              <p
                className="text-[12px] text-[var(--ink-light)]"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Onboarding session scheduled after booking. No extra cost.
              </p>
              <Link href="/portal" className="text-link text-[11px]">
                Learn more →
              </Link>
            </div>
          </div>
        </FadeUp>

      </div>
    </section>
  )
}
