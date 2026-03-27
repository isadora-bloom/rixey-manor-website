'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'
import StickyBookBar from '@/components/ui/StickyBookBar'

export default function SiteChrome({ children, calendlyUrl }) {
  const pathname = usePathname()
  const isAdmin  = pathname.startsWith('/admin')
  const isPortal = pathname.startsWith('/portal')
  const hideChrome = isAdmin || isPortal

  return (
    <>
      {!hideChrome && <Navbar calendlyUrl={calendlyUrl} />}
      <main>{children}</main>
      {!hideChrome && <Footer />}
      {!hideChrome && <StickyBookBar calendlyUrl={calendlyUrl} />}
    </>
  )
}
