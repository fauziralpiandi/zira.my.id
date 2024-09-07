import { PostProps } from 'app/lib/types'

export const DEFAULT_RECENT = 1
export const DEFAULT_FEATURED = false

export function getRecentPosts(
  posts: PostProps[],
  recent: number,
): PostProps[] {
  return posts.slice(0, recent)
}

export function getFeaturedPosts(
  posts: PostProps[],
  featured: boolean,
): PostProps[] {
  return posts
    .filter((post) => !featured || post.metadata.isFeatured)
    .sort(
      (a, b) =>
        new Date(b.metadata.date).getTime() -
        new Date(a.metadata.date).getTime(),
    )
}
