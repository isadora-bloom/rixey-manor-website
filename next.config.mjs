/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  async redirects() {
    return [
      { source: '/post/the-dog-question-what-to-think-about-when-the-pup-gets-an-invite', destination: '/blog/bringing-your-dog-to-your-wedding', permanent: true },
      { source: '/post/wedding-things-that-might-not-be-worth-the-money', destination: '/blog/wedding-extras-not-worth-the-money', permanent: true },
      { source: '/post/why-every-month-is-a-good-month-to-get-married-in-virginia', destination: '/blog/best-month-to-get-married-in-virginia', permanent: true },
      { source: '/post/planning-a-rehearsal-dinner', destination: '/blog/rehearsal-dinner-planning', permanent: true },
      { source: '/post/wedding-stereotypes-and-how-to-avoid-becoming-one', destination: '/blog/wedding-stereotypes', permanent: true },
      { source: '/post/real-rixey-cynthia-and-her-catholic-wedding', destination: '/blog/catholic-church-ceremony-rixey-manor-reception', permanent: true },
      { source: '/post/real-rixey-janice-and-the-morning-of-the-wedding', destination: '/blog/morning-of-wedding-interview', permanent: true },
      { source: '/post/a-virginia-bride-danielle-and-pj', destination: '/blog/real-rixey-danielle-pj', permanent: true },
      { source: '/post/what-exclusive-use-really-means-and-why-it-s-worth-it', destination: '/blog/what-exclusive-use-actually-means', permanent: true },
      // Catch-all for any unmapped Wix post URLs
      { source: '/post/:slug*', destination: '/blog', permanent: true },
      // Wix page paths
      { source: '/the-venue', destination: '/venue', permanent: true },
      { source: '/wedding-gallery', destination: '/gallery', permanent: true },
      { source: '/pricing-1', destination: '/pricing', permanent: true },
      { source: '/single-post/:slug*', destination: '/blog/:slug*', permanent: true },
    ]
  },
}

export default nextConfig
