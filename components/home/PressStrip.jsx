import Image from 'next/image'
import FadeUp from '@/components/ui/FadeUp'

const defaultPress = [
  {
    id: 'cnn',
    publication: 'CNN',
    logo_url: '/assets/press/cnn.svg',
    logo_alt: 'CNN',
    url: 'https://edition.cnn.com/2016/03/11/living/madeline-stuart-wedding-photo-shoot-feat',
  },
  {
    id: 'people',
    publication: 'People',
    logo_url: null,
    logo_alt: 'People',
    url: 'https://people.com',
  },
  {
    id: 'huffpost',
    publication: 'HuffPost',
    logo_url: '/assets/press/huffpost.svg',
    logo_alt: 'HuffPost',
    url: 'https://www.huffpost.com/entry/madeline-stuart-model-with-down-syndrome-stuns-in-romantic-bridal-shoot_n_56e32204e4b0b25c9181e562',
  },
  {
    id: 'today',
    publication: 'TODAY',
    logo_url: null,
    logo_alt: 'TODAY',
    url: 'https://www.today.com/style/madeline-stuart-model-down-syndrome-stuns-photos-wedding-shoot-t79461',
  },
  {
    id: 'refinery29',
    publication: 'Refinery29',
    logo_url: null,
    logo_alt: 'Refinery29',
    url: 'https://www.refinery29.com/en-us/2016/03/105670/madeline-stuart-bridal-shoot',
  },
  {
    id: 'washingtonian',
    publication: 'Washingtonian',
    logo_url: null,
    logo_alt: 'Washingtonian',
    url: 'https://www.washingtonian.com',
  },
  {
    id: 'martha-stewart',
    publication: 'Martha Stewart Weddings',
    logo_url: null,
    logo_alt: 'Martha Stewart Weddings',
    url: 'https://www.marthastewart.com/weddings',
  },
  {
    id: 'style-me-pretty',
    publication: 'Style Me Pretty',
    logo_url: null,
    logo_alt: 'Style Me Pretty',
    url: 'https://www.stylemepretty.com',
  },
  {
    id: 'the-knot',
    publication: 'The Knot',
    logo_url: null,
    logo_alt: 'The Knot Hall of Fame',
    url: 'https://www.theknot.com/marketplace/rixey-manor',
  },
  {
    id: 'weddingwire',
    publication: 'WeddingWire',
    logo_url: null,
    logo_alt: 'WeddingWire',
    url: 'https://www.weddingwire.com',
  },
]

function PressItem({ item }) {
  const inner = item.logo_url ? (
    <Image
      src={item.logo_url}
      alt={item.logo_alt}
      width={120}
      height={32}
      className="h-7 w-auto object-contain grayscale"
    />
  ) : (
    <span
      className="text-[11px] tracking-[0.18em] uppercase text-[var(--ink)]"
      style={{ fontFamily: 'var(--font-ui)' }}
    >
      {item.publication}
    </span>
  )

  if (item.url) {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="opacity-40 hover:opacity-70 transition-opacity duration-200"
        aria-label={`As featured in ${item.publication}`}
      >
        {inner}
      </a>
    )
  }

  return <div className="opacity-40">{inner}</div>
}

export default function PressStrip({ press = [] }) {
  const items = press.length > 0 ? press : defaultPress

  return (
    <section className="section-warm-white py-12 px-6 lg:px-10 border-t border-[var(--border)]">
      <div className="max-w-7xl mx-auto">
        <FadeUp>
          <p className="eyebrow text-center mb-8">As featured in</p>
          <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-6 lg:gap-x-14">
            {items.map(item => (
              <PressItem key={item.id} item={item} />
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
