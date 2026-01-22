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
  const [isAngkatanOpen, setIsAngkatanOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const angkatanList = [32, 31, 30, 29];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenus = () => {
    setIsOpen(false);
    setIsAngkatanOpen(false);
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
              
              <div className="relative group/dropdown">
                <button 
                  onClick={() => setIsAngkatanOpen(!isAngkatanOpen)} 
                  onMouseEnter={() => setIsAngkatanOpen(true)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-all duration-300 hover:scale-105 relative group ${
                    isActive('/periode') ? 'text-red-800 bg-red-50' : 'text-gray-700 hover:text-red-800 hover:bg-red-50'
                  }`}
                >
                  Angkatan
                  <svg 
                    className={`ml-2 h-4 w-4 transform transition-transform duration-300 ${isAngkatanOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-red-800 transition-all duration-300 ${
                    isActive('/periode') ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </button>
                
                {/* Dropdown Menu */}
                <div 
                  className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transform transition-all duration-300 origin-top-right ${
                    isAngkatanOpen ? 'opacity-100 scale-100 translate-y-0 visible' : 'opacity-0 scale-95 -translate-y-2 invisible'
                  }`}
                  onMouseLeave={() => setIsAngkatanOpen(false)}
                >
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    {angkatanList.map((period) => (
                      <Link
                        key={period}
                        href={`/periode/${period}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-800 transition-colors duration-200"
                        role="menuitem"
                        onClick={closeMenus}
                      >
                        Mosaec Angkatan {period}
                      </Link>
                    ))}
                    <div className="border-t border-gray-100 my-1"></div>
                     <Link
                        href="/periode"
                        className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-800 font-medium transition-colors duration-200"
                        role="menuitem"
                        onClick={closeMenus}
                      >
                        Lihat Semua Angkatan
                      </Link>
                  </div>
                </div>
              </div>

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

          <div className="space-y-1">
            <button 
              onClick={() => setIsAngkatanOpen(!isAngkatanOpen)}
              className={`w-full text-left px-3 py-2 rounded-md text-base font-medium flex justify-between items-center transition-all duration-300 ${
                 isActive('/periode') ? 'text-red-800 bg-red-50' : 'text-gray-700 hover:text-red-800 hover:bg-red-50'
              }`}
            >
              Angkatan
              <svg 
                className={`h-4 w-4 transform transition-transform duration-300 ${isAngkatanOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <div className={`pl-4 space-y-1 transition-all duration-300 ${isAngkatanOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
              {angkatanList.map((period) => (
                <Link
                  key={period}
                  href={`/periode/${period}`}
                  onClick={closeMenus}
                  className="block px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-red-800 hover:bg-red-50 transition-colors duration-200"
                >
                  Angkatan {period}
                </Link>
              ))}
               <Link
                  href="/periode"
                  onClick={closeMenus}
                  className="block px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 transition-colors duration-200"
                >
                  Lihat Semua
                </Link>
            </div>
          </div>

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
