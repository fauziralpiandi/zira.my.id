'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { LuMenu, LuX } from 'react-icons/lu';

import { FlipName, Logo } from './ui';
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
      className="fixed left-0 right-0 top-0 z-30 flex items-center justify-between bg-stone-950 px-8 pb-3 pt-6"
      style={{
        boxShadow: '0px 0px 30px 50px rgba(12, 10, 9, 1)',
      }}
    >
      <div className="z-30 flex items-center space-x-3">
        <Logo width={24} height={24} />
        <FlipName />
      </div>

      <button
        onClick={toggleNav}
        className="z-30 -mr-1 text-amber-100 md:hidden"
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
