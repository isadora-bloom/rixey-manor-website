import { supabase } from './supabase'

/**
 * Fetch site image slots by ID, including any extra gallery images per slot.
 * Returns a keyed object:
 *   { 'hero-homepage': { url, alt_text, object_position, extras: [] } | null, ... }
 */
export async function getSiteImages(slots) {
  const [{ data: images }, { data: extras }] = await Promise.all([
    supabase
      .from('site_images')
      .select('id, url, alt_text, object_position')
      .in('id', slots),
    supabase
      .from('site_image_extras')
      .select('slot_id, url, alt_text, sort_order')
      .in('slot_id', slots)
      .order('sort_order'),
  ])

  const extrasMap = {}
  ;(extras || []).forEach(e => {
    if (!extrasMap[e.slot_id]) extrasMap[e.slot_id] = []
    extrasMap[e.slot_id].push({ url: e.url, alt_text: e.alt_text || '' })
  })

  return (images || []).reduce((acc, row) => {
    if (row.url) {
      acc[row.id] = {
        url: row.url,
        alt_text: row.alt_text || '',
        object_position: row.object_position || null,
        extras: extrasMap[row.id] || [],
      }
    } else {
      acc[row.id] = null
    }
    return acc
  }, {})
}
