-- ─────────────────────────────────────────────────────────────────────────────
-- Rixey Manor — Venue Extras ("Only at Rixey")
-- PASTE THIS ENTIRE FILE into the Supabase SQL Editor and click Run.
-- Safe to run more than once.
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Create table
CREATE TABLE IF NOT EXISTS venue_extras (
  id          BIGSERIAL   PRIMARY KEY,
  title       TEXT        NOT NULL,
  description TEXT        DEFAULT '',
  quote       TEXT        DEFAULT '',
  image_url   TEXT,
  sort_order  INT         DEFAULT 0,
  active      BOOLEAN     DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE venue_extras ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "venue_extras_public_read" ON venue_extras;
CREATE POLICY "venue_extras_public_read"
  ON venue_extras FOR SELECT TO anon, authenticated USING (true);

-- 2. Seed content (skips rows that already exist)
INSERT INTO venue_extras (title, description, quote, sort_order) VALUES

('Live painter',
 'An artist sets up a canvas during cocktail hour and paints your day in real time. You leave with an original painting of your wedding.',
 '', 10),

('Bury a bottle of whiskey',
 'Hide a bottle of your favourite spirit somewhere on the grounds before your wedding. Dig it up on your first anniversary — or crack it open at the end of the night with whoever is left.',
 '', 20),

('Horses',
 'Magic the horse has grazed these pastures for years. Couples have incorporated horses into first looks, processionals, and portraits. Isadora once coordinated a surprise floral wreath for the mane.',
 '', 30),

('Lion dance',
 'The 30 acres, the open lawn, the full weekend — it is the kind of venue where a lion dance during the reception is not a logistical problem. It is just Tuesday.',
 '', 40),

('Baraat procession',
 'The back lawn becomes the stage. Music, dancing, the whole procession before the ceremony begins. Couples have done full Indian-American fusion weddings here start to finish.',
 '', 50),

('Fire pit',
 'The fire pit runs all night out back. Blankets available. Couples tend to find their favourite people gathered around it around 11pm, long after the dancing is done.',
 'Food trucks outside, fire pit out back, casino tables throughout the house and even caricature artists.',
 60),

('Food trucks',
 'Park two or three on the drive. Any cuisine, any vendor — no approved list, no corkage fee, no catch. The venue recommends three dinner trucks and one dessert truck for up to 120 guests.',
 '', 70),

('Morning-after donut truck',
 'Sunday morning. Still in wedding clothes or already in pyjamas. Donut truck in the drive, everyone sitting in the sun, replaying the night before.',
 '', 80),

('Casino tables',
 'Blackjack, poker, caricature artists — couples have turned the manor rooms into a full casino floor for an evening. The house is big enough.',
 'Food trucks outside, fire pit out back, casino tables throughout the house and even caricature artists.',
 90),

('Clay shooting and cigars',
 'Saturday afternoon, the groomsmen take over. Skeet shooting, cigars, whiskey. The grounds have room for it. The manor has the whiskey.',
 '', 100),

('Sparkler exit',
 'Lined up along the drive with sparklers, staff on hand. It photographs exactly as well as you think it will.',
 '', 110),

('Hot chocolate bar',
 'A winter wedding staple. Staff sets up hot chocolate, blankets, and hand warmers without being asked. It is one of those things you did not know you needed until it appeared.',
 '', 120),

('Pets',
 'Nearly half of Rixey couples bring their dogs. Shih tzus, golden retrievers, rescue mutts serving as ring bearers. A staff member will personally look after them so you do not have to.',
 '', 130),

('The copper tub at midnight',
 'The bridal suite has a copper tub built for two. Getting in it at the end of the night — in the dress or not — has become something of a Rixey tradition.',
 '', 140),

('Come as you are',
 'The full Suicide Squad showed up here once. Whatever yourselves looks like — themed, costumed, unconventional, queer, polyamorous, interfaith — this is the right venue for it.',
 'She seems to genuinely care about each wedding she chooses to host in a way we didn''t feel in any of the 20+ venues we toured.',
 150),

('The big group photo',
 'Everyone. Right after the ceremony, before anyone wanders off. The whole crowd on the lawn at once. It has become a Rixey thing.',
 '', 160),

('The tree swing',
 'On the grounds. Portraits happen here. So do quiet moments between the chaos.',
 '', 170),

('The library at the end of the night',
 'At some point after midnight, the library with the real fire and the big sofas fills up with whoever is left. No one wants to go to bed.',
 'Curl up at the end of the night in the library with your favourite people — big sofas, real fires.',
 180),

('Breakfast cooked for everyone',
 'The morning after, staff cook breakfast for the wedding party. Not a continental spread. Actual breakfast. It is part of the weekend.',
 '', 190),

('The borrow cottage',
 'Free access to signs, vases, candleholders, lanterns, and décor donated from previous weddings. Take what you want. Leave what you do not use.',
 '', 200)

ON CONFLICT DO NOTHING;

-- 3. Set image URLs for extras that have photos
--    (these were uploaded to Supabase Storage by upload-extras-photos.mjs)
UPDATE venue_extras SET image_url = 'https://fgbnvotlqpfaewvpnsxf.supabase.co/storage/v1/object/public/rixey-media/extras/sparkler-exit.webp'
  WHERE title = 'Sparkler exit';

UPDATE venue_extras SET image_url = 'https://fgbnvotlqpfaewvpnsxf.supabase.co/storage/v1/object/public/rixey-media/extras/food-trucks.webp'
  WHERE title = 'Food trucks';

UPDATE venue_extras SET image_url = 'https://fgbnvotlqpfaewvpnsxf.supabase.co/storage/v1/object/public/rixey-media/extras/pets.webp'
  WHERE title = 'Pets';

UPDATE venue_extras SET image_url = 'https://fgbnvotlqpfaewvpnsxf.supabase.co/storage/v1/object/public/rixey-media/extras/copper-tub.webp'
  WHERE title = 'The copper tub at midnight';

UPDATE venue_extras SET image_url = 'https://fgbnvotlqpfaewvpnsxf.supabase.co/storage/v1/object/public/rixey-media/extras/come-as-you-are.webp'
  WHERE title = 'Come as you are';

UPDATE venue_extras SET image_url = 'https://fgbnvotlqpfaewvpnsxf.supabase.co/storage/v1/object/public/rixey-media/extras/group-photo.webp'
  WHERE title = 'The big group photo';

UPDATE venue_extras SET image_url = 'https://fgbnvotlqpfaewvpnsxf.supabase.co/storage/v1/object/public/rixey-media/extras/tree-swing.webp'
  WHERE title = 'The tree swing';

UPDATE venue_extras SET image_url = 'https://fgbnvotlqpfaewvpnsxf.supabase.co/storage/v1/object/public/rixey-media/extras/library.webp'
  WHERE title = 'The library at the end of the night';

UPDATE venue_extras SET image_url = 'https://fgbnvotlqpfaewvpnsxf.supabase.co/storage/v1/object/public/rixey-media/extras/baraat.webp'
  WHERE title = 'Baraat procession';
