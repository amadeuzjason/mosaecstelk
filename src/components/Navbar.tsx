'use client';

import React, { useState, useEffect } from 'react';
import { MenuIcon, CloseIcon } from './icons';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

interface NavbarProps {
  // setCurrentPage prop removed as we use App Router
}

const Navbar: React.FC<NavbarProps> = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenus = () => {
    setIsOpen(false);
  };

  const isActive = (path: string) => {
    if (!pathname) return false;
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 print:hidden ${
      scrolled 
        ? 'bg-white/80 backdrop-blur-md shadow-lg border-b border-red-100' 
        : 'bg-white/60 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-3 group">
            <Link href="/" className="flex items-center space-x-2 transform group-hover:scale-105 transition-transform duration-300">
              <img 
                src="/assets/logo/stelkmks.png" 
                alt="Logo SMK Telkom" 
                className="h-10 w-10 transform hover:rotate-12 transition-transform duration-300"
              />
              <img 
                src="/assets/logo/mosaec.png" 
                alt="Logo MOSAEC" 
                className="h-10 w-10 rounded-full transform hover:rotate-12 transition-transform duration-300"
              />
            </Link>
            <Link 
              href="/"
              className="text-xl font-playfair font-bold text-red-800 cursor-pointer hover:text-red-900 transition-colors duration-300"
            >
              MOSAEC <span className="text-lg">STELK</span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-2">
              <Link
                href="/" 
                className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-300 hover:scale-105 relative group ${
                    isActive('/') && pathname === '/' ? 'text-red-800 bg-red-50' : 'text-gray-700 hover:text-red-800 hover:bg-red-50'
                }`}
              >
                Home
                <span className={`absolute bottom-0 left-0 h-0.5 bg-red-800 transition-all duration-300 ${
                    isActive('/') && pathname === '/' ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </Link>

              <Link
                href="/events" 
                className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-300 hover:scale-105 relative group ${
                    isActive('/events') ? 'text-red-800 bg-red-50' : 'text-gray-700 hover:text-red-800 hover:bg-red-50'
                }`}
              >
                Events
                <span className={`absolute bottom-0 left-0 h-0.5 bg-red-800 transition-all duration-300 ${
                    isActive('/events') ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </Link>
              
              <Link
                href="/periode" 
                className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-300 hover:scale-105 relative group ${
                    isActive('/periode') ? 'text-red-800 bg-red-50' : 'text-gray-700 hover:text-red-800 hover:bg-red-50'
                }`}
              >
                Angkatan
                <span className={`absolute bottom-0 left-0 h-0.5 bg-red-800 transition-all duration-300 ${
                    isActive('/periode') ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </Link>

               <Link
                href="/latihan" 
                className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-300 hover:scale-105 relative group ${
                    isActive('/latihan') ? 'text-red-800 bg-red-50' : 'text-gray-700 hover:text-red-800 hover:bg-red-50'
                }`}
              >
                Latihan Soal
                <span className={`absolute bottom-0 left-0 h-0.5 bg-red-800 transition-all duration-300 ${
                    isActive('/latihan') ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </Link>
            </div>
          </div>
          
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-red-800 hover:text-white hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white transition-all duration-300"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
          <Link
            href="/"
            onClick={closeMenus}
            className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${
                isActive('/') && pathname === '/' ? 'bg-red-800 text-white shadow-md' : 'text-gray-700 hover:text-red-800 hover:bg-red-50'
            }`}
          >
            Home
          </Link>
          
          <Link
            href="/events"
            onClick={closeMenus}
            className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${
                isActive('/events') ? 'bg-red-800 text-white shadow-md' : 'text-gray-700 hover:text-red-800 hover:bg-red-50'
            }`}
          >
            Events
          </Link>

          <Link
            href="/periode"
            onClick={closeMenus}
            className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${
                isActive('/periode') ? 'bg-red-800 text-white shadow-md' : 'text-gray-700 hover:text-red-800 hover:bg-red-50'
            }`}
          >
            Angkatan
          </Link>

          <Link
            href="/latihan"
            onClick={closeMenus}
            className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${
                isActive('/latihan') ? 'bg-red-800 text-white shadow-md' : 'text-gray-700 hover:text-red-800 hover:bg-red-50'
            }`}
          >
            Latihan Soal
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
