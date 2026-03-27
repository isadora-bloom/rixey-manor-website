export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/portal/', '/admin/'],
    },
    sitemap: 'https://www.rixeymanor.com/sitemap.xml',
    host: 'https://www.rixeymanor.com',
  }
}
