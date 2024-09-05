import React from 'react'
import Link from 'next/link'
import { highlight } from 'sugar-high'
import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote/rsc'

type TableProps = {
  data: {
    headers: string[]
    rows: (string | number)[][]
  }
}

function Table({ data }: TableProps) {
  const headers = data.headers.map((header, index) => (
    <th key={index} className="table-header">
      {header}
    </th>
  ))

  const rows = data.rows.map((row, index) => (
    <tr key={index}>
      {row.map((cell, cellIndex) => (
        <td key={cellIndex} className="table-cell">
          {cell}
        </td>
      ))}
    </tr>
  ))

  return (
    <table aria-label="Data Table" className="table">
      <thead>
        <tr>{headers}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  )
}

const CustomLink = React.forwardRef<
  HTMLAnchorElement,
  {
    href: string
    children: React.ReactNode
  } & React.AnchorHTMLAttributes<HTMLAnchorElement>
>(({ href, children, ...rest }, ref) => {
  let isExternalLink = false

  try {
    isExternalLink =
      new URL(href, window.location.origin).origin !==
      window.location.origin
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
})

CustomLink.displayName = 'CustomLink'

export default CustomLink

interface CodeProps extends React.HTMLProps<HTMLElement> {
  children: string
}

function Code({ children, ...props }: CodeProps) {
  const codeHTML = highlight(children)
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
  const components: ComponentsType = {}
  for (let i = 1; i <= 6; i++) {
    components[`h${i}`] = createHeading(i)
  }
  return components
}

type ComponentsType = {
  [key: string]: React.ComponentType<any>
}

const components: ComponentsType = {
  ...generateHeadingComponents(),
  a: CustomLink,
  code: Code,
  Table,
}

export function Contents(props: MDXRemoteProps) {
  return (
    <MDXRemote
      {...props}
      components={{ ...components, ...props.components }}
    />
  )
}
