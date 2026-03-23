'use client'

import { useState, useEffect, Suspense } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'

// ─── QUESTIONS DATA ───────────────────────────────────────────────────────────

const VIBES_QS = [
  {
    id: 'v1',
    q: 'Your ideal date night?',
    opts: [
      { id: 'v1a', t: "A restaurant you've had bookmarked for months. You finally go.", pts: 2 },
      { id: 'v1b', t: "Cooking something elaborate at home. A good bottle open. No plans after.", pts: 2 },
      { id: 'v1c', t: "Live music somewhere small. You stay out later than intended.", pts: 1 },
      { id: 'v1d', t: "Bottle service at a club. The whole production.", pts: 0, disq: true },
      { id: 'v1e', t: "A film and takeout. Honestly perfect.", pts: 1 },
    ],
  },
  {
    id: 'v2',
    q: 'Dream weekend away?',
    opts: [
      { id: 'v2a', t: "A farmhouse or cabin. Fireplace. Nothing scheduled.", pts: 3, tag: 'farmhouse' },
      { id: 'v2b', t: "A city hotel, one great restaurant, a long walk, maybe a museum.", pts: 1 },
      { id: 'v2c', t: "All-inclusive beach resort. Someone brings you drinks. Zero decisions.", pts: 0, disq: true },
      { id: 'v2d', t: "Somewhere neither of you has been. Plans made the day before.", pts: 2 },
      { id: 'v2e', t: "No plans at all. That IS the plan.", pts: 1 },
    ],
  },
  {
    id: 'v3',
    q: "Pick the set that's basically you:",
    opts: [
      { id: 'v3a', t: '🌿  🐕  🍷', pts: 3, tag: 'dog' },
      { id: 'v3b', t: '🥂  ✨  💅', pts: -1 },
      { id: 'v3c', t: '🌅  🏔️  📷', pts: 2, tag: 'outdoor' },
      { id: 'v3d', t: '🎉  🍾  🕺', pts: 0, disq: true },
      { id: 'v3e', t: '🕯️  📚  🫖', pts: 2, tag: 'candlelit' },
      { id: 'v3f', t: '📋  ✅  🗓️', pts: 0 },
    ],
  },
  {
    id: 'v4',
    q: 'Ideal Sunday morning?',
    opts: [
      { id: 'v4a', t: 'Slow. Coffee. Nowhere to be.', pts: 2 },
      { id: 'v4b', t: 'Farmers market, something baked, a long walk.', pts: 2 },
      { id: 'v4c', t: 'Big brunch, big group, the more the merrier.', pts: 0 },
      { id: 'v4d', t: 'Completely alone. Recharging. Do not contact us.', pts: 1 },
      { id: 'v4e', t: 'Back to sleep, honestly.', pts: 1 },
    ],
  },
  {
    id: 'v5',
    q: 'Your home is closest to:',
    opts: [
      { id: 'v5a', t: 'Old things with history. Worn wood over new laminate any day.', pts: 3, tag: 'historic' },
      { id: 'v5b', t: 'Clean lines, modern, everything has a place.', pts: -1 },
      { id: 'v5c', t: 'Collected. Meaningful stuff everywhere. Probably a bit much.', pts: 2 },
      { id: 'v5d', t: 'Somewhere between Airbnb and aspirational.', pts: 0 },
    ],
  },
  {
    id: 'v6',
    q: 'The dog?',
    opts: [
      { id: 'v6a', t: 'We have one and they come everywhere.', pts: 3, tag: 'dog' },
      { id: 'v6b', t: "We don't have one but we absolutely should.", pts: 1 },
      { id: 'v6c', t: "We love other people's dogs.", pts: 0 },
      { id: 'v6d', t: 'Hard no / allergies.', pts: -1 },
    ],
  },
  {
    id: 'v7',
    q: 'Pick 3 or 4 words that feel like your wedding:',
    type: 'words',
    min: 3,
    max: 4,
    words: [
      { w: 'Worn', pts: 1 }, { w: 'Honest', pts: 1 }, { w: 'Gathered', pts: 1 },
      { w: 'Candlelit', pts: 1, tag: 'candlelit' }, { w: 'Unhurried', pts: 1 },
      { w: 'Barefoot', pts: 1 }, { w: 'Layered', pts: 1 }, { w: 'Rambling', pts: 1 },
      { w: 'Historic', pts: 1, tag: 'historic' }, { w: 'Handmade', pts: 1 },
      { w: 'Imperfect', pts: 1 }, { w: 'Real', pts: 1 }, { w: 'Overgrown', pts: 1 },
      { w: 'Relaxed', pts: 1 }, { w: 'Old', pts: 1 },
      { w: 'Sleek', pts: -2 }, { w: 'Polished', pts: -2 }, { w: 'Curated', pts: -2 },
      { w: 'Modern', pts: -2 }, { w: 'Managed', pts: -2 }, { w: 'Urban', pts: -2 },
      { w: 'Pristine', pts: -2 }, { w: 'Efficient', pts: -2 }, { w: 'Chic', pts: -2 },
      { w: 'Minimal', pts: -2 }, { w: 'Controlled', pts: -2 }, { w: 'Coordinated', pts: -2 },
      { w: 'Luxe', pts: -2 }, { w: 'Handled', pts: -2 }, { w: 'Branded', pts: -2 },
    ],
  },
]

const LOGISTICS_QS = [
  {
    id: 'l1',
    q: 'How many guests are you thinking?',
    opts: [
      { id: 'l1a', t: 'Under 50 — just the people who really matter.', pts: 2, tag: 'intimate' },
      { id: 'l1b', t: '50–100', pts: 3 },
      { id: 'l1c', t: '100–150', pts: 2 },
      { id: 'l1d', t: '150–200', pts: 1 },
      { id: 'l1e', t: '200+', pts: 0, tag: 'big-group' },
      { id: 'l1f', t: 'No idea yet.', pts: 0 },
    ],
  },
  {
    id: 'l2',
    q: "Rixey is about an hour from DC. Is that fine?",
    opts: [
      { id: 'l2a', t: 'Completely fine — we want to be away from the city.', pts: 3 },
      { id: 'l2b', t: 'Fine for us, might stretch some guests.', pts: 2, tag: 'drive' },
      { id: 'l2c', t: "It's at the limit of what we'd consider.", pts: 0, tag: 'drive' },
      { id: 'l2d', t: "That's too far.", pts: 0, disq: true, tag: 'drive' },
    ],
  },
  {
    id: 'l3',
    q: 'One day or the whole weekend?',
    opts: [
      { id: 'l3a', t: 'The whole weekend — Friday through Sunday is the dream.', pts: 3, tag: 'weekend' },
      { id: 'l3b', t: 'One day works for us.', pts: 1 },
      { id: 'l3c', t: "We'd love the weekend but budget is a real factor.", pts: 1, tag: 'budget-concern' },
    ],
  },
  {
    id: 'l4',
    q: 'Vendors — caterer, florist, DJ. How do you want to handle that?',
    opts: [
      { id: 'l4a', t: 'We want to choose everything ourselves.', pts: 3, tag: 'no-vendor-list' },
      { id: 'l4b', t: 'We have some people in mind, need help with the rest.', pts: 2 },
      { id: 'l4c', t: "We'd prefer recommendations and a bit of hand-holding.", pts: 1 },
      { id: 'l4d', t: 'One package, everything arranged, done.', pts: 0, disq: true },
    ],
  },
  {
    id: 'l5',
    q: 'The bar?',
    opts: [
      { id: 'l5a', t: 'BYO — more control, better value.', pts: 3, tag: 'byob' },
      { id: 'l5b', t: "We'd prefer a fully managed bar service.", pts: -1, tag: 'hosted-bar' },
      { id: 'l5c', t: 'Dry wedding.', pts: 0 },
      { id: 'l5d', t: "Haven't thought about it yet.", pts: 0 },
    ],
  },
  {
    id: 'l6',
    q: 'Rough total budget for everything?',
    opts: [
      { id: 'l6a', t: 'Under $25k', pts: 0, disq: true, tag: 'budget-low' },
      { id: 'l6b', t: '$25k–$50k', pts: 1 },
      { id: 'l6c', t: '$50k–$100k', pts: 2 },
      { id: 'l6d', t: '$100k–$175k', pts: 3 },
      { id: 'l6e', t: '$175k+', pts: 3 },
      { id: 'l6f', t: 'No idea yet.', pts: 0 },
    ],
  },
  {
    id: 'l7',
    q: 'Pick 3 or 4 words that describe what you need from a venue:',
    type: 'words',
    min: 3,
    max: 4,
    words: [
      { w: 'Exclusive', pts: 1 }, { w: 'Flexible', pts: 1 }, { w: 'Outdoor', pts: 1, tag: 'outdoor' },
      { w: 'Personal', pts: 1 }, { w: 'Whole-weekend', pts: 1, tag: 'weekend' },
      { w: 'Intimate', pts: 1, tag: 'intimate' }, { w: 'Dog-friendly', pts: 1, tag: 'dog' },
      { w: 'Historic', pts: 1, tag: 'historic' }, { w: 'Overnight', pts: 1, tag: 'overnight' },
      { w: 'Scenic', pts: 1 }, { w: 'Independent', pts: 1 }, { w: 'Open', pts: 1 },
      { w: 'BYOB', pts: 1, tag: 'byob' }, { w: 'Real', pts: 1 }, { w: 'Ours', pts: 1 },
      { w: 'All-inclusive', pts: -2 }, { w: 'Managed', pts: -2 }, { w: 'Turnkey', pts: -2 },
      { w: 'Centrally-located', pts: -2 }, { w: 'Catered', pts: -2 }, { w: 'Full-service', pts: -2 },
      { w: 'Structured', pts: -2 }, { w: 'Comprehensive', pts: -2 }, { w: 'Handled', pts: -2 },
      { w: 'Coordinated', pts: -2 }, { w: 'Polished', pts: -2 }, { w: 'Urban', pts: -2 },
      { w: 'Convenient', pts: -2 }, { w: 'Modern', pts: -2 }, { w: 'Accessible', pts: -2 },
    ],
  },
]

// ─── ONE-LINERS ───────────────────────────────────────────────────────────────

const ONE_LINERS = [
  { tag: 'dog', text: "You mentioned the dog goes everywhere. Good. So does ours sometimes. You'll fit in fine." },
  { tag: 'farmhouse', text: `Farmhouse getaway — yes. Though we'd say ${new Date().getFullYear() - 1801}-year-old manor on 30 acres, but farmhouse getaway captures the spirit of it.` },
  { tag: 'byob', text: "You want to pick your own wine. We have never once charged a corkage fee. We think this is the beginning of something." },
  { tag: 'weekend', text: "Friday rehearsal dinner, Saturday wedding, Sunday brunch with the people still standing. You've understood what we're selling." },
  { tag: 'candlelit', text: "Candlelit. We've got crystal chandeliers and a copper bathtub. We think you'll manage." },
  { tag: 'no-vendor-list', text: "You want to bring your own people. That's the only way we do it. There is no preferred list. There is only your list." },
  { tag: 'intimate', text: "Sixty guests who all actually know you. That's our sweet spot, honestly. Anyone who made the cut deserves to be there." },
  { tag: 'drive', text: "An hour from DC gave you pause. Understandable. Worth knowing: our couples consistently say the drive is the last thing they think about once they're here." },
  { tag: 'outdoor', text: "You want to get married outside. We have a lake. The Blue Ridge Mountains are behind it. We won't oversell it." },
  { tag: 'overnight', text: "You asked about staying over. The Newlywed Suite has a copper bathtub and a 360-degree mirror. You won't be rushing home." },
  { tag: 'hosted-bar', text: "You want someone else to handle the bar entirely. That's a full-service venue — hotel ballroom territory. We're BYOB, which means you're in charge of the wine list. Some people love that. Some people really don't." },
  { tag: 'big-group', text: "Two hundred or more guests. We go up to 250 outdoors. You're cutting it fine, but let's talk before you rule it out." },
  { tag: 'historic', text: "Historic and full of character. Built in 1801. There's a signed pen-and-ink sketch of the manor we found inside when we moved in. It came with the house. So does that feeling." },
  { tag: 'budget-concern', text: "Budget is front of mind — fair. Our pricing calculator is on the site. No hidden fees, no mandatory upgrades. The number you see is the number." },
]

// ─── SCORING ──────────────────────────────────────────────────────────────────

function getMaxScore(qs) {
  return qs.reduce((sum, q) => {
    if (q.type === 'words') return sum + q.max
    const maxPts = Math.max(...q.opts.filter(o => !o.disq).map(o => o.pts || 0), 0)
    return sum + maxPts
  }, 0)
}

function scoreQuiz(answers, qs) {
  let total = 0
  const tags = new Set()
  let disqualified = false
  for (const q of qs) {
    const ans = answers[q.id]
    if (ans === undefined) continue
    if (q.type === 'words') {
      for (const word of (Array.isArray(ans) ? ans : [])) {
        const wd = q.words.find(w => w.w === word)
        if (wd) { total += wd.pts; if (wd.tag) tags.add(wd.tag) }
      }
    } else {
      const opt = q.opts.find(o => o.id === ans)
      if (opt) {
        if (opt.disq) disqualified = true
        if (opt.tag) tags.add(opt.tag)
        total += opt.pts || 0
      }
    }
  }
  const pct = getMaxScore(qs) > 0 ? total / getMaxScore(qs) : 0
  const tier = disqualified || pct < 0.35 ? 3 : pct >= 0.65 ? 1 : 2
  return { tier, total, tags: Array.from(tags) }
}

function pickOneLiners(tags) {
  return ONE_LINERS.filter(ol => tags.includes(ol.tag)).slice(0, 2)
}

// ─── TIER DATA ────────────────────────────────────────────────────────────────

const TIER_DATA = {
  1: {
    eyebrow: "You're a Rixey Couple",
    headline: "You already knew, didn't you.",
    body: "The whole-weekend thing. The no-vendor-list thing. The \"we want it to feel like ours\" thing. You weren't looking for a venue to fit into — you were looking for a place that fits you. That's exactly what Rixey is.\n\nCome and see it. We think you'll walk in and stop talking mid-sentence.",
    image: '/assets/quiz-tier-1.webp',
    imageAlt: 'Couple walking down the aisle at Rixey Manor with confetti',
    cta: 'Book a Tour',
    ctaHref: '/pricing#book-tour',
  },
  2: {
    eyebrow: 'Could Go Either Way',
    headline: 'Worth a conversation. Possibly a very good one.',
    body: "You're not a certain-no and you're not a certain-yes, which usually means the details matter. The drive. The headcount. The vision that's still forming. Those are exactly the things a tour is for.\n\nRixey isn't for every couple — but we've got a hunch about you. Come see it before you decide.",
    image: '/assets/quiz-tier-2.webp',
    imageAlt: 'Couple on the Rixey Manor front balcony',
    cta: 'Book a Tour',
    ctaHref: '/pricing#book-tour',
  },
  3: {
    eyebrow: "Probably Not Your Place",
    headline: "Rixey's not your venue. That's actually useful information.",
    body: "Not every couple wants a whole estate in rural Virginia for a weekend. Some people want something closer, something bigger, something with the catering already sorted and a hotel block across the street. That's completely legitimate. It's just not what we are.\n\nWhat you're describing sounds like a venue that does the heavy lifting on logistics — in-house catering, a dedicated coordinator who handles everything from linen colour to the seating chart, a location your guests can get to without a car hire. There are good options out there for exactly that. Rixey just isn't one of them.",
    image: '/assets/quiz-tier-3.webp',
    imageAlt: 'Bride descending the Rixey Manor grand staircase',
    cta: null,
    softCta: "Think we got it wrong? Come and tell us.",
    softCtaHref: '/pricing#book-tour',
  },
}

// ─── CONTACT FORM ─────────────────────────────────────────────────────────────

function ContactForm({ tier, path, answers, questions }) {
  const [form, setForm] = useState({ name: '', partner: '', email: '', date: '', notes: '' })
  const [status, setStatus] = useState('idle')

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('submitting')
    try {
      const res = await fetch('/api/quiz-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, tier, path, answers: summariseAnswers(answers, questions) }),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch { setStatus('error') }
  }

  if (status === 'success') return (
    <div className="mt-8 p-6 bg-[var(--cream)]">
      <p className="text-[17px] mb-2" style={{ fontFamily: 'var(--font-display)' }}>Got it.</p>
      <p className="text-[15px] text-[var(--ink-light)]" style={{ fontFamily: 'var(--font-body)' }}>
        {"We'll be in touch soon. You'll hear from Isadora directly."}
      </p>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <p className="text-[13px] text-[var(--ink-light)]" style={{ fontFamily: 'var(--font-ui)' }}>
        {"We'll attach your quiz answers so you don't have to explain twice."}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] tracking-[0.15em] uppercase mb-2 text-[var(--ink-light)]" style={{ fontFamily: 'var(--font-ui)' }}>Your name *</label>
          <input required type="text" value={form.name} onChange={e => set('name', e.target.value)}
            className="w-full px-4 py-3 bg-white border border-[var(--border)] text-[15px] focus:outline-none focus:border-[var(--forest)] transition-colors"
            style={{ fontFamily: 'var(--font-body)' }} placeholder="Alex" />
        </div>
        <div>
          <label className="block text-[11px] tracking-[0.15em] uppercase mb-2 text-[var(--ink-light)]" style={{ fontFamily: 'var(--font-ui)' }}>{"Partner's name"}</label>
          <input type="text" value={form.partner} onChange={e => set('partner', e.target.value)}
            className="w-full px-4 py-3 bg-white border border-[var(--border)] text-[15px] focus:outline-none focus:border-[var(--forest)] transition-colors"
            style={{ fontFamily: 'var(--font-body)' }} placeholder="Jordan" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] tracking-[0.15em] uppercase mb-2 text-[var(--ink-light)]" style={{ fontFamily: 'var(--font-ui)' }}>Email *</label>
          <input required type="email" value={form.email} onChange={e => set('email', e.target.value)}
            className="w-full px-4 py-3 bg-white border border-[var(--border)] text-[15px] focus:outline-none focus:border-[var(--forest)] transition-colors"
            style={{ fontFamily: 'var(--font-body)' }} placeholder="you@example.com" />
        </div>
        <div>
          <label className="block text-[11px] tracking-[0.15em] uppercase mb-2 text-[var(--ink-light)]" style={{ fontFamily: 'var(--font-ui)' }}>Wedding date in mind</label>
          <input type="text" value={form.date} onChange={e => set('date', e.target.value)}
            className="w-full px-4 py-3 bg-white border border-[var(--border)] text-[15px] focus:outline-none focus:border-[var(--forest)] transition-colors"
            style={{ fontFamily: 'var(--font-body)' }} placeholder="October 2026, or no idea yet" />
        </div>
      </div>
      <div>
        <label className="block text-[11px] tracking-[0.15em] uppercase mb-2 text-[var(--ink-light)]" style={{ fontFamily: 'var(--font-ui)' }}>Anything else you want us to know</label>
        <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={3}
          className="w-full px-4 py-3 bg-white border border-[var(--border)] text-[15px] focus:outline-none focus:border-[var(--forest)] transition-colors resize-none"
          style={{ fontFamily: 'var(--font-body)' }} placeholder="Whatever feels relevant." />
      </div>
      {status === 'error' && (
        <p className="text-[13px] text-red-600" style={{ fontFamily: 'var(--font-ui)' }}>
          Something went wrong. Try emailing us at info@rixeymanor.com
        </p>
      )}
      <button type="submit" disabled={status === 'submitting'} className="btn-primary disabled:opacity-60">
        {status === 'submitting' ? 'Sending...' : 'Send this to Rixey'}
      </button>
    </form>
  )
}

function summariseAnswers(answers, questions) {
  return questions.map(q => {
    const ans = answers[q.id]
    if (!ans) return null
    if (q.type === 'words') return `${q.q}\n→ ${Array.isArray(ans) ? ans.join(', ') : ans}`
    const opt = q.opts.find(o => o.id === ans)
    return opt ? `${q.q}\n→ ${opt.t}` : null
  }).filter(Boolean).join('\n\n')
}

// ─── LANDING SCREEN ───────────────────────────────────────────────────────────

function Landing({ onStart }) {
  return (
    <div className="relative min-h-screen flex flex-col justify-end">
      {/* Full-screen background image */}
      <div className="absolute inset-0">
        <Image
          src="/assets/quiz-landing.webp"
          alt="Couple walking toward the tent at Rixey Manor at dusk"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Overlay — bottom half very dark, top stays readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/70 to-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 lg:px-16 pb-16 lg:pb-20 pt-32">
        <div className="max-w-5xl mx-auto">
          <p className="eyebrow-sage mb-5">Not every venue is for every couple</p>
          <h1
            className="text-[44px] lg:text-[68px] leading-[1.05] mb-6 max-w-2xl"
            style={{ fontFamily: 'var(--font-display)', color: '#ffffff' }}
          >
            Is Rixey<br />
            <em>right for you?</em>
          </h1>
          <p className="text-[17px] leading-[1.7] max-w-md mb-12" style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.8)' }}>
            {"A few honest questions. We'll tell you what we think — even if the answer is no."}
          </p>

          {/* Three paths */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl">
            {[
              {
                path: 'vibes',
                label: 'The Vibe Check',
                sub: 'Date nights, Sunday mornings, the dog question.',
                count: '7 questions',
              },
              {
                path: 'logistics',
                label: 'The Logistics Check',
                sub: 'Guest count, the drive, budget, the bar.',
                count: '7 questions',
              },
              {
                path: 'both',
                label: 'Take Both',
                sub: 'The most personalised result.',
                count: '14 questions',
                featured: true,
              },
            ].map(({ path, label, sub, count, featured }) => (
              <button
                key={path}
                onClick={() => onStart(path)}
                className={`group text-left p-6 transition-all duration-200 ${
                  featured
                    ? 'bg-white/15 hover:bg-white/25 border border-white/30 hover:border-white/60'
                    : 'bg-white/8 hover:bg-white/15 border border-white/15 hover:border-white/35'
                }`}
              >
                <p className="text-[10px] tracking-[0.2em] uppercase text-white/45 mb-3" style={{ fontFamily: 'var(--font-ui)' }}>
                  {count}
                </p>
                <p
                  className="text-[18px] text-white mb-2 leading-[1.2]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {label}
                </p>
                <p className="text-[13px] leading-[1.5] text-white/55 mb-4" style={{ fontFamily: 'var(--font-body)' }}>
                  {sub}
                </p>
                <span className="text-[10px] tracking-[0.18em] uppercase text-white/45 group-hover:text-white/80 transition-colors" style={{ fontFamily: 'var(--font-ui)' }}>
                  Start →
                </span>
              </button>
            ))}
          </div>

          <p className="mt-6 text-[11px] tracking-[0.12em] uppercase text-white/35" style={{ fontFamily: 'var(--font-ui)' }}>
            No email required to see your result
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── QUESTION SCREEN ──────────────────────────────────────────────────────────

function QuestionScreen({ questions, currentQ, answers, onAnswer, onWordNext, onBack, path }) {
  const [visible, setVisible] = useState(true)
  const [displayQ, setDisplayQ] = useState(currentQ)

  useEffect(() => {
    if (currentQ !== displayQ) {
      setVisible(false)
      const t = setTimeout(() => {
        setDisplayQ(currentQ)
        setVisible(true)
      }, 220)
      return () => clearTimeout(t)
    }
  }, [currentQ, displayQ])

  const q = questions[displayQ]
  const progress = ((displayQ) / questions.length) * 100
  const selectedWords = Array.isArray(answers[q?.id]) ? answers[q?.id] : []
  const currentAnswer = answers[q?.id]

  function toggleWord(w) {
    const current = Array.isArray(answers[q.id]) ? answers[q.id] : []
    if (current.includes(w)) {
      onAnswer(q.id, current.filter(x => x !== w))
    } else if (current.length < q.max) {
      onAnswer(q.id, [...current, w])
    }
  }

  if (!q) return null

  const pathLabel = path === 'vibes' ? 'Vibe Check' : path === 'logistics' ? 'Logistics Check' : 'Full Check'

  return (
    <div className="min-h-screen bg-[var(--warm-white)] flex flex-col">
      {/* Progress line */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-[var(--border)]">
        <div
          className="h-full bg-[var(--forest)] transition-all duration-600 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Nav */}
      <div className="flex items-center justify-between px-6 lg:px-12 pt-8 pb-6">
        <button
          onClick={onBack}
          className="text-[11px] tracking-[0.15em] uppercase text-[var(--ink-light)] hover:text-[var(--ink)] transition-colors"
          style={{ fontFamily: 'var(--font-ui)' }}
        >
          ← Back
        </button>
        <p className="text-[11px] tracking-[0.15em] uppercase text-[var(--ink-light)]" style={{ fontFamily: 'var(--font-ui)' }}>
          {pathLabel} &middot; {displayQ + 1} / {questions.length}
        </p>
      </div>

      {/* Question area */}
      <div
        className="flex-1 flex flex-col justify-center px-6 lg:px-12 pb-20 transition-all duration-220"
        style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(12px)' }}
      >
        <div className="max-w-xl mx-auto w-full">

          {/* Question number */}
          <p className="text-[11px] tracking-[0.2em] uppercase text-[var(--ink-light)] mb-6" style={{ fontFamily: 'var(--font-ui)' }}>
            {String(displayQ + 1).padStart(2, '0')}
          </p>

          {/* Question text */}
          <h2
            className="text-[28px] lg:text-[34px] leading-[1.25] text-[var(--ink)] mb-10"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {q.q}
          </h2>

          {q.type === 'words' ? (
            /* Word picker */
            <div>
              <p className="text-[12px] tracking-[0.1em] uppercase text-[var(--ink-light)] mb-5" style={{ fontFamily: 'var(--font-ui)' }}>
                {selectedWords.length < q.min
                  ? `Select ${q.min}–${q.max} · ${q.min - selectedWords.length} more to go`
                  : `${selectedWords.length} selected · ready when you are`}
              </p>
              <div className="flex flex-wrap gap-2 mb-10">
                {q.words.map(({ w }) => {
                  const selected = selectedWords.includes(w)
                  const maxed = selectedWords.length >= q.max && !selected
                  return (
                    <button
                      key={w}
                      onClick={() => toggleWord(w)}
                      disabled={maxed}
                      style={{ fontFamily: 'var(--font-body)' }}
                      className={`px-4 py-2 text-[14px] border transition-all duration-150 ${
                        selected
                          ? 'bg-[var(--forest)] text-white border-[var(--forest)]'
                          : maxed
                          ? 'bg-transparent text-[var(--ink-light)] border-[var(--border)] opacity-30 cursor-not-allowed'
                          : 'bg-transparent text-[var(--ink-mid)] border-[var(--border)] hover:border-[var(--forest)] hover:text-[var(--forest)]'
                      }`}
                    >
                      {w}
                    </button>
                  )
                })}
              </div>
              <button
                onClick={onWordNext}
                disabled={selectedWords.length < q.min}
                className="btn-primary disabled:opacity-30"
              >
                Continue
              </button>
            </div>
          ) : (
            /* Answer options */
            <div className="space-y-3">
              {q.opts.map(opt => {
                const isSelected = currentAnswer === opt.id
                return (
                  <button
                    key={opt.id}
                    onClick={() => onAnswer(q.id, opt.id)}
                    style={{ fontFamily: 'var(--font-body)', boxShadow: isSelected ? 'none' : undefined }}
                    className={`w-full text-left px-6 py-4 text-[16px] leading-[1.55] transition-all duration-200 border-l-[3px] ${
                      isSelected
                        ? 'bg-[var(--forest)] text-white border-l-[var(--forest)] pl-6'
                        : 'bg-white text-[var(--ink-mid)] border-l-transparent hover:border-l-[var(--rose)] hover:text-[var(--ink)] hover:shadow-[0_2px_12px_rgba(0,0,0,0.08)]'
                    }`}
                  >
                    {opt.t}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── RESULT SCREEN ────────────────────────────────────────────────────────────

function ResultScreen({ result, onRestart, answers, questions }) {
  const [showContact, setShowContact] = useState(false)
  const [copied, setCopied] = useState(false)
  const [visible, setVisible] = useState(false)
  const path = questions.length > 7 ? 'both' : questions[0]?.id?.startsWith('v') ? 'vibes' : 'logistics'
  const tier = result.eyebrow.includes("Rixey Couple") ? 1 : result.cta ? 2 : 3

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60)
    return () => clearTimeout(t)
  }, [])

  function handleShare() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const paragraphs = result.body.split('\n\n').filter(Boolean)

  return (
    <div
      className="min-h-screen flex flex-col lg:flex-row transition-opacity duration-500"
      style={{ opacity: visible ? 1 : 0 }}
    >
      {/* Image panel */}
      <div className="relative w-full lg:w-[42%] lg:sticky lg:top-0 lg:h-screen flex-shrink-0">
        <div className="relative w-full h-[70vw] lg:h-full min-h-[320px]">
          <Image
            src={result.image}
            alt={result.imageAlt}
            fill
            className="object-cover object-top"
            priority
          />
        </div>
      </div>

      {/* Content panel */}
      <div className="flex-1 bg-[var(--warm-white)] px-8 lg:px-16 py-14 lg:py-24 flex flex-col justify-center">
        <div className="max-w-[480px]">

          <p className="eyebrow mb-5">{result.eyebrow}</p>

          <h1
            className="text-[32px] lg:text-[42px] leading-[1.1] text-[var(--ink)] mb-8"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {result.headline}
          </h1>

          {/* Personalised one-liners */}
          {result.oneLiners?.length > 0 && (
            <div className="mb-8 pl-5 border-l-2 border-[var(--rose)] space-y-3">
              {result.oneLiners.map((ol, i) => (
                <p
                  key={i}
                  className="text-[15px] leading-[1.7] text-[var(--ink-mid)] italic"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {ol.text}
                </p>
              ))}
            </div>
          )}

          {/* Body */}
          <div className="space-y-5 mb-10">
            {paragraphs.map((p, i) => (
              <p key={i} className="text-[16px] leading-[1.8] text-[var(--ink-mid)]" style={{ fontFamily: 'var(--font-body)' }}>
                {p}
              </p>
            ))}
          </div>

          {/* CTA */}
          {result.cta && !showContact && (
            <div className="space-y-3 mb-10">
              <a href={result.ctaHref} className="btn-primary inline-flex">
                {result.cta}
              </a>
              <button
                onClick={() => setShowContact(true)}
                className="block text-[11px] tracking-[0.15em] uppercase text-[var(--ink-light)] hover:text-[var(--forest)] transition-colors underline underline-offset-4"
                style={{ fontFamily: 'var(--font-ui)' }}
              >
                Send us your quiz answers with your inquiry
              </button>
            </div>
          )}

          {result.cta && showContact && (
            <div className="mb-10">
              <ContactForm tier={tier} path={path} answers={answers} questions={questions} />
            </div>
          )}

          {/* Soft CTA for tier 3 */}
          {!result.cta && result.softCta && (
            <div className="mb-10 pt-8 border-t border-[var(--border)]">
              <a
                href={result.softCtaHref}
                className="inline-block text-[13px] text-[var(--ink-light)] hover:text-[var(--ink)] transition-colors underline underline-offset-4"
                style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic' }}
              >
                {result.softCta}
              </a>
            </div>
          )}

          {/* Footer actions */}
          <div className="pt-6 border-t border-[var(--border)] flex flex-wrap items-center gap-5">
            <button
              onClick={handleShare}
              className="text-[11px] tracking-[0.15em] uppercase text-[var(--ink-light)] hover:text-[var(--ink)] transition-colors"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              {copied ? '✓ Link copied' : 'Share your result'}
            </button>
            <button
              onClick={onRestart}
              className="text-[11px] tracking-[0.15em] uppercase text-[var(--ink-light)] hover:text-[var(--ink)] transition-colors"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              Take it again
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

// ─── MAIN QUIZ ────────────────────────────────────────────────────────────────

function QuizContent({ calendlyUrl = '' }) {
  const sp = useSearchParams()
  const initTier = sp ? parseInt(sp.get('r')) || null : null
  const initResult = initTier && TIER_DATA[initTier] ? { ...TIER_DATA[initTier], oneLiners: [] } : null

  const [screen, setScreen] = useState(initResult ? 'result' : 'landing')
  const [path, setPath] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(initResult)

  function startPath(p) {
    const qs = p === 'vibes' ? VIBES_QS : p === 'logistics' ? LOGISTICS_QS : [...VIBES_QS, ...LOGISTICS_QS]
    setPath(p); setQuestions(qs); setCurrentQ(0); setAnswers({}); setScreen('questions')
  }

  function handleAnswer(qId, answer) {
    const q = questions[currentQ]
    const newAnswers = { ...answers, [qId]: answer }
    setAnswers(newAnswers)
    if (q?.type === 'words') return
    setTimeout(() => advance(newAnswers), 420)
  }

  function advance(currentAnswers = answers) {
    if (currentQ < questions.length - 1) {
      setCurrentQ(q => q + 1)
    } else {
      const scored = scoreQuiz(currentAnswers, questions)
      const oneLiners = pickOneLiners(scored.tags)
      setResult({ ...TIER_DATA[scored.tier], oneLiners })
      setScreen('result')
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', `/quiz?r=${scored.tier}`)
      }
    }
  }

  function restart() {
    setScreen('landing'); setPath(null); setQuestions([]); setCurrentQ(0)
    setAnswers({}); setResult(null)
    if (typeof window !== 'undefined') window.history.pushState({}, '', '/quiz')
  }

  if (screen === 'landing') return <Landing onStart={startPath} />

  if (screen === 'questions') return (
    <QuestionScreen
      questions={questions}
      currentQ={currentQ}
      answers={answers}
      onAnswer={handleAnswer}
      onWordNext={() => advance()}
      onBack={() => currentQ > 0 ? setCurrentQ(q => q - 1) : setScreen('landing')}
      path={path}
    />
  )

  if (screen === 'result' && result) {
    // Override CTA href with Calendly URL if available
    const resultWithCta = result.cta
      ? { ...result, ctaHref: calendlyUrl || result.ctaHref }
      : result
    return (
      <ResultScreen result={resultWithCta} onRestart={restart} answers={answers} questions={questions} />
    )
  }

  return null
}

export default function Quiz({ calendlyUrl = '' }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0d1a13]" />}>
      <QuizContent calendlyUrl={calendlyUrl} />
    </Suspense>
  )
}
