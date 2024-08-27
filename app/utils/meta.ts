import { site } from 'app/utils/constant'
import markdownIt from 'markdown-it'

export const meta = {
  getMeta: (text: string) => {
    const filter = markdownIt()
    // Turning Markdown into plain text, like magic, but less exciting!
    const textPlain = filter.render(text).replace(/<[^>]*>/g, '') // Because HTML tags are so last season

    // Trim that text, no one likes extra spaces hanging around.
    const textTrimmed = textPlain.trim()

    // Splitting text into words, we can't just guess!
    const wordsArray = textTrimmed.split(/\s+/)
    const numberOfWords = wordsArray.length

    // Counting characters, one by one, we're dedicated like that.
    const numberOfCharacters = textTrimmed.replace(/\s+/g, '').length

    // Counting sentences, periods deserve respect too!
    const numberOfSentences = textTrimmed
      .split(/[.!?]+/)
      .filter(Boolean).length

    // Calculating reading time, because nobody has time to actually read!
    const wordsPerMin = 200
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
  if (minutesAgo < 1) return 'Just now!'
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
