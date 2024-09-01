import postgres from 'postgres'

const postgresUrl = process.env.POSTGRES_URL
if (!postgresUrl) {
  throw new Error('POSTGRES_URL is not defined')
}

export const sql = postgres(postgresUrl, {
  ssl: { rejectUnauthorized: true },
})
