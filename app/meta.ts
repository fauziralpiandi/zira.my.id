interface Site {
  host: string
  baseUrl: string
  title: string
  description: string
  locales: string[]
}

interface My {
  fullName: string
  alias: string
  role: string
}

export const site: Site = {
  host: 'zira.my.id',
  baseUrl: 'https://zira.my.id',
  title: 'Fauzira Alpiandi',
  description:
    'Hey there! I\u2019m a frontendless exploring the exciting world of React!',
  locales: ['en', 'id'],
}

export const my: My = {
  fullName: 'Fauzira Alpiandi',
  alias: 'Zira',
  role: 'Frontendless',
}
