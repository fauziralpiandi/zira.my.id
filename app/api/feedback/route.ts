import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

const REQUEST_LIMIT = 3
const TIME_WINDOW = 24 * 60 * 60 * 1000

const requestCounts = new Map<
  string,
  { count: number; firstRequestTime: number }
>()

const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
  return re.test(email)
}

const validateFeedback = (
  name: string,
  email: string,
  message: string,
) => {
  if (!name || name.trim().length === 0) {
    return 'Name is required.'
  }
  if (!email || !validateEmail(email)) {
    return 'Invalid email address.'
  }
  if (!message || message.trim().length < 50 || message.length > 500) {
    return 'Message must be between 50 and 500 characters long.'
  }
  return null
}

const rateLimit = (ip: string) => {
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

  if (requestData.count > REQUEST_LIMIT) {
    return true
  }
  return false
}

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
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

    const sanitizedName = name.trim()
    const sanitizedEmail = email.trim()
    const sanitizedMessage = message.trim()

    await sql`
      INSERT INTO feedbacks (name, email, message) VALUES (${sanitizedName}, ${sanitizedEmail}, ${sanitizedMessage})
    `

    return NextResponse.json(
      { message: 'Feedback submitted successfully!' },
      { status: 201 },
    )
  } catch (error) {
    console.error('Oops!', error)
    return NextResponse.json(
      { message: 'Feedback submission failed due to a server error.' },
      { status: 500 },
    )
  }
}
