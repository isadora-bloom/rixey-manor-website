// Rewrite FAQ rows: replace em dashes with periods, commas, or parens per
// Isadora's voice rules. Targeted by ID so this is idempotent and reviewable.
// Keeps content otherwise unchanged.
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

function loadEnv() {
  const txt = readFileSync('.env.local', 'utf-8')
  for (const line of txt.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i)
    if (!m) continue
    if (!process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '')
  }
}
loadEnv()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
)

// id → { question?, answer }
// Only fields that change are listed.
const UPDATES = [
  { id: '9203dcb6-bbad-4ef5-a320-e5feab7ccd41',
    answer: 'Yes. Rixey is BYOB with no corkage fees. You supply the beer, wine, and spirits and we handle professional service.' },
  { id: '68c85b96-0309-4b6d-a862-55260a84a05e',
    answer: "Absolutely. We'll help plan quantities and a drink menu (beer/wine only or full bar), plus signature cocktails. We can also suggest local Virginia wines and beers." },
  { id: '5d777711-edcf-46f0-87fd-a1eac173c905',
    answer: 'We have a built-in bar with taps for kegs and a wine fridge. A satellite bar for cocktail hour is also possible. Ask us about layout options.' },
  { id: 'bdda38cc-98f4-4356-8cd3-a71b3045107f',
    answer: "Yes. Signature cocktails are encouraged. Provide the ingredients and we'll make them. Staffed tasting stations (e.g. whiskey) are also possible." },
  { id: '62d99c5a-c131-475d-a1f1-8508b799b5b0',
    answer: 'We allow shots and drinking games within reason, at the absolute discretion of our coordinator and bartenders. Our priority is a safe, enjoyable celebration for everyone.' },
  { id: 'c7b639eb-d733-4c90-9863-a912a3bc5845',
    answer: 'Yes. Rixey is pet-friendly with prior written notice. Pets must be supervised and leashed or crated as appropriate. We can recommend local pet sitters and help plan a pet-friendly ceremony moment.' },
  { id: '8aa9458b-ef2e-4b40-803b-a1b79aa5d33c',
    answer: "Absolutely. Please plan active supervision for children at all times. There are stairs, a rooftop, and a pond. We can set up a kids' lounge or movie space and share babysitter recommendations if helpful." },
  { id: '5176b405-20e0-4858-8222-ed0d1dff5827',
    answer: "Yes. Please purchase a one-day event liability policy naming Rixey Manor as additional insured. It's affordable and protects you, your guests, and us. We'll provide timing and minimum coverage details." },
  { id: '7c193ab7-2360-4fbf-a7c9-20f57e0d1814',
    answer: 'Yes. Free on-site parking with signage. Because rideshare is unreliable in the countryside, we strongly recommend hotel shuttles for guest safety. Overnight cars are fine to collect the next morning.' },
  { id: '079e2a4d-d2a7-4a53-855c-6e71d86e0c61',
    answer: 'Wedding-safe sparklers are allowed under staff supervision. Fireworks (consumer or professional) are not permitted on the property.' },
  { id: '9a6f5479-522f-445c-a9a0-a61d66563bbb',
    answer: 'Yes. Please schedule all visits in advance so we can give you our full attention and protect overnight guest privacy.' },
  { id: '4350aa50-18aa-4e1b-b4bf-55e50a864f8f',
    answer: "No. Those are typically provided by your caterer or rental company. We'll share table sizes and specs so linen orders and glassware counts are correct." },
  { id: '846896da-5a24-41b7-8d94-63b9f105a325',
    question: 'What is not included? What should we budget for separately?',
    answer: 'Catering and food service, linens, dinnerware, and glassware, tents, stages, or extra lighting if needed, DJ or band and AV equipment, florals, a full-service planner beyond included coordination, guest transportation, and your officiant.' },
  { id: 'f076d945-0861-485f-bb12-d86500c39b14',
    answer: "Yes. Our in-house décor inventory is available at no extra charge: signs, table numbers, easels, lanterns, arbors, backdrops, and more. We'll share a catalog you can browse." },
  { id: 'd199da56-1a40-4bf8-917b-dc354aea4023',
    answer: "Yes. Ask about Late Check-Out with Brunch and Extra Party Hours. We'll align staffing, bar service, and logistics to fit your plan." },
  { id: '38656538-a7b5-4822-a8dc-4ab3cafc2803',
    answer: 'Approximately 60 miles from Washington DC, about an hour depending on traffic. Dulles (IAD) is roughly 60 minutes; Charlottesville (CHO) around 45 minutes. Culpeper also has an Amtrak stop for regional travellers.' },
  { id: 'a2a7cc3e-1d09-49b8-b6cf-f4a5ec555cbe',
    answer: 'We recommend hotels in Culpeper. Holiday Inn Express, Hampton Inn, and Best Western are all close by. Nearby Airbnbs are also popular. Consider setting up a room block and sharing details in your wedding website or welcome guide.' },
  { id: '33a40690-4cc0-4256-9558-08df440614b1',
    answer: "Couples arrange their own shuttles, and we strongly recommend them. Rideshare is unreliable in the countryside. We'll share trusted providers and suggested schedules." },
  { id: 'aab1a057-b424-4075-873e-4eef1a021d92',
    answer: 'Yes. Guests may leave vehicles overnight and collect them the next morning. Safety first.' },
  { id: 'ada5adb3-6828-4c4c-ba68-367bdd1808b4',
    answer: "We can coordinate welcome bag hand-off with hotels and provide a checklist (maps, snacks, itinerary, shuttle info). We'll share a printable template you can customise." },
  { id: '225e0f6e-5f56-428e-8a80-9bbabf7c6595',
    answer: 'Encourage guests to arrive 20 to 30 minutes early. Country roads, parking, and greeting time all add up. Provide clear directions and shuttle times on your wedding website.' },
  { id: '1b7657c1-eac9-42a3-929f-15fdbe54be17',
    answer: 'Yes. Wi-Fi is available throughout the property. Most carriers have service outdoors, though historic walls can limit indoor cell signal. Wi-Fi calling works well as a workaround.' },
  { id: '3d9b6507-deaa-4d20-92c7-6665838d306f',
    answer: 'Yes. Culpeper has salons, pharmacies, grocery stores, and a hospital nearby. We can share a local services list for out-of-town guests.' },
  { id: '946492d3-54b6-424d-9ef7-94f645ee7038',
    answer: "Yes. Please purchase a one-day event liability policy naming Rixey Manor as additional insured. We'll share minimum coverage details and timing." },
  { id: '12798695-4302-468c-ba7f-e1048f842bfd',
    question: 'Are there hidden fees like corkage, cake cutting, or service charges?',
    answer: 'No hidden venue fees. We do not charge corkage or cake-cutting fees. The only bar-related cost is our in-house bartending service when alcohol is served.' },
  { id: '599018e8-4dc4-430c-b8eb-600e44f385ac',
    answer: "We'll schedule a walkthrough 1 to 2 months out, collect your vendor list, insurance certificate, and final guest count, and finalize the timeline. We provide prompts and templates to keep this simple." },
  { id: '250f502e-eec1-4a75-96d0-d0ca3e151f44',
    answer: 'The lakeside ceremony site, the ballroom, the rooftop, the terrace, and the surrounding lawns. All available to you for the full weekend. Many couples do an outdoor ceremony, rooftop or patio cocktail hour, and ballroom dinner with dancing.' },
  { id: 'df12d74b-3779-4f2a-987f-459fe68756d8',
    answer: 'Yes. On-site accommodations for up to 14 guests across the Manor and the Blacksmith Cottage. Ideal for the wedding party and immediate family. Breakfast is provided for overnight guests.' },
  { id: 'f218ba34-e335-4b18-b746-89a6b2fba8d3',
    answer: "Main areas (the ballroom, main-floor restrooms, and patio) are ADA accessible. The historic upstairs bedrooms and the rooftop are staircase access only. We'll assist with accessible parking and any specific needs." },
  { id: '5aae7a43-4487-4f00-81f3-8845ab835612',
    answer: 'Yes. Sample floorplans, site maps, and video walkthroughs are available to help you plan seating, the dance floor, and guest flow.' },
  { id: '3df9f4ea-7f1b-4b7b-856c-5e9cc1f5e4f3',
    answer: 'Absolutely. Photographers are welcome to scout ahead of time. First looks can be staged in the gardens, the manor library, or on the rooftop.' },
  { id: '410e5d60-b449-4644-8fff-67c2db2f8a57',
    answer: 'The Newlywed Suite has a 360-degree mirror, bright natural light, and a copper en-suite bathtub. Ideal for getting ready. Additional manor rooms provide separate spaces for each side of the wedding party.' },
  { id: '67697469-5d5b-49ae-9121-8876e0aa2b89',
    answer: "Yes. During planning we'll share suggested table arrangements, dance floor placements, and ceremony seating for your specific guest count." },
  { id: 'ae53e88d-ed34-424a-9cbd-3d29f830e624',
    answer: 'Your on-site coordinator manages the master timeline, rehearsal, vendor communication, cueing for ceremony and reception, and day-of problem-solving, so you can be a guest at your own wedding.' },
  { id: 'b6635b5a-c4a3-4c21-b31c-e2f17f6fd59b',
    answer: 'Not for day-of. Our coordination covers that. If you want full-service planning and design support, ask about our upgrade or hire an outside planner; we collaborate happily.' },
  { id: '600c28f9-86b8-44cd-b1de-3f325cc72b26',
    answer: 'Yes. Choose any professional vendors: photographer, florist, DJ or band, caterer, and more. We provide a vetted recommendation list upon request. No commissions, just teams we trust.' },
  { id: '08721417-fbd7-4cf7-8bde-c7239cb2b89b',
    answer: 'Vendors should be licensed and insured where applicable and agree to venue rules (no confetti or glitter, outdoor sound cutoff at 10 PM). We collect certificates of insurance and confirm details in advance.' },
  { id: '2c8c9373-f56d-454c-8936-c9861c7f86cc',
    answer: 'We problem-solve quickly, leveraging our network, backups, or on-site solutions, so your celebration stays on track.' },
  { id: 'f6542fdb-63ad-4250-8671-1beaad43f676',
    answer: "Yes. On-site parking and access for load-in. Power is available throughout the venue. We'll discuss any special electrical needs (bands, lighting, tent installs) in advance." },
  { id: '7ec5841f-677a-4fa5-bc7b-9e578b552bd7',
    answer: "Yes. We're happy to share up-to-date recommendations across categories: caterers, DJs, florists, photographers, transportation, and more." },
]

let ok = 0, fail = 0
for (const u of UPDATES) {
  const patch = {}
  if (u.question !== undefined) patch.question = u.question
  if (u.answer !== undefined) patch.answer = u.answer
  const { error } = await supabase.from('faqs').update(patch).eq('id', u.id)
  if (error) {
    console.error(`FAIL ${u.id}:`, error.message)
    fail++
  } else {
    ok++
  }
}

console.log(`\nUpdated ${ok} rows, ${fail} failed.`)
