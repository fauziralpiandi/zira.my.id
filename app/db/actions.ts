'use server'

import { sql } from './postgres'
import { unstable_noStore as noStore } from 'next/cache'

export async function increment(slug: string): Promise<void> {
  noStore()
  try {
    await sql`
      INSERT INTO views (slug, count)
      VALUES (${slug}, 1)
      ON CONFLICT (slug)
      DO UPDATE SET count = views.count + 1
    `
  } catch (error) {
    console.error('Error incrementing views count:', error)
    throw new Error('Failed to increment views count')
  }
}
