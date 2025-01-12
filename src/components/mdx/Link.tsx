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
  const isExternalLink =
    href.startsWith('http://') || href.startsWith('https://');

  if (isExternalLink) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
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
    <Link href={href} passHref {...props} className={className}>
      {children}
    </Link>
  );
};
