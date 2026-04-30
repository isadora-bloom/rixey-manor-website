'use client'

import { useEffect, useState } from 'react'
import { getVisitorContext } from '@/lib/visitor'

// Role-aware copy with serializable props only (so this can be safely used
// from server components). Pass `defaultContent` plus a `byRole` map keyed
// by role. Returns the role-specific string when context is known, otherwise
// falls back to default. Names don't get interpolated here — write the role
// variants directly. For surfaces that need names interpolated, build a
// dedicated client component (see HeroSubhead).
export default function AdaptiveCopy({
  defaultContent,
  byRole = {},
  as: Tag = 'span',
  className,
  style,
}) {
  const [role, setRole] = useState(null)

  useEffect(() => {
    const ctx = getVisitorContext()
    setRole(ctx?.role || null)
  }, [])

  const content = (role && byRole[role]) || defaultContent

  return (
    <Tag suppressHydrationWarning className={className} style={style}>
      {content}
    </Tag>
  )
}
