import markdownIt from 'markdown-it'

const markdownParser = markdownIt()

const literalMeta = {
  getCounts: (text: string) => {
    const textPlain = markdownParser
      .render(text)
      .replace(/<[^>]*>/g, '')
      .trim()
    const wordsArray = textPlain.split(/\s+/)
    const wordCount = wordsArray.length
    const wordPerMin = 100
    const readTimeInMinutes = Math.ceil(wordCount / wordPerMin)
    const readTime = `${readTimeInMinutes} ${readTimeInMinutes === 1 ? 'min' : 'mins'}`

    return {
      readTime,
      words: wordCount,
    }
  },
}

export default literalMeta
