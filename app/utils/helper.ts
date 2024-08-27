import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter' // Because why do things manually when you have magic?

// Define the structure for blog post metadata.
// Because even a blog needs a little bit of style!
type PostMetadata = {
  title: string
  summary: string
  author: string
  publishedAt: string
  image: string
}

// Extract the frontmatter from the Markdown file content.
// If the frontmatter isn't there, we throw an error—
// like serving a burger without the patty!
function parseFrontmatter(fileContent: string): {
  metadata: PostMetadata
  content: string
} {
  const { data, content } = matter(fileContent)
  const metadata = data as PostMetadata
  validateMetadata(metadata)
  return { metadata, content }
}

// Ensure all the required metadata fields are present.
// Missing one? That's like going to a party without snacks!
function validateMetadata(metadata: PostMetadata): void {
  const requiredFields: (keyof PostMetadata)[] = [
    'title',
    'summary',
    'author',
    'publishedAt',
    'image',
  ]

  requiredFields.forEach((field) => {
    if (!(field in metadata)) {
      throw new Error(
        `Missing required field: ${field}. Don't ghost us like that!`,
      )
    }
  })
}

// Get a list of all Markdown files in the directory.
// If the directory can’t be read, we’ll return an empty array
// and pretend we didn’t see anything. It’s like a magic trick!
async function getMarkdownFiles(dir: string): Promise<string[]> {
  try {
    const files = await fs.readdir(dir)
    return files.filter((file) => path.extname(file) === '.md')
  } catch (error) {
    console.warn(
      `Warning: Unable to read directory '${dir}': ${(error as Error).message}`,
    )
    return []
  }
}

// Read a Markdown file and parse its content.
// If something goes wrong, we'll log the error and throw it—
// because errors deserve to be noticed, unlike your last relationship.
async function readMarkdownFile(
  filePath: string,
): Promise<{ metadata: PostMetadata; content: string }> {
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

// This is where we turn a bunch of Markdown files into blog posts—
// like turning water into wine, but with less divine intervention.
async function getMarkdownData(
  dir: string,
): Promise<
  Array<{ metadata: PostMetadata; slug: string; content: string }>
> {
  const markdownFiles = await getMarkdownFiles(dir)
  return Promise.all(
    markdownFiles.map(async (file) => {
      const { metadata, content } = await readMarkdownFile(
        path.join(dir, file),
      )
      const slug = path.basename(file, path.extname(file)) // Slug it like you mean it!
      return { metadata, slug, content }
    }),
  )
}

// Retrieve all the blog posts from the posts directory.
// Because what’s a blog without blog posts? Just a sad empty shell!
export async function getBlogPosts(): Promise<
  Array<{ metadata: PostMetadata; slug: string; content: string }>
> {
  const postsDir = path.join(process.cwd(), 'posts')
  return getMarkdownData(postsDir)
}
