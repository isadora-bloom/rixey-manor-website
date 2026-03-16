-- Add venue-hero and accommodations to media category constraint
ALTER TABLE media DROP CONSTRAINT IF EXISTS media_category_check;
ALTER TABLE media ADD CONSTRAINT media_category_check
  CHECK (category IN ('hero', 'spaces', 'gallery', 'team', 'venue-hero', 'accommodations'));
