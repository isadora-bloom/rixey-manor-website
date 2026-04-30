'use client'

import { useEffect, useState } from 'react'
import { getVisitorContext } from '@/lib/visitor'

// Renders `defaultContent` server-side and on first paint, then swaps in the
// personalized version once we've read the visitor context from localStorage.
//
// `personalized` is a function (ctx) => ReactNode | null. Returning null falls
// back to the default — important so we never render a half-personalized
// string ("Welcome back, ").
//
// The wrapping span uses suppressHydrationWarning because we deliberately
// render different content on the client.
export default function AdaptiveText({ defaultContent, personalized, as: Tag = 'span', ...rest }) {
  const [ctx, setCtx] = useState(null)

  useEffect(() => {
    setCtx(getVisitorContext())
  }, [])

  let content = defaultContent
  if (ctx && typeof personalized === 'function') {
    const candidate = personalized(ctx)
    if (candidate) content = candidate
  }

  return (
    <Tag suppressHydrationWarning {...rest}>
      {content}
    </Tag>
  )
}
