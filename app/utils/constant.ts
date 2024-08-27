// Interface for the site's data structure
interface Site {
  domain: string
  baseUrl: string
  author: string
  title: string
  desc: string
  locale: string
  timeZone: string
  verify: string
}

// Constant site information
export const site: Site = {
  domain: 'zira.my.id',
  baseUrl: 'https://zira.my.id',
  author: 'Fauzira Alpiandi',
  title: 'Fauzira Alpiandi',
  desc: 'It‘s a multifaceted creative with expertise in frontend development, artwork, and writing.',
  locale: 'en-US',
  timeZone: 'Asia/Jakarta',
  verify: 'xuMdCxKom7IZ2YwCTzVJli3Sp_bvt-nofj8Q1iBjPf0',
}
