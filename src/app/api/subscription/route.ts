import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'
import {
  rateLimit,
  REQUEST_LIMIT,
  TIME_WINDOW,
  validateEmail,
  sanitizeInput,
  getClientIp,
} from '~/formActions'

export async function POST(request: Request) {
  const ip = getClientIp(request)
  console.log(`Request from IP: ${ip}`)

  if (rateLimit(ip, REQUEST_LIMIT, TIME_WINDOW)) {
    return NextResponse.json(
      { message: 'Too many attempts, please try again.' },
      { status: 429 },
    )
  }

  if (!process.env.POSTGRES_URL) {
    return NextResponse.json(
      { message: 'Database connection is not configured' },
      { status: 500 },
    )
  }

  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { message: 'Invalid email address' },
        { status: 400 },
      )
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 },
      )
    }

    const sanitizedEmail = sanitizeInput(email, 255)

    const existingSubscription = await sql`
      SELECT * FROM subscriptions WHERE email = ${sanitizedEmail}
    `

    if (existingSubscription.rows.length > 0) {
      return NextResponse.json(
        { message: 'This email is already subscribed.' },
        { status: 409 },
      )
    }

    await sql`
      INSERT INTO subscriptions (email, ip, created_at) 
      VALUES (${sanitizedEmail}, ${ip}, NOW())
    `

    return NextResponse.json(
      { message: 'Subscription successful!' },
      { status: 201 },
    )
  } catch (error) {
    console.error(`Server error from IP ${ip}:`, (error as Error).message)
    return NextResponse.json(
      { message: 'An unexpected error occurred, please try again later.' },
      { status: 500 },
    )
  }
}
