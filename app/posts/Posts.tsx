import Link from 'next/link'
import { formatDate } from 'app/utils/meta'
import { getPosts } from 'app/utils/provider'

// Meet our PostType: where every slug dreams of being unique.
export interface PostType {
  slug: string // The magic string that leads to the hidden treasures.
  metadata: {
    date: string // The glorious day this post entered the world.
    title: string // The attention-grabbing headline that shouts, "Read me!"
    isFeatured?: boolean // Optional VIP pass for the cool kids' club.
  }
}

// Props for MyPosts—because we need to know how many posts to display without overwhelming anyone.
export interface PostsProps {
  recent?: number // How many recent posts are we pretending to care about?
  featured?: boolean // Should we only showcase the elite posts? You decide.
}

export async function MyPosts({ recent, featured = false }: PostsProps) {
  let allPosts: PostType[] = []
  try {
    // Attempt to fetch posts, a.k.a. the digital equivalent of fishing.
    allPosts = (await getPosts()).filter(Boolean) as PostType[]
  } catch (error) {
    console.error('Failed to fetch posts—', error) // When the internet decides to take a break.
    return (
      <div className="text-red-500">
        Unable to load posts. Please try again later.
        {/* Basically, we're saying "Oops, something broke!" */}
      </div>
    )
  }

  if (!allPosts.length) {
    return (
      <div className="text-yellow-500">Check back soon for updates!</div> //  Translation: "We've got nothing for you. Go outside!"
    )
  }

  // Filtering, sorting, and slicing—because we love making decisions for our users.
  const filteredPosts = allPosts
    .filter((post) => !featured || post.metadata.isFeatured) // Only let the "chosen ones" through if featured is true.
    .sort(
      (a, b) =>
        new Date(b.metadata.date).getTime() -
        new Date(a.metadata.date).getTime(), // Freshness matters! New posts first, please.
    )
    .slice(0, recent) // Just the right amount of posts—because less is more, right?

  return (
    <div>
      {filteredPosts.map((post) => (
        <Link
          key={post.slug} // The key to unlock this post's hidden wisdom.
          className="flex flex-col my-4 space-y-2"
          href={`/posts/${post.slug}`} // Where the magic happens! Click if you dare.
        >
          <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2">
            <p className="text-neutral-400 tabular-nums">
              {formatDate(post.metadata.date, 'absolute')}{' '}
              {/* Date when this gem was released into the wild. */}
            </p>
            <p className="font-medium text-neutral-200 leading-snug">
              {post.metadata.title}{' '}
              {/* The title: a one-liner that can make or break your interest. */}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}
