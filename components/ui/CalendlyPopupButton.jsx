'use client'

import { getAttributionPayload } from '@/lib/visitor'

const CALENDLY_URL = 'https://calendly.com/rixeymanor/manortour'

// Fire-and-forget POST that never blocks the popup from opening.
function logTourIntent(target) {
  try {
    const attr = getAttributionPayload()
    const payload = JSON.stringify({
      kind: 'open',
      visitor_id: attr.visitor_id,
      calendly_url: target,
      source: attr.source,
      medium: attr.medium,
      campaign: attr.campaign,
      referrer: attr.referrer,
      landing_page: attr.first_landing_page,
      trigger_path: typeof window !== 'undefined' ? window.location.pathname : null,
    })
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/track/tour-intent', new Blob([payload], { type: 'application/json' }))
    } else {
      fetch('/api/track/tour-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      }).catch(() => {})
    }
  } catch {
    // Tracking failures must never block the popup.
  }
}

export default function CalendlyPopupButton({ url, className, children }) {
  const handleClick = (e) => {
    e.preventDefault()
    const target = url || CALENDLY_URL
    if (typeof window !== 'undefined') {
      logTourIntent(target)
      if (window.gtag) window.gtag('event', 'book_tour_click')
      if (window.Calendly) {
        window.Calendly.initPopupWidget({ url: target })
      } else {
        window.open(target, '_blank')
      }
    }
  }

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  )
}
