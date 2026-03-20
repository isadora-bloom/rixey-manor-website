import { supabaseServer } from '@/lib/supabaseServer'
import FadeUp from '@/components/ui/FadeUp'
import GalleryGrid from '@/components/gallery/GalleryGrid'
import { getOgImage } from '@/lib/getPageSeo'
const supabase = supabaseServer()

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const ogImage = await getOgImage('gallery')
  return {
    title: { absolute: 'Wedding Gallery — Real Couples at Rixey Manor' },
    description: 'Photos from real Rixey weddings. See the ceremony site, rooftop, ballroom, terrace and overnight rooms as they actually look.',
    alternates: { canonical: 'https://www.rixeymanor.com/gallery' },
    openGraph: {
      title: 'Wedding Gallery — Real Couples at Rixey Manor',
      description: 'Photos from real Rixey weddings. See the ceremony site, rooftop, ballroom, terrace and overnight rooms as they actually look.',
      url: 'https://www.rixeymanor.com/gallery',
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630 }] }),
    },
  }
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Rixey Manor', item: 'https://www.rixeymanor.com' },
    { '@type': 'ListItem', position: 2, name: 'Gallery', item: 'https://www.rixeymanor.com/gallery' },
  ],
}

async function getGalleryImages() {
  const { data } = await supabase
    .from('media')
    .select('*')
    .eq('category', 'gallery')
    .eq('active', true)
    .order('sort_order')
  return data || []
}

export default async function GalleryPage() {
  const images = await getGalleryImages()

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Hero */}
      <section className="bg-[var(--cream)] pt-40 pb-16 lg:pt-48 lg:pb-20 px-6 lg:px-10">
        <div className="max-w-3xl">
          <FadeUp>
            <p className="eyebrow mb-6">The Gallery</p>
            <h1
              className="text-[42px] lg:text-[58px] leading-[1.05] text-[var(--ink)] mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Real weddings.<br />
              <em>Real couples.</em>
            </h1>
            <p className="body-copy max-w-xl">
              Every photo here is from an actual Rixey wedding.
              Browse by season, space, or mood.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-[var(--warm-white)] py-16 lg:py-24 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          {images.length > 0 ? (
            <GalleryGrid images={images} />
          ) : (
            <FadeUp>
              <p className="body-copy text-[var(--ink-light)]">
                Gallery coming soon. In the meantime,{' '}
                <a href="https://www.theknot.com/marketplace/rixey-manor" className="text-link-forest" target="_blank" rel="noopener noreferrer">
                  see our reviews and photos on The Knot
                </a>.
              </p>
            </FadeUp>
          )}
        </div>
      </section>
    </>
  )
}
