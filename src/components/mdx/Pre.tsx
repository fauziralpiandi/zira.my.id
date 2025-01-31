'use client';

import { useRef, useState } from 'react';
import { LuCopy, LuCheck } from 'react-icons/lu';

import { cx } from '~/lib/utils';

export const MdxPreCode = ({
  children,
  ...restProps
}: React.ComponentPropsWithoutRef<'pre'>) => {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  const handleCopy = () => {
    if (preRef.current) {
      const codeText = preRef.current.innerText;
      navigator.clipboard.writeText(codeText).then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 1000);
      });
    }
  };

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
            copied ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
          )}
        >
          <LuCopy className="text-xl text-neutral-500" />
        </span>
        <span
          className={cx(
            'animate absolute top-0 right-0',
            copied ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
          )}
        >
          <LuCheck className="text-accent text-xl" />
        </span>
      </button>
      {children}
    </pre>
  );
};
