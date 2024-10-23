import { site } from '~/siteConfig'

export function literalCount(text: string, wordsPerMinute = 150) {
  const cleanText = (input: string) =>
    input
      .replace(/[*_~`>#-]/g, '')
      .replace(/(.*?).*?/g, '$1')
      .replace(/!.*?.*?/g, '')
      .trim()

  const cleanedText = cleanText(text)

  if (!cleanedText) {
    return { readTime: '0 mins', words: 0 }
  }

  const wordsArray = cleanedText.split(/\s+/)
  const wordCount = wordsArray.length
  const readTimeInMinutes = Math.ceil(wordCount / wordsPerMinute)
  const readTime = `${readTimeInMinutes} ${readTimeInMinutes === 1 ? 'min' : 'mins'}`

  return { readTime, words: wordCount }
}

export function formatDate(
  date: string,
  type: 'relative' | 'absolute' = 'relative',
): string {
  const currentDate = new Date()
  const targetDate = new Date(date)

  if (isNaN(targetDate.getTime())) {
    return 'Invalid date format'
  }

  const timeDifference = currentDate.getTime() - targetDate.getTime()
  const minutesAgo = Math.floor(timeDifference / (1000 * 60))
  const hoursAgo = Math.floor(timeDifference / (1000 * 60 * 60))
  const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24))
  const weeksAgo = Math.floor(daysAgo / 7)
  const monthsAgo = Math.floor(daysAgo / 30)
  const yearsAgo = Math.floor(daysAgo / 365)

  const timeString = targetDate.toLocaleTimeString(site.locale, {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: site.timeZone,
  })
  const fullDate = targetDate.toLocaleString(site.locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: site.timeZone,
  })

  if (type === 'absolute') {
    return targetDate.toLocaleDateString(site.locale, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      timeZone: site.timeZone,
    })
  }

  if (minutesAgo < 60) return 'Just now!'
  if (hoursAgo < 24) return `${hoursAgo} hour${hoursAgo === 1 ? '' : 's'} ago`
  if (hoursAgo < 48) return `${timeString} (Yesterday)`
  if (daysAgo < 7)
    return `${fullDate} (${daysAgo} day${daysAgo === 1 ? '' : 's'} ago)`
  if (weeksAgo < 4)
    return `${fullDate} (${weeksAgo} week${weeksAgo === 1 ? '' : 's'} ago)`
  if (monthsAgo < 12)
    return `${fullDate} (${monthsAgo} month${monthsAgo === 1 ? '' : 's'} ago)`

  return `${fullDate} (${yearsAgo} year${yearsAgo === 1 ? '' : 's'} ago)`
}
