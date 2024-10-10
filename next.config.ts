import createMDX from '@next/mdx'
import { NextConfig } from 'next'

const nextConfig: NextConfig = {
  pageExtensions: ['mdx', 'ts', 'tsx'],
  experimental: {
    mdxRs: true,
  },
}

const withMDX = createMDX({})

export default withMDX(nextConfig)
