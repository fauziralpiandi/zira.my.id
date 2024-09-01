import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
    <th key={index}>{header}</th>
  ))

  const rows = data.rows.map((row, index) => (
    <tr key={index}>
      {row.map((cell, cellIndex) => (
        <td key={cellIndex}>{cell}</td>
      ))}
    </tr>
  ))

  return (
    <table>
      <thead>
        <tr>{headers}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  )
}

const CustomLink = React.forwardRef<
  HTMLAnchorElement,
  { href: string; children: React.ReactNode }
>(({ href, children, ...rest }, ref) => {
  let isExternalLink = false
  try {
    isExternalLink =
      new URL(href, window.location.origin).origin !==
      window.location.origin
  } catch (error) {
    isExternalLink = false
  }

  const isInternalLink = href.startsWith('/')
  const isAnchorLink = href.startsWith('#')
  const isMailtoLink = href.startsWith('mailto:')
  const isTelLink = href.startsWith('tel:')

  if (isInternalLink) {
    return (
      <Link href={href} ref={ref} {...rest}>
        {children}
      </Link>
    )
  }

  if (isAnchorLink || isMailtoLink || isTelLink) {
    return (
      <a href={href} ref={ref} {...rest}>
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
        ref={ref}
        {...rest}
      >
        {children}
      </a>
    )
  }

  return (
    <a href={href} ref={ref} {...rest}>
      {children}
    </a>
  )
})

CustomLink.displayName = 'CustomLink'

export default CustomLink

interface RoundedImageProps extends React.ComponentProps<typeof Image> {
  alt: string
  src: string
}

function RoundedImage({ alt, src, ...props }: RoundedImageProps) {
  return <Image alt={alt} className="rounded-lg shadow-lg" src={src} {...props} />
}

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
    .replace(/\s+/g, '-')
    .replace(/&/g, '-and-')
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

type ComponentsType = {
  [key: string]: React.ComponentType<any>
}

function generateHeadingComponents() {
  const components: Record<
    string,
    React.FC<{ children: React.ReactNode }>
  > = {}

  for (let i = 1; i <= 6; i++) {
    components[`h${i}`] = createHeading(i)
  }

  return components
}

const components: ComponentsType = {
  ...generateHeadingComponents(),
  Image: RoundedImage,
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
