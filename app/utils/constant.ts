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
  desc: '\u2014and it kinda feels like I\u2019m trying to save some paper with what you\u2019re seeing right now; nothing\u2019s colored here\u2014 keep it simple, stupid!',
  locale: 'en-US',
  timeZone: 'Asia/Jakarta',
  verify: 'xuMdCxKom7IZ2YwCTzVJli3Sp_bvt-nofj8Q1iBjPf0',
}
