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
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
