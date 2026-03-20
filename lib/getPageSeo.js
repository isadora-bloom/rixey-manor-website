import { supabaseServer } from './supabaseServer'

/**
 * Fetch OG image URL for a page from the page_seo table.
 * Returns null if not set — callers use their hardcoded fallback.
 */
export async function getOgImage(pageKey) {
  const { data } = await supabaseServer()
    .from('page_seo')
    .select('og_image_url')
    .eq('page_key', pageKey)
    .single()
  return data?.og_image_url || null
}
