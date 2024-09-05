import postgres, { Sql } from 'postgres'

const postgresUrl: string = process.env.POSTGRES_URL || ''

if (!postgresUrl) {
  throw new Error('POSTGRES_URL is not defined')
}

const sqlInstance: Sql<any> = postgres(postgresUrl, {
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: true }
      : false,
})

export const sql = sqlInstance
