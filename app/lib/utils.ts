import { PostParamsProps } from './types'

export function getFilteredPosts(
  posts: PostParamsProps[],
  featured: boolean | undefined,
  recent: number | undefined,
): PostParamsProps[] {
  return posts
    .filter((post) => !featured || post.metadata.featured)
    .sort(
      (a, b) =>
        new Date(b.metadata.date).getTime() -
        new Date(a.metadata.date).getTime(),
    )
    .slice(0, recent)
}
