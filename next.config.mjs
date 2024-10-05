import postgres from 'postgres'
import createMDX from '@next/mdx';

export const sql = postgres(process.env.POSTGRES_URL, {
  ssl: process.env.NODE_ENV === 'production' ? 'require' : 'allow',
})

if (!process.env.POSTGRES_URL) {
  console.warn('POSTGRES_URL is not defined')
}

const nextConfig = {
  pageExtensions: ['mdx', 'ts', 'tsx'],
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
