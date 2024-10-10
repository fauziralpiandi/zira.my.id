interface Site {
  host: string
  baseUrl: string
  title: string
  description: string
  keywords: string[]
  locale: string
}

interface My {
  tagLine: string
  headLine: string
  fullName: string
  nickName: string
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

export const my: My = {
  tagLine: 'fauziralpiandi',
  headLine: 'frontendless',
  fullName: 'Fauzira Alpiandi',
  nickName: 'Zira',
}
