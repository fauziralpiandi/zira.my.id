import fs from 'fs/promises'
import path from 'path'

// Define the structure for blog post metadata.
// Because we want our blog posts to be as well-organized as a librarian's bookshelf.
type Metadata = {
  title: string
  summary: string
  author: string
  publishedAt: string
  image: string
}

// Extract the frontmatter from the Markdown file content.
// If there's no frontmatter, we throw an error—
// because a blog post without metadata is like a movie without credits.
function parseFrontmatter(fileContent: string): {
  metadata: Metadata
  content: string
} {
  const frontmatterRegex = /---\s*([\s\S]*?)\s*---/
  const match = frontmatterRegex.exec(fileContent)

  if (!match) {
    throw new Error(
      'Frontmatter not found. Did you forget the triple dashes? Or did they escape to a better life?',
    )
  }

  const frontMatterBlock = match[1]
  const content = fileContent.replace(frontmatterRegex, '').trim()
  const metadata: Partial<Metadata> = {}

  if (frontMatterBlock) {
    frontMatterBlock
      .trim()
      .split('\n')
      .forEach((line) => {
        const [key, ...valueArr] = line.split(': ')

        // Make sure the key is not undefined—because a key without a value is like a door without a lock.
        if (key) {
          const value = valueArr
            .join(': ')
            .trim()
            .replace(/^['"](.*)['"]$/, '$1')
          metadata[key.trim() as keyof Metadata] = value
        } else {
          // Handle the condition when key is undefined. We don't want mysteries here.
          console.warn('Key is undefined for line:', line)
        }
      })
  } else {
    // Handle the condition when frontMatterBlock is undefined.
    // An undefined frontMatterBlock is as useful as a chocolate teapot.
    console.warn('frontMatterBlock is undefined')
  }

  validateMetadata(metadata as Metadata)

  return { metadata: metadata as Metadata, content }
}

// Ensure all the required metadata fields are present.
// Missing one? That’s an error because we’re not writing a mystery novel here!
function validateMetadata(metadata: Metadata): void {
  const requiredFields: (keyof Metadata)[] = [
    'title',
    'summary',
    'author',
    'publishedAt',
    'image',
  ]

  requiredFields.forEach((field) => {
    if (!(field in metadata)) {
      throw new Error(
        `Missing required field: ${field}. Don't leave us hanging—this is a blog post, not a suspense thriller!`,
      )
    }
  })
}

// Get a list of all Markdown files in the directory.
// If the directory can’t be read, we’ll return an empty array
// and pretend it never happened (with a gentle warning).
async function getMarkdownFiles(dir: string): Promise<string[]> {
  try {
    const files = await fs.readdir(dir)
    return files.filter((file) => path.extname(file) === '.md')
  } catch (error) {
    console.warn(
      `Warning: Unable to read directory '${dir}': ${(error as Error).message}. But don't worry, we're still here.`,
    )
    return []
  }
}

// Read a Markdown file and parse its content.
// If something goes wrong, we'll log the error and throw it,
// because errors deserve attention too (they have feelings, you know).
async function readMarkdownFile(
  filePath: string,
): Promise<{ metadata: Metadata; content: string }> {
  try {
    const rawContent = await fs.readFile(filePath, 'utf-8')
    return parseFrontmatter(rawContent)
  } catch (error) {
    console.error(
      'Error reading file:',
      filePath,
      (error as Error).message,
    )
    throw error
  }
}

// Get all the Markdown data from the directory.
// This is where we turn a bunch of Markdown files into blog posts,
// like magic, but with less sparkle and more code.
async function getMarkdownData(
  dir: string,
): Promise<Array<{ metadata: Metadata; slug: string; content: string }>> {
  const markdownFiles = await getMarkdownFiles(dir)
  return Promise.all(
    markdownFiles.map(async (file) => {
      const { metadata, content } = await readMarkdownFile(
        path.join(dir, file),
      )
      const slug = path.basename(file, '.md')
      return { metadata, slug, content }
    }),
  )
}

// Retrieve all the blog posts from the posts directory.
// Because what’s a blog without blog posts? Just a sad, empty page waiting for attention.
export async function getBlogPosts(): Promise<
  Array<{ metadata: Metadata; slug: string; content: string }>
> {
  const postsDir = path.join(process.cwd(), 'posts')
  return getMarkdownData(postsDir)
}
