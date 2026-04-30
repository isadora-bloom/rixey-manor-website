'use client'

// Visitor identity + attribution layer.
//
// One UUID per browser, persisted in cookie (1yr) AND localStorage so it
// survives tab closes, returns, and storage clears that hit only one of the two.
// First-touch UTM is captured on first visit and never overwritten — the original
// source is what matters for attribution. Last-touch UTM is updated every visit
// so we can also see what brought them back.
//
// Name is stored locally (after the visitor gives it) so personalization works
// instantly without a server round-trip on every page.

const COOKIE_NAME       = 'rixey_vid'
const LS_VID_KEY        = 'rixey_vid'
const LS_FIRST_KEY      = 'rixey_first_touch'
const LS_LAST_KEY       = 'rixey_last_touch'
const LS_NAME_KEY       = 'rixey_visitor_name'      // legacy; superseded by LS_CTX_KEY
const LS_CTX_KEY        = 'rixey_visitor_context_v1'
const LS_DISMISS_KEY    = 'rixey_name_capture_dismissed'
const LS_SESSION_KEY    = 'rixey_session_id'
const COOKIE_MAX_AGE    = 60 * 60 * 24 * 365  // 1 year
const SESSION_TTL_MS    = 30 * 60 * 1000      // 30 min idle = new session

// Role values the prompt collects. 'browsing' means name only — no
// adaptive CTAs, just the soft greeting.
export const ROLES = ['couple', 'parent', 'friend_family', 'planner', 'browsing']

// ── Cookie helpers ────────────────────────────────────────────────────────────

function readCookie(name) {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp('(^|;\\s*)' + name + '=([^;]+)'))
  return match ? decodeURIComponent(match[2]) : null
}

function writeCookie(name, value, maxAge = COOKIE_MAX_AGE) {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Lax`
}

// ── UUID ──────────────────────────────────────────────────────────────────────

function uuid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  // Fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

// ── Visitor ID ────────────────────────────────────────────────────────────────

export function getVisitorId() {
  if (typeof window === 'undefined') return null

  let id = readCookie(COOKIE_NAME)
  if (!id) {
    try { id = localStorage.getItem(LS_VID_KEY) } catch {}
  }
  if (!id) {
    id = uuid()
  }

  // Re-write to both stores every time so a missing one heals
  writeCookie(COOKIE_NAME, id)
  try { localStorage.setItem(LS_VID_KEY, id) } catch {}

  return id
}

// ── Session ID (rotates on 30min idle) ────────────────────────────────────────

export function getSessionId() {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(LS_SESSION_KEY)
    const parsed = raw ? JSON.parse(raw) : null
    const now = Date.now()
    if (parsed && parsed.id && (now - (parsed.last || 0)) < SESSION_TTL_MS) {
      sessionStorage.setItem(LS_SESSION_KEY, JSON.stringify({ id: parsed.id, last: now }))
      return parsed.id
    }
    const fresh = uuid()
    sessionStorage.setItem(LS_SESSION_KEY, JSON.stringify({ id: fresh, last: now }))
    return fresh
  } catch {
    return uuid()
  }
}

// ── Attribution capture ───────────────────────────────────────────────────────

function readTouchFromLocation() {
  if (typeof window === 'undefined') return null
  const params = new URLSearchParams(window.location.search)
  return {
    source:        params.get('utm_source')   || null,
    medium:        params.get('utm_medium')   || null,
    campaign:      params.get('utm_campaign') || null,
    content:       params.get('utm_content')  || null,
    term:          params.get('utm_term')     || null,
    referrer:      document.referrer          || null,
    landing_page:  window.location.pathname   || null,
    captured_at:   new Date().toISOString(),
  }
}

export function captureAttribution() {
  if (typeof window === 'undefined') return
  const touch = readTouchFromLocation()
  if (!touch) return

  // First touch: only set once, ever
  try {
    if (!localStorage.getItem(LS_FIRST_KEY)) {
      // Only persist as first-touch if it has *something* — otherwise wait for
      // a real signal. Direct/no-referrer first visits still get stored as a
      // last resort so we don't keep overwriting later.
      localStorage.setItem(LS_FIRST_KEY, JSON.stringify(touch))
    }
  } catch {}

  // Last touch: only update if there's a real new signal (utm OR external referrer)
  const hasNewSignal =
    touch.source ||
    (touch.referrer && !touch.referrer.includes(window.location.host))
  if (hasNewSignal) {
    try { localStorage.setItem(LS_LAST_KEY, JSON.stringify(touch)) } catch {}
  }
}

export function getFirstTouch() {
  if (typeof window === 'undefined') return null
  try { return JSON.parse(localStorage.getItem(LS_FIRST_KEY) || 'null') } catch { return null }
}

export function getLastTouch() {
  if (typeof window === 'undefined') return null
  try { return JSON.parse(localStorage.getItem(LS_LAST_KEY) || 'null') } catch { return null }
}

// ── Visitor context (role + names) ───────────────────────────────────────────

const EMPTY_CTX = { firstName: '', partnerName: '', role: '' }

// Read the full context (role + names). Falls back to the legacy name-only key
// so visitors who already gave their name pre-role aren't asked again.
export function getVisitorContext() {
  if (typeof window === 'undefined') return { ...EMPTY_CTX }
  try {
    const raw = localStorage.getItem(LS_CTX_KEY)
    if (raw) return { ...EMPTY_CTX, ...JSON.parse(raw) }
    const legacy = localStorage.getItem(LS_NAME_KEY)
    if (legacy) {
      const parsed = JSON.parse(legacy)
      return { firstName: parsed.firstName || '', partnerName: parsed.partnerName || '', role: '' }
    }
  } catch {}
  return { ...EMPTY_CTX }
}

export function setVisitorContext({ firstName, partnerName, role } = {}) {
  if (typeof window === 'undefined') return
  const current = getVisitorContext()
  const next = {
    firstName:   firstName   !== undefined ? (firstName   || '').trim() : current.firstName,
    partnerName: partnerName !== undefined ? (partnerName || '').trim() : current.partnerName,
    role:        role        !== undefined ? (role        || '').trim() : current.role,
  }
  try {
    localStorage.setItem(LS_CTX_KEY, JSON.stringify(next))
    // Keep the legacy key in sync so any older readers still get the name
    localStorage.setItem(LS_NAME_KEY, JSON.stringify({
      firstName: next.firstName, partnerName: next.partnerName,
    }))
  } catch {}
}

// Backwards-compat: existing call-sites use getVisitorName() and setVisitorName()
export function getVisitorName() {
  const { firstName, partnerName } = getVisitorContext()
  return { firstName, partnerName }
}

export function setVisitorName(firstName, partnerName) {
  setVisitorContext({ firstName, partnerName })
}

export function dismissNameCapture() {
  if (typeof window === 'undefined') return
  try { localStorage.setItem(LS_DISMISS_KEY, String(Date.now())) } catch {}
}

export function isNameCaptureDismissed() {
  if (typeof window === 'undefined') return true
  try {
    const raw = localStorage.getItem(LS_DISMISS_KEY)
    if (!raw) return false
    // Re-prompt after 7 days
    const ts = parseInt(raw, 10)
    return Number.isFinite(ts) && (Date.now() - ts) < 7 * 24 * 60 * 60 * 1000
  } catch { return true }
}

// ── Combined payload for form submissions ────────────────────────────────────

export function getAttributionPayload() {
  const first = getFirstTouch() || {}
  const last  = getLastTouch()  || {}
  return {
    visitor_id:   getVisitorId(),
    session_id:   getSessionId(),
    // First-touch (where they came from originally)
    first_source:        first.source       || null,
    first_medium:        first.medium       || null,
    first_campaign:      first.campaign     || null,
    first_referrer:      first.referrer     || null,
    first_landing_page:  first.landing_page || null,
    first_seen_at:       first.captured_at  || null,
    // Last-touch (what brought them back this time)
    last_source:         last.source        || first.source       || null,
    last_medium:         last.medium        || first.medium       || null,
    last_campaign:       last.campaign      || first.campaign     || null,
    last_referrer:       last.referrer      || first.referrer     || null,
    // Legacy flat fields (kept so the calculator API doesn't need to change shape)
    source:   last.source   || first.source   || null,
    medium:   last.medium   || first.medium   || null,
    campaign: last.campaign || first.campaign || null,
    referrer: last.referrer || first.referrer || null,
  }
}
