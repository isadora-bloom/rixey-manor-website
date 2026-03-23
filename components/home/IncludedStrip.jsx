import Link from 'next/link'
import FadeUp from '@/components/ui/FadeUp'

const ITEMS = [
  { label: 'BYO alcohol',          sub: 'No corkage fee. Buy at retail.' },
  { label: 'Bring any caterer',    sub: 'No required vendor list.' },
  { label: 'Décor to borrow',      sub: 'Arbors, lanterns, signs & more.' },
  { label: 'Coordinator included', sub: 'Not an add-on. From day one.' },
  { label: 'Overnight stays',      sub: 'Up to 14 guests, both nights.' },
  { label: 'No hidden fees',       sub: 'No service charge. No surprises.' },
]

export default function IncludedStrip() {
  return (
    <section className="section-cream border-t border-b border-[var(--border)] py-14 px-6 lg:px-10">
      <FadeUp>
        <p
          className="text-center text-[11px] tracking-[0.25em] uppercase text-[var(--ink-light)] mb-8"
          style={{ fontFamily: 'var(--font-ui)' }}
        >
          Every wedding includes
        </p>
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-4">
          {ITEMS.map(item => (
            <div key={item.label} className="flex flex-col items-center text-center gap-2">
              <span
                className="text-[14px] font-medium text-[var(--ink)]"
                style={{ fontFamily: 'var(--font-ui)', letterSpacing: '0.03em' }}
              >
                {item.label}
              </span>
              <span
                className="text-[12px] leading-[1.5] text-[var(--ink-light)]"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {item.sub}
              </span>
            </div>
          ))}
        </div>
        <FadeUp delay={120}>
          <p className="text-center mt-10" style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink-light)' }}>
            And then there are the things no venue checklist covers.{' '}
            <Link href="/extras" className="text-link" style={{ fontFamily: 'var(--font-body)' }}>
              Only at Rixey →
            </Link>
          </p>
        </FadeUp>
      </FadeUp>
    </section>
  )
}
