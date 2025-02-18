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
      <div className="z-30 flex items-center space-x-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 375 375"
          width="26"
          height="26"
        >
          <path
            fill="#fef3c7"
            d="M213.21 193.42L253.34 153.29L203.14 103.09C181.68 81.63 146.88 81.63 125.42 103.09L0 228.51L80.65 229.09L164.77 144.97Z"
          />
          <path
            fill="#fef3c7"
            d="M296.30 146.35L213.21 229.43L165.25 181.47L125.12 221.60L177.34 273.82C196.88 293.36 228.57 293.36 248.11 273.82L375.02 146.93Z"
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
