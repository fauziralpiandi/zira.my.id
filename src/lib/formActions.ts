type RequestData = {
  count: number
  firstRequestTime: number
}

const requestCounts = new Map<string, RequestData>()

export const REQUEST_LIMIT = parseInt(process.env.REQUEST_LIMIT || '3', 10)
export const TIME_WINDOW = parseInt(process.env.TIME_WINDOW || '86400000', 10)

export function rateLimit(
  ip: string,
  REQUEST_LIMIT: number,
  TIME_WINDOW: number,
): boolean {
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

export function validateEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function sanitizeInput(input: string, maxLength: number) {
  return input
    .trim()
    .substring(0, maxLength)
    .replace(/<[^>]+>/g, '')
}

export function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip') ||
    'unknown'
  ).toString()
}
