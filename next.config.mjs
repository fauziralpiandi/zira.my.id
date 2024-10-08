import createMDX from '@next/mdx'

const nextConfig = {
  pageExtensions: ['mdx', 'ts', 'tsx'],
  experimental: {
    mdxRs: true,
  },
}

const withMDX = createMDX({})

export default withMDX(nextConfig)