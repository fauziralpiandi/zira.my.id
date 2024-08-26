import { site } from 'app/utils/config'
import MarkdownIt from 'markdown-it'

const wordsPerMin = 250
const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
})

interface MetaData {
  readTime: string
  characters: number
  words: number
  sentences: number
}

export const meta = {
  getMeta: (text: string): MetaData => {
    // Convert Markdown to HTML
    const htmlText = md.render(text)

    // Get plain text
    const plainText = htmlText
      .replace(/<\/?[^>]+(>|$)/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

    // Splitting text into words
    const wordsArray = plainText
      .split(/\s+/)
      .filter((word: string) => word.length > 0 && word.match(/^\w+$/)) // Filter only valid words
    const numberOfWords = wordsArray.length

    // Counting characters (excluding spaces)
    const numberOfCharacters = plainText.replace(/\s+/g, '').length

    // Counting sentences with improved regex
    const numberOfSentences = plainText
      .split(/(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?|!)\s/)
      .filter((sentence: string) => sentence.trim().length > 0).length

    // Calculating read time
    const minutes = Math.ceil(numberOfWords / wordsPerMin)
    const readTime = `${minutes} ${minutes === 1 ? 'min' : 'mins'}`

    return {
      readTime,
      characters: numberOfCharacters,
      words: numberOfWords,
      sentences: numberOfSentences,
    }
  },
}

// Date formatting because time is precious!
export const formatDate = (
  date: string,
  type: 'relative' | 'absolute' = 'relative',
): string => {
  const currentDate = new Date()
  const targetDate = new Date(date)

  // No time travelers allowed here!
  if (isNaN(targetDate.getTime())) {
    throw new Error('Invalid date format! Did you time travel?')
  }

  // Time difference calculations, like a math whiz!
  const timeDifference = currentDate.getTime() - targetDate.getTime()
  const minutesAgo = Math.floor(timeDifference / (1000 * 60))
  const hoursAgo = Math.floor(timeDifference / (1000 * 60 * 60))
  const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24))
  const weeksAgo = Math.floor(daysAgo / 7)
  const monthsAgo = Math.floor(daysAgo / 30)
  const yearsAgo = Math.floor(daysAgo / 365)

  // Format the date nicely
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

  // Relative time, for that friendly vibe
  if (minutesAgo < 1) return 'Just now, like, seriously!'
  if (minutesAgo < 60)
    return `${minutesAgo} min${minutesAgo === 1 ? '' : 's'} ago`
  if (hoursAgo < 24)
    return `${hoursAgo} hour${hoursAgo === 1 ? '' : 's'} ago`
  if (hoursAgo < 48) return `${timeString} (Yesterday, in case you forgot)`
  if (daysAgo < 7)
    return `${fullDate} (${daysAgo} day${daysAgo === 1 ? '' : 's'} ago)`
  if (weeksAgo < 4)
    return `${fullDate} (${weeksAgo} week${weeksAgo === 1 ? '' : 's'} ago)`
  if (monthsAgo < 12)
    return `${fullDate} (${monthsAgo} month${monthsAgo === 1 ? '' : 's'} ago)`

  return `${fullDate} (${yearsAgo} year${yearsAgo === 1 ? '' : 's'} ago)`
}

export default formatDate
