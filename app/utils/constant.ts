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
  desc: 'Do you really like bright objects at night? That\u2019s always the silliest question I\u2019ve ever heard. More annoying than those clouds that often block everything and force to hit me the hay early.',
  locale: 'en-US',
  timeZone: 'Asia/Jakarta',
  verify: 'xuMdCxKom7IZ2YwCTzVJli3Sp_bvt-nofj8Q1iBjPf0',
}
