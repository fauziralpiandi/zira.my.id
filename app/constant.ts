interface My {
  greetings: string
  tagLine: string
  headLine: string
  fullName: string
  nickName: string
}

interface Site {
  host: string
  baseUrl: string
  title: string
  description: string
  keywords?: string[]
  locale: string
}

interface Verify {
  google?: string
  yandex?: string
  bing?: string
}

export const my: My = {
  greetings: '^-',
  tagLine: 'fauziralpiandi',
  headLine: 'frontendless',
  fullName: 'Fauzira Alpiandi',
  nickName: 'Zira',
}

export const site: Site = {
  host: 'zira.my.id',
  baseUrl: 'https://zira.my.id',
  title: 'Fauzira Alpiandi',
  description:
    'Hey there! I\u2019m a frontendless exploring the exciting world of React!',
  keywords: ['zira', 'fauzira', 'alpiandi', 'frontendless'],
  locale: 'en',
}

export const verify: Verify = {
  google: 'xuMdCxKom7IZ2YwCTzVJli3Sp_bvt-nofj8Q1iBjPf0',
}
