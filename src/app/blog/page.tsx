import { MyBlog } from './Helper'
import { getMyBlog } from '~/blogParser'

type BlogParams = {
  slug: string
  metadata: {
    published: string
    title: string
    featured?: boolean
  }
}

export default async function Blog() {
  const myBlog = await getMyBlog()

  const allBlog: BlogParams[] = myBlog.filter(Boolean) as BlogParams[]

  return (
    <>
      <div className="mb-8">
        <span className="text-mono-500">
          {allBlog.length} &mdash; Stay tuned for more!
        </span>
      </div>
      <MyBlog />
    </>
  )
}
