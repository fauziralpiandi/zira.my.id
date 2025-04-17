'use client';

import { usePathname } from 'next/navigation';
import { Link } from 'next-view-transitions';

const generateCrumb = (pathname: string) => {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumb = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    return { label: segment, href };
  });

  return [{ label: 'home', href: '/' }, ...breadcrumb];
};

export const BreadCrumb = () => {
  const pathname = usePathname();
  const breadcrumb = generateCrumb(pathname);

  return (
    <nav
      className="font-display flex items-center text-xs tracking-tight text-amber-100"
      aria-label="Breadcrumb"
    >
      {breadcrumb.map((crumb, index) => (
        <span key={index} className="flex items-center">
          {index < breadcrumb.length - 1 ? (
            <Link href={crumb.href}>{crumb.label}</Link>
          ) : (
            <span className="line-clamp-1 text-stone-400" aria-current="page">
              {crumb.label}
            </span>
          )}
          {index < breadcrumb.length - 1 && (
            <span className="mx-1.5 text-stone-400">/</span>
          )}
        </span>
      ))}
    </nav>
  );
};
