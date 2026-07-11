import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://mewwmahgokmjbcsogmvm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ld3dtYWhnb2ttamJjc29nbXZtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDIzMDE0NCwiZXhwIjoyMDg1ODA2MTQ0fQ.rB2fOiH3j7SusaBPISWVr27frwdwkh6-JhCtTmpx48c'
)

// ─── FIXES: content, titles, categories ─────────────────────────────────────

const TITLE_FIXES = {
  'Food Truck Wedidngs': 'Food Truck Weddings',
}

// Entries with broken/wrong content that need full replacement
const CONTENT_FIXES = {
  'Appointments': `Schedule Meetings & Check-Ins with the Rixey Team

Use the Calendly links below to book time with the Rixey Manor team at any stage of your planning:

- 15-Minute Phone Call: https://calendly.com/rixeymanor/15-minute-phone-call
- Onboarding & Initial Planning: https://calendly.com/rixeymanor/onboarding-and-initial-planning
- Mid-Planning Check-In: https://calendly.com/rixeymanor/onboarding-and-initial-planning-clone
- 1-Hour Planning Meeting (Zoom): https://calendly.com/rixeymanor/1hr-planning-meeting-zoom
- 1-Hour Wedding Planning (In-Person): https://calendly.com/rixeymanor/1hr-wedding-planning
- Final Walkthrough (3-6 weeks before): https://calendly.com/rixeymanor/final-walkthrough-6-3-weeks-before-wedding-date
- Pre-Wedding Drop Off: https://calendly.com/rixeymanor/pre-wedding-drop-off
- Vendor Meeting / Walk-Through: https://calendly.com/rixeymanor/vendor-meeting-walk-through

You can also text or call (540) 212-4545 anytime.`,

  'Things For Guests To Do': `Things For Guests To Do Near Rixey Manor

Rixey Manor is in Culpeper County, Virginia — a gorgeous area with plenty to keep your guests entertained between wedding events.

Nearby Towns & Activities:
- Culpeper (10-15 min): charming downtown with restaurants, antique shops, wine bars, and a historic walking tour. Great for a Saturday morning outing.
- Sperryville (20 min): small-town art galleries, the Rappahannock River, and Thornton River Grille for casual dining.
- Madison (15 min): quiet, scenic, good for a peaceful drive through horse country.
- Charlottesville (45 min): UVA campus, the Downtown Mall, wineries along Route 29.

Wineries & Breweries:
- Old House Vineyards (15 min) — closest winery, great for group tastings.
- DuCard Vineyards (25 min) — mountain-top views, popular for groups.
- Many others within a 30-minute drive along the Culpeper wine trail.

Outdoor Activities:
- Shenandoah National Park / Skyline Drive (30 min) — hiking, scenic overlooks.
- Old Rag Mountain (40 min) — popular but strenuous hike with incredible views.
- Hazel River swimming holes — local favorite in summer.

For guests staying at nearby hotels in Culpeper, the downtown area is walkable with coffee shops, restaurants, and a movie theater.

Nearest airports: Dulles (1 hour), Charlottesville (45 min). Culpeper also has a train station on the Northeast Regional line (Boston to New Orleans).`,

  'Books & Inspiration': `Post-Wedding Self-Care

Catch Up on Sleep: You'll be exhausted after the wedding weekend. Make time to sleep — then sleep some more. The adrenaline crash is real.

Take a Break: Go on your honeymoon, or at least take a few days off and stay in a cabin somewhere. You've earned it.

Reconnect: Plan a date night and a casual night out with friends. You've been in wedding mode — remember what normal life feels like.

Ease Back In: Back off on talking to all the random family members for a little while. You've been "on" for months.

Take Care of Yourself: Ditch the fried, cheesy food and reach for some fruit. Hydrate. Move your body.

Find a New Goal: Babies, puppies, new house, new job, a great vacation, volunteering — channel that planning energy into something exciting.

Cozy Up: Cuddle on the sofa and binge-watch something just for the two of you.

Wedding Blues Are Real: Not everyone is affected, but it's possible. The hustle and bustle of planning suddenly stops. If you're feeling low, that's normal. Consider talking to a counselor if it lingers — some couples find post-wedding counseling genuinely helpful.`,
}

// Category/subcategory fixes for ad-hoc entries
const CATEGORY_FIXES = {
  'Patio': { category: 'Venue & Spaces', subcategory: 'Spaces', description: 'Back patio dimensions and layout for reception and ceremony use.' },
  'Ballroom size': { category: 'Venue & Spaces', subcategory: 'Spaces', description: 'Ballroom physical dimensions.' },
  'Venue railing dimensions': { category: 'Venue & Spaces', subcategory: 'Dimensions', description: 'Front porch railing measurements for décor planning (garlands, draping).' },
  'Hi, is my contract located on this website somewhere?': { category: 'Planning', subcategory: 'Contracts', description: 'Where to find your venue contract on ContractHouse.' },
  'Delivery': { category: 'Month-of Wedding Info', subcategory: 'Drop-Off', description: 'General delivery coordination for wedding items.' },
  'Product Recommendations': { category: 'Inspiration', subcategory: 'Shopping', description: 'Recommended products and supplies for wedding planning.' },
  'Sparklers': { category: 'Inspiration', subcategory: 'Send-Off', description: 'Sparkler exit details — where to buy, sizes, quantities per pack.' },
  'What time can flowers be dropped off?': { category: 'Vendors & Staffing', subcategory: 'Florist', description: 'When florists and floral deliveries can arrive at the venue.' },
  'Ballroom': { category: 'Venue & Spaces', subcategory: 'Spaces', description: 'Ballroom layout flexibility and group size accommodations.' },
  'Books & Inspiration': { category: 'Post-Wedding', subcategory: 'Wellbeing', description: 'Post-wedding self-care: sleep, reconnecting, wedding blues support.', title: 'Post-Wedding Self-Care' },
}

// Description fixes for entries with null descriptions
const DESCRIPTION_FIXES = {
  'Tent Cooling & AC': 'How cooling works across the venue buildings and tent, especially for summer weddings.',
  'Band & Live Music Setup': 'Stage availability, band parking, and equipment storage for live music at Rixey.',
  'Rain Plan & Weather Backup': 'What happens if it rains — ceremony backup, tent options, and how weather decisions are made.',
  'Cake Drop-Off & Storage': 'When and how wedding cakes can be delivered and stored at the venue.',
  'Preferred Vendor Discount': 'How the 5% venue fee discount works when using Rixey recommended vendors.',
  'Chair Inventory': 'How many chairs Rixey has on-site and options for supplementing.',
  'Ballroom Capacity': 'Maximum seated capacity for the ballroom and how it affects layout decisions.',
  'Cottage & Overnight Suite Details': 'Details about the newlywed suite, cottage, and overnight accommodation options.',
  "Sammy's Rentals": 'Overview of Sammy\'s Rentals — the primary rental company for Rixey Manor weddings.',
  'Common Caterers at Rixey': 'Overview of frequently used caterers and what to know about working with each.',
  'Tent Delivery & Setup': 'How tent delivery and setup works — couples don\'t need to coordinate with Sammy\'s directly.',
  'Pre-Ceremony Photography Timeline': 'Detailed breakdown of how to structure the pre-ceremony photography timeline.',
  'Wedding Week Drop-Off Schedule': 'When couples can start bringing items to the venue during their wedding week.',
  'Fire Pit': 'Fire pit availability for weddings.',
  'Welcome Mirror': 'Welcome mirror available for borrowing, with calligraphy by Grace.',
  'Bud Vases': 'Bud vases available for borrowing for table decor and centerpieces.',
  'Bar Taps & Drink Dispensers': 'Details on bar tap heads and drink dispensers available at the venue.',
  'Cocktail Hour Staffing Realities': 'Why passed service is limited during cocktail hour and alternatives.',
  'Hair & Makeup Timeline': 'Key timing milestones for hair and makeup on the wedding day.',
  'Pet Allergy Accommodations': 'Accommodations for guests with severe pet allergies.',
  'Back-to-Back Wedding Logistics': 'What happens when there\'s another wedding the day after yours.',
  'Payment Methods & Details': 'How to make payments to Rixey Manor — check, Venmo, credit card.',
  'Rehearsal Timing & Schedule': 'Standard rehearsal timing and what to tell your officiant.',
}

// ─── MERGE TARGETS: source title → target title (append content) ────────────

const MERGES = [
  {
    source: 'Ballroom size',
    target: 'Ballroom Capacity',
    prefix: '\n\nPhysical Dimensions:\n',
  },
  {
    source: 'Ballroom',
    target: 'Ballroom Capacity',
    prefix: '\n\nLayout Flexibility:\n',
  },
]

// ─── MAIN ───────────────────────────────────────────────────────────────────

async function main() {
  console.log('Fetching all knowledge_base rows...')
  const { data: allRows, error } = await supabase.from('knowledge_base').select('*')
  if (error) { console.error('Fetch error:', error.message); process.exit(1) }
  console.log(`  Total rows: ${allRows.length}`)

  // ── Step 1: Split into handbook vs non-handbook ──
  const handbook = allRows.filter(r => r.category === 'Handbook')
  const nonHandbook = allRows.filter(r => r.category !== 'Handbook')
  console.log(`  Handbook rows: ${handbook.length}`)
  console.log(`  Non-handbook rows: ${nonHandbook.length}`)

  // ── Step 2: Group non-handbook by title, pick best per group ──
  const groups = {}
  nonHandbook.forEach(r => {
    const key = r.title.trim()
    if (!groups[key]) groups[key] = []
    groups[key].push(r)
  })

  const keepMap = {} // title → row to keep
  const deleteIds = new Set()

  // Delete all handbook rows
  handbook.forEach(r => deleteIds.add(r.id))

  // For each non-handbook group: keep longest content, delete rest
  for (const [title, rows] of Object.entries(groups)) {
    rows.sort((a, b) => (b.content || '').length - (a.content || '').length)
    keepMap[title] = rows[0]
    rows.slice(1).forEach(r => deleteIds.add(r.id))
  }

  const keepCount = Object.keys(keepMap).length
  console.log(`\n  Unique entries to keep: ${keepCount}`)
  console.log(`  Rows to delete: ${deleteIds.size}`)

  // ── Step 3: Apply merges (before deleting sources) ──
  for (const merge of MERGES) {
    const source = keepMap[merge.source]
    const target = keepMap[merge.target]
    if (source && target) {
      target.content = (target.content || '') + merge.prefix + (source.content || '')
      deleteIds.add(source.id)
      delete keepMap[merge.source]
      console.log(`  Merged "${merge.source}" → "${merge.target}"`)
    }
  }

  // ── Step 4: Apply fixes to kept entries ──
  const updates = []

  for (const [title, row] of Object.entries(keepMap)) {
    const patch = {}

    // Title fix
    if (TITLE_FIXES[title]) {
      patch.title = TITLE_FIXES[title]
    }

    // Content fix
    if (CONTENT_FIXES[title]) {
      patch.content = CONTENT_FIXES[title]
    }

    // Category fix (for ad-hoc entries)
    const catFix = CATEGORY_FIXES[title]
    if (catFix) {
      patch.category = catFix.category
      patch.subcategory = catFix.subcategory
      if (catFix.description) patch.description = catFix.description
      if (catFix.title) patch.title = catFix.title
    }

    // Description fix (null descriptions)
    if (!row.description && DESCRIPTION_FIXES[title]) {
      patch.description = DESCRIPTION_FIXES[title]
    }

    // Always set updated_at
    if (Object.keys(patch).length > 0) {
      patch.updated_at = new Date().toISOString()
      updates.push({ id: row.id, title, patch })
    }
  }

  console.log(`  Updates to apply: ${updates.length}`)

  // ── Step 5: Execute deletes in batches ──
  const deleteArray = [...deleteIds]
  console.log(`\nDeleting ${deleteArray.length} rows...`)

  for (let i = 0; i < deleteArray.length; i += 50) {
    const batch = deleteArray.slice(i, i + 50)
    const { error: delErr } = await supabase.from('knowledge_base').delete().in('id', batch)
    if (delErr) console.error(`  Delete batch error:`, delErr.message)
    else process.stdout.write(`  Deleted batch ${Math.floor(i / 50) + 1}/${Math.ceil(deleteArray.length / 50)}\r`)
  }
  console.log(`\n  Deleted ${deleteArray.length} rows.`)

  // ── Step 6: Execute updates ──
  console.log(`\nApplying ${updates.length} updates...`)
  for (const u of updates) {
    const { error: upErr } = await supabase
      .from('knowledge_base')
      .update(u.patch)
      .eq('id', u.id)
    if (upErr) console.error(`  Update error for "${u.title}":`, upErr.message)
    else console.log(`  Updated: ${u.title}${u.patch.title ? ' → ' + u.patch.title : ''}`)
  }

  // ── Step 7: Verify final state ──
  const { data: final, error: finalErr } = await supabase
    .from('knowledge_base')
    .select('id, title, category, subcategory, description')
    .order('category')
    .order('title')

  if (finalErr) { console.error('Final check error:', finalErr.message); return }

  console.log(`\n════════════════════════════════════════`)
  console.log(`  FINAL KB: ${final.length} entries`)
  console.log(`════════════════════════════════════════\n`)

  // Group by category
  const byCat = {}
  final.forEach(r => {
    const cat = r.category || '(none)'
    if (!byCat[cat]) byCat[cat] = []
    byCat[cat].push(r)
  })

  for (const [cat, rows] of Object.entries(byCat).sort()) {
    console.log(`${cat} (${rows.length}):`)
    rows.forEach(r => {
      const desc = r.description ? '' : ' ⚠ NO DESC'
      console.log(`  ${r.subcategory || '-'} | ${r.title}${desc}`)
    })
    console.log()
  }

  // Check for remaining issues
  const noDesc = final.filter(r => !r.description)
  if (noDesc.length) {
    console.log(`⚠ ${noDesc.length} entries still have no description:`)
    noDesc.forEach(r => console.log(`  - ${r.title} (${r.category})`))
  }
}

main().catch(console.error)
