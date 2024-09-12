import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'

import {
  PostMetadataProps,
  ParsedFrontmatterProps,
  PostDataProps,
} from 'app/lib/types'

// Extract frontmatter and content from the Markdown file.
export function parseFrontmatter(fileContent: string): ParsedFrontmatterProps {
  const { data, content } = matter(fileContent)
  const metadata = data as PostMetadataProps
  validateMetadata(metadata)
  return { metadata, content }
}

// Validate required metadata fields.
function validateMetadata(metadata: PostMetadataProps): void {
  const requiredFields: (keyof PostMetadataProps)[] = [
    'title',
    'summary',
    'date',
  ]
  requiredFields.forEach((field) => {
    if (!(field in metadata)) {
      throw new Error(`Missing required field: "${field}"`)
    }
  })
}

// Get a list of all Markdown and MDX files in the directory.
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

// Read and parse a Markdown or MDX file.
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

// Process Markdown and MDX files into posts.
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

// Retrieve all the posts from the posts directory.
export async function getPosts(): Promise<PostDataProps[]> {
  const postsDir = path.join(process.cwd(), 'posted')
  return getMarkdownData(postsDir)
}
