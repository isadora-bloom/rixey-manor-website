'use client'

const CALENDLY_URL = 'https://calendly.com/rixeymanor/manortour'

export default function CalendlyInline({ url }) {
  const src = (url || CALENDLY_URL) + '?primary_color=2e7d54&hide_gdpr_banner=1'

  return (
    <div
      className="calendly-inline-widget w-full"
      data-url={src}
      style={{ minWidth: '320px', height: '700px' }}
    />
  )
}
