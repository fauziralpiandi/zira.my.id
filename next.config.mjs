import postgres from 'postgres';

export const sql = postgres(process.env.POSTGRES_URL, {
  ssl: 'allow',
});

const nextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;