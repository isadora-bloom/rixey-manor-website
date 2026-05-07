import Link from 'next/link'
import FadeUp from '@/components/ui/FadeUp'

const ITEMS = [
  { label: 'BYO alcohol',          sub: 'No corkage fee. Buy at retail.',       value: 'Couples save thousands on the bar.' },
  { label: 'Bring any caterer',    sub: 'No required vendor list.',             value: 'No outside-catering fee.' },
  { label: 'Décor to borrow',      sub: 'Arbors, lanterns, signs & more.',      value: 'A decade of weddings, free to use.' },
  { label: 'Coordinator included', sub: 'Not an add-on. From day one.',         value: 'What others quote separately.' },
  { label: 'Overnight stays',      sub: 'Up to 14 guests, both nights.',        value: 'Lodging at no extra charge.' },
  { label: 'No hidden fees',       sub: 'No service charge. No surprises.',     value: 'No cake-cutting fee. No insurance requirement.' },
]

export default function IncludedStrip({ whatItCostsEnabled = false }) {
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
              {item.value && (
                <span
                  className="text-[11px] italic leading-[1.5] text-[var(--rose)] mt-0.5"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {item.value}
                </span>
              )}
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
          <p className="text-center mt-3" style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--ink-light)' }}>
            Wondering how this compares to an all-inclusive venue?{' '}
            <Link href="/compare" className="text-link" style={{ fontFamily: 'var(--font-body)' }}>
              The honest version →
            </Link>
          </p>
          {whatItCostsEnabled && (
            <p className="text-center mt-3" style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--ink-light)' }}>
              Want to see what a full wedding here actually costs?{' '}
              <Link href="/what-it-costs" className="text-link" style={{ fontFamily: 'var(--font-body)' }}>
                Line by line →
              </Link>
            </p>
          )}
        </FadeUp>
      </FadeUp>
    </section>
  )
}
