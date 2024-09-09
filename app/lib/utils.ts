import { PostProps } from './types'

export function getFilteredPosts(
  posts: PostProps[],
  featured: boolean | undefined,
  recent: number | undefined,
): PostProps[] {
  return posts
    .filter((post) => !featured || post.metadata.featured)
    .sort(
      (a, b) =>
        new Date(b.metadata.date).getTime() -
        new Date(a.metadata.date).getTime(),
    )
    .slice(0, recent)
}
