const reviewSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Rixey Manor Wedding Reviews',
  itemListElement: [
    {
      '@type': 'Review',
      position: 1,
      author: { '@type': 'Person', name: 'Caitlin' },
      reviewBody: "The venue is breathtaking both in person and in our pictures. Our guests still say it was the best wedding and venue they've seen. If you're anxious about planning and you want a flawless wedding experience, book Rixey Manor. It's the best decision you'll make.",
      reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
      itemReviewed: { '@type': 'WeddingVenue', name: 'Rixey Manor' },
    },
    {
      '@type': 'Review',
      position: 2,
      author: { '@type': 'Person', name: 'Sarai' },
      reviewBody: "The venue itself is gorgeous but the team at Rixey Manor is something so special. These people make dreams come true and my husband and I, along with our families, are so grateful for them.",
      reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
      itemReviewed: { '@type': 'WeddingVenue', name: 'Rixey Manor' },
    },
    {
      '@type': 'Review',
      position: 3,
      author: { '@type': 'Person', name: 'Apeksha' },
      reviewBody: "We recently had our Indian-American fusion wedding at Rixey Manor, and it was beyond perfect. From the stunning grounds to the exceptional service — and even a double rainbow — every detail was beautifully executed.",
      reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
      itemReviewed: { '@type': 'WeddingVenue', name: 'Rixey Manor' },
    },
    {
      '@type': 'Review',
      position: 4,
      author: { '@type': 'Person', name: 'Lauren' },
      reviewBody: "I can't say enough good things about Isadora and the team — do yourself a favour and go look at this place. So many of our guests (and we made them all drive from New Jersey) were so impressed and complimentary.",
      reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
      itemReviewed: { '@type': 'WeddingVenue', name: 'Rixey Manor' },
    },
  ],
}

const videoSchema = [
  {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: 'First Dance Lift — Rixey Manor Wedding',
    description: 'A first dance lift captured on site at Rixey Manor wedding venue in Rixeyville, Virginia.',
    thumbnailUrl: 'https://www.rixeymanor.com/assets/hero-main.webp',
    uploadDate: '2025-01-01',
    publisher: { '@type': 'Organization', name: 'Rixey Manor', url: 'https://www.rixeymanor.com' },
    url: 'https://www.tiktok.com/@rixeymanorteam/video/7565507952648424718',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: 'Bride Wedding Planning Vlog — Rixey Manor',
    description: 'A 2027 bride vlogs about planning her wedding at Rixey Manor and the experience working with the team.',
    thumbnailUrl: 'https://www.rixeymanor.com/assets/hero-main.webp',
    uploadDate: '2025-01-01',
    publisher: { '@type': 'Organization', name: 'Rixey Manor', url: 'https://www.rixeymanor.com' },
    url: 'https://www.tiktok.com/@tinivault/video/7613243160164191519',
  },
]

export default function SchemaMarkup() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WeddingVenue',
    name: 'Rixey Manor',
    url: 'https://www.rixeymanor.com',
    telephone: '+15402124545',
    email: 'info@rixeymanor.com',
    description: 'A historic 1801 estate wedding venue on 30 acres in Rixeyville, Culpeper County, Northern Virginia. Exclusive use, one wedding per weekend, up to 250 guests, full weekend access with overnight lodging.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '9155 Pleasant Hill Lane',
      addressLocality: 'Rixeyville',
      addressRegion: 'VA',
      postalCode: '22737',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 38.5612,
      longitude: -77.9483,
    },
    image: [
      'https://www.rixeymanor.com/assets/hero-main.webp',
    ],
    sameAs: [
      'https://www.instagram.com/rixeymanor',
      'https://www.facebook.com/rixeymanor',
      'https://www.theknot.com/marketplace/rixey-manor',
      'https://www.weddingwire.com/biz/rixey-manor-rixeyville/ce916f124034d2e2.html',
    ],
    priceRange: '$$$',
    currenciesAccepted: 'USD',
    openingHoursSpecification: { '@type': 'OpeningHoursSpecification', description: 'By appointment' },
    maximumAttendeeCapacity: 250,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: '220',
      bestRating: '5',
      worstRating: '1',
      url: 'https://www.theknot.com/marketplace/rixey-manor',
    },
    award: 'The Knot Hall of Fame',
    founder: {
      '@type': 'Person',
      name: 'Isadora Martin-Dye',
    },
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'Exclusive use', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Overnight lodging', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Pet friendly', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'BYOB permitted', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'ADA accessible (main floor)', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Military discount', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'No required vendors', value: true },
    ],
    foundingDate: '2014',
    yearBuilt: '1801',
    numberOfRooms: 5,
    tourBookingPage: 'https://www.rixeymanor.com/pricing#book-tour',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Reservations',
      telephone: '+15402124545',
      url: 'https://www.rixeymanor.com/pricing#book-tour',
      availableLanguage: 'en',
    },
    priceSpecification: [
      {
        '@type': 'PriceSpecification',
        priceCurrency: 'USD',
        price: '950',
        name: 'Elopement package (up to 12 guests)',
      },
      {
        '@type': 'PriceSpecification',
        priceCurrency: 'USD',
        price: '6000',
        name: 'One-day event (weekday)',
      },
      {
        '@type': 'PriceSpecification',
        priceCurrency: 'USD',
        price: '10000',
        name: 'Full weekend (starting price)',
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
      />
      {videoSchema.map((vs, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(vs) }}
        />
      ))}
    </>
  )
}
