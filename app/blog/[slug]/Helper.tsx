import React from 'react'
import Link from 'next/link'
import { highlight } from 'sugar-high'
import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote/rsc'

interface Types {
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

const HyperLink = React.forwardRef<HTMLAnchorElement, Types['HyperLink']>(
  ({ href, children, key, ...rest }, ref) => {
    let isExternalLink = false

    try {
      isExternalLink =
        new URL(href, window.location.origin).origin !== window.location.origin
    } catch (error) {
      isExternalLink = true
    }

    const isInternalLink = href.startsWith('/')
    const isAnchorLink = href.startsWith('#')
    const isMailtoLink = href.startsWith('mailto:')
    const isTelLink = href.startsWith('tel:')

    const commonProps = { ref, ...rest }

    if (isInternalLink) {
      return (
        <Link href={href} {...commonProps}>
          {children}
        </Link>
      )
    }

    if (isAnchorLink || isMailtoLink || isTelLink) {
      return (
        <a href={href} {...commonProps}>
          {children}
        </a>
      )
    }

    if (isExternalLink) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          {...commonProps}
        >
          {children}
        </a>
      )
    }

    return (
      <a href={href} {...commonProps}>
        {children}
      </a>
    )
  },
)

HyperLink.displayName = 'HyperLink'

function Code({ children, ...props }: Types['Code']) {
  const codeHTML = highlight(String(children))
  return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[\s&]+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
}

function createHeading(level: number) {
  const Heading = ({ children }: { children: React.ReactNode }) => {
    let slug = children !== undefined ? slugify(String(children)) : ''
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

function generateHeadingComponents() {
  const components: Types['Components'] = {}
  for (let i = 1; i <= 6; i++) {
    components[`h${i}`] = createHeading(i)
  }
  return components
}

const components: Types['Components'] = {
  ...generateHeadingComponents(),
  a: HyperLink,
  code: Code,
}

export function Contents(props: MDXRemoteProps) {
  return (
    <MDXRemote {...props} components={{ ...components, ...props.components }} />
  )
}
