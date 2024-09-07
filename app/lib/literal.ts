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
    const characterCount = textPlain.replace(/\s+/g, '').length
    const sentenceCount = textPlain.split(/[.!?]+/).filter(Boolean).length

    const wordPerMin = 100
    const readTimeInMinutes = Math.ceil(wordCount / wordPerMin)
    const readTime = `${readTimeInMinutes} ${readTimeInMinutes === 1 ? 'min' : 'mins'}`

    return {
      readTime,
      characters: characterCount,
      words: wordCount,
      sentences: sentenceCount,
    }
  },
}

export default literalMeta
