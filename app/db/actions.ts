'use server'

import { sql } from './postgres'
import { unstable_noStore as noStore } from 'next/cache'
import { ViewsCountProps } from 'app/lib/types'

const POSTGRES_URL = process.env.POSTGRES_URL

if (!POSTGRES_URL) {
  throw new Error('Postgres URL is not defined')
}

export async function increment(slug: string): Promise<ViewsCountProps> {
  noStore()
  try {
    const [updatedViewRow] = await sql`
      INSERT INTO views (slug, count)
      VALUES (${slug}, 1)
      ON CONFLICT (slug)
      DO UPDATE SET count = views.count + 1
      RETURNING slug, count
    `
    const updatedView: ViewsCountProps = {
      slug: updatedViewRow.slug,
      count: updatedViewRow.count,
    }
    return updatedView
  } catch (error: any) {
    console.error('Error incrementing views count:', error)
    throw new Error('Failed to increment views count')
  }
}

export async function getPostsViews(): Promise<number> {
  noStore()
  try {
    const [totalView] = await sql`
      SELECT SUM(count) as total FROM views
    `
    return totalView.total || 0
  } catch (error) {
    console.error('Error fetching post views:', error)
    throw new Error('Failed to fetch post views')
  }
}

export async function getViewsCount(): Promise<ViewsCountProps[]> {
  noStore()
  try {
    const viewCounts: ViewsCountProps[] = await sql`
      SELECT slug, count FROM views
    `
    return viewCounts
  } catch (error) {
    console.error('Error fetching views count:', error)
    throw new Error('Failed to fetch views count')
  }
}
