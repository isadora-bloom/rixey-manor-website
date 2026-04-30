'use client'

// Backwards-compatible shim. New code should import from '@/lib/visitor'.
// All callers that still do `getUTM()` get the same flat shape they had before
// plus the new visitor_id / session_id keys.

import { captureAttribution, getAttributionPayload } from './visitor'

export function captureUTM() {
  captureAttribution()
}

export function getUTM() {
  return getAttributionPayload()
}
