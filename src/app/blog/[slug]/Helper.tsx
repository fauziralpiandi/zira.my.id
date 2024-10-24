import React from 'react'
import { Link } from 'next-view-transitions'
import { highlight } from 'sugar-high'
import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote/rsc'

type Types = {
  HyperLink: {
    href: string
    children: React.ReactNode
    key?: string
  }
  Code: {
    children: React.ReactNode
  }
  Components: {
    [key: string]: React.ElementType
  }
}

const slugify = (str: string) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[\s&]+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
}

const hyperLink = ({ href = '', children, ...props }: Types['HyperLink']) => {
  const isInternalLink = href.startsWith('/')
  const isExternalLink = href.startsWith('https')

  if (isInternalLink) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <a
      href={href}
      target={isExternalLink ? '_blank' : undefined}
      rel={isExternalLink ? 'noopener noreferrer' : undefined}
      aria-label={isExternalLink ? `Visit external link: ${href}` : undefined}
      {...props}
    >
      {children}
    </a>
  )
}

const highlightCode = ({ children, ...props }: Types['Code']) => {
  const codeHTML = highlight(String(children))
  return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />
}

const createHeading = (level: number) => {
  const Heading = ({ children }: { children?: React.ReactNode }) => {
    const slug = children ? slugify(String(children)) : ''
    return React.createElement(
      `h${level}`,
      { id: slug },
      [
        React.createElement('a', {
          href: `#${slug}`,
          key: `link-${slug}`,
          className: 'anchor',
        }),
      ],
      children,
    )
  }

  Heading.displayName = `Heading${level}`
  return Heading
}

const generateHeadingComponents = () => {
  const components: Types['Components'] = {}
  for (let i = 1; i <= 6; i++) {
    components[`h${i}`] = createHeading(i)
  }
  return components
}

const components: Types['Components'] = {
  ...generateHeadingComponents(),
  a: hyperLink,
  code: highlightCode,
}

export default function Blog(props: MDXRemoteProps) {
  return (
    <MDXRemote {...props} components={{ ...components, ...props.components }} />
  )
}
