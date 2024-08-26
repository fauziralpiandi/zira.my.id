import { getBlogPosts } from 'app/utils/helper'
import { BlogPosts, BlogPostType } from 'app/components/Posts'

/* Let's keep it concise but intriguing */
const stuff = 'featuring posts \u0026 some thoughts\u2014'

export const metadata = {
  title: 'Blog',
  description: stuff,
}

export default async function Blog() {
  /* What’s a blog without content? */
  const blogPosts = await getBlogPosts()

  /* Only the good stuff survives */
  const allBlogs: BlogPostType[] = blogPosts.filter(
    Boolean,
  ) as BlogPostType[]

  return (
    <section>
      <div className="animate-in">
        <div className="mb-8">
          <h1 className="font-semibold text-2xl leading-tight tracking-tight">
            {stuff} {/* Bringing that meta desc. into the spotlight */}
          </h1>
          <p className="text-neutral-400">
            {allBlogs.length} posts &mdash; Stay tuned for more!
            {/* Because we’ve got more content coming, right? */}
          </p>
        </div>
        <BlogPosts /> {/* Rendering the blog posts like a pro */}
      </div>
    </section>
  )
}
