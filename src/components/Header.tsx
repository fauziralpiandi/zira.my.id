'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { LuMenu, LuX } from 'react-icons/lu';

import { FlipName } from './ui';
import { DesktopNav, MobileNav } from '~/components';

const navItems = {
  '/stories': { name: 'stories' },
  '/notes': { name: 'notes' },
  '/misc': { name: 'misc' },
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
      className="fixed left-0 right-0 top-0 z-30 flex items-center justify-between bg-neutral-950 px-8 pb-3 pt-6"
      style={{
        boxShadow: '0px 0px 30px 50px hsl(0, 0%, 4%)',
      }}
    >
      <div className="z-30 flex items-center space-x-3">
        <svg
          className="fill-accent"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 0 375 375"
          width="24"
          height="24"
        >
          <path d="M 271.378906 250.332031 C 252.128906 263.75 228.726562 271.621094 203.484375 271.621094 C 137.835938 271.621094 84.617188 218.402344 84.617188 152.753906 C 84.617188 112.550781 104.574219 77.007812 135.125 55.496094 C 59.972656 58.589844 0 120.492188 0 196.40625 C 0 274.292969 63.140625 337.433594 141.027344 337.433594 C 199.816406 337.433594 250.199219 301.464844 271.378906 250.332031 Z" />
          <path d="M 103.621094 124.664062 C 122.871094 111.246094 146.273438 103.378906 171.515625 103.378906 C 237.164062 103.378906 290.382812 156.597656 290.382812 222.246094 C 290.382812 262.449219 270.425781 297.992188 239.875 319.503906 C 315.027344 316.40625 375 254.503906 375 178.59375 C 375 100.707031 311.859375 37.566406 233.972656 37.566406 C 175.183594 37.566406 124.800781 73.535156 103.621094 124.664062 Z" />
        </svg>
        <FlipName />
      </div>

      <button
        onClick={toggleNav}
        className="z-30 -mr-1 text-accent md:hidden"
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
