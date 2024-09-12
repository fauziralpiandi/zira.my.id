import { StaticImageData } from 'next/image'

// Site Configuration
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

// Post Related Interfaces
export interface PostParamsProps {
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

export interface HeadPostProps {
  title: string
  summary: string
  author?: string
  readTime: string
  date: string
  slug: string
}

export interface BodyPostProps {
  title: string
  image?: string
  credit?: string
  content: string
}

export interface MetaPostProps {
  title: string
  description: string
  publishedTime: string
  image?: string
  slug: string
}

export interface PostMetadataProps {
  title: string
  summary: string
  date: string
  author?: string
  image?: string
  credit?: string
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

// UI Components
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

export interface GridImageProps {
  alt: string
  src: string | StaticImageData
  className?: string
}

// Analytics
export interface ViewsCountProps {
  slug: string
  count: number
}

export interface ViewsCounterProps {
  slug: string
  allViews: ViewsCountProps[] | undefined
}

// Cookies
export interface CookieProps {
  acceptedCookies?: string
}

// Request Data
export interface RequestDataProps {
  count: number
  firstRequestTime: number
}
