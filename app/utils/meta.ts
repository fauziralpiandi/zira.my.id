import { site } from 'app/utils/constant'
import markdownIt from 'markdown-it'

const markdownParser = markdownIt()

export const meta = {
  getMeta: (text: string) => {
    const textPlain = markdownParser
      .render(text)
      .replace(/<[^>]*>/g, '')
      .trim()
    const wordsArray = textPlain.split(/\s+/)
    const numberOfWords = wordsArray.length
    const numberOfCharacters = textPlain.replace(/\s+/g, '').length
    const numberOfSentences = textPlain
      .split(/[.!?]+/)
      .filter(Boolean).length

    const wordsPerMin = 200
    const readTimeInMinutes = Math.ceil(numberOfWords / wordsPerMin)
    const readTime = `${readTimeInMinutes} ${readTimeInMinutes === 1 ? 'min' : 'mins'}`

    return {
      readTime,
      characters: numberOfCharacters,
      words: numberOfWords,
      sentences: numberOfSentences,
    }
  },
}

export const formatDate = (
  date: string,
  type: 'relative' | 'absolute' = 'relative',
): string => {
  const currentDate = new Date()
  const targetDate = new Date(date)

  if (isNaN(targetDate.getTime())) {
    throw new Error('Invalid date format!')
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
  if (hoursAgo < 24)
    return `${hoursAgo} hour${hoursAgo === 1 ? '' : 's'} ago`
  if (hoursAgo < 48) return `${timeString} (Yesterday)`
  if (daysAgo < 7)
    return `${fullDate} (${daysAgo} day${daysAgo === 1 ? '' : 's'} ago)`
  if (weeksAgo < 4)
    return `${fullDate} (${weeksAgo} week${weeksAgo === 1 ? '' : 's'} ago)`
  if (monthsAgo < 12)
    return `${fullDate} (${monthsAgo} month${monthsAgo === 1 ? '' : 's'} ago)`

  return `${fullDate} (${yearsAgo} year${yearsAgo === 1 ? '' : 's'} ago)`
}

export default formatDate
