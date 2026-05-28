'use client'

import { useEffect, useRef } from 'react'
import { getAttributionPayload } from '@/lib/visitor'

const CALENDLY_URL = 'https://calendly.com/rixeymanor/manortour'

// Calendly posts messages on its iframe with event names like:
//   calendly.profile_page_viewed
//   calendly.event_type_viewed
//   calendly.date_and_time_selected
//   calendly.event_scheduled
//
// We treat event_type_viewed (first real interaction inside the widget) as an
// OPEN intent and event_scheduled as a SCHEDULE. The OPEN log is de-duped
// per visitor per URL per day server-side, so we don't need to be clever
// here about firing once.
function isCalendlyMessage(e) {
  return e?.origin === 'https://calendly.com' && typeof e?.data?.event === 'string' && e.data.event.startsWith('calendly.')
}

function post(payload) {
  try {
    const body = JSON.stringify(payload)
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      navigator.sendBeacon('/api/track/tour-intent', new Blob([body], { type: 'application/json' }))
    } else {
      fetch('/api/track/tour-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
      }).catch(() => {})
    }
  } catch {}
}

export default function CalendlyInline({ url }) {
  const target = url || CALENDLY_URL
  const src = target + '?primary_color=2e7d54&hide_gdpr_banner=1'
  const openedRef = useRef(false)

  useEffect(() => {
    function onMessage(e) {
      if (!isCalendlyMessage(e)) return
      const evt = e.data.event
      const attr = getAttributionPayload()
      const base = {
        visitor_id: attr.visitor_id,
        calendly_url: target,
        source: attr.source,
        medium: attr.medium,
        campaign: attr.campaign,
        referrer: attr.referrer,
        landing_page: attr.first_landing_page,
        trigger_path: typeof window !== 'undefined' ? window.location.pathname : null,
      }
      if (evt === 'calendly.event_type_viewed' && !openedRef.current) {
        openedRef.current = true
        post({ kind: 'open', ...base })
      } else if (evt === 'calendly.event_scheduled') {
        const invitee = e.data.payload?.invitee || {}
        post({
          kind: 'scheduled',
          ...base,
          scheduled_event_uri: e.data.payload?.event?.uri || null,
          email: invitee.email || null,
          first_name: invitee.name || null,
        })
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'tour_scheduled', {
            source: attr.source || '(none)',
            medium: attr.medium || '(none)',
          })
        }
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [target])

  return (
    <div
      className="calendly-inline-widget w-full"
      data-url={src}
      style={{ minWidth: '320px', height: '700px' }}
    />
  )
}
