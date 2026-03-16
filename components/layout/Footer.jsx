import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer
      className="border-t border-[var(--border)] bg-[var(--cream)] py-16 px-6 lg:px-10"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">

        {/* Brand */}
        <div>
          <Link href="/" className="no-underline inline-block mb-4">
            <Image
              src="/assets/rixey-manor-logo.png"
              alt="Rixey Manor"
              width={160}
              height={133}
              className="h-20 w-auto"
            />
          </Link>
          <p className="body-copy text-[14px] leading-relaxed max-w-xs">
            Historic estate weddings in Virginia, since 2014.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <p className="eyebrow mb-5">Explore</p>
          <nav className="flex flex-col gap-3">
            {[
              { label: 'The Venue', href: '/venue' },
              { label: 'Pricing', href: '/pricing' },
              { label: 'Gallery', href: '/gallery' },
              { label: 'FAQs', href: '/faq' },
              { label: 'Blog', href: '/blog' },
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-link"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Contact */}
        <div>
          <p className="eyebrow mb-5">Get in touch</p>
          <div className="flex flex-col gap-3">
            <a
              href="tel:+15402124545"
              className="body-copy text-[15px] text-[var(--ink-mid)] hover:text-[var(--ink)] transition-colors no-underline"
            >
              (540) 212-4545
            </a>
            <p
              className="text-[11px] tracking-widest uppercase text-[var(--ink-light)] -mt-2"
              style={{ fontFamily: 'var(--font-ui)' }}
            >
              Yes, you can text.
            </p>
            <a
              href="mailto:info@rixeymanor.com"
              className="body-copy text-[15px] text-[var(--ink-mid)] hover:text-[var(--ink)] transition-colors no-underline"
            >
              info@rixeymanor.com
            </a>
            <address
              className="not-italic text-[13px] text-[var(--ink-light)] mt-2"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              9155 Pleasant Hill Lane<br />
              Rixeyville, VA 22737
            </address>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <p
          className="text-[12px] text-[var(--ink-light)]"
          style={{ fontFamily: 'var(--font-ui)' }}
        >
          © {new Date().getFullYear()} Rixey Manor. Est. 1801.
        </p>
        <div className="flex gap-6 items-center">
          <a
            href="https://www.instagram.com/rixeymanor"
            target="_blank"
            rel="noopener noreferrer"
            className="text-link"
            aria-label="Rixey Manor on Instagram"
          >
            Instagram
          </a>
          <a
            href="https://www.facebook.com/rixeymanor"
            target="_blank"
            rel="noopener noreferrer"
            className="text-link"
            aria-label="Rixey Manor on Facebook"
          >
            Facebook
          </a>
          <Link href="/faq" className="text-link">FAQ</Link>
        </div>
      </div>
    </footer>
  )
}
