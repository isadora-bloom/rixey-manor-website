'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'

export default function SiteChrome({ children, calendlyUrl }) {
  const pathname = usePathname()
  const isAdmin  = pathname.startsWith('/admin')

  return (
    <>
      {!isAdmin && <Navbar calendlyUrl={calendlyUrl} />}
      <main>{children}</main>
      {!isAdmin && <Footer />}
    </>
  )
}
