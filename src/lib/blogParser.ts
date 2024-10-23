import path from 'path'
import fs from 'fs/promises'

type Frontmatter = {
  metadata: Metadata
  content: string
}

type Metadata = {
  title: string
  summary: string
  published: string
  category: string
  image?: string
}

type Blog = {
  metadata: Metadata
  slug: string
  content: string
}

function parseFrontmatter(fileContent: string) {
  const frontmatterRegex = /---\s*([\s\S]*?)\s*---/
  const match = frontmatterRegex.exec(fileContent)
  const frontMatterBlock = match?.[1]
  if (!frontMatterBlock) {
    throw new Error('Frontmatter not found')
  }
  const content = fileContent.replace(frontmatterRegex, '').trim()
  const frontMatterLines = frontMatterBlock.trim().split('\n')
  const metadata: Partial<Metadata> = {}

  frontMatterLines.forEach((line) => {
    const [key, ...valueArr] = line.split(': ')
    let value = valueArr.join(': ').trim()
    value = value.replace(/^['"](.*)['"]$/, '$1')
    metadata[key.trim() as keyof Metadata] = value
  })

  return { metadata: metadata as Metadata, content }
}

function validateMetadata(metadata: Metadata): void {
  const requiredFields: (keyof Metadata)[] = [
    'title',
    'summary',
    'published',
    'category',
  ]
  requiredFields.forEach((field) => {
    if (!Object.hasOwn(metadata, field)) {
      throw new Error(`Missing required field: "${field}"`)
    }
  })
}

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

async function readMarkdownFile(filePath: string): Promise<Frontmatter> {
  try {
    const rawContent = await fs.readFile(filePath, 'utf-8')
    const { metadata, content } = parseFrontmatter(rawContent)
    validateMetadata(metadata)
    return { metadata, content }
  } catch (error) {
    console.error(
      `Error reading file: ${filePath}. Reason: ${(error as Error).message}`,
    )
    throw error
  }
}

export async function getParsedMarkdownData(dir: string): Promise<Blog[]> {
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
        console.error(
          `Error processing file: ${file}. Reason: ${(error as Error).message}`,
        )
        return null
      }
    }),
  ).then((results) =>
    results.filter((result): result is Blog => result !== null),
  )
}

export async function getMyBlog(): Promise<Blog[]> {
  const contentDir = path.join(process.cwd(), 'src', 'content')
  return getParsedMarkdownData(contentDir)
}
