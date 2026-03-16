import Image from 'next/image'
import FadeUp from '@/components/ui/FadeUp'

const TEAM = [
  {
    name: 'Isadora Martin-Dye',
    role: 'Owner',
    slot: 'venue-team-isadora',
    bio: 'Isadora built Rixey Manor from a derelict shell and has run it her way for over a decade. Before this, she spent years in film and TV in Los Angeles — including productions like The Hunger Games. That background informs everything here: the standards, the storytelling, the guest experience. Certified Elite Wedding Planner. Knot Hall of Fame.',
  },
  {
    name: 'Grace',
    role: 'Venue Manager',
    slot: 'venue-team-grace',
    bio: 'Grace manages the client journey from the moment you sign your contract through the last Sunday morning goodbye. She handles your planning file, table layouts, vendor coordination, and monthly check-ins. She will have seen your floor plan more times than you have.',
  },
]

function TeamMember({ person, image }) {
  return (
    <FadeUp>
      <div className="flex flex-col items-start">
        <div className="relative w-36 h-36 rounded-full overflow-hidden bg-[var(--sage-light)] mb-5">
          {image ? (
            <Image
              src={image.url}
              alt={image.alt_text || person.name}
              fill
              className="object-cover object-top"
              sizes="144px"
            />
          ) : (
            <div className="w-full h-full bg-[var(--sage-light)]" />
          )}
        </div>
        <h4
          className="text-[20px] leading-snug text-[var(--ink)] mb-1"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {person.name}
        </h4>
        <p
          className="text-[11px] font-medium tracking-[0.2em] uppercase text-[var(--rose)] mb-4"
          style={{ fontFamily: 'var(--font-ui)' }}
        >
          {person.role}
        </p>
        <p className="body-copy text-[15px]">{person.bio}</p>
      </div>
    </FadeUp>
  )
}

export default function TeamSection({ teamImages = {} }) {
  return (
    <section id="team" className="bg-[var(--warm-white)] py-24 lg:py-28 px-6 lg:px-10 border-t border-[var(--border)]">
      <div className="max-w-7xl mx-auto">

        <FadeUp>
          <p className="eyebrow mb-12">The Team</p>
        </FadeUp>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-14 lg:gap-20 max-w-3xl mb-14">
          {TEAM.map(person => (
            <TeamMember key={person.name} person={person} image={teamImages[person.slot] || null} />
          ))}
        </div>

        <FadeUp>
          <div className="max-w-xl pt-10 border-t border-[var(--border)]">
            <p className="body-copy text-[15px] mb-4">
              The core team is intentionally small. The extended event team — setup crew, day-of staff, breakdown — scales to whatever your wedding needs. Many of the people who work here have been doing so for more than ten years. That kind of loyalty is rare in hospitality. We think it shows on the day.
            </p>
            <p
              className="text-[17px] text-[var(--ink)] italic"
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
