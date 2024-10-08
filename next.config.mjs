import createMDX from '@next/mdx'

const nextConfig = {
  pageExtensions: ['mdx', 'ts', 'tsx'],
}

const withMDX = createMDX({})

export default withMDX(nextConfig)