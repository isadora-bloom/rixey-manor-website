// Data for the inclusion grid used on /pricing and /checklist.
// Single source of truth — keep this aligned with the pricing brief.
//
// Row shape:
//   { item, wd, ew, mode }                         — regular row
//   { section: 'header', slug, label }             — section divider
//
// wd / ew values:
//   'check' → green ✓     'dash' → em-dash (not on this package)
//   any other string is rendered verbatim ('10pm', 'None', '+$1,750', '−10%')
//
// mode controls how blank competitor cells render on /checklist:
//   'dollar'  → ☐  + $ _________   (default)
//   'yesno'   → ☐ yes  ☐ no
//   'percent' → ☐  − ____ %
//   'text'    → _____________

export const ROWS = [
  // ── Section 1: what you get for the headline price ──────────────────────
  { section: 'header', slug: 'base', label: "What's in the base price" },
  { item: 'Venue rental, full day',                       wd: 'check', ew: 'check', mode: 'dollar' },
  { item: 'Friday access for rehearsal dinner',           wd: 'dash',  ew: 'check', mode: 'dollar' },
  { item: 'Two nights lodging for 14 (manor + cottage)',  wd: 'dash',  ew: 'check', mode: 'dollar' },
  { item: 'Chiavari chairs & tables',                     wd: 'check', ew: 'check', mode: 'dollar' },
  { item: 'Two separate getting-ready spaces',            wd: 'check', ew: 'check', mode: 'dollar' },
  { item: 'Exclusive use of the property',                wd: 'Totally private all day', ew: 'Whole weekend, no other weddings', mode: 'text' },
  { item: 'Licensed bartending — Saturday',               wd: 'check', ew: 'check', mode: 'dollar' },
  { item: 'Licensed bartending — Friday',                 wd: 'dash',  ew: 'check', mode: 'dollar' },
  { item: 'BYOB, no corkage fees',                        wd: 'check', ew: 'check', mode: 'dollar' },
  { item: 'Basic linens',                                 wd: 'check', ew: 'check', mode: 'dollar' },
  { item: 'Silk floral + candle centerpieces',            wd: 'check', ew: 'check', mode: 'dollar' },
  { item: 'Borrow shed (décor library)',                  wd: 'check', ew: 'check', mode: 'dollar' },
  { item: 'No required vendor list',                      wd: 'check', ew: 'check', mode: 'dollar' },
  { item: 'No vendor markup or facility fee',             wd: 'check', ew: 'check', mode: 'dollar' },
  { item: 'Day-of venue team',                            wd: 'check', ew: 'check', mode: 'dollar' },
  { item: 'Day-of coordinator',                           wd: 'check', ew: 'check', mode: 'dollar' },
  { item: 'Pets welcome at ceremony',                     wd: 'check', ew: 'check', mode: 'yesno' },
  { item: 'Outdoor finish time',                          wd: '10pm',  ew: '10pm',  mode: 'text' },
  { item: 'Guest minimum',                                wd: 'None',  ew: 'None',  mode: 'text' },

  // ── Section 2: paid upgrades ────────────────────────────────────────────
  { section: 'header', slug: 'upgrades', label: 'Available upgrades' },
  { item: 'Extra hour beyond 10pm (tent, amplified music, fire pit)', wd: '+$750/hr', ew: '+$750/hr', mode: 'dollar' },
  { item: 'Third night of lodging',                              wd: 'dash',     ew: '+$1,750',  mode: 'dollar' },
  { item: 'Overnight — one night before or after',               wd: '+$1,750',  ew: 'dash',     mode: 'dollar' },
  { item: 'Overnight — two nights around the wedding',           wd: '+$3,250',  ew: 'dash',     mode: 'dollar' },
  { item: 'Extra event (cultural ceremony, exit brunch, etc.)',  wd: '+$1,500/50', ew: '+$1,500/50', mode: 'dollar' },
  { item: 'Larger guest count (101–150 Saturday)',               wd: '+$1,500',  ew: '+$1,500',  mode: 'dollar' },
  { item: 'Larger guest count (151–200 Saturday)',               wd: '+$3,000',  ew: '+$3,000',  mode: 'dollar' },

  // ── Section 3: discounts ────────────────────────────────────────────────
  { section: 'header', slug: 'discounts', label: 'Available discounts (stackable up to 20% at Rixey)' },
  { item: 'Off-site ceremony (church, separate venue)',          wd: '−5%',  ew: '−5%',  mode: 'percent' },
  { item: 'Recommended vendors only',                            wd: '−5%',  ew: '−5%',  mode: 'percent' },
  { item: 'Under 50 Saturday guests',                            wd: '−10%', ew: '−10%', mode: 'percent' },
  { item: 'Military / veteran / first responder',                wd: '−10%', ew: '−10%', mode: 'percent' },

  // ── Section 4: BYO freedom + other policies ─────────────────────────────
  { section: 'header', slug: 'policies', label: 'Bring-your-own + other policies' },
  { item: 'Outside caterer of your choice allowed',              wd: 'check', ew: 'check', mode: 'yesno' },
  { item: 'Food trucks allowed',                                 wd: 'check', ew: 'check', mode: 'yesno' },
  { item: 'Multiple ceremony locations on property',             wd: 'check', ew: 'check', mode: 'yesno' },
  { item: 'Indoor backup if it rains',                           wd: 'check', ew: 'check', mode: 'yesno' },
  { item: 'Sparklers allowed (wedding-safe)',                    wd: 'check', ew: 'check', mode: 'yesno' },
  { item: 'Open-flame candles allowed',                          wd: 'check', ew: 'check', mode: 'yesno' },
  { item: 'Real-flower petals allowed',                          wd: 'check', ew: 'check', mode: 'yesno' },
  { item: 'Drone photography allowed',                           wd: 'check', ew: 'check', mode: 'yesno' },
  { item: 'Day-after pickup window for vendor rentals',          wd: 'check', ew: 'check', mode: 'yesno' },
  { item: 'No day-of liability insurance required by venue',     wd: 'check', ew: 'check', mode: 'yesno' },
  { item: 'Same-sex / LGBTQ+ weddings welcome',                  wd: 'check', ew: 'check', mode: 'yesno' },
]

// Filter rows to only the requested section slugs. Returns the header rows
// AND their child rows for each allowed slug, preserving original order.
// Example: filterRowsBySection(ROWS, 'base', 'upgrades') for /pricing.
export function filterRowsBySection(rows, ...allowedSlugs) {
  const out = []
  let include = false
  for (const row of rows) {
    if (row.section === 'header') {
      include = allowedSlugs.includes(row.slug)
    }
    if (include) out.push(row)
  }
  return out
}
