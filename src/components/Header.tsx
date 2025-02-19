'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { LuMenu, LuX } from 'react-icons/lu';

import { FlipName } from './ui';
import { DesktopNav, MobileNav } from '~/components';

const navItems = {
  '/stories': { name: 'Stories' },
  '/notes': { name: 'Notes' },
  '/misc': { name: 'Misc' },
};

export const Header = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <header
      className="fixed top-0 right-0 left-0 z-30 flex items-center justify-between bg-neutral-950 px-8 pt-6 pb-3"
      style={{
        boxShadow: '0px 0px 30px 50px #0a0a0a',
      }}
    >
      <div className="z-30 flex items-center space-x-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 375 375"
          width="28"
          height="28"
        >
          <path
            fill="#f7efd1"
            d="M247.9 232.74c-13.86 9.66-30.71 15.33-48.89 15.33-47.27 0-85.59-38.32-85.59-85.59 0-28.95 14.37-54.54 36.36-70.03-54.11 2.23-97.29 46.8-97.29 101.46 0 56.08 45.46 101.54 101.54 101.54 42.33 0 78.61-25.9 93.85-62.72z"
          />
          <path
            fill="#f7efd1"
            d="M127.1 142.26c13.86-9.66 30.71-15.33 48.89-15.33 47.27 0 85.59 38.32 85.59 85.59 0 28.95-14.37 54.54-36.36 70.03 54.11-2.23 97.29-46.8 97.29-101.46 0-56.08-45.46-101.54-101.54-101.54-42.33 0-78.61 25.9-93.85 62.72z"
          />
        </svg>
        <FlipName />
      </div>

      <button
        onClick={toggleNav}
        className="text-accent z-30 -mr-1 md:hidden"
        aria-label="Toggle navigation"
      >
        {isOpen ? <LuX size={22} /> : <LuMenu size={22} />}
      </button>

      <MobileNav
        isOpen={isOpen}
        pathname={pathname}
        navItems={navItems}
        closeNav={() => setIsOpen(false)}
      />
      <DesktopNav pathname={pathname} navItems={navItems} />
    </header>
  );
};
