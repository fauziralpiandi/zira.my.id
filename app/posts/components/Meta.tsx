import { site } from 'app/lib/constant'
import { MetaPostProps } from 'app/lib/types'

const MetaPost = ({
  title,
  description,
  publishedTime,
  image,
  slug,
}: MetaPostProps) => {
  const ogImage = image
    ? image
    : `${site.baseUrl}/og?title=${encodeURIComponent(title)}`

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            'author': {
              '@type': 'Person',
              'name': site.author,
            },
            'headline': title,
            'datePublished': publishedTime,
            'description': description,
            'image': ogImage,
            'url': `${site.baseUrl}/posts/${slug}`,
          }),
        }}
      />
    </>
  )
}

export default MetaPost
