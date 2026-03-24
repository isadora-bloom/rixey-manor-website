import FadeUp from '@/components/ui/FadeUp'

const STATS = [
  { num: '350+', label: 'Weddings hosted' },
  { num: '30', label: 'Acres' },
  { num: '200', label: 'Maximum outdoor guests' },
  { num: '14', label: 'Overnight guests' },
]

export default function EstateOverview() {
  return (
    <section className="bg-[var(--cream)] py-24 lg:py-32 px-6 lg:px-10">
      <div className="max-w-3xl mx-auto">

        <FadeUp>
          <p className="eyebrow mb-6">The Full Picture</p>
          <h2
            className="text-[34px] lg:text-[42px] leading-[1.1] text-[var(--ink)] mb-8"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Not a slot for the afternoon.<br />
            <em>A home for the weekend.</em>
          </h2>
          <p className="body-copy mb-6">
            Rixey Manor is 30 acres of historic Virginia estate in Culpeper County, at the foot of the Blue Ridge:
            the manor house built in 1801, a private lake, mountain views across the Piedmont, and four bedrooms
            plus a separate cottage for your wedding party to stay in.
          </p>
          <p className="body-copy mb-6">
            The estate sits in Rixeyville, Virginia — about an hour from Washington DC, 15 minutes from
            Culpeper, and a straightforward drive from anywhere in Northern Virginia. Couples
            come from across the DMV, from Richmond, from Charlottesville, and regularly from further afield
            for the kind of weekend a ballroom-in-a-hotel simply cannot replicate.
          </p>
          <p className="body-copy">
            When you book Rixey, you get all of it. The whole building. The whole grounds. From Friday afternoon
            through Sunday morning. No other events, no strangers, no clock running out at midnight. Just your
            wedding, the way you actually imagined it.
          </p>
        </FadeUp>

        {/* Stat row */}
        <FadeUp delay={150}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6 mt-16 pt-12 border-t border-[var(--border)]">
            {STATS.map(s => (
              <div key={s.num} className="flex flex-col items-center gap-2">
                <span
                  className="text-[60px] lg:text-[68px] leading-none text-[var(--forest)]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {s.num}
                </span>
                <span
                  className="text-[11px] font-medium tracking-[0.2em] uppercase text-[var(--ink-light)]"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </FadeUp>

      </div>
    </section>
  )
}
