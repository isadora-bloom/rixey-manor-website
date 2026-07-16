import Image from 'next/image'
import FadeUp from '@/components/ui/FadeUp'

// The full team, restored. Grace's longer bio and the bartending team
// (including Cousin Adam) were cut in the rebuild — they're back here.
// This is the canonical team surface; /venue links in to #team.
function TeamCard({ name, role, image, children }) {
  return (
    <FadeUp>
      <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-6 lg:gap-10 items-start">
        <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full overflow-hidden bg-[var(--sage-light)]">
          {image ? (
            <Image
              src={image.url}
              alt={image.alt_text || name}
              fill
              className="object-cover object-top"
              sizes="160px"
            />
          ) : (
            <div className="w-full h-full bg-[var(--sage-light)]" />
          )}
        </div>
        <div>
          <h3
            className="text-[22px] leading-snug text-[var(--ink)] mb-1"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {name}
          </h3>
          <p
            className="text-[11px] font-medium tracking-[0.2em] uppercase text-[var(--rose)] mb-4"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            {role}
          </p>
          <div className="flex flex-col gap-3">{children}</div>
        </div>
      </div>
    </FadeUp>
  )
}

export default function FullTeam({ teamImages = {} }) {
  return (
    <section id="team" className="bg-[var(--warm-white)] py-24 lg:py-32 px-6 lg:px-10 border-t border-[var(--border)]">
      <div className="max-w-3xl mx-auto">

        <FadeUp>
          <p className="eyebrow mb-6">The Team</p>
          <h2
            className="text-[30px] lg:text-[42px] leading-[1.1] text-[var(--ink)] mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            The people who
            <em> run your day.</em>
          </h2>
          <p className="body-copy mb-16 max-w-2xl">
            The core team is intentionally small, and many of the people here have been
            doing this for more than ten years. That kind of loyalty is rare in hospitality.
            We think it shows on the day.
          </p>
        </FadeUp>

        <div className="flex flex-col gap-16">

          <TeamCard name="Grace" role="Venue Manager" image={teamImages['venue-team-grace']}>
            <p className="body-copy">
              For over ten years, Grace has been the steady hand behind our events.
              Originally from New York State, she balances the job with being a proud mom to
              her son. She lives in the details: vendor coordination, timelines, floor plans,
              the hundred small things that have to line up for a day to feel effortless. Her
              precision is what lets us offer a flexible catering policy, because we know
              every "i" will be dotted and every "t" crossed.
            </p>
            <p className="body-copy">
              She is also, affectionately, our grandmother wrangler. Her warmth keeps family
              members feeling cared for and included, the excited grandmothers especially, so
              that mothers can focus entirely on their daughters. Getting Grace to pose for a
              photograph is notoriously hard. Looking after a young party guest, it turns
              out, was too tempting to resist.
            </p>
          </TeamCard>

          <TeamCard name="The Bartending Team" role="Behind the Bar" image={teamImages['history-team-bartenders']}>
            <p className="body-copy">
              Our bartenders are hired exclusively through us, and they are part of the
              fabric of the place. Some have been here since our very first wedding. A few
              loved Rixey so much they chose it for their own day. They do not just pour
              drinks. They carry the same standard we teach everyone here: professional,
              attentive, genuinely warm.
            </p>
            <p className="body-copy">
              You will often find Cousin Adam behind the bar. He came to us after hiking the
              Appalachian Trail, lives on the estate, and is known for a dry wit that guests
              adore. Sharp humor aside, he is one of the most reliable people we have, as
              good at troubleshooting a setup as he is at mixing a drink. From the first pour
              to the final farewell, the team keeps things seamless so you and your guests
              can just be present.
            </p>
          </TeamCard>

        </div>

        <FadeUp>
          <div className="max-w-xl pt-12 mt-16 border-t border-[var(--border)]">
            <p className="body-copy mb-4">
              The extended event team, the setup crew, day-of staff, and breakdown, scales to
              whatever your wedding needs. Isadora leads all of it, and her story is above.
            </p>
            <p className="body-copy mb-4">
              Whoever you are, and whoever you love, this team is glad you are here.
            </p>
            <p
              className="text-[18px] text-[var(--ink)] italic"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              One wedding at a time. Every time.
            </p>
          </div>
        </FadeUp>

      </div>
    </section>
  )
}
