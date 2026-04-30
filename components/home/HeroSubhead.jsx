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
  const tail = `${age} years old, 30 acres, 60 miles from Washington DC.`
  // Planner gets a different tail — "exclusive use" is the language they care about
  const plannerTail = `${age} years old, 30 acres, full exclusive use, no event-stacking.`

  switch (role) {
    case 'couple': {
      // The visitor IS getting married — direct invitation
      const couple =
        firstName && partnerName ? `${firstName} & ${partnerName}` : firstName
      return `${couple}, this could be your estate for your wedding weekend. ${tail}`
    }
    case 'parent':
      // The wedding is their child's, not theirs — shift to third person
      return partnerName
        ? `${firstName}, this could be where ${partnerName} gets married. ${tail}`
        : `${firstName}, this could be where the wedding happens. ${tail}`
    case 'friend_family':
      return partnerName
        ? `${firstName}, this could be where ${partnerName} gets married. ${tail}`
        : `${firstName}, this could be where they get married. ${tail}`
    case 'planner':
      // Planner is also third-party — talking about the couple they represent
      return partnerName
        ? `${firstName}, this could be where ${partnerName} gets married. ${plannerTail}`
        : `${firstName}, this could be the venue for the wedding you're planning. ${plannerTail}`
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
