import { Link } from 'next-view-transitions';
import { cx } from '~/lib/utils';

type DesktopNav = {
  pathname: string;
  navItems: Record<string, { name: string }>;
};

export const DesktopNav = ({ pathname, navItems }: DesktopNav) => {
  return (
    <nav
      className="hidden items-center space-x-6 md:flex"
      aria-label="Main navigation"
    >
      {Object.entries(navItems).map(([path, { name }]) => (
        <Link
          key={path}
          href={path}
          className={cx(
            'font-display font-medium capitalize tracking-tight text-amber-100',
            pathname === path ? 'opacity-25' : ''
          )}
          aria-current={pathname === path ? 'page' : undefined}
        >
          {name}
        </Link>
      ))}
    </nav>
  );
};
