import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'
import { rateLimit } from 'app/lib/limiter'
import { validateFeedback } from 'app/lib/validation'
import validator from 'validator'

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
          'Too many submission attempts, please try again after 24 hours.',
      },
      { status: 429 },
    )
  }

  try {
    const { name, email, message } = await request.json()

    const validationError = validateFeedback(name, email, message)
    if (validationError) {
      return NextResponse.json({ message: validationError }, { status: 400 })
    }

    const sanitizedName = validator.escape(name.trim().substring(0, 255))
    const sanitizedEmail = validator.normalizeEmail(email.trim()) || ''
    const sanitizedMessage = validator.escape(message.trim().substring(0, 500))

    await sql`
      INSERT INTO feedbacks (name, email, message) 
      VALUES (${sanitizedName}, ${sanitizedEmail}, ${sanitizedMessage})
    `

    return NextResponse.json(
      { message: 'Submitted successfully!' },
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
