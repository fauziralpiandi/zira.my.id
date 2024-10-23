import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'
import {
  rateLimit,
  REQUEST_LIMIT,
  TIME_WINDOW,
  sanitizeInput,
  validateEmail,
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
    const { name, email, message } = await request.json()

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ message: 'Invalid name' }, { status: 400 })
    }
    if (!validateEmail(email)) {
      return NextResponse.json(
        { message: 'Invalid email address' },
        { status: 400 },
      )
    }
    if (
      !message ||
      typeof message !== 'string' ||
      message.trim().length === 0
    ) {
      return NextResponse.json(
        { message: 'Message cannot be empty' },
        { status: 400 },
      )
    }

    const sanitizedName = sanitizeInput(name, 255)
    const sanitizedEmail = sanitizeInput(email.toLowerCase(), 255)
    const sanitizedMessage = sanitizeInput(message, 500)

    await sql`
      INSERT INTO submissions (name, email, message, ip, created_at) 
      VALUES (${sanitizedName}, ${sanitizedEmail}, ${sanitizedMessage}, ${ip}, NOW())
    `

    return NextResponse.json(
      { message: 'Submitted successfully!' },
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
