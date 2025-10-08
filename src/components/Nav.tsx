import { Link } from 'next-view-transitions';
import { cx } from '@/lib/utils';

type DesktopNav = {
  pathname: string;
  navItems: Record<string, { name: string; path: string }>;
};

type MobileNav = {
  isOpen: boolean;
  pathname: string;
  navItems: Record<string, { name: string; path: string }>;
  closeNav: () => void;
};

function DesktopNav({ pathname, navItems }: DesktopNav) {
  return (
    <nav
      className="hidden items-center space-x-6 md:flex"
      aria-label="Main navigation"
    >
      {Object.entries(navItems).map(([path, { name }]) => (
        <Link
          key={path}
          href={path}
          aria-current={pathname === path ? 'page' : undefined}
          className={cx(
            'font-display text-accent font-medium capitalize',
            pathname === path ? 'opacity-50' : '',
          )}
        >
          {name}
        </Link>
      ))}
    </nav>
  );
}

function MobileNav({ isOpen, pathname, navItems, closeNav }: MobileNav) {
  return (
    <nav
      aria-hidden={!isOpen}
      className={cx(
        'animate fixed inset-0 right-0 z-20 flex flex-col items-center justify-center bg-neutral-950/80 backdrop-blur-3xl backdrop-grayscale md:hidden',
        isOpen ? 'visible opacity-100' : 'invisible opacity-0',
      )}
    >
      {Object.entries(navItems).map(([path, { name }]) => (
        <Link
          key={path}
          href={path}
          title={name}
          aria-current={pathname === path ? 'page' : undefined}
          onClick={closeNav}
          className={cx(
            'font-display text-accent py-2 text-5xl font-medium',
            pathname === path ? 'opacity-50' : '',
          )}
        >
          {name}
        </Link>
      ))}
      <aside className="fixed bottom-0 block w-full p-8 md:hidden">
        <div className="flex items-center justify-center">
          <p className="font-display text-sm text-neutral-400">
            &copy; {new Date().getFullYear()} Fauzira Alpiandi
          </p>
          <span className="mx-1.5 text-neutral-500">/</span>
          <a
            download
            href="/zira.my.id_tnc.md"
            title="Terms & Conditions"
            aria-label="Terms & Conditions"
            className="font-display text-accent text-right text-sm font-medium"
          >
            TnC
            <span className="sr-only">Terms & Conditions</span>
          </a>
        </div>
      </aside>
    </nav>
  );
}

export { DesktopNav, MobileNav };
