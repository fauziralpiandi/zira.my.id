import { Link } from 'next-view-transitions';
import { PiArrowUpRight } from 'react-icons/pi';

type MdxLinkProps = {
  href: string;
  children: React.ReactNode;
  key?: string;
  className?: string;
};

export const MdxLink = ({
  href,
  children,
  className,
  ...props
}: MdxLinkProps) => {
  if (!href || typeof href !== 'string') {
    console.error('Requires a valid href string');
    return null;
  }

  const isInternalLink = href.startsWith('/') || href.startsWith('#');

  if (!isInternalLink) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer nofollow"
        title={`Visit external link: ${href}`}
        aria-label={`Visit external link: ${href}`}
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
      title={`Navigate to: ${href}`}
      aria-label={`Navigate to: ${href}`}
      className={className}
      {...props}
    >
      {children}
    </Link>
  );
};
