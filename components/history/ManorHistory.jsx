import Image from 'next/image'
import Link from 'next/link'
import FadeUp from '@/components/ui/FadeUp'

// The estate's heritage, restored from the old site and refined. Two
// deliberate framings, both true and both requested. First, the house began
// as a plain working farmhouse (Pleasant Hill), not a grand estate, which
// walks the narrative away from a "plantation" read. Second, the columned
// front is a 1928 Classical Revival addition built for the wedding of James
// Marion Dyer and Margaret Robinson Lewis, so the mansion facade everyone
// photographs is far younger than it looks. The named people and places (the
// Rixey land grant, the Dyers, Eppa Rixey, Marymount) are the concrete facts
// search and AI engines can cite.
function Figure({ image, caption, aspect = 'aspect-[3/2]' }) {
  if (!image) return null
  return (
    <FadeUp>
      <figure className="my-4">
        <div className={`relative w-full ${aspect} bg-[var(--sage-light)] overflow-hidden`}>
          <Image
            src={image.url}
            alt={image.alt_text || caption || 'Historic photograph of Rixey Manor'}
            fill
            className="object-cover"
            style={{ objectPosition: image.object_position || 'center center' }}
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
        {caption && (
          <figcaption
            className="mt-3 text-[12px] text-[var(--ink-light)]"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            {caption}
          </figcaption>
        )}
      </figure>
    </FadeUp>
  )
}

export default function ManorHistory({ images = {} }) {
  return (
    <section id="heritage" className="section-cream py-24 lg:py-32 px-6 lg:px-10">
      <div className="max-w-3xl mx-auto">

        <FadeUp>
          <p className="eyebrow mb-6">Since 1801</p>
          <h2
            className="text-[30px] lg:text-[42px] leading-[1.1] text-[var(--ink)] mb-10"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            It started as a farmhouse.
            <em> The mansion came later.</em>
          </h2>
        </FadeUp>

        <div className="flex flex-col gap-6">
          <FadeUp delay={60}>
            <p className="body-copy">
              Rixey Manor started as farmland, and the house had another name: Pleasant Hill.
              The lane still carries it. The Rixey family held the land through a grant that
              reached back to the years after the Revolutionary War, but the house itself was
              a plain working farmhouse, not the white-columned mansion people picture today.
              For most of its life this was a family farm, hogs and all.
            </p>
          </FadeUp>

          {images['history-farmhouse'] && (
            <FadeUp delay={80}>
              <figure className="my-4">
                <div className="relative w-full aspect-[4/3] bg-[var(--sage-light)] overflow-hidden">
                  <Image
                    src={images['history-farmhouse'].url}
                    alt={images['history-farmhouse'].alt_text || 'AI-assisted reconstruction of Pleasant Hill, the original Rixey Manor farmhouse, before its columned front was added'}
                    fill
                    className="object-cover"
                    style={{ objectPosition: images['history-farmhouse'].object_position || 'center center' }}
                    sizes="(max-width: 768px) 100vw, 768px"
                  />
                </div>
                <figcaption
                  className="mt-3"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  <span className="block text-[13px] text-[var(--ink-mid)]">
                    Pleasant Hill, the farmhouse that became Rixey Manor, as it looked before the columned front was added for the 1928 wedding.
                  </span>
                  <span className="block mt-1 text-[12px] text-[var(--ink-light)]">
                    An AI-assisted reconstruction by Isadora, a British historian who also teaches responsible AI use. Built from the surviving architectural evidence, old photographs, and documentary research, with AI used only to visualise the research, not to invent it, exactly the standard she teaches: use the tool, disclose it, never let it make things up.
                  </span>
                </figcaption>
              </figure>
            </FadeUp>
          )}
          <Figure
            image={images['history-pig-farm']}
            caption="A working farm through and through, around 1930."
          />
        </div>

        {/* The acknowledgement — restored and refined, and kept honest to the
            farmhouse framing above. Set apart so it reads as considered. */}
        <FadeUp delay={100}>
          <div className="my-12 border-l-2 border-[var(--sage)] pl-6 lg:pl-8 py-1">
            <div className="flex flex-col gap-5">
              <p className="body-copy">
                We tell the harder part too, and now we can tell it plainly. The family who
                held this estate were Virginia farmers and Confederates. Richard Henry Lewis,
                who married into the Rixey family and died at Rosedale, in his day part of this
                estate, rode with the Black Horse Cavalry. His family enslaved people. One of
                them we can name: a craftsman called Henry, who made the spurs that cavalry
                wore into the war. Most of the others we cannot name yet.
              </p>
              <p className="body-copy">
                That "yet" matters to us. Isadora is a British historian, and she is still
                researching this house and the people bound to it. The aim of that work is not
                the owners, whose names are easy to find. It is the enslaved men, women and
                children whose labour and whose lives were written out of the record, and who
                deserve to have their stories told too. As we recover names, they will go here.
              </p>
              <p className="body-copy">
                We cannot undo this history, and we will not paper over it. A plaque on the
                old blacksmith shop stands in their memory. What we can decide is what this
                place is now: somewhere every couple, of any race, religion, or orientation,
                is safe, celebrated, and genuinely welcome.
              </p>
              <p className="body-copy">
                When we weigh a decision about Rixey today, we ask whether it would make the
                estate's original owners turn in their graves. When the answer is a firm yes,
                we know we are pointing the right way.
              </p>
              <p className="body-copy">
                That welcome is not just a feeling. What we commit to for LGBTQ+ couples and
                families, disabled couples, couples with chronic illness, and neurodivergent
                couples is named in writing, in every contract.{' '}
                <Link href="/inclusion" className="text-link">See exactly what we promise →</Link>
              </p>
            </div>
          </div>
        </FadeUp>

        {/* The front / the Dyer wedding (1928): the centrepiece. */}
        <div className="flex flex-col gap-6">
          <FadeUp delay={120}>
            <h3
              className="text-[22px] lg:text-[28px] italic text-[var(--ink)] mt-6 mb-1"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              The famous front was built for a wedding.
            </h3>
          </FadeUp>
          <FadeUp delay={140}>
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

          <FadeUp delay={160}>
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
          <FadeUp delay={160}>
            <h3
              className="text-[22px] lg:text-[26px] italic text-[var(--ink)] mt-8 mb-1"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Handed down the female line.
            </h3>
          </FadeUp>
          <FadeUp delay={170}>
            <p className="body-copy">
              Here is the thread we love most. Through the generations the estate mostly
              passed down through the women of the Rixey family, not the usual way these
              things went in Virginia. The family kept it into the mid-1990s. So when Isadora
              bought the derelict house in 2014 and made it hers, she was, without setting out
              to, carrying on a place that has nearly always been in women's hands. It still
              is.
            </p>
          </FadeUp>
          <FadeUp delay={185}>
            <p className="body-copy">
              The Rixey name is still woven through this place, and the family are still part
              of our lives. They are our neighbors. They have worked here, celebrated here,
              and chosen Rixey Manor to say their own vows. Their blessing meant a great deal
              at the start, and it still does.
            </p>
          </FadeUp>

          <Figure image={images['history-family']} />

          <FadeUp delay={200}>
            <h3
              className="text-[22px] lg:text-[26px] italic text-[var(--ink)] mt-6 mb-1"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              A name you may already know.
            </h3>
          </FadeUp>
          <FadeUp delay={220}>
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
          <FadeUp delay={240}>
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
