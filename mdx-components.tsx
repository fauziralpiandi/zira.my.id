import React from 'react'
import Link from 'next/link'
import { highlight } from 'sugar-high'
import type { MDXComponents } from 'mdx/types'

const isValidUrl = (url: string) => {
  return url.startsWith('https')
}

const components: MDXComponents = {
  a: ({ href, children, ...props }) => {
    const isInternalLink = href?.startsWith('/')
    const isExternalLink = isValidUrl(href || '')

    if (isInternalLink) {
      return (
        <Link href={href || ''} {...props}>
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
  },
  code: ({ children, ...props }) => {
    const codeHTML = highlight(children as string)
    return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />
  },
  Table: ({ data }: { data: { headers: string[]; rows: string[][] } }) => (
    <table className="min-w-full border-collapse">
      <thead>
        <tr>
          {data.headers.map((header, index) => (
            <th key={index} className="border p-2 text-left">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.rows.map((row, index) => (
          <tr key={index}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex} className="border p-2">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
}

export function useMDXComponents(): MDXComponents {
  return {
    ...components,
  }
}
