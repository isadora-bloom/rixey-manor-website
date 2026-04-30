'use client'

import { useEffect, useState } from 'react'
import { getVisitorContext } from '@/lib/visitor'

// Role-aware hero subhead. Lives client-side so we can read localStorage.
// Server renders the default; client swaps in a personalized version once
// we have role + name. Falls back to default for anything we can't say
// honestly with the context we have.

function personalizedSubhead(ctx, age) {
  if (!ctx?.firstName || !ctx?.role) return null
  const { firstName, partnerName, role } = ctx
  const couple =
    firstName && partnerName ? `${firstName} & ${partnerName}` : firstName
  const tail = `${age} years old, 30 acres, 60 miles from Washington DC.`
  switch (role) {
    case 'couple':
      return `${couple}, this is the estate. ${tail}`
    case 'parent':
      return partnerName
        ? `${firstName}, this is where ${partnerName}'s wedding could happen. ${tail}`
        : `${firstName}, this is the estate. ${tail}`
    case 'friend_family':
      return partnerName
        ? `${firstName}, this is where ${partnerName} could get married. ${tail}`
        : `${firstName}, this is the estate. ${tail}`
    case 'planner':
      return `${firstName}, here's the estate. ${age} years old, 30 acres, full exclusive use, no event-stacking.`
    case 'browsing':
      return `${firstName}, take your time. ${tail}`
    default:
      return null
  }
}

export default function HeroSubhead({ age, className, style }) {
  const [ctx, setCtx] = useState(null)

  useEffect(() => {
    setCtx(getVisitorContext())
  }, [])

  const defaultText = `A ${age}-year-old estate wedding venue in Rixeyville, Virginia. 60 miles from Washington DC.`
  const personalized = ctx ? personalizedSubhead(ctx, age) : null
  const content = personalized || defaultText

  return (
    <p suppressHydrationWarning className={className} style={style}>
      {content}
    </p>
  )
}
