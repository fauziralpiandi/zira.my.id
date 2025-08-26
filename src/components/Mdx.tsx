'use client';

import { useEffect, useRef, useState } from 'react';
import { useMDXComponent } from 'next-contentlayer2/hooks';
import { Link } from 'next-view-transitions';
import { PiArrowUpRight } from 'react-icons/pi';
import { LuCheck, LuCopy } from 'react-icons/lu';
import { cx } from '@/lib/utils';

type Link = {
  href: string;
  children: React.ReactNode;
  key?: string;
  className?: string;
};

function MdxLink({ href, children, className, ...props }: Link) {
  if (!href || typeof href !== 'string') {
    return null;
  }

  const isInternalLink = href.startsWith('/') || href.startsWith('#');

  if (!isInternalLink) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer nofollow"
        title={`Visit external link (${href})`}
        aria-label={`Visit external link (${href})`}
        className={className}
        {...props}
      >
        {children}
        <PiArrowUpRight
          size={10}
          className="inline -translate-y-1 opacity-80"
        />
      </a>
    );
  }

  return (
    <Link
      passHref
      href={href}
      title={`Navigate to (${href})`}
      aria-label={`Navigate to (${href})`}
      className={className}
      {...props}
    >
      {children}
    </Link>
  );
}

function MdxPreCode({
  children,
  ...restProps
}: React.ComponentPropsWithoutRef<'pre'>) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);
  const handleCopy = () => {
    if (!preRef.current) {
      return;
    }

    const codeText = preRef.current.innerText;

    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      return;
    }

    navigator.clipboard.writeText(codeText).then(() => setCopied(true));
  };

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timer = setTimeout(() => setCopied(false), 1e3);

    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <pre ref={preRef} {...restProps} tabIndex={0} className="group relative">
      <button
        onClick={handleCopy}
        className="animate absolute top-2.5 right-2 opacity-0 group-focus-within:opacity-100"
        aria-label="Copy to clipboard"
      >
        <span
          className={cx(
            'animate absolute top-0 right-0',
            copied ? 'scale-0 opacity-0' : 'scale-100 opacity-100',
          )}
        >
          <LuCopy className="text-xl text-neutral-500" />
        </span>
        <span
          className={cx(
            'animate absolute top-0 right-0',
            copied ? 'scale-100 opacity-100' : 'scale-0 opacity-0',
          )}
        >
          <LuCheck className="text-accent text-xl" />
        </span>
      </button>
      {children}
    </pre>
  );
}

export function Mdx({ code }: { code: string }) {
  const BodyContent = useMDXComponent(code);

  return (
    <article className="prose prose-neutral prose-invert mx-auto max-w-2xl">
      <BodyContent components={{ a: MdxLink, pre: MdxPreCode }} />
    </article>
  );
}
