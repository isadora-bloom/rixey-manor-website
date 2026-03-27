'use client'

const UTM_KEY = 'rixey_utm'

export function captureUTM() {
  if (typeof window === 'undefined') return
  const params = new URLSearchParams(window.location.search)
  const utm = {
    source:   params.get('utm_source')   || document.referrer || 'direct',
    medium:   params.get('utm_medium')   || null,
    campaign: params.get('utm_campaign') || null,
    referrer: document.referrer          || null,
  }
  // Only overwrite if there are actual UTM params (preserve original source)
  if (params.get('utm_source') || !sessionStorage.getItem(UTM_KEY)) {
    sessionStorage.setItem(UTM_KEY, JSON.stringify(utm))
  }
}

export function getUTM() {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(sessionStorage.getItem(UTM_KEY) || '{}')
  } catch {
    return {}
  }
}
