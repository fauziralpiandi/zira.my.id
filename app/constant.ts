interface Site {
  host: string
  baseUrl: string
  title: string
  description: string
  locale: string
}

interface My {
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
  locale: 'en',
}

export const my: My = {
  headLine: 'frontendless',
  fullName: 'Fauzira Alpiandi',
  nickName: 'Zira',
}
