import Image from 'next/image'
import FadeUp from '@/components/ui/FadeUp'

// Shared captioned figure for the history sections. Pulled out of
// ManorHistory when the page split into a love-story section and a separate
// honest-history section, both of which need it.
export default function Figure({ image, caption, aspect = 'aspect-[3/2]' }) {
  if (!image) return null
  return (
    <FadeUp>
      <figure className="my-4">
        <div className={`relative w-full ${aspect} bg-[var(--sage-light)] overflow-hidden`}>
          <Image
            src={image.url}
            alt={image.alt_text || caption || 'Historic photograph of Rixey Manor'}
            fill
            className="object-cover"
            style={{ objectPosition: image.object_position || 'center center' }}
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
        {caption && (
          <figcaption
            className="mt-3 text-[12px] text-[var(--ink-light)]"
            style={{ fontFamily: 'var(--font-ui)' }}
          >
            {caption}
          </figcaption>
        )}
      </figure>
    </FadeUp>
  )
}
