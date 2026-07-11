# Rixey Manor Sage Knowledge Base -- Full Audit Report

**Date:** 2026-04-02
**Total rows:** 439
**Active rows:** 439 (0 inactive)

---

## Executive Summary

The KB has a **severe duplication problem** and a **structural import problem**. Of 439 rows:

- **~261 rows are excess duplicates** (same title + same category, differing only by created_at or minor content variation)
- **255 rows (58%) are in a catch-all "Handbook" category** -- these are sentence fragments that were imported by splitting a handbook PDF into individual lines rather than keeping coherent topic entries
- Only **~130 rows represent genuinely distinct, well-formed knowledge entries** after deduplication
- The KB effectively has **two parallel knowledge structures**: (1) curated topic entries with proper categories, and (2) a raw handbook dump that splinters every bullet point into its own row

**Estimated ideal KB size after cleanup: 80-100 well-structured entries.**

---

## 1. Duplicates

### 1A. Exact Duplicates (same title, same content, different IDs)

**52 duplicate groups, producing 102 excess rows in non-Handbook categories alone.**

Every curated (non-Handbook) entry exists in triplicate -- the data was imported 3 times. Each group below has identical title, category, subcategory, description, and content. Only `created_at` differs.

| # | Title | Category | IDs (keep 1, delete 2) |
|---|-------|----------|----------------------|
| 1 | Brunch Upgrade | Extras & Add-Ons | `46eddc39`, `6a9300c9`, `f7622679` |
| 2 | Extra Meals | Extras & Add-Ons | `fb64cb40`, `acd8c67b`, `9290f020` |
| 3 | Guest Accommodations | Guest Experience | `10d97d05`, `3289a92a`, `a6ea5094` |
| 4 | Guest Comfort Tips | Guest Experience | `1e051ca7`, `67dff802`, `a906cf90` |
| 5 | Welcome Bag Ideas | Guest Experience | `e7e1227e`, `7a5f0c9d`, `0c7ef9e6` |
| 6 | Things For Guests To Do | Guest Experience | `ac412773`, `8c867ec2`, `a736e3a5` |
| 7 | Shuttle Planning | Guest Experience | `1af73d1b`, `32dac489`, `2f35f6c6` |
| 8 | Decor Borrowing List | Inspiration | `17d53105`, `62f5978f`, `e9a73c5c` |
| 9 | Signature Drink Ideas | Inspiration | `c75fc485`, `8ec79fdd`, `c1d3140a` |
| 10 | Sprinkles | Inspiration | `911e7580`, `9f2a065b`, `2cc0a3bd` |
| 11 | Pinterest Board Guidance | Inspiration | `5e1ba08a`, `55bf6426`, `e4d97e9e` |
| 12 | Seasonal Touches | Inspiration | `60c596f8`, `cc84b7ce`, `2c45010a` |
| 13 | Alcohol & Bar Setup | Logistics | `075e10ec`, `1a6cef6d`, `d9716637` |
| 14 | Bedrooms | Logistics | `f1a90642`, `4374c16d`, `980098d0` |
| 15 | Bar Upgrades | Logistics | `0e5dc55c`, `8eda1984`, `c8c26376` |
| 16 | Table Layout Options | Logistics | `41b20789`, `cf20484a`, `2552f817` |
| 17 | Google Planning Sheet | Logistics | `ec73ec16`, `199d4f7d`, `548234b3` |
| 18 | Rentals Guidance | Logistics | `36aa7d78`, `90b5bedc`, `75c77c7c` |
| 19 | Clean-Up Guidance | Month-of Wedding Info | `0eaa956d`, `1a54e341`, `f10654d7` |
| 20 | Vendor Confirmations | Month-of Wedding Info | `cb04949f`, `b6a0d20c`, `532b6016` |
| 21 | Drop-Off Instructions | Month-of Wedding Info | `30f7c1bd`, `ddb531c4`, `ee481a18` |
| 22 | Emergency & Backup Items | Month-of Wedding Info | `bfd51a44`, `87f8478e`, `13186f69` |
| 23 | Final Walkthrough Checklist | Month-of Wedding Info | `0831e3e1`, `ce6be9e6`, `e05a659b` |
| 24 | Things People Forget | Month-of Wedding Info | `1f68c265`, `a59efbb2`, `d659d660` |
| 25 | Move-In Day Guide | Month-of Wedding Info | `3b349c8e`, `a27b99bb`, `d651baa9` |
| 26 | Packing Guidance | Month-of Wedding Info | `0e17d539`, `6c2e2bc4`, `2f7303de` |
| 27 | Tipping Guidance | Month-of Wedding Info | `3d39e218`, `76587635`, `f6ce977c` |
| 28 | Appointments | Planning | `3f25c648`, `3e065db7`, `268f3e90` |
| 29 | Budget Guide | Planning | `35da7ec3`, `4b7f4812`, `b2492655` |
| 30 | Wedding To-Do List | Planning | `36062151`, `eb0d31fa`, `1f9fba32` |
| 31 | Handbook | Planning | `dfade756`, `dc5e6ea0`, `ef845a6f` |
| 32 | How To Upload Contracts | Planning | `202dac05`, `763e0841`, `361e9481` |
| 33 | Rehearsal Dinner Options | Planning | `81bdec45`, `17c99225`, `155ed596` |
| 34 | Planning Tech Tools | Planning | `41fe337d`, `b0f3621a`, `1af836fe` |
| 35 | Timelines | Planning | `22cb7da2`, `0dd70732`, `9fbf3e08` |
| 36 | Tour Prep Guide | Planning | `d120fe6d`, `299e5622`, `8a6390ab` |
| 37 | Finance & Paperwork | Post-Wedding | `896c0f0a`, `22df3d38`, `dcde88e7` |
| 38 | Post-Wedding Checklist | Post-Wedding | `24ea5b82`, `59a1bd90`, `9e9ddaf1` |
| 39 | Reviews & Thank-Yous | Post-Wedding | `6176c5ed`, `d17bd403`, `51f0b157` |
| 40 | Wedding Blues Support | Post-Wedding | `e7f35597`, `1801cbe9`, `ec143840` |
| 41 | Beauty & Wellness | Shopping Links | `c060303f`, `32740e34`, `b01e5eb5` |
| 42 | Books & Inspiration | Shopping Links | `664f133c`, `98e5b3df`, `18ea67b3` |
| 43 | Decor Finds | Shopping Links | `5bde2d90`, `177860cc`, `7aa65b68` |
| 44 | Practical Purchases | Shopping Links | `b8de3f0c`, `03092583`, `5d0e9a16` |
| 45 | Rental Alternatives | Shopping Links | `e83ce701`, `63c5d65c`, `dcc710bb` |
| 46 | Caterer & Food Truck Info | Staffing & Vendors | `207d3242`, `8077b000`, `5e03ce96` |
| 47 | Food Truck Wedidngs | Staffing & Vendors | `4178027a`, `f9af1eb9`, `4ad09090` |
| 48 | Vendor Tips | Staffing & Vendors | `d5f1da13`, `e8e48eee`, `b43a6cf2` |
| 49 | Rixey Staffing Guide | Staffing & Vendors | `6937c371`, `c8642292`, `194ebd4f` |
| 50 | Vendor Recommendations | Staffing & Vendors | `0e3d693b`, `ab178213`, `00868b3c` |
| 51 | Confirm with your florist... | Handbook | `c13f293e`, `e8ce6ffc` (2x exact) |
| 52 | We recommend three different types of alcoholic bars: | Handbook | `806227b7`, `b002d1f7` (2x exact) |

### 1B. Same Title, Different Content (near-duplicates in Handbook)

These Handbook entries share a title but have varying content lengths because they captured different amounts of surrounding context from the source document. Each group should be collapsed into ONE entry with the richest content.

| Title (truncated) | Variant count | IDs |
|--------------------|--------------|-----|
| Sweetheart Table Box: toasting flutes, signage, candles | **18** | `aa23224d`, `31ecf536`, `d2db019d`, `070d576d`, `6955d077`, `6ca6be60`, `f7da3f0e`, `c85df808`, `faa5f049`, `853ec8cf`, `174511fd`, `ad718ce3`, `adf60295`, `e5384374`, `9f0a7967`, `82769b7b`, `625f347c`, `68125612` |
| Through our experience, we've learned a few tricks... | **14** | `31ec6fa5`, `475ae63b`, `4a589ccb`, `f1d0bec7`, `6e033335`, `5feb5ec0`, `e095a113`, `8f6918b8`, `9d2b237c`, `b3a18db6`, `2cdcfd54`, `27864897`, `af47d7d1`, `f4cc934c` |
| A typical Saturday menu... | **9** | `627fd7cf`, `2b00672c`, `a732c0fc`, `a75011f4`, `55c70a23`, `35fea843`, `f34375b0`, `7624e0ee`, `be5fa86a` |
| Face and hair products... | **9** | `ac4ba901`, `e17afb04`, `055f54a8`, `48908fc6`, `31d1d71e`, `a975a3b5`, `8cd38108`, `8f27b3d7`, `5eca147e` |
| Embrace the season of your wedding... | **8** | `89e2c160`, `12dcc37f`, `a4ab2783`, `967f9c41`, `cba1bd4d`, `4f9741e8`, `be7edd40`, `28baf02b` |
| Please try to limit the number of shot only liquors... | **8** | `6b653670`, `27ea69f3`, `18f51fc1`, `010745af`, `68596a1a`, `852de6a9`, `9710843e`, `eaf36f38` |
| Confirm with your florist... | **7** | `ac69398c`, `e8b71c3d`, `c13f293e`, `e8ce6ffc`, `19db8345`, `8c5c8f14`, `f881764a` |
| Front Porch Dinner: Can seat about 30... | **7** | `a7ab8c7e`, `55f1f501`, `18e6fb08`, `65912a58`, `8d88baa8`, `700070b0`, `923b5342` |
| Weddings where the ceremony is being held earlier... | **7** | `90623a3e`, `bbffa6ff`, `ab72bab5`, `834d1c67`, `e380e2cf`, `43e9ca49`, `def0ee29` |
| Florals: Send home with guests or take them yourself... | **6** | `6c097dfa`, `81af15cb`, `a3c6d486`, `14521019`, `61c258d7`, `143dbb8a` |
| Holiday Inn Express, Hampton Inn... | **6** | `a816995f`, `bb67927a`, `3559071d`, `dd619c29`, `6c482a85`, `d52ae39d` |
| Skimping on the candles in the ballroom... | **6** | `da6941fa`, `26bc360a`, `f2f9f51e`, `254b45d8`, `8c220228`, `78c4576c` |
| At a minimum, there should be about six people... | **5** | `a9c43dac`, `c5a67e3f`, `cf87fbf6`, `6e1ba693`, `16b9ae17` |
| The back bedroom has a queen-sized bed... | **5** | `aa6f521a`, `99e8a6a0`, `57ef47cd`, `34be8074`, `8bea3928` |
| A 5ft table round seats 8-10... | **4** | `3fe3ec6e`, `d0cef515`, `159c2597`, `7bbb7efb` |
| At the wedding, schedule the photographers to eat... | **4** | `fa40ea72`, `c213b6f7`, `2099ea66`, `a9352aed` |
| Each bartender gets paid $350... | **4** | `d371f88c`, `41961e8c`, `1ab0a0c2`, `168be5d5` |
| Grace, our Venue Manager, always appreciates a tip. | **4** | `99885cdc`, `c13bf0d0`, `95077575`, `f133a6bb` |
| Listen to all your songs... | **4** | `61fb2f90`, `1dfb68de`, `5087dde6`, `0224993c` |
| Think about where the flower girl/ring kids... | **4** | `6471ebca`, `50c4dc4c`, `c4f82e37`, `6790e501` |
| We recommend three different types of alcoholic bars: | **4** | `806227b7`, `68a94be3`, `ed89d789`, `b002d1f7` |
| Candles in the ceremony... | **3** | `e6ab8ddb`, `6c01b9b1`, `aa3c8626` |
| Condiments -- Olives, Cherry's... | **3** | `70c24b69`, `19677c2a`, `b14725f1` |
| Decide if you want to find someone who does marriage counseling. | **3** | `63d736eb`, `56a05f7f`, `d3c2be11` |
| One of our brides asked for this section... | **3** | `9e726b3d`, `db41e0f2`, `828bc5d1` |
| Rixey Manor Handbook | **3** | `880d20b1`, `0cfb7be3`, `90f39d65` |
| The cake is usually on a 30" hightop... | **3** | `4c670135`, `2ffce491`, `ee10a672` |
| The longer the sparkler... | **3** | `5ef12b64`, `d2f029d5`, `b2601ea8` |
| Trash: we'll collect, but please bag obvious trash... | **3** | `d59278de`, `8a645d3f`, `c0d24e9a` |
| Plus 29 more groups with 2 copies each | -- | (see full listing above) |

### 1C. Cross-Category Duplicates

These entries exist in both Handbook AND a curated category, covering the same topic:

| Topic | Handbook Fragment Count | Curated Entry Count | Curated Category |
|-------|----------------------|-------------------|-----------------|
| Bar/alcohol setup | 29 fragments | 7 entries (3x Alcohol & Bar Setup, 3x Bar Upgrades, 1x Bar Taps) | Logistics |
| Accommodations/hotels/bedrooms | 11 fragments | 8 entries (3x Guest Accommodations, 1x Cottage, 1x Pet Allergy, 3x Bedrooms) | Guest Experience / Logistics |
| Catering/food/meals | 18 fragments | 13 entries (3x Brunch, 3x Extra Meals, 3x Caterer Info, 1x Common Caterers, 3x Food Truck) | Extras & Add-Ons / Staffing & Vendors |
| Florist/florals | 14 fragments | 3 entries (1x Florist + 2x Vendor category) | Florist / Vendor |
| Tipping | 4 fragments | 9 entries (3x Tipping Guidance, 3x Guest Comfort Tips, 3x Vendor Tips) | Month-of / Guest Experience / Staffing |
| Transport/shuttle | 4 fragments | 3 entries (3x Shuttle Planning) | Guest Experience |

---

## 2. Fragment Rows

**255 rows in the "Handbook > General Information" category are sentence fragments**, not standalone knowledge entries. They were clearly produced by splitting a handbook PDF line-by-line. Evidence:

- All 255 have the generic description `"From the Rixey Manor Handbook 2026"`
- Titles ARE the content (the title is the first sentence of the fragment)
- Content is often <100 characters
- They read like bullet points, not complete answers

### All 255 Handbook Fragment IDs

Every row with `category = "Handbook"` is a fragment. There are 95 unique titles producing 255 total rows (many titles duplicated 2-18x with varying content lengths).

**Fragments under 100 characters (95 rows) -- the worst offenders:**

| ID | Title | Content Length |
|----|-------|---------------|
| `a85c4449` | Patio | 22 |
| `83419129` | Ballroom size | 26 |
| `b3787289` | Hi, is my contract located on this website somewhere? | 40 |
| `abf60851` | Venue railing dimensions | 42 |
| `f133a6bb` | Grace, our Venue Manager, always appreciates a tip. | 51 |
| `5bae6576` | Menu options and ability to handle dietary requests | 51 |
| `e55bdf0a` | Wooden table numbers with white calligraphy writing | 51 |
| `7b6bfd4a` | What time can flowers be dropped off? | 51 |
| `9e8a74c4` | Confirm (numbers and arrival times) with all vendors | 52 |
| `8b54461e` | Hair Styling (Bridesmaids, Moms, etc.) - $100 - $250 | 52 |
| `b9a4246d` | Ice (60 to 80lbs) -- we have lots of room to store it | 52 |
| `b14725f1` | Condiments -- Olives, Cherry's, Oranges, Lemons, Limes | 53 |
| `b57babcd` | Plan a date night and a casual night out with friends | 53 |
| `68a94be3` | We recommend three different types of alcoholic bars: | 53 |
| `4b798237` | All the random bits (ring pillow, ceremony sand, etc.) | 54 |
| `4d07e786` | And if you do forget, we usually still have it on hand | 54 |
| `ca8ef91b` | Bed Linens (unless you are bringing in air mattresses) | 54 |
| `ac9bfe1e` | Photographers should always come with a second shooter. | 55 |
| `31ecf536` | Sweetheart Table Box: toasting flutes, signage, candles | 55 |
| `10c45a9b` | Anything OTHER than the kegs (no buckets or taps needed) | 56 |
| `168be5d5` | Each bartender gets paid $350 per event per day in 2026. | 56 |
| `1fc79318` | Sparklers | 58 |
| `8f17d5cc` | Bring in your own food/or have a family member cook for you | 59 |
| `2ab6d2dc` | Cake Stand, 3 tiers, silver (for cupcakes or cookies, etc.) | 59 |
| `774b0168` | How many staff are included for setup, serving, and cleanup | 59 |
| `7bbb7efb` | A 5ft table round seats 8-10 (8 with chargers, 10 without) | 60 |
| `81b04aab` | Detox. Ditch the fried, cheesy food and reach for some fruit | 60 |
| `33723f51` | Pack your decor and supplies by wedding "zone." For example: | 60 |
| `90623a3e` | Weddings where the ceremony is being held earlier in the day | 60 |
| `b6560313` | Platters, various in silver, glass, and gold, for cookie bars | 61 |
| `50c4dc4c` | Think about where the flower girl/ring kids will sit or stand | 61 |
| `9710843e` | Please try to limit the number of shot only liquors (Tequila). | 62 |
| `99e8a6a0` | The back bedroom has a queen-sized bed, staircase, and shower. | 62 |
| `1eeb240e` | Transportation: Confirm the shuttle schedule (times/locations) | 62 |
| `53cca60e` | Ballroom: Awesome for all group sizes regardless of the weather | 63 |
| `63d736eb` | Decide if you want to find someone who does marriage counseling. | 64 |
| `e93d5c75` | Back off on talking to all the random family members for a little | 65 |
| `a10abe03` | Please, no half kegs, as they are unsafe to move down our staircase. | 65 |
| `ad876107` | Water (at least 6 cases of water; the smaller bottles are better) | 65 |
| `a369d4ec` | We have 2 4ft tables; one is usually used at the sweetheart table | 65 |
| `89ffe5e4` | Culpeper has a train station on a track from Boston to New Orleans | 66 |
| `845067c6` | 1 or 2 handles of each of the following -- rum, gin, vodka, fireball | 67 |
| `51c8e102` | A 6ft table round seats 10-12 people (10 with chargers, 12 without) | 67 |
| `aedac330` | Load personal suitcases into cars first so decor doesn't get buried | 67 |
| `6f9b918c` | Cuddle on the sofa and binge-watch something just for the two of you | 68 |
| `c11f1157` | Cake Stand, round silver (two different sizes, large and extra-large) | 69 |
| `59e9b2c1` | Cake Stand, square silver (two different sizes, large and extra-large) | 70 |
| `9e726b3d` | One of our brides asked for this section, and it's a great suggestion. | 70 |
| `d6a38893` | Snacks (we keep a fully stocked snack box or two on hand at all times) | 70 |
| `71a42a6e` | The following are usually 6ft x 30" rectangles unless otherwise noted. | 70 |
| `391b0ff7` | Upload all contracts, reference photos, and table layouts to Honeybook | 70 |
| `075844a4` | A large team of new vendors (especially new caterers or photographers) | 70 |
| `5d1872a8` | DJ: Send them the final order of reception entrances if you haven't yet | 71 |
| `d8ef2f38` | Two specialty cocktails -- enough to make up a mix of at least 2 gallons | 71 |
| `084fdb08` | Photographer: Confirm the specific family formal shot list you gave them | 72 |
| `22e2a22a` | Using these rules, here is our Wedding To-Do list from priority to last. | 72 |
| `d6428303` | Nearest airports are Dulles (1 hour approx.) and Charlottesville (45mins) | 73 |
| `b2601ea8` | The longer the sparkler, the more time you have to get the right pictures | 73 |
| `a3e4762e` | UPLOAD ALL MOST RECENT CONTRACTS FROM ANYONE YOU HAVE GIVEN ANY MONEY TO. | 73 |
| `1d162146` | Use the confirmation touchpoint to remind vendors of any unique requests: | 73 |
| `fa40ea72` | At the wedding, schedule the photographers to eat as soon as you go to eat. | 75 |
| `476b9510` | Jewelry, dress, and menswear are also variables that are difficult to guess | 75 |
| `73b4b18a` | Your officiant must be legally registered to perform ceremonies in Virginia. | 76 |
| `de89595c` | (2) 88"x 132" Linens for the Guest Book/Cards Table and the Beverages Table. | 77 |
| `af47d7d1` | Through our experience, we've learned a few tricks that make a big difference: | 78 |
| `c76e4a47` | Larger weddings where your coordinator has to cover a lot more ground and guests | 80 |
| `2ffce491` | The cake is usually on a 30" hightop behind the sweetheart table or estate table | 80 |
| `a7ab8c7e` | Front Porch Dinner: Can seat about 30 for dinner, covered and fairly weather-safe | 81 |
| `df1fdb65` | Catering that doesn't provide any serving/clean-up help (usually Friday or Sunday) | 82 |
| `945373d2` | Don't be afraid to ask questions -- a great caterer will guide you through options | 82 |
| `664f133c` | Books & Inspiration | 82 |
| `98e5b3df` | Books & Inspiration | 82 |
| `18ea67b3` | Books & Inspiration | 82 |
| `28365cd6` | Find a new goal -- babies, puppies, new house, new job, great vacation, volunteer | 83 |
| `cc1f4836` | Go on your honeymoon. Or at least take a few days off and stay in a cabin somewhere | 83 |
| `0224993c` | Listen to all your songs, paying special attention to the lyrics and their meaning | 83 |
| `8a645d3f` | Trash: we'll collect, but please bag obvious trash and leave it in the utility room | 83 |
| `33ca7c53` | Kids Craft table (sometimes just the library, or sometimes set up outside somewhere) | 84 |
| `402c2db5` | The DJ table usually has a 6ft rectangle. (Ask your DJ if he needs a table provided) | 84 |
| `28baf02b` | Embrace the season of your wedding -- it can make the celebration even more memorable | 85 |
| `35efcec1` | Wine and champagne are poured at tables (depending on numbers, you may need two) | 86 |
| `c5a67e3f` | At a minimum, there should be about six people coming to staff any event over 70 | 88 |
| `006e46b3` | Gift table (front porch for a front-of-house wedding, bar patio if ceremony on the...) | 88 |
| `ea6ea558` | Appetizer tables for cocktail hour display (sometimes 6ft rectangle, sometimes 5ft round) | 89 |
| `f7e2ff58` | Ballroom | 89 |
| `0663ca61` | Other costs that add up are rentals (tents, outdoor furniture, signage), calligraphy... | 90 |
| `6c097dfa` | Florals: Send home with guests or take them yourself. We'll donate or use left over | 91 |
| `a816995f` | Holiday Inn Express, Hampton Inn, and Best Western in Culpeper are the nearest... | 91 |
| `94156a1d` | Our cocktail tables are 30" round, and can be normal table height (30") or bar height | 91 |
| `e17afb04` | Face and hair products (we have them but your wedding day isn't the time to try...) | 92 |
| `c1d5d129` | On that subject, if there is someone you want to book. Book them as soon as you... | 92 |
| `7624e0ee` | A typical Saturday menu is usually fruit and yogurt, Bagels with cream cheese, OJ... | 94 |
| `097cc0bf` | Favors. Most people won't take them unless they are edible in the shuttle/car on... | 94 |
| `acc94e3a` | Ask them if they tend to stick to the script; if they are friends, make sure you... | 95 |
| `c13f293e` | Confirm with your florist that your personal items will be there when the photographer... | 95 |
| `e8ce6ffc` | Confirm with your florist that your personal items will be there when the photographer... | 95 |
| `26bc360a` | Skimping on the candles in the ballroom. Candles are a beautiful accent that is... | 95 |
| `fda6d298` | Juices -- Orange Juice (lots of it for mimosas, breakfasts, etc.), cranberry, pineapple | 96 |
| `6c01b9b1` | Candles in the ceremony. Getting them to stay lit during an outdoor ceremony takes... | 97 |
| `b81af216` | Whether they handle rentals (linens, china, flatware) or if you'll need a separate... | 97 |
| `43fba0d3` | You can make a ceremonial cake for cake cutting and then a dessert bar if you're... | 97 |
| `7392a711` | We could write a book on talking to vendors, but below are the highlights for each | 98 |
| `cfe6e57d` | Buffet Table (the dining room is 6ft to 18 ft) (We suggest 3 132" Linens to cover) | 99 |
| `e53749f7` | Florist: "Don't forget, we'll reuse the ceremony arch flowers on our sweetheart..." | 99 |
| `7357ee2f` | Pre-ceremony drinks table (front porch for a front-of-house wedding, bar patio if...) | 99 |

---

## 3. Category/Subcategory Inconsistencies

### 3A. All Category > Subcategory Combinations (57 total)

| Category | Subcategory | Row Count |
|----------|-------------|-----------|
| Extras & Add-Ons | Food | 6 |
| Florist | Arrival time | 1 |
| Guest Experience | Accommodations | 4 |
| Guest Experience | Comfort | 4 |
| Guest Experience | Gifts & Extras | 3 |
| Guest Experience | Things To Do | 3 |
| Guest Experience | Transportation | 3 |
| **Handbook** | **General Information** | **255** |
| Inspiration | Drinks & Beverages | 3 |
| Inspiration | Decor | 5 |
| Inspiration | Entertainment | 3 |
| Inspiration | Planning Inspiration | 3 |
| Inspiration | Seasonal | 3 |
| Logistics | Bar | 4 |
| Logistics | Bedrooms | 3 |
| Logistics | Drinks | 3 |
| Logistics | General Information | 6 |
| Logistics | Layouts | 5 |
| Logistics | Planning Sheet | 3 |
| Logistics | Rentals | 3 |
| Month-of Wedding Info | Clean-Up | 4 |
| Month-of Wedding Info | Confirmations | 3 |
| Month-of Wedding Info | Drop-Off | 4 |
| Month-of Wedding Info | Emergency | 3 |
| Month-of Wedding Info | Final Walkthrough | 3 |
| Month-of Wedding Info | Last-Minute | 3 |
| Month-of Wedding Info | Move-In | 3 |
| Month-of Wedding Info | Packing | 3 |
| Month-of Wedding Info | Tipping | 3 |
| Planning | Appointments | 3 |
| Planning | Budget | 3 |
| Planning | Checklist | 3 |
| Planning | Planning | 3 |
| Planning | Planning Meetings | 3 |
| Planning | Rehearsal | 4 |
| Planning | Technology | 3 |
| Planning | Timelines | 5 |
| Planning | Tours | 3 |
| Post-Wedding | Admin | 4 |
| Post-Wedding | Checklist | 3 |
| Post-Wedding | Gratitude | 3 |
| Post-Wedding | Wellbeing | 3 |
| Shopping Links | Beauty | 3 |
| Shopping Links | Books | 3 |
| Shopping Links | Decor | 3 |
| Shopping Links | Planning | 6 |
| Staffing & Vendors | Catering | 4 |
| Staffing & Vendors | Food Trucks | 3 |
| Staffing & Vendors | Planning | 3 |
| Staffing & Vendors | Staffing | 4 |
| Staffing & Vendors | Vendors | 5 |
| **Vendor** | **Floral** | **1** |
| **Vendor** | **floral** | **1** |
| **general** | **(null)** | **2** |
| **general** | **Exits** | **1** |
| **venue** | **Decor** | **1** |
| **venue** | **contract** | **1** |
| **venue** | **dimensions** | **2** |
| **venue** | **sent** | **1** |

### 3B. Flagged Issues

1. **"Handbook" is not a real category** -- it is a dump bucket for 255 unstructured fragments. It should be eliminated entirely and its useful content merged into topical entries.

2. **Case inconsistency:** `general`, `venue`, `Vendor` use lowercase while all other categories are Title Case. `Vendor > floral` vs `Vendor > Floral` is a case mismatch within the same category.

3. **Overlapping categories:**
   - `Florist` (1 row), `Vendor` (2 rows), and `Staffing & Vendors` (19 rows) all deal with vendor-related content. These should be unified.
   - `general` (3 rows) and `venue` (5 rows) are ad-hoc categories that overlap with `Logistics`.
   - `Logistics > Drinks` and `Logistics > Bar` overlap -- both are about alcohol service.
   - `Planning > Planning` is a redundant subcategory name.
   - `Planning > Planning Meetings` and `Planning > Appointments` overlap in concept.
   - `Shopping Links > Planning` contains "Practical Purchases" and "Rental Alternatives" which are more "Decor" or "Rentals" than "Planning".
   - `Staffing & Vendors > Planning` is ambiguous -- "planning" as a subcategory under vendors is unclear.

4. **Null subcategories:**
   - `general > (null)` -- 2 rows (`c141ecb4` Delivery, `751e341a` Product Recommendations)

5. **Nonsensical subcategory:**
   - `venue > sent` -- subcategory "sent" appears to be a workflow status tag, not a content category. Row: `a85c4449` (Patio, content: "Back patio is 70'x40'")

6. **Entries in wrong category:**
   - `Books & Inspiration` (Shopping Links > Books) -- content is "Catch Up on Sleep: You'll be exhausted..." -- this is post-wedding self-care advice, NOT a book/shopping recommendation. **Title-content mismatch.**
   - `Appointments` (Planning > Appointments) -- content says "You can find them here !" but contains no URL. This is a broken link entry.

---

## 4. Entries That Should Be Merged

### 4A. Handbook Fragments to Merge into Existing Curated Entries

These Handbook fragments cover the same topic as an existing curated entry. They should be deleted or their unique details folded into the curated entry.

| Merge Target (Curated Entry) | Handbook Fragments to Absorb | Fragment Count |
|------------------------------|------------------------------|---------------|
| **Alcohol & Bar Setup** (Logistics) | All "We recommend three different types of alcoholic bars:", "Please try to limit the number of shot only liquors", "Each bartender gets paid $350", "Anything OTHER than the kegs", "Wine and champagne are poured at tables", "Two specialty cocktails", "Condiments", "Ice (60 to 80lbs)", "Please, no half kegs" | 29 |
| **Table Layout Options** (Logistics) | "A 5ft table round seats 8-10", "A 6ft table round seats 10-12", "Our cocktail tables are 30 round", "The DJ table usually has a 6ft rectangle", "The following are usually 6ft x 30 rectangles", "We have 2 4ft tables", "Buffet Table (the dining room is 6ft to 18 ft)", "The cake is usually on a 30 hightop", "Appetizer tables for cocktail hour", "Gift table", "Pre-ceremony drinks table", "Kids Craft table", "Front Porch Dinner: Can seat about 30" | 25+ |
| **Guest Accommodations** (Guest Experience) | "Holiday Inn Express, Hampton Inn", "Culpeper has a train station", "Nearest airports are Dulles", "The back bedroom has a queen-sized bed" | 16 |
| **Tipping Guidance** (Month-of) | "Grace, our Venue Manager, always appreciates a tip." | 4 |
| **Clean-Up Guidance** (Month-of) | "Trash: we'll collect", "Florals: Send home with guests", "Load personal suitcases into cars first" | 11 |
| **Vendor Confirmations** (Month-of) | "Confirm (numbers and arrival times) with all vendors", "Confirm with your florist", "Transportation: Confirm the shuttle schedule", "DJ: Send them the final order", "Photographer: Confirm the specific family formal shot list", "Florist: Don't forget, we'll reuse...", "Use the confirmation touchpoint" | 13 |
| **Packing Guidance** (Month-of) | "Pack your decor and supplies by wedding zone", "All the random bits (ring pillow, ceremony sand, etc.)", "Face and hair products", "Bed Linens" | 15 |
| **Things People Forget** (Month-of) | "And if you do forget, we usually still have it on hand", "Sweetheart Table Box: toasting flutes" | 20 |
| **Budget Guide** (Planning) | "Other costs that add up are rentals", "Jewelry, dress, and menswear are also variables", "Hair Styling (Bridesmaids, Moms) - $100-$250" | 4 |
| **Wedding Blues Support** (Post-Wedding) | "Cuddle on the sofa and binge-watch something", "Find a new goal", "Go on your honeymoon", "Plan a date night", "Detox. Ditch the fried, cheesy food", "Back off on talking to all the random family members", "Decide if you want to find someone who does marriage counseling", "Listen to all your songs" | 16 |
| **Wedding To-Do List** / **Handbook** (Planning) | "Using these rules, here is our Wedding To-Do list", "Upload all contracts", "UPLOAD ALL MOST RECENT CONTRACTS", "Rixey Manor Handbook" | 7 |
| **Caterer & Food Truck Info** (Staffing & Vendors) | "Don't be afraid to ask questions -- a great caterer will guide you", "Whether they handle rentals (linens, china, flatware)", "How many staff are included", "Menu options and ability to handle dietary requests", "Catering that doesn't provide any serving/clean-up help", "Bring in your own food" | 8 |
| **Rixey Staffing Guide** (Staffing & Vendors) | "At a minimum, there should be about six people", "Larger weddings where your coordinator", "A large team of new vendors" | 8 |
| **Extra Meals** (Extras & Add-Ons) | "A typical Saturday menu is usually fruit and yogurt", "Snacks (we keep a fully stocked snack box)" | 10 |
| **Seasonal Touches** (Inspiration) | "Embrace the season of your wedding" | 8 |

### 4B. Non-Handbook Entries That Should Be Merged

| Proposed Merged Entry | Current Separate Entries | Reasoning |
|-----------------------|------------------------|-----------|
| **Bar & Alcohol Guide** | Alcohol & Bar Setup, Bar Upgrades, Bar Taps & Drink Dispensers, Signature Drink Ideas | All cover bar service at Rixey -- should be one comprehensive entry |
| **Vendor Management** | Vendor Tips, Vendor Confirmations, Vendor Recommendations, Preferred Vendor Discount | All vendor-related planning guidance |
| **Catering Guide** | Caterer & Food Truck Info, Food Truck Weddings, Common Caterers at Rixey | All catering-related |
| **Florist & Floral Coordination** | What time can flowers be dropped off? (3 versions across Florist/Vendor), Bud Vases, Welcome Mirror | Florist-related content scattered across 3 categories |
| **Accommodations & Lodging** | Guest Accommodations, Cottage & Overnight Suite Details, Bedrooms, Pet Allergy Accommodations | All about where guests/couple sleep |
| **Venue Dimensions & Spaces** | Patio, Ballroom, Ballroom size, Ballroom Capacity, Venue railing dimensions | Physical venue measurements scattered across `venue` and `Logistics` |

---

## 5. Missing or Weak Descriptions

### 5A. Null Descriptions (11 rows)

| ID | Title | Category |
|----|-------|----------|
| `a884800a` | What time can flowers be dropped off? | Florist |
| `1fc79318` | Sparklers | general |
| `c141ecb4` | Delivery | general |
| `751e341a` | Product Recommendations | general |
| `7b6bfd4a` | What time can flowers be dropped off? | Vendor |
| `ef418b91` | What time can flowers be dropped off? | Vendor |
| `b3787289` | Hi, is my contract located on this website somewhere? | venue |
| `abf60851` | Venue railing dimensions | venue |
| `f7e2ff58` | Ballroom | venue |
| `83419129` | Ballroom size | venue |
| `a85c4449` | Patio | venue |

### 5B. Generic/Useless Description (255 rows)

All 255 Handbook rows have the same description: **"From the Rixey Manor Handbook 2026"**. This is useless for semantic search. It tells Sage nothing about what the entry actually covers. When a couple asks "how many people fit at a round table?", the description "From the Rixey Manor Handbook 2026" provides zero retrieval signal.

### 5C. Assessment of Non-Handbook Descriptions

The curated (non-Handbook) entries generally have good descriptions. However, these could be improved:

| ID | Title | Current Description | Issue |
|----|-------|-------------------|-------|
| `3f25c648` (x3) | Appointments | "Schedule meetings and check-ins with the Rixey Manor team." | OK but entry content is broken (see Section 6) |
| `664f133c` (x3) | Books & Inspiration | "Book recommendations and sleep recovery tips for post-wedding." | Description says "books" but content is purely sleep advice -- no book links |

---

## 6. Content Quality Issues

### 6A. Title-Content Mismatches

| ID | Title | Actual Content | Problem |
|----|-------|---------------|---------|
| `664f133c`, `98e5b3df`, `18ea67b3` | **Books & Inspiration** | "Catch Up on Sleep: You'll be exhausted. Make time to sleep -- then sleep some more!" | Title implies book recommendations. Content is a single sleep tip. |
| `aa6f521a` | **The back bedroom has a queen-sized bed, staircase, and shower.** | "We usually recommend no more than 4 or 5 types of wine." | Content is about WINE, not bedrooms. Complete data corruption. |
| `34be8074` | **The back bedroom has a queen-sized bed, staircase, and shower.** | "The typical wedding alcohol calculation is one drink per person per hour..." | Content is about ALCOHOL MATH, not bedrooms. Data corruption. |
| `8bea3928` | **The back bedroom has a queen-sized bed, staircase, and shower.** | "Below are the figures for a 120-person wedding at the Manor..." | Content is about alcohol quantities, not bedrooms. Data corruption. |

### 6B. Broken References

| ID | Title | Issue |
|----|-------|-------|
| `3f25c648`, `3e065db7`, `268f3e90` | **Appointments** | Content says "You can find them here !" but contains NO URL. The link was stripped during import. |
| `391b0ff7` | **Upload all contracts...to Honeybook** | References Honeybook but provides no URL or instructions. |

### 6C. HTML/Iframe Content (unusable by an AI assistant)

| ID | Title | Content |
|----|-------|---------|
| `ac412773`, `8c867ec2`, `a736e3a5` | **Things For Guests To Do** | Content is a raw `<iframe>` embed tag pointing to a Google Maps embed. An AI assistant cannot render iframes. This should be replaced with a text description of local activities with addresses. |

### 6D. Typos

| ID | Title | Typo | Correction |
|----|-------|------|-----------|
| `4178027a`, `f9af1eb9`, `4ad09090` | **Food Truck Wedidngs** | "Wedidngs" | "Weddings" |
| `b14725f1`, `70c24b69`, `19677c2a` | **Condiments -- Olives, Cherry's...** | "Cherry's" (possessive) | "Cherries" (plural) |
| `a3e4762e`, `ef8cd5ed` | **UPLOAD ALL MOST RECENT CONTRACTS...** | ALL CAPS title | Should be normal case |

### 6E. Content Too Short to Be Useful

Beyond the 95 Handbook fragments already listed in Section 2, these non-Handbook entries are too terse:

| ID | Title | Content | Length |
|----|-------|---------|--------|
| `a85c4449` | Patio | "Back patio is 70'x40'" | 22 |
| `83419129` | Ballroom size | "the ballroom is 50' x 30'" | 26 |
| `b3787289` | Hi, is my contract located on this website somewhere? | "Venue contracts are located on Honeybook" | 40 |
| `abf60851` | Venue railing dimensions | "Dimensions of front railing 134\" per side" | 42 |
| `7b6bfd4a` | What time can flowers be dropped off? | "Anytime within daylight and your contracted hours!" | 51 |
| `1fc79318` | Sparklers | "www.Superiorcelebrations.com\n36\"\nQuantities of 40 a pack" | 58 |

### 6F. Contradictions/Redundancy Between Entries

| Topic | Entry A | Entry B | Issue |
|-------|---------|---------|-------|
| Flower drop-off time | `a884800a` (Florist): "anytime after 8am" | `7b6bfd4a` (Vendor): "Anytime within daylight and your contracted hours!" | Different answers to the same question |
| Ballroom info | `f7e2ff58` (venue): "we can layout the ballroom in a way everyone is comfortable without having to move tables" | `83419129` (venue): "the ballroom is 50' x 30'" | Two separate entries for the same room, neither complete; `56bf042c` (Logistics > Layouts > Ballroom Capacity) has the comprehensive version |

---

## 7. Suggested New Category Structure

### Proposed Taxonomy

The current KB has 14 categories (plus ad-hoc ones). After dedup and merge, approximately 80-100 entries would remain. A clean taxonomy:

```
VENUE & SPACES
  - Ballroom (capacity, dimensions, layouts)
  - Front Porch & Patio (dimensions, dining, weather)
  - Cottage & Bedrooms (accommodations, what's provided)
  - Kitchen & Utility (fridge, equipment, cleanup)
  - Fire Pit & Grounds (s'mores, sparklers, outdoor spaces)
  - Tent Setup (delivery, AC, timing)

BAR & BEVERAGES
  - Bar Setup & Options (BYOB, beer/wine, full bar)
  - Bar Equipment (taps, dispensers, what's provided)
  - Alcohol Quantities (calculations, what to buy)
  - Signature Cocktails (ideas, quantities)
  - Bar Upgrades (add-ons, pricing)

FOOD & CATERING
  - Caterer Selection (what to ask, common caterers)
  - Food Truck Weddings
  - Saturday Breakfast (what's provided)
  - Extra Meals (Friday dinner, Saturday lunch, vendor meals)
  - Brunch Upgrade (Sunday, extended checkout)
  - Late-Night Snacks (s'mores, pizza, donuts)
  - Cake & Desserts (drop-off, storage, stands)

VENDORS & STAFFING
  - Recommended Vendors (list with contacts)
  - Preferred Vendor Discounts
  - Vendor Tips (booking, communicating, confirming)
  - Rixey Staffing (what's included, bartender pricing)
  - Cocktail Hour Staffing
  - Florist Coordination (drop-off, reuse, timing)
  - Photographer Guidelines (second shooter, meals, timeline)
  - DJ & Band Setup (equipment, space needs)
  - Officiant Requirements (Virginia registration)

PLANNING & TIMELINE
  - Budget Guide
  - Wedding To-Do List (priority order)
  - Timelines & Scheduling
  - Hair & Makeup Timeline
  - Pre-Ceremony Photography Timeline
  - Rehearsal Timing & Schedule
  - Appointments & Check-Ins (with links)
  - Tour Prep Guide
  - Planning Tools (Honeybook, Google Sheets)
  - Contracts & Uploads

LOGISTICS & SETUP
  - Table Layouts (rounds, rectangles, seating capacity)
  - Chair Inventory
  - Rentals Guidance (what to rent, Sammy's)
  - Linens & Table Settings
  - Decor Borrowing List (what Rixey provides)
  - Delivery Schedule (tents Thursday, other Friday)
  - Rain Plan & Weather Backup

GUEST EXPERIENCE
  - Accommodations (hotels, Manor rooms, cottage)
  - Shuttle Planning (companies, timing)
  - Guest Comfort Tips (fans, warmth, accessibility)
  - Pet Allergy Accommodations
  - Welcome Bags
  - Things For Guests To Do (local activities)
  - Kids at Weddings (craft table, seating)

WEEK-OF & DAY-OF
  - Packing Guidance (by zone)
  - Move-In Day Guide
  - Drop-Off Schedule
  - Final Walkthrough Checklist
  - Emergency & Backup Items
  - Things People Forget
  - Vendor Confirmations (last-minute reminders)
  - Tipping Guidance

CEREMONY
  - Ceremony Locations (options, setup)
  - Ceremony Decor Tips (candles, arbor, flowers)
  - Processional & Flower Girl Planning

RECEPTION
  - Sweetheart Table Setup
  - Table Numbers & Decor
  - Favors (what works, what doesn't)
  - Send-Off Options (sparklers, wands, confetti)
  - Seasonal Touches

POST-WEDDING
  - Clean-Up Guide (what you do, what we handle)
  - Back-to-Back Wedding Logistics
  - Post-Wedding Checklist
  - Finance & Paperwork (payments, deposits)
  - Reviews & Thank-Yous
  - Wedding Blues Support

INSPIRATION & SHOPPING
  - Pinterest Board Guidance
  - Product Recommendations (with Amazon links)
  - Decor Finds
  - Practical Purchases
  - Rental Alternatives (buy vs rent)
```

### Key Changes from Current Structure

1. **Eliminate "Handbook" category entirely** -- all 255 fragment rows absorbed into topical entries above
2. **Eliminate "general", "venue", "Vendor", "Florist"** ad-hoc categories
3. **Split "Logistics"** into "Logistics & Setup" (physical) and "Bar & Beverages" (drinks)
4. **Split "Extras & Add-Ons"** into "Food & Catering" sub-topics
5. **Rename "Month-of Wedding Info"** to "Week-of & Day-of" (clearer for couples)
6. **Move "Inspiration" shopping links** into "Inspiration & Shopping"
7. **Add "Ceremony" and "Reception"** as distinct categories (currently no ceremony-specific category)
8. **Every entry gets a meaningful description** (not "From the Rixey Manor Handbook 2026")

---

## Summary of Action Items

| Priority | Action | Rows Affected |
|----------|--------|---------------|
| **P0** | Delete exact duplicates (keep newest of each triple) | Remove 102 rows |
| **P0** | Delete all 255 Handbook fragment rows after extracting unique content | Remove 255 rows |
| **P1** | Fix 3 data-corruption rows where title says "back bedroom" but content is about alcohol | Fix `aa6f521a`, `34be8074`, `8bea3928` |
| **P1** | Fix "Books & Inspiration" entries -- replace with actual book recommendations or re-title | Fix `664f133c`, `98e5b3df`, `18ea67b3` |
| **P1** | Replace iframe content in "Things For Guests To Do" with text | Fix `ac412773`, `8c867ec2`, `a736e3a5` |
| **P1** | Add URL to "Appointments" entries or remove | Fix `3f25c648`, `3e065db7`, `268f3e90` |
| **P1** | Fix typo "Wedidngs" -> "Weddings" | Fix `4178027a`, `f9af1eb9`, `4ad09090` |
| **P2** | Merge ad-hoc categories (venue, general, Vendor, Florist) into proper categories | 11 rows |
| **P2** | Write real descriptions for all 11 null-description rows | 11 rows |
| **P2** | Expand terse venue dimension rows into a single comprehensive "Venue Dimensions" entry | 5 rows |
| **P2** | Merge overlapping non-Handbook entries (bar, vendor, catering, accommodations) | ~20 entries -> ~10 |
| **P3** | Re-categorize all entries into the proposed taxonomy | All remaining rows |
| **P3** | Write meaningful descriptions for every entry (replacing "From the Rixey Manor Handbook 2026") | All entries |

**Net result: ~439 rows -> ~80-100 well-structured, unique, properly-categorized entries.**
