import React from 'react'
import { Link } from 'next-view-transitions'
import { highlight } from 'sugar-high'
import type { MDXComponents } from 'mdx/types'
import { PiArrowUpRightLight } from 'react-icons/pi'

type Types = {
  HyperLink: {
    href: string
    children: React.ReactNode
    key?: string
    className?: string
  }
  Code: {
    children: string
  }
  Components: {
    [key: string]: React.ElementType
  }
}

// Slugify text for headings
const slugify = (str: string) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[\s&]+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
}

// Handle both internal and external links
const MDXHyperLink = ({
  href = '',
  children,
  className = '',
  ...props
}: Types['HyperLink']) => {
  const isInternalLink = href.startsWith('/')

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
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit external link: ${href}`}
      {...props}
    >
      {children}
      <PiArrowUpRightLight size={15} className="inline-block opacity-50" />
    </a>
  )
}

// Code highlighting
const MDXHighlightCode = ({ children, ...props }: Types['Code']) => {
  const codeHTML = highlight(String(children))
  return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />
}

// Generate heading dynamically (h1 - h6)
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

// Generate all heading (h1 - h6)
const generateHeadingComponents = () => {
  const components: Types['Components'] = {}
  for (let i = 1; i <= 6; i++) {
    components[`h${i}`] = createHeading(i)
  }
  return components
}

const components: Types['Components'] = {
  ...generateHeadingComponents(),
  a: MDXHyperLink,
  code: MDXHighlightCode,
}

export function useMDXComponents(): MDXComponents {
  return {
    ...components,
  }
}
