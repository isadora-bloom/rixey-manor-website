import Image from 'next/image'
import FadeUp from '@/components/ui/FadeUp'
import Figure from '@/components/history/Figure'

// The love story of the house: the columned front that couples photograph was
// built for a wedding, held one marriage for fifty years, and passed down the
// women of the Rixey family into Isadora's hands. This is what a visitor is
// actually looking at today. The estate's harder, older history (the farmhouse
// origins, slavery, the Confederate thread) lives in a separate section that
// comes after this and after the team, by the owner's decision: earn belief in
// the people and the place first, then meet the reckoning head on. The named
// people and places (the Dyers, Eppa Rixey, Marymount) are the concrete facts
// search and AI engines can cite.
export default function ManorHistory({ images = {} }) {
  return (
    <section id="heritage" className="section-cream py-24 lg:py-32 px-6 lg:px-10">
      <div className="max-w-3xl mx-auto">

        <FadeUp>
          <p className="eyebrow mb-6">The House</p>
          <h2
            className="text-[30px] lg:text-[42px] leading-[1.1] text-[var(--ink)] mb-10"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            The front was built
            <em> for a wedding.</em>
          </h2>
        </FadeUp>

        {/* The front / the Dyer wedding (1928): the centrepiece. */}
        <div className="flex flex-col gap-6">
          <FadeUp delay={60}>
            <p className="body-copy">
              The grand columned front that everyone photographs is not as old as it looks. It
              is a Classical Revival addition, built for a wedding: the 1928 marriage of James
              Marion Dyer and Margaret Robinson Lewis. The same steps where couples now line up
              for their portraits were raised for the two of them.
            </p>
          </FadeUp>

          <Figure
            image={images['history-construction']}
            caption="Raising the new Classical Revival front, brick by brick, ahead of the 1928 wedding."
          />
          <Figure
            image={images['history-margaret-wedding']}
            caption="James Marion Dyer and Margaret Robinson Lewis on the new front steps in 1928, the first wedding party to stand where thousands now do."
            aspect="aspect-[4/3]"
          />

          <FadeUp delay={80}>
            <p className="body-copy">
              They never left. Fifty years on, in 1978, James and Margaret were still the
              owners of this house, and they marked their golden wedding anniversary on the
              very same steps. The front was made for their marriage, and it held them the
              whole way.
            </p>
          </FadeUp>

          <Figure
            image={images['history-anniversary']}
            caption="James and Margaret's golden anniversary in 1978, on the same steps they married on."
            aspect="aspect-[4/3]"
          />
        </div>

        <div className="flex flex-col gap-6">
          <FadeUp delay={100}>
            <h3
              className="text-[22px] lg:text-[26px] italic text-[var(--ink)] mt-8 mb-1"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Handed down the female line.
            </h3>
          </FadeUp>
          <FadeUp delay={110}>
            <p className="body-copy">
              Here is the thread we love most. Through the generations the estate mostly
              passed down through the women of the Rixey family, not the usual way these
              things went in Virginia. The family kept it into the mid-1990s. So when Isadora
              bought the derelict house in 2014 and made it hers, she was, without setting out
              to, carrying on a place that has nearly always been in women's hands. It still
              is.
            </p>
          </FadeUp>
          <FadeUp delay={125}>
            <p className="body-copy">
              The Rixey name is still woven through this place, and the family are still part
              of our lives. They are our neighbors. They have worked here, celebrated here,
              and chosen Rixey Manor to say their own vows. Their blessing meant a great deal
              at the start, and it still does.
            </p>
          </FadeUp>

          <Figure image={images['history-family']} />

          <FadeUp delay={140}>
            <h3
              className="text-[22px] lg:text-[26px] italic text-[var(--ink)] mt-6 mb-1"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              A name you may already know.
            </h3>
          </FadeUp>
          <FadeUp delay={160}>
            <p className="body-copy">
              The wider Rixey legacy is worth a detour. If you studied at Marymount
              University you will know Rixey House, one of the cornerstone buildings on
              campus. The family tree runs from a university founder to presidential
              physicians to a genuine sports legend. Baseball Hall of Famer Eppa Rixey was
              born right here in Culpeper.
            </p>
          </FadeUp>
        </div>

        {images['history-coat-of-arms'] && (
          <FadeUp delay={180}>
            <figure className="mt-12 flex flex-col items-center text-center">
              <div className="relative w-40 h-40 lg:w-48 lg:h-48">
                <Image
                  src={images['history-coat-of-arms'].url}
                  alt={images['history-coat-of-arms'].alt_text || 'The Rixey family coat of arms'}
                  fill
                  className="object-contain"
                  sizes="192px"
                />
              </div>
              <figcaption
                className="mt-4 text-[12px] tracking-[0.12em] uppercase text-[var(--ink-light)]"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                The Rixey family coat of arms
              </figcaption>
            </figure>
          </FadeUp>
        )}

      </div>
    </section>
  )
}
