import path from 'path'
import fs from 'fs/promises'
import matter from 'gray-matter'

// Definiting
export interface PostMetadataProps {
  title: string
  summary: string
  date: string
  category: string
  author?: string
  image?: string
  credit?: string
}

export interface ParsedFrontmatterProps {
  metadata: PostMetadataProps
  content: string
}

export interface PostDataProps {
  metadata: PostMetadataProps
  slug: string
  content: string
}

// Extracting
export function parseFrontmatter(fileContent: string): ParsedFrontmatterProps {
  const { data, content } = matter(fileContent)
  const metadata = data as PostMetadataProps
  validateMetadata(metadata)
  return { metadata, content }
}

// Validating
function validateMetadata(metadata: PostMetadataProps): void {
  const requiredFields: (keyof PostMetadataProps)[] = [
    'title',
    'summary',
    'date',
    'category',
  ]
  requiredFields.forEach((field) => {
    if (!(field in metadata)) {
      throw new Error(`Missing required field: "${field}"`)
    }
  })
}

// Getting
async function getMarkdownFiles(dir: string): Promise<string[]> {
  try {
    const files = await fs.readdir(dir)
    return files.filter((file) => ['.md', '.mdx'].includes(path.extname(file)))
  } catch (error) {
    console.warn(
      `Warning: Unable to read directory '${dir}': ${(error as Error).message}`,
    )
    return []
  }
}

// Reading and parsing
async function readMarkdownFile(
  filePath: string,
): Promise<ParsedFrontmatterProps> {
  try {
    const rawContent = await fs.readFile(filePath, 'utf-8')
    return parseFrontmatter(rawContent)
  } catch (error) {
    console.error('Error reading file:', filePath, (error as Error).message)
    throw error
  }
}

// Processing
export async function getMarkdownData(dir: string): Promise<PostDataProps[]> {
  const markdownFiles = await getMarkdownFiles(dir)
  return Promise.all(
    markdownFiles.map(async (file) => {
      try {
        const { metadata, content } = await readMarkdownFile(
          path.join(dir, file),
        )
        const slug = path.basename(file, path.extname(file))
        return { metadata, slug, content }
      } catch (error) {
        console.error('Error processing file:', file, (error as Error).message)
        return null
      }
    }),
  ).then((results) =>
    results.filter((result): result is PostDataProps => result !== null),
  )
}

// Retrieving
export async function getMyBlog(): Promise<PostDataProps[]> {
  const contentDir = path.join(process.cwd(), 'content')
  return getMarkdownData(contentDir)
}
