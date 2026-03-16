import { supabase } from './supabase'

/**
 * Fetch site image slots by ID.
 * Returns a keyed object: { 'hero-homepage': { url, alt_text, object_position } | null, ... }
 */
export async function getSiteImages(slots) {
  const { data } = await supabase
    .from('site_images')
    .select('id, url, alt_text, object_position')
    .in('id', slots)

  return (data || []).reduce((acc, row) => {
    acc[row.id] = row.url ? {
      url: row.url,
      alt_text: row.alt_text || '',
      object_position: row.object_position || null,
    } : null
    return acc
  }, {})
}
