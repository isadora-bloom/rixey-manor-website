'use client'

const CALENDLY_URL = 'https://calendly.com/rixeymanor/manortour'

export default function CalendlyPopupButton({ url, className, children }) {
  const handleClick = (e) => {
    e.preventDefault()
    const target = url || CALENDLY_URL
    if (typeof window !== 'undefined' && window.Calendly) {
      window.Calendly.initPopupWidget({ url: target })
    } else {
      window.open(target, '_blank')
    }
  }

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  )
}
