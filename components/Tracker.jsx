'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import {
  getVisitorId,
  getSessionId,
  captureAttribution,
  getFirstTouch,
  getLastTouch,
} from '@/lib/visitor'

// Mounted once at the root. Captures attribution on first paint, then fires a
// pageview to /api/track/pageview on every route change. Failures are silent —
// tracking must never block the UI.
export default function Tracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const fired = useRef(new Set())

  useEffect(() => {
    captureAttribution()
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || !pathname) return

    const queryStr = searchParams?.toString() || ''
    const key = pathname + (queryStr ? '?' + queryStr : '')

    // De-dupe: React StrictMode + fast nav can fire the effect twice
    if (fired.current.has(key)) return
    fired.current.add(key)

    const visitor_id = getVisitorId()
    const session_id = getSessionId()
    if (!visitor_id) return

    const first = getFirstTouch() || {}
    const last  = getLastTouch()  || {}

    const payload = {
      visitor_id,
      session_id,
      path: pathname,
      query: queryStr || null,
      referrer: typeof document !== 'undefined' ? (document.referrer || null) : null,
      first_source:        first.source       || null,
      first_medium:        first.medium       || null,
      first_campaign:      first.campaign     || null,
      first_content:       first.content      || null,
      first_term:          first.term         || null,
      first_referrer:      first.referrer     || null,
      first_landing_page:  first.landing_page || null,
      first_seen_at:       first.captured_at  || null,
      last_source:         last.source        || null,
      last_medium:         last.medium        || null,
      last_campaign:       last.campaign      || null,
      last_referrer:       last.referrer      || null,
      last_landing_page:   last.landing_page  || null,
    }

    // sendBeacon survives page unload; fall back to fetch
    try {
      const body = JSON.stringify(payload)
      if (navigator.sendBeacon) {
        const blob = new Blob([body], { type: 'application/json' })
        navigator.sendBeacon('/api/track/pageview', blob)
      } else {
        fetch('/api/track/pageview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
          keepalive: true,
        }).catch(() => {})
      }
    } catch {}
  }, [pathname, searchParams])

  return null
}
