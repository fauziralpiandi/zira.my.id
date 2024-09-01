import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

const REQUEST_LIMIT = parseInt(process.env.REQUEST_LIMIT || '2', 10)
const TIME_WINDOW = parseInt(process.env.TIME_WINDOW || '86400000', 10)

const requestCounts = new Map<
  string,
  { count: number; firstRequestTime: number }
>()

const validateEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)

const validateFeedback = (
  name: string,
  email: string,
  message: string,
): string | null => {
  if (!name.trim()) return 'Name is required.'
  if (!validateEmail(email)) return 'Invalid email address.'
  if (message.trim().length < 50 || message.length > 500)
    return 'Message must be between 50 and 500 characters long.'
  return null
}

const rateLimit = (ip: string): boolean => {
  const currentTime = Date.now()
  const requestData = requestCounts.get(ip) || {
    count: 0,
    firstRequestTime: currentTime,
  }

  if (currentTime - requestData.firstRequestTime < TIME_WINDOW) {
    requestData.count += 1
  } else {
    requestData.count = 1
    requestData.firstRequestTime = currentTime
  }

  requestCounts.set(ip, requestData)

  return requestData.count > REQUEST_LIMIT
}

export async function POST(request: Request) {
  const ip =
    request.headers.get('x-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip') ||
    'unknown'

  if (rateLimit(ip)) {
    return NextResponse.json(
      {
        message:
          'Too many feedback submissions, please try again after 24 hours.',
      },
      { status: 429 },
    )
  }

  try {
    const { name, email, message } = await request.json()

    const validationError = validateFeedback(name, email, message)
    if (validationError) {
      return NextResponse.json(
        { message: validationError },
        { status: 400 },
      )
    }

    const sanitizedName = name.trim().substring(0, 255)
    const sanitizedEmail = email.trim().substring(0, 255)
    const sanitizedMessage = message.trim().substring(0, 500)

    await sql`
      INSERT INTO feedbacks (name, email, message) 
      VALUES (${sanitizedName}, ${sanitizedEmail}, ${sanitizedMessage})
    `

    return NextResponse.json(
      { message: 'Feedback submitted successfully!' },
      { status: 201 },
    )
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { message: 'An unexpected error occurred. Please try again later.' },
      { status: 500 },
    )
  }
}
