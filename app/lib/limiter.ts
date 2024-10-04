interface RequestDataProps {
  count: number
  firstRequestTime: number
}

const requestCounts = new Map<string, RequestDataProps>()

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
