import createMDX from '@next/mdx'
import { NextConfig } from 'next'

const nextConfig: NextConfig = {
  pageExtensions: ['mdx', 'ts', 'tsx'],
}

const withMDX = createMDX({})

export default withMDX(nextConfig)
