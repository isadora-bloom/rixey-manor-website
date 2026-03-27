'use client'

import { useState } from 'react'

const SECTIONS = [
  { id: 'budgets', title: 'Budgets' },
  { id: 'todo', title: 'To-Do List' },
  { id: 'vendors', title: 'Vendor Tips' },
  { id: 'catering', title: 'Catering & Food Trucks' },
  { id: 'staffing', title: 'Rixey Staffing' },
  { id: 'pinterest', title: 'Pinterest' },
  { id: 'timeline', title: 'Timeline' },
  { id: 'tables', title: 'Table Layout' },
  { id: 'ceremony', title: 'Ceremony Set Up' },
  { id: 'bedrooms', title: 'Bedrooms' },
  { id: 'alcohol', title: 'Alcohol & Bar Setup' },
  { id: 'borrow', title: 'Things to Borrow' },
  { id: 'dont-bring', title: "Things You Don't Need to Bring" },
  { id: 'forget', title: 'Things People Forget' },
  { id: 'emergency', title: 'Emergency & Backup Items' },
  { id: 'packing', title: 'Packing, Move-In & Clean-Up' },
  { id: 'tipping', title: 'Tipping' },
  { id: 'extras', title: 'Extras & Special Touches' },
  { id: 'guests', title: 'Guest Information' },
  { id: 'confirmations', title: 'Vendor Confirmations' },
  { id: 'post-wedding', title: 'Post Wedding' },
]

export default function HandbookPage() {
  const [open, setOpen] = useState(null)

  return (
    <div style={{ padding: '40px 24px 80px', maxWidth: 780, margin: '0 auto' }}>

      <div style={{ marginBottom: 40 }}>
        <p className="eyebrow" style={{ marginBottom: 12 }}>The Handbook</p>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 4vw, 40px)',
            color: 'var(--ink)',
            lineHeight: 1.1,
            marginBottom: 12,
          }}
        >
          Rixey Manor<br />
          <em>Handbook 2026</em>
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 15,
            lineHeight: 1.7,
            color: 'var(--ink-light)',
            maxWidth: 540,
          }}
        >
          Everything we know about planning a wedding at Rixey Manor, from the team that's been doing this for over a decade.
          Written with love, honesty, and zero fluff.
        </p>
      </div>

      {/* Table of Contents */}
      <nav
        style={{
          marginBottom: 40,
          padding: '24px 28px',
          background: 'var(--cream)',
          border: '1px solid var(--border)',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 11,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--ink-light)',
            marginBottom: 12,
          }}
        >
          Contents
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {SECTIONS.map(s => (
            <a
              key={s.id}
              href={`#${s.id}`}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                color: 'var(--forest)',
                textDecoration: 'none',
                padding: '4px 0',
                borderBottom: '1px solid transparent',
              }}
            >
              {s.title}
            </a>
          ))}
        </div>
      </nav>

      {/* Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        <HandbookSection id="budgets" title="Budgets">
          <P>This is less about what is a good thing to spend your money on and more about what, in our humble opinion, is not! And also a little education about where to start on the big-ticket items.</P>
          <P>You can usually save money by breaking your contracts into specifics &mdash; food, staffing, linens, etc., can all be booked through your caterer, which often leads to less stress and room for error, but you may shave some of your budgets down if you split them up.</P>

          <H3>Where to begin</H3>
          <P>These are guesstimates, but be wary of anyone that seems like a fantastic deal. You tend to get what you pay for, but some great new people are out there looking to get good reviews and recommendations. Your wedding is their advertising.</P>
          <BudgetList items={[
            ['Food', '$50 \u2013 $200 per person'],
            ['Photography', '$2,500 \u2013 $8,000'],
            ['Videography', '$2,000 \u2013 $6,000'],
            ['Flowers', '$600 \u2013 $15,000'],
            ['Cake/Desserts', '$6 \u2013 $10 per person'],
            ['DJ', '$2,000 \u2013 $5,000'],
            ['Photo Booth', '$800 \u2013 $1,200'],
            ['Live Band', '$3,500+'],
            ['Officiant', '$150 \u2013 $500'],
            ['Hair Styling (Bride)', '$100 \u2013 $250'],
            ['Hair Styling (Bridesmaids, Moms, etc.)', '$100 \u2013 $250'],
            ['Makeup (Bride)', '$150 \u2013 $300'],
            ['Makeup (Bridesmaids, Moms, etc.)', '$150 \u2013 $300'],
            ['Alcohol', '$1,000+'],
            ['Invitations', '$3 \u2013 $20 per invite'],
          ]} />
          <P>Jewelry, dress, and menswear are also variables that are difficult to guess. Other costs that add up are rentals (tents, outdoor furniture, signage), calligraphy, etc.</P>

          <H3>Things that might not be worth the money</H3>
          <P>As a rule of thumb, ask yourself if you would miss it when you were a guest at another wedding. Then you can decide if it&rsquo;s worth it.</P>
          <UL items={[
            'Favors. Most people won\u2019t take them unless they are edible in the shuttle/car on the way home.',
            'Programs. Helpful if your ceremony is over thirty minutes or has multiple readings. Otherwise, your guests will just use them as fans.',
            'Candles in the ceremony. Getting them to stay lit during an outdoor ceremony takes a lot of work.',
            'Signs for every little thing. They are fun and cute, but hopefully, your guests can tell the difference between a guestbook and a seating chart.',
          ]} />

          <H3>Things we don&rsquo;t recommend</H3>
          <UL items={[
            'Buying your table linens. They come creased, and getting them pressed can be as expensive as renting them. Pressing them yourself is arduous. Dry cleaning/pressing is about $14 per linen. Negotiate with a rental company.',
            'Skimping on the candles in the ballroom. Candles are a beautiful accent that is cost-effective.',
            'Missing out on DJ party lights.',
            'Silk rose petals. Please use REAL rose petals \u2014 not allowing silk rose petals is one of our only restrictions.',
            'DIY Flowers. Sometimes this works out. But building flower arrangements can take 3\u20135 people for a whole day. Get a florist\u2019s quote and practice arranging before making this decision.',
            'Skipping shuttle service. Without them, you are liable if someone drives home drunk, plus it makes your guests feel treasured.',
          ]} />
        </HandbookSection>

        <HandbookSection id="todo" title="To-Do List">
          <P>For most couples, we are the first stop on the wedding trail. From this point onward, you are faced with a massive list of tasks broken down into months. We hate this and would like to propose our way:</P>
          <P><strong>Throw out the month-by-month timeline.</strong> There is nothing wrong with booking things as soon as you want to. Why should you wait until a month or two out to buy your guest book? Just get things as you find them.</P>
          <P><strong>On that subject,</strong> if there is someone you want to book &mdash; book them as soon as you have a date.</P>
          <P><strong>Don&rsquo;t put your guest list together first</strong> and then try to figure out how you&rsquo;ll pay for that many meals. Have a clear idea of your food budget per head, where you&rsquo;d like your ceremony, and your budget in general. Then come up with a maximum number of guests. The first thing we always tell couples: if you wouldn&rsquo;t take someone out for a three-course meal on a normal day, why would you do that at your wedding?</P>

          <H3>Our priority to-do list</H3>
          <OL items={[
            'Budget', 'Venue and Date', 'Guest list', 'DJ/Music',
            'Photographer and/or Videographer', 'Book Hair and Makeup', 'Engagement Shoot',
            'Hotel Block', 'Wedding Party', 'Florist', 'Caterers (including Linens etc.)',
            'Dress', 'Save the Dates', 'Tent/Arbor/Big rentals', 'Cake', 'Officiant',
            'Transportation (Shuttles)', 'Timeline (broad)', 'Bridesmaids/Groomsmen Clothing',
            'Invitations', 'Plan Rehearsal Dinner', 'Smaller Rentals like Signage', 'Rings',
            'Marriage License (no sooner than 60 days away)', 'Chase down RSVPs',
            'Work out Alcohol', 'Upload all contracts and table layouts',
            'Confirm (numbers and arrival times) with all vendors', 'Seating Chart',
            'Timeline (detailed, including order of photos)', 'All the random bits (ring pillow, ceremony sand, etc.)',
            'Order lunches/breakfast and any other meals', 'GET MARRIED!',
          ]} />
        </HandbookSection>

        <HandbookSection id="vendors" title="Vendor Tips">
          <H3>Photography</H3>
          <UL items={[
            'Opt for the trial and pay for your engagement session separately before booking the whole wedding day.',
            'Photographers should always come with a second shooter.',
            'At the wedding, schedule the photographers to eat as soon as you go to eat.',
            'For the family shot list, keep the number of photos even between both sides. Budget about 2 minutes per shot.',
            'If the photographer hasn\u2019t been here before, we REALLY recommend doing an onsite walkthrough before the wedding.',
          ]} />
          <H3>Caterers</H3>
          <UL items={[
            'Don\u2019t cut the coffee and tea after the cake.',
            'Don\u2019t cut water service at the table \u2014 it makes the tables look better and stops people from getting too drunk.',
            'At minimum, about six people to staff any event over 70 people.',
            'Provide pre-ceremony lemonade and tea as a welcome surprise. Hot drinks from October till April.',
            'If the catering company hasn\u2019t been here before, we REALLY recommend doing an onsite walkthrough.',
          ]} />
          <H3>DJ</H3>
          <UL items={[
            'Make sure they have lights and a lapel mic.',
            'Listen to all your songs, paying attention to lyrics and their meaning.',
            'Keep the first dance and parent dance songs to about 60\u201390 seconds.',
            'Get the order of your entrances to the DJ (and send us a copy too).',
          ]} />
          <H3>Band</H3>
          <P>Please read their rider and send it to us before booking. We need to check we can meet their expectations.</P>
          <H3>Cake</H3>
          <UL items={[
            'Sugar flowers are more expensive than fresh ones.',
            'Cut cake straight after dinner.',
            'Groom cakes are best for the Rehearsal Dinner.',
            'You can make a ceremonial cake for cutting and then a dessert bar if you\u2019re not big on cake.',
          ]} />
          <H3>Officiant</H3>
          <UL items={[
            'Your officiant must be legally registered to perform ceremonies in Virginia.',
            'Ask if they tend to stick to the script; if they are friends, make sure you have a script.',
            'Decide if you want someone who does marriage counseling.',
          ]} />
          <H3>Florist</H3>
          <UL items={[
            'Make sure you can reuse the ceremony flowers somewhere. We use them again in the ballroom \u2014 double duty, big savings.',
            'Greenery can sometimes be cheaper than flowers. Ask the florist what\u2019s in season.',
            'Confirm your personal items (bouquets etc.) will be there when the photographer arrives.',
          ]} />
          <H3>Hair and Makeup</H3>
          <P>The trial is vital. Be honest at the trial about how you feel! We don&rsquo;t have time to start again on the wedding day, and you want to be happy with how you feel.</P>
        </HandbookSection>

        <HandbookSection id="catering" title="Catering & Food Trucks">
          <H3>Choosing a Caterer</H3>
          <P>Rixey Manor does not have in-house catering, so you&rsquo;ll hire an outside caterer of your choice. We recommend booking early. When evaluating caterers, consider:</P>
          <UL items={[
            'Menu options and ability to handle dietary requests',
            'How many staff are included for setup, serving, and cleanup',
            'Whether they handle rentals (linens, china, flatware) or if you need a separate rental company',
            'Cost per person (we\u2019ve seen $50 up to $200 per guest depending on menu and service style)',
          ]} />

          <H3>Menu & Service Tips</H3>
          <UL items={[
            'Keep water on tables. Even for buffet meals, it elevates the setting and keeps guests hydrated.',
            'Pre-ceremony welcome drink: lemonade, iced tea, or fruit-infused water in warm months. Hot cocoa or apple cider in cooler months.',
            'Two entr\u00e9es plus a vegetarian option is usually plenty.',
            'Real China vs. Disposables: Real dinnerware adds elegance but comes with rental costs. High-quality disposables can be a budget-friendly alternative.',
          ]} />

          <H3>Food Truck Weddings</H3>
          <UL items={[
            'For up to 120 guests: 3 dinner trucks + 1 dessert truck.',
            'At least one truck should provide cocktail hour food.',
            'Include one wood-fired pizza truck \u2014 they serve quickly, great grab-and-go.',
            'Limit options at each truck, and put menus on the tables.',
            'You need a separate rental company for linens, napkins, etc.',
            'You will need staffing. Trucks only staff food service \u2014 you still need a team for tables, clearing, bathrooms, etc.',
            'We recommend an Event Captain + one person per 30 guests.',
            'Consider buying disposable plate/party sets from Amazon (delivered directly here).',
          ]} />
          <P>Ensure any caterer or food truck you hire is properly licensed and carries liability insurance. We may ask for a Certificate of Insurance.</P>
        </HandbookSection>

        <HandbookSection id="staffing" title="Rixey Staffing">
          <P>All Rixey staff get paid <strong>$350 per person</strong> in 2026. We will Venmo request you for the payment at the final walkthrough.</P>

          <H3>Bartenders</H3>
          <UL items={[
            '$350 per bartender per day (2026).',
            'Friday: required if alcohol is served to anyone not staying on site. One per 50 guests.',
            'Saturday: minimum of two bartenders for every wedding. One per 50 guests.',
            'Add an extra bartender if you want: champagne welcome drink, specialty bar on rooftop, satellite bar on patio, wine/champagne poured at tables, or real glassware.',
          ]} />

          <H3>When you\u2019ll need extra hands</H3>
          <UL items={[
            'A large team of new vendors (especially new caterers or photographers)',
            'Catering that doesn\u2019t provide serving/clean-up help (usually Friday or Sunday)',
            'Bring-your-own food or family cooking',
            'Food trucks (see food truck section)',
            'Larger weddings where the coordinator has to cover more ground',
            'Events with multiple larger gatherings (e.g. ceremonial aspects on Friday night)',
            'Weddings with the ceremony earlier in the day',
            'Lots of DIY decor',
            'No shuttles (to help with parking)',
            'Any flower arranging / DIY flowers on site',
          ]} />
        </HandbookSection>

        <HandbookSection id="pinterest" title="Pinterest">
          <P>Pinterest can trigger three main emotions: overwhelming panic, inferiority, and second-guessing. To avoid this, answer a few key questions on paper before diving in: How do you want your wedding to feel? What elements are important to you? What do you want your wedding to say about you as a couple?</P>
          <P>Create specific boards for each element (flowers, boutonnieres, table plans). Keep in mind that many images are staged by vendors and may not be realistic for your budget. Don&rsquo;t second-guess yourself &mdash; stick with your decisions once you&rsquo;ve made them.</P>
        </HandbookSection>

        <HandbookSection id="timeline" title="Timeline">
          <UL items={[
            'Front-load everything: finish dinner, do speeches, cut the cake. It makes the DJ\u2019s job easier, and people are held wedding hostage till you cut the cake.',
            'First looks allow for a much quicker photo session. Everyone is focused and you two get to join cocktail hour.',
            'Schedule the last shuttle 15 minutes before it needs to depart \u2014 drunk people take a while to move, and someone has always lost their phone or bag.',
            'Receiving lines take forever. Budget 30 seconds per guest minimum (100 guests = 50+ minutes). We suggest not doing these.',
            'Consider eating dinner in the library or bridal suite. Your guests don\u2019t miss you when they\u2019re eating, and 20 minutes alone together is invaluable.',
          ]} />
        </HandbookSection>

        <HandbookSection id="tables" title="Table Layout">
          <H3>Table sizes</H3>
          <BudgetList items={[
            ['6ft round', 'Seats 10\u201312 (10 with chargers, 12 without)'],
            ['5ft round', 'Seats 8\u201310 (8 with chargers, 10 without)'],
            ['6ft rectangle', 'Seats 6, not including ends (no ends with chargers)'],
            ['8ft rectangle', 'Seats 8, not including ends (no ends with chargers)'],
            ['Two 6ft tables', 'Seat 14'],
            ['Two 8ft tables', 'Seat 18'],
            ['6ft + 8ft', 'Seat 16'],
            ['Cocktail tables', '30" round, normal (30") or bar height (42")'],
          ]} />
          <P>We don&rsquo;t recommend estate tables unless you&rsquo;re under about 100 people \u2014 they are inefficient. If you want one, try to seat people on both sides except in front of you two.</P>

          <H3>Other tables you may need</H3>
          <UL items={[
            'Gift table (front porch or bar patio depending on ceremony location)',
            'Guest Book table (starts at gift table, moves inside after cocktail hour)',
            'Pre-ceremony drinks table',
            'Seating chart table (bar or patio)',
            'Photo booth prop table (bar)',
            'Candy bar / cupcake table',
            'S\u2019mores table (on the patio)',
            'Buffet table (dining room, 6ft to 18ft \u2014 we suggest 3 linens to cover it)',
            'Appetizer tables for cocktail hour',
            'Kids craft table',
            'Sweetheart table (usually 4ft rectangle)',
            'DJ table (6ft)',
          ]} />

          <H3>Linen sizes reference</H3>
          <BudgetList items={[
            ['2.5ft (30"x30") Cocktail Table', '132" with Sash'],
            ['2.5ft (30"x30") Cake Table', '132"'],
            ['4ft (48x30") Sweetheart Table', '88" x 132"'],
            ['5ft (60") Round Dining', '120"'],
            ['6ft (72") Round Dining', '132"'],
            ['6ft (30"x72") Rectangle', '88" x 132"'],
            ['8ft (30"x96") Rectangle', '88" x 154"'],
          ]} />
          <P>Don&rsquo;t forget: (2) 88"x132" linens for the Guest Book/Cards table and Beverages table.</P>

          <H3>Our table inventory</H3>
          <P>11 &times; 6ft Round &bull; 10 &times; 5ft Round &bull; 9 &times; 6ft Rectangle &bull; 8 &times; 8ft Rectangle &bull; 2 &times; 4ft Rectangle &bull; 6 &times; High Cocktail &bull; 2 high chairs</P>
        </HandbookSection>

        <HandbookSection id="ceremony" title="Ceremony Set Up">
          <UL items={[
            'Think about how many people you want on the front row on each side (parents, siblings, grandparents, etc.).',
            'Think about where the flower girl/ring kids will sit or stand.',
            'Front lawn ceremonies: typically 6\u20138 rows. Ballroom: typically 10\u201316 rows.',
          ]} />
        </HandbookSection>

        <HandbookSection id="bedrooms" title="Bedrooms">
          <BudgetList items={[
            ['Mountain Room', 'Queen bed, bathtub in room. Quietest room in the Manor.'],
            ['Maple Room', 'King bed, separate bathroom. Biggest floor space (best for cribs and air mattresses).'],
            ['Back Bedroom', 'Queen bed, staircase, and shower.'],
            ['Newlywed Suite', 'Cal-King, copper bathtub, 360-mirror.'],
            ['The Cottage', 'Queen upstairs + 2 twins adjoining + large bathroom. Downstairs: almost-king sofa bed, half bath, full kitchen.'],
          ]} />
        </HandbookSection>

        <HandbookSection id="alcohol" title="Alcohol & Bar Setup">
          <P>The typical calculation is one drink per person per hour, so about eight drinks per person \u2014 800 for a 120-person wedding. Don&rsquo;t take out the people you know who don&rsquo;t drink; they balance out the ones who drink two per hour.</P>
          <P>Below are figures for a <strong>120-person wedding</strong>, lasting Friday through Sunday. They tend to be generous as you can return unopened bottles.</P>
          <P>We recommend no more than 4\u20135 types of wine (2 red, 2\u20133 white/ros\u00e9, 1 sparkling). Please, no half kegs \u2014 they are unsafe to move down our staircase.</P>

          <H3>Beer and Wine</H3>
          <UL items={[
            '8 cases of wine (1 sparkling, 4 white/ros\u00e9 in summer / 3 in winter, 4 red in winter / 3 in summer)',
            '2 \u00d7 1/6th kegs of beer (add another 1/6th if over 120 people or hosting rehearsal dinner)',
            '2 \u00d7 1/4 keg of beer',
          ]} />

          <H3>Beer, Wine & Specialty Cocktails</H3>
          <P>Same as above, plus two specialty cocktails \u2014 enough mix for at least 2 gallons.</P>

          <H3>Modified Full Bar</H3>
          <UL items={[
            '6 cases of wine (same distribution)',
            'Same kegs',
            '1\u20132 handles each of: rum, gin, vodka, fireball',
            '2\u20133 handles of Jack Daniel\u2019s',
          ]} />
          <P>You can add a specialty bar (rum, bourbon) with lots of varieties, sometimes at a satellite bar. Please try to limit shot-only liquors (tequila).</P>

          <H3>Signature Drinks</H3>
          <UL items={[
            'Keep it simple: Choose a drink easy to make in bulk. Avoid more than 3 ingredients or blending per drink.',
            'Match the season: fall \u2192 Apple Cider Moscow Mule, winter \u2192 Spiced Rum Punch, spring \u2192 Lavender Lemonade with gin, summer \u2192 Watermelon Mojito.',
            'Have a non-alcoholic version too, so non-drinkers can participate.',
            'Make a sign for the bar listing ingredients and why you chose it.',
          ]} />

          <H3>Other bar supplies</H3>
          <UL items={[
            'Ice (60\u201380 lbs) \u2014 we have lots of room to store it',
            'Water (at least 6 cases, smaller bottles are better)',
            'Soda: Coke (4 cases of 12-packs), Sprite, Ginger Ale, Diet Coke, Tonic Water, Soda Water (2 cases each)',
            'Juices: Orange juice (lots, for mimosas/breakfasts), cranberry, pineapple, sour mix',
            'Condiments: olives, cherries, oranges, lemons, limes',
          ]} />
          <P><strong>Tip:</strong> Call us on Monday before your wedding to see what we have left over from previous weddings. We almost always have soda and mixers.</P>
        </HandbookSection>

        <HandbookSection id="borrow" title="Things to Borrow (from Rixey Manor)">
          <P>These are available at no charge. Not an exhaustive list, but the usual suspects:</P>
          <UL items={[
            'Wooden table numbers with white calligraphy',
            'Clear table numbers',
            'Table number holders in varying colors',
            'Cake Stands: round silver (2 sizes), square silver (2 sizes), wood pedestal (small), gold pedestal (small), rustic white pedestal (XL), glass pedestal (medium), wood flat round (medium), 5-tier silver (cupcakes), 3-tier silver (cookies etc.)',
            'Platters in silver, glass, and gold (cookie bars etc.)',
            'Cake Cutting Set (Gold), Cake Cutting Set (Clear and silver)',
            'Votive Holders',
            'Chalkboard Sign (large free-standing)',
            'Iron Sign Stand',
            'Lots of small chalkboard signs',
          ]} />
        </HandbookSection>

        <HandbookSection id="dont-bring" title="Things You Don&rsquo;t Need to Bring">
          <UL items={[
            'Snacks (we keep a fully stocked snack box on hand at all times)',
            'Steamers',
            'Irons',
            'Votive candle holders',
            'Condiments',
            'Bed linens (unless you are bringing air mattresses)',
            'Towels',
            'Extra vases',
            'Scissors',
            'Lighters',
            'Anything OTHER than the kegs (no buckets or taps needed)',
          ]} />
        </HandbookSection>

        <HandbookSection id="forget" title="Things People Forget">
          <P>And if you do forget, we usually still have it on hand:</P>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '4px 24px' }}>
            {['Ice', 'Water', 'Perfume', 'Deodorant', 'Extra blank place cards', 'Extra ribbons', 'Envelopes (for tipping)', 'Fancy paper for speech writing', 'Cards and envelopes for quick thank yous', 'Ring box', 'Getting ring cleaned', 'Extra shoes', 'Extra underwear', 'Razor', 'Marriage license'].map(item => (
              <p key={item} style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink-mid)', padding: '4px 0' }}>
                &bull; {item}
              </p>
            ))}
          </div>
        </HandbookSection>

        <HandbookSection id="emergency" title="Emergency & Backup Items">
          <H3>Your personal emergency kit \u2014 must brings</H3>
          <UL items={[
            'Medication',
            'Face and hair products (your wedding day isn\u2019t the time to try a new brand)',
            'Lens solution and eye drops',
            'Dress and shoes for dancing in',
          ]} />

          <H3>What Rixey has on hand</H3>
          <P>We maintain our own \u201Coh no!\u201D supply closet: pain relievers, bandages, deodorant, toothbrushes & toothpaste, mouthwash, floss, tampons/pads, baby wipes, lint rollers, super glue, safety pins, sewing kit, white chalk (covers dress stains in a pinch), earring backs, Q-tips, tweezers, nail clippers, bug spray, sunscreen, hand warmers, umbrellas, phone chargers, extension cords, duct tape, spare votive candles, lighters, scissors, and vases.</P>
          <P>We keep steamers and irons on-site, snack boxes for blood sugar boosts, and extra linens, towels, and bedding.</P>

          <H3>Weather backup</H3>
          <P>Have water and small fans for hot days. Shawls or wraps for sleeveless dresses in cold weather. We keep blankets and umbrellas handy.</P>

          <P><strong>The key message:</strong> Don&rsquo;t panic. If anything goes wrong or something&rsquo;s missing, tell us. There&rsquo;s a very high chance we have a fix ready.</P>
        </HandbookSection>

        <HandbookSection id="packing" title="Packing, Move-In Day & Clean-Up">
          <H3>Packing guidance</H3>
          <P><strong>Think in zones.</strong> Pack your d\u00e9cor by where it&rsquo;ll be used: Ceremony Box, Sweetheart Table Box, Gift Table Box. Helpers can grab a box and know exactly where it belongs.</P>
          <UL items={[
            'Label every bin or box with what\u2019s inside and what area it\u2019s for. Bold labels.',
            'Remove packaging in advance \u2014 take tags off candles, unwrap glassware, replace stock photos in frames.',
            'Don\u2019t forget the small stuff: cake knife, toasting flutes, memorial photos, rings, marriage license, vow books, pens.',
            'Assign one trusted person (MOH, Best Man) to safeguard the truly vital items till Saturday morning.',
            'Keep personal items separate from d\u00e9cor boxes.',
          ]} />

          <H3>Drop-offs</H3>
          <UL items={[
            'Schedule early drop-offs as early as possible so we can plan our week.',
            'Buy all alcohol, sodas, etc. and drop them off in one trip.',
            'Alcohol gets stacked in the bar room \u2014 we\u2019ll unpack and check for anything missing.',
            'Other early drop-off items go in the Dining Room until setup begins Friday.',
          ]} />

          <H3>Move-in day (usually Friday)</H3>
          <P>Arrival is usually 3pm. We\u2019ll do a quick check-in, show you rooms, and review the weekend schedule. Unpack boxes into the rooms they\u2019ll be set up in. We always leave ceremony setup until day-of, in case of weather. Hang wedding dress and gowns (we have hangers, garment racks, and a steamer).</P>

          <H3>Rehearsal</H3>
          <P>Usually Friday late afternoon (4\u20135pm). Gather key people &mdash; wedding party, parents, officiant. Walk through processional and recessional.</P>

          <H3>Clean-up (Sunday)</H3>
          <P>Check-out is <strong>10am</strong> (unless brunch upgrade). Start cleanup around 8:30\u20139am.</P>
          <UL items={[
            'Start in bedrooms: strip beds and towels \u2192 laundry room behind kitchen.',
            'Sweep drawers, closets, bathrooms for chargers, toiletries.',
            'Load personal suitcases first so d\u00e9cor doesn\u2019t get buried.',
            'Re-pack d\u00e9cor into labeled bins.',
            'Alcohol: keep original boxes, split leftovers between cars. Unopened cases may be returnable.',
            'Food: take leftover cake, bring coolers for a long drive.',
            'Florals: send home with guests or take them. We\u2019ll donate or use leftover florals.',
            'Rentals (linens, furniture, tents) usually picked up Monday \u2014 don\u2019t pack venue items by accident.',
          ]} />
          <P>Before departure: check all rooms, bar, kitchen, outdoor areas. We\u2019ll gather irreplaceable items into a \u201Cprecious\u201D box (guest book, sentimental d\u00e9cor, etc.).</P>
        </HandbookSection>

        <HandbookSection id="tipping" title="Tipping">
          <P>Each bartender or extra set of hands is paid $350 (required). If you do not want a tip jar on the bar, an additional $100 tip per bartender is required.</P>
          <BudgetList items={[
            ['Grace (Venue Manager)', 'Tip always appreciated'],
            ['Each server', '$20\u2013$50'],
            ['Photographer, DJ, Officiant, Hair, Makeup, Florist, Cake', '$20\u2013$100'],
            ['Assistants', '$20\u2013$50 per person'],
            ['Second shooter', '$50\u2013$100 for the day'],
          ]} />
          <P>We are happy to hand out tips for you \u2014 just put the amount in an envelope with the name or job title of the person.</P>
        </HandbookSection>

        <HandbookSection id="extras" title="Extras & Special Touches">
          <H3>Seasonal touches</H3>
          <UL items={[
            'Spring/Summer: welcome guests with lemonade or iced tea.',
            'Fall/Winter: hot apple cider, hot chocolate, or mulled wine.',
            'S\u2019mores by the fire: incredibly popular in cooler weather. Outdoors on dark tablecloth. Bring marshmallows, chocolate, graham crackers, and roasting sticks.',
            'Hot chocolate machine (winter): ~3 gallons before the ceremony. Bring extra chocolate milk to refill. We stock whipped cream and syrups.',
          ]} />

          <H3>Grand finale ideas</H3>
          <UL items={[
            'Sparkler exit: Wedding-safe, 36-inch smokeless sparklers. We have the process down. Longer sparklers = more time for photos.',
            'Confetti or petal toss: Dissolvable, biodegradable confetti or real petals only. Dried lavender is another lovely option. No paper or foil.',
            'Champagne pop: A fun photo-op, best done outdoors.',
          ]} />

          <H3>Tablecloths, arbors & sparklers</H3>
          <UL items={[
            'Tablecloths rent for $14\u2013$75. See if they can pick up linens on Monday so we can reuse them for brunch.',
            'Some caterers order linens from an outside company (dropped Thursday/Friday, picked up Monday) \u2014 one of the best ways to do it.',
            'Drop = how far down the tablecloth falls. Halfway is informal, full length is formal. When in doubt: dark tablecloth + light napkins.',
            'We have a white birch arbor, lightweight metal round arbor, and hexagon wood arbor. Once flowers are on, they\u2019re very hard to move.',
          ]} />

          <H3>Saturday meals</H3>
          <P>A typical Saturday menu: fruit and yogurt, bagels with cream cheese, OJ, and mimosas. We can make it healthier or diet-compliant with a week\u2019s notice. Don\u2019t forget lunch on Saturday. Please don\u2019t bring in tons of extra food \u2014 it fills up the kitchen and makes the caterer\u2019s job harder.</P>

          <H3>Brunch</H3>
          <P>If feeding more than 12\u201314 people on Sunday, consider hiring a caterer (like Carpe Donut) or going out to Culpeper. Check-out is 10am; if you\u2019d like to extend until 1pm for brunch, let us know and we can add it to your contract.</P>
        </HandbookSection>

        <HandbookSection id="guests" title="Guest Information & Experience">
          <H3>Getting here</H3>
          <UL items={[
            'Nearest airports: Dulles (~1 hour) and Charlottesville (~45 min)',
            'Culpeper has a train station on the Boston-to-New Orleans line',
            'Nearest hotels: Holiday Inn Express, Hampton Inn, and Best Western in Culpeper',
            'Please don\u2019t rely on taxis or Uber from the Manor',
          ]} />

          <H3>Shuttles</H3>
          <UL items={[
            'Your time begins at first pickup and ends at last drop-off at the hotel (not when they leave the Manor).',
            'Schedule one shuttle ~10 minutes after the DJ ends, then one more run after. Or two shuttles at the same time ~15 minutes after music ends.',
            'Write out a schedule, post it on your website, put it in welcome bags, and email it to the shuttle company.',
          ]} />
        </HandbookSection>

        <HandbookSection id="confirmations" title="Vendor Confirmations">
          <P>About 1\u20133 weeks out, confirm all details with every vendor:</P>
          <UL items={[
            'Upload all most recent contracts from anyone you\u2019ve given money to.',
            'Confirm final guest count and timing with each vendor.',
            'Confirm with florist that personal items arrive when photographer does.',
            'Verify arrival/setup times and any extra time needed.',
            'Let vendors who are staying through reception know about their meal.',
            'Confirm final payments and paperwork.',
            'Send photographer the family shot list.',
            'Send DJ the final entrance order.',
            'Remind florist about reusing ceremony flowers on sweetheart table.',
            'Confirm shuttle schedule with the transport company.',
            'Provide each vendor with a day-of emergency contact (usually our number).',
          ]} />
        </HandbookSection>

        <HandbookSection id="post-wedding" title="Post Wedding">
          <P>One of our brides asked for this section: <em>\u201CWedding blues are a thing. Not everyone is affected, but it is possible. There\u2019s no more hustle and bustle of planning, no more communicating with vendors. Things get super quiet. Find something else to occupy your time and mind, and pamper yourself \u2014 you\u2019ve earned it!\u201D</em></P>
          <P>I don\u2019t think I could say it better. However, there are a few extra things:</P>
          <P>You both will be tired, emotionally drained, and you will have spent at least three days with your family. Chances are you will fight over something idiotic. Here is what you need to do:</P>
          <UL items={[
            'Go on your honeymoon. Or at least take a few days off and stay in a cabin somewhere.',
            'Sleep. Sleep and more sleep.',
            'Detox. Ditch the fried, cheesy food and reach for some fruit.',
            'Water. Lots of it.',
            'Turn off the phone for a couple of days.',
            'Plan a date night and a casual night out with friends.',
            'Back off on talking to all the random family members for a little.',
            'Find a new goal \u2014 babies, puppies, new house, new job, great vacation, volunteering.',
            'Recheck all your finances and paperwork.',
            'Cuddle on the sofa and binge-watch something just for the two of you.',
          ]} />
        </HandbookSection>
      </div>
    </div>
  )
}

/* ── Reusable components ── */

function HandbookSection({ id, title, children }) {
  return (
    <section
      id={id}
      style={{
        padding: '32px 0',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(22px, 3vw, 30px)',
          color: 'var(--ink)',
          lineHeight: 1.2,
          marginBottom: 20,
        }}
      >
        {title}
      </h2>
      <div>{children}</div>
    </section>
  )
}

function H3({ children }) {
  return (
    <h3
      style={{
        fontFamily: 'var(--font-display)',
        fontSize: 18,
        fontStyle: 'italic',
        color: 'var(--ink)',
        marginTop: 24,
        marginBottom: 10,
      }}
    >
      {children}
    </h3>
  )
}

function P({ children }) {
  return (
    <p
      style={{
        fontFamily: 'var(--font-body)',
        fontSize: 15,
        lineHeight: 1.8,
        color: 'var(--ink-mid)',
        marginBottom: 14,
      }}
    >
      {children}
    </p>
  )
}

function UL({ items }) {
  return (
    <ul style={{ paddingLeft: '1.25em', marginBottom: 16 }}>
      {items.map((item, i) => (
        <li
          key={i}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 15,
            lineHeight: 1.7,
            color: 'var(--ink-mid)',
            marginBottom: 6,
          }}
        >
          {item}
        </li>
      ))}
    </ul>
  )
}

function OL({ items }) {
  return (
    <ol style={{ paddingLeft: '1.5em', marginBottom: 16 }}>
      {items.map((item, i) => (
        <li
          key={i}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 15,
            lineHeight: 1.7,
            color: 'var(--ink-mid)',
            marginBottom: 4,
          }}
        >
          {item}
        </li>
      ))}
    </ol>
  )
}

function BudgetList({ items }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {items.map(([label, value], i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            gap: 16,
            padding: '8px 0',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink)', fontWeight: 500 }}>{label}</span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink-mid)', textAlign: 'right', flexShrink: 0 }}>{value}</span>
        </div>
      ))}
    </div>
  )
}
