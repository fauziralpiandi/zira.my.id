'use server'

import { sql } from './postgres'
import { unstable_noStore as noStore } from 'next/cache'

interface ViewCount {
  slug: string
  count: number
}

export async function getBlogViews(): Promise<number> {
  if (!process.env.POSTGRES_URL) {
    throw new Error('Postgres URL is not defined')
  }

  noStore()
  try {
    const views: { count: number }[] = await sql`
      SELECT count FROM views
    `

    return views.reduce((acc, curr) => acc + curr.count, 0)
  } catch (error) {
    console.error('Error fetching post views:', error)
    throw new Error('Failed to fetch post views')
  }
}

export async function getViewsCount(): Promise<ViewCount[]> {
  if (!process.env.POSTGRES_URL) {
    throw new Error('Postgres URL is not defined')
  }

  noStore()
  try {
    const viewCounts: ViewCount[] = await sql`
      SELECT slug, count FROM views
    `
    return viewCounts
  } catch (error) {
    console.error('Error fetching views count:', error)
    throw new Error('Failed to fetch views count')
  }
}
