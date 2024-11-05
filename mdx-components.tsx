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
  const linkClass =
    'text-blue-700 dark:text-yellow-500 hover:underline underline-offset-2 decoration-mono-500'

  if (isInternalLink) {
    return (
      <Link href={href} {...props} className={linkClass}>
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
      className={linkClass}
    >
      {children}
      <PiArrowUpRightLight size={15} className="inline-block opacity-50" />
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

const generateHeadings = () => {
  const components: Types['Components'] = {}
  for (let i = 1; i <= 6; i++) {
    components[`h${i}`] = createHeading(i)
  }
  return components
}

const components: Types['Components'] = {
  ...generateHeadings(),
  h1: (props) => <h1 className="fade-in mb-0 font-semibold" {...props} />,
  h2: (props) => <h2 className="mb-3 mt-8 font-medium" {...props} />,
  h3: (props) => <h3 className="mb-3 mt-8 font-medium" {...props} />,
  h4: (props) => <h4 className="font-medium" {...props} />,
  p: (props) => <p className="leading-snug" {...props} />,
  ol: (props) => <ol className="list-decimal space-y-2 pl-5" {...props} />,
  ul: (props) => <ul className="list-disc space-y-1 pl-5" {...props} />,
  li: (props) => <li className="pl-1" {...props} />,
  em: (props) => <em className="font-medium" {...props} />,
  strong: (props) => <strong className="font-medium" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="border-l-3 ml-[0.075em] border-mono-700 pl-4 text-mono-300"
      {...props}
    />
  ),
  a: hyperLink,
  code: highlightCode,
}

export function useMDXComponents(): MDXComponents {
  return {
    ...components,
  }
}
