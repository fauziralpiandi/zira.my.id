import { Link } from 'next-view-transitions';

import { constant } from '@/lib/constant';
import { cx } from '@/lib/utils';

type MobileNav = {
  isOpen: boolean;
  pathname: string;
  navItems: Record<string, { name: string; path: string }>;
  closeNav: () => void;
};

export const MobileNav = ({
  isOpen,
  pathname,
  navItems,
  closeNav,
}: MobileNav) => {
  return (
    <nav
      className={cx(
        'animate fixed inset-0 right-0 z-20 flex flex-col items-center justify-center bg-neutral-950/80 backdrop-blur-3xl backdrop-grayscale md:hidden',
        isOpen ? 'visible opacity-100' : 'invisible opacity-0',
      )}
      aria-hidden={!isOpen}
    >
      {Object.entries(navItems).map(([path, { name }]) => (
        <Link
          key={path}
          href={path}
          title={name}
          className={cx(
            'font-display text-accent py-2 text-5xl font-medium',
            pathname === path ? 'opacity-50' : '',
          )}
          aria-current={pathname === path ? 'page' : undefined}
          onClick={closeNav}
        >
          {name}
        </Link>
      ))}

      <aside className="fixed bottom-0 block w-full p-8 md:hidden">
        <div className="flex items-center justify-center">
          <p className="font-display text-xs text-neutral-400">
            &copy; {new Date().getFullYear()} {constant.authorName}
          </p>
          <span className="mx-1.5 text-neutral-500">/</span>
          <Link
            href="/tnc"
            title="Terms and Conditions"
            aria-label="Terms and Conditions"
            className="font-display text-accent text-right text-xs font-medium"
            onClick={closeNav}
          >
            TnC
            <span className="sr-only">(Terms and Conditions)</span>
          </Link>
        </div>
      </aside>
    </nav>
  );
};
