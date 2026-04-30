'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getVisitorContext } from '@/lib/visitor'

// Renders only when the visitor has given us a name. Clicking sends them to
// the homepage with a flag that tells AdaptivePrompt to re-show with current
// values pre-filled, even though they've already answered.
export default function EditDetailsLink() {
  const [hasContext, setHasContext] = useState(false)

  useEffect(() => {
    const ctx = getVisitorContext()
    setHasContext(Boolean(ctx?.firstName))
  }, [])

  if (!hasContext) return null

  function handleClick() {
    try {
      sessionStorage.setItem('rixey_force_prompt', '1')
      localStorage.removeItem('rixey_name_capture_dismissed')
    } catch {}
  }

  return (
    <Link
      href="/?edit=1"
      onClick={handleClick}
      className="text-link"
    >
      Update your details
    </Link>
  )
}
