export default async function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/',
    },
    sitemap: `https://zira.my.id/sitemap.xml`,
    host: 'zira.my.id',
  }
}