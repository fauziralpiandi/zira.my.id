import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'
import validator from 'validator'

import { rateLimit } from 'app/lib/limiter'
import { validateEmail } from 'app/lib/validation'

const REQUEST_LIMIT = parseInt(process.env.REQUEST_LIMIT || '2', 10)
const TIME_WINDOW = parseInt(process.env.TIME_WINDOW || '86400000', 10)

export async function POST(request: Request) {
  const ip = (
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip') ||
    'unknown'
  ).toString()

  if (rateLimit(ip, REQUEST_LIMIT, TIME_WINDOW)) {
    return NextResponse.json(
      {
        message:
          'Too many subscription attempts, please try again after 24 hours.',
      },
      { status: 429 },
    )
  }

  try {
    const { email } = await request.json()

    if (!validateEmail(email)) {
      return NextResponse.json(
        { message: 'Invalid email address' },
        { status: 400 },
      )
    }

    const sanitizedEmail = validator.normalizeEmail(email.trim()) || ''

    const existingSubscription = await sql`
      SELECT * FROM subscriptions WHERE email = ${sanitizedEmail}
    `

    if (existingSubscription.rows.length > 0) {
      return NextResponse.json(
        { message: 'This email is already subscribed' },
        { status: 409 },
      )
    }

    await sql`
      INSERT INTO subscriptions (email) 
      VALUES (${sanitizedEmail})
    `

    return NextResponse.json(
      { message: 'Subscription successful!' },
      { status: 201 },
    )
  } catch (error) {
    console.error('Server error:', (error as Error).message)
    return NextResponse.json(
      { message: 'An unexpected error occurred, please try again later.' },
      { status: 500 },
    )
  }
}