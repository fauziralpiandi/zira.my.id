import { site } from 'app/utils/constant'

type MetaTagsProps = {
  title: string
  description: string
  publishedTime: string
  image?: string
  slug: string
}

const MetaTags = ({
  title,
  description,
  publishedTime,
  image,
  slug,
}: MetaTagsProps) => {
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

export default MetaTags
