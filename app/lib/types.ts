import { StaticImageData } from 'next/image'

export interface SiteProps {
  domain: string
  baseUrl: string
  author: string
  title: string
  desc: string
  locale: string
  timeZone: string
  verify: string
}

export interface PostParamsProps {
  slug: string
}

export interface PostProps {
  slug: string
  metadata: {
    date: string
    title: string
    featured?: boolean
  }
}

export interface FilteredPostsProps {
  recent?: number
  featured?: boolean
}

export interface AuthorInfoProps {
  author: string
  readTime: string
  date: string
}

export interface PostBodyProps {
  title: string
  image: string | null
  content: string
}

export interface MetaTagsProps {
  title: string
  description: string
  publishedTime: string
  image?: string | null
  slug: string
}

export interface TableProps {
  data: {
    headers: string[]
    rows: (string | number)[][]
  }
}

export interface HyperLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  children: React.ReactNode
}

export interface CodeProps extends React.HTMLProps<HTMLElement> {
  children: string
}

export interface ComponentsProps {
  [key: string]: React.ComponentType<any>
}

export interface ViewsCountProps {
  slug: string
  count: number
}

export interface ViewsCounterProps {
  slug: string
  allViews: ViewsCountProps[] | undefined
}

export interface GridImageProps {
  alt: string
  src: string | StaticImageData
  className?: string
}

export interface CookieProps {
  acceptedCookies?: string
}

export interface PostMetadataProps {
  title: string
  summary: string
  date: string
  author?: string
  image?: string
}

export interface ParsedFrontmatterProps {
  metadata: PostMetadataProps
  content: string
}

export interface PostDataProps {
  metadata: PostMetadataProps
  slug: string
  content: string
}

export interface RequestDataProps {
  count: number
  firstRequestTime: number
}

export interface Feedback {
  name: string
  email: string
  message: string
}
