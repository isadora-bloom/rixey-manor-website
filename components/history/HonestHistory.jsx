import Link from 'next/link'
import Image from 'next/image'
import FadeUp from '@/components/ui/FadeUp'
import Figure from '@/components/history/Figure'

// The estate's older, harder history, deliberately placed after the owner's
// story, the team, and the love story of the house. The owner's call: earn a
// reader's belief in the people and their intentions first, then meet the
// reckoning head on. Placed last it is not buried, it carries the closing
// weight. House rule still holds: any mention of slavery or the estate's hard
// history is immediately followed by the commitment (the "turn in their
// graves" pivot), never left hanging. Structured along the Montpelier /
// National Trust interpretation rubric: name the enslaved, centre them over
// the owners, invite descendants, keep researching. The farmhouse (Pleasant
// Hill) origin opens it, walking the narrative away from a "plantation" read
// before naming the truth plainly.
export default function HonestHistory({ images = {} }) {
  return (
    <section id="history" className="bg-[var(--warm-white)] py-24 lg:py-32 px-6 lg:px-10 border-t border-[var(--border)]">
      <div className="max-w-3xl mx-auto">

        <FadeUp>
          <p className="eyebrow mb-6">Where It Came From</p>
          <h2
            className="text-[30px] lg:text-[42px] leading-[1.1] text-[var(--ink)] mb-10"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            It started as a farmhouse.
            <em> We won't paper over the rest.</em>
          </h2>
        </FadeUp>

        <div className="flex flex-col gap-6">
          <FadeUp delay={60}>
            <p className="body-copy">
              Long before the columns and the weddings, this was farmland, and the house had
              another name: Pleasant Hill. The lane still carries it. The Rixey family held the
              land through a grant that reached back to the years after the Revolutionary War,
              but the house itself was a plain working farmhouse, not the white-columned
              mansion people picture today. For most of its life this was a family farm, hogs
              and all.
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

        {/* The acknowledgement. House rule: any mention of slavery or the estate's
            hard history is immediately followed by the commitment (the "turn in
            their graves" pivot), never left hanging on its own. Set apart so it
            reads as considered. */}
        <FadeUp delay={100}>
          <div className="my-12 border-l-2 border-[var(--sage)] pl-6 lg:pl-8 py-1">
            <div className="flex flex-col gap-5">
              <p className="body-copy">
                Every estate of this age in Virginia was built on the labour of enslaved
                people, and we will not pretend this one was any different. The family who
                came to hold this estate were Virginia farmers. One of them, Richard Henry
                Lewis, who married into the Rixey family and died at Rosedale, then part of
                the Rixey estate, rode for the Confederacy with the Black Horse Cavalry. His family enslaved people. One of
                them we can name: a craftsman called Henry, who made the spurs that cavalry
                wore into the war.
              </p>
              <p className="body-copy">
                We cannot undo any of that, and we will not paper over it. What we can decide
                is what this place is now. When we weigh a decision about Rixey today, we ask
                whether it would make the estate's original owners turn in their graves, and
                when the answer is a firm yes, we know we are pointing the right way. This is
                now somewhere every couple, of any race, religion, or orientation, is safe,
                celebrated, and genuinely welcome.
              </p>
              <p className="body-copy">
                The rest is unfinished work. Isadora is a British historian, and she is still
                researching this house and the people bound to it. The aim is not the owners,
                whose names are easy to find. It is the enslaved men, women and children whose
                lives were written out of the record and who deserve to have their stories
                told too. A plaque on the old blacksmith shop stands in their memory, and as
                we recover names, they will go here. If you are descended from anyone enslaved
                on this land, we would be honoured to hear from you.
              </p>
              <p className="body-copy">
                And we keep it standing. Some of the skill in the oldest parts of this house,
                the carving, the joinery, the brickwork, was the work of enslaved hands. The
                surest way we know to honour it is to make sure the building is never again
                left derelict and at risk of being lost, the way it once was. It came close.
                Not again.
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

      </div>
    </section>
  )
}
