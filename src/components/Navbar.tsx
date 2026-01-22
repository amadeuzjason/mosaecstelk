'use client';

import React, { useState, useEffect } from 'react';
import { MenuIcon, CloseIcon } from './icons';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  setCurrentPage?: (page: string) => void;
}

// No mapping needed - we use period numbers directly for navigation

const Navbar: React.FC<NavbarProps> = ({ setCurrentPage }) => {
  const router = useRouter();
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

  const navigate = (page: string) => {
    if (page === 'latihan') {
      router.push('/latihan');
      return;
    }

    if (setCurrentPage) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // If we are not on the SPA page, navigate to home
      // We can't easily deep link to specific sections without refactoring Home
      router.push('/');
    }
    setIsOpen(false);
    setIsAngkatanOpen(false);
  };

  const navigateAngkatan = (period: number) => {
    if (setCurrentPage) {
      navigate(`periode-${period}`);
    } else {
      router.push('/');
    }
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
            <div className="flex items-center space-x-2 transform group-hover:scale-105 transition-transform duration-300">
              <img 
                src="assets/logo/stelkmks.png" 
                alt="Logo SMK Telkom" 
                className="h-10 w-10 transform hover:rotate-12 transition-transform duration-300"
              />
              <img 
                src="assets/logo/mosaec.png" 
                alt="Logo MOSAEC" 
                className="h-10 w-10 rounded-full transform hover:rotate-12 transition-transform duration-300"
              />
            </div>
            <a 
              onClick={() => navigate('home')} 
              className="text-xl font-playfair font-bold text-red-800 cursor-pointer hover:text-red-900 transition-colors duration-300"
            >
              MOSAEC <span className="text-lg">STELK</span>
            </a>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-2">
              <a 
                onClick={() => navigate('home')} 
                className="text-gray-700 hover:text-red-800 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-300 hover:scale-105 relative group"
              >
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-800 transition-all duration-300 group-hover:w-full"></span>
              </a>
              
              <div className="relative">
                <button 
                  onClick={() => setIsAngkatanOpen(!isAngkatanOpen)} 
                  className="text-gray-700 hover:text-red-800 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-all duration-300 hover:scale-105 relative group"
                >
                  Angkatan
                  <svg 
                    className={`w-4 h-4 ml-1 transition-transform duration-300 ${isAngkatanOpen ? 'transform rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-800 transition-all duration-300 group-hover:w-full"></span>
                </button>
                
                {isAngkatanOpen && (
                  <div className="absolute right-0 mt-2 w-32 bg-white/90 backdrop-blur-md rounded-xl shadow-2xl py-2 z-20 border border-red-100 animate-fade-in">
                    {angkatanList.map((period) => (
                      <a 
                        key={period} 
                        onClick={() => navigateAngkatan(period)} 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-800 cursor-pointer transition-all duration-300 hover:translate-x-1 font-medium"
                      >
                        Angkatan {period}
                      </a>
                    ))}
                  </div>
                )}
              </div>
              
              <a 
                onClick={() => navigate('events')} 
                className="text-gray-700 hover:text-red-800 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-300 hover:scale-105 relative group"
              >
                Events
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-800 transition-all duration-300 group-hover:w-full"></span>
              </a>

              <a 
                onClick={() => navigate('latihan')} 
                className="text-gray-700 hover:text-red-800 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-300 hover:scale-105 relative group"
              >
                Latihan
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-800 transition-all duration-300 group-hover:w-full"></span>
              </a>
            </div>
          </div>
          
          <div className="-mr-2 flex md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="bg-red-800/90 backdrop-blur-sm inline-flex items-center justify-center p-2 rounded-lg text-white hover:bg-red-900 focus:outline-none transition-all duration-300 hover:scale-110 shadow-lg"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>
      
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-red-100 animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a 
              onClick={() => navigate('home')} 
              className="text-gray-700 hover:bg-red-50 hover:text-red-800 block px-4 py-3 rounded-lg text-base font-medium cursor-pointer transition-all duration-300"
            >
              Home
            </a>
            
            <div className="relative">
              <button 
                onClick={() => setIsAngkatanOpen(!isAngkatanOpen)} 
                className="w-full text-left text-gray-700 hover:bg-red-50 hover:text-red-800 block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 flex items-center justify-between"
              >
                Angkatan
                <svg 
                  className={`w-4 h-4 transition-transform duration-300 ${isAngkatanOpen ? 'transform rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              {isAngkatanOpen && (
                <div className="pl-4 mt-1 space-y-1 animate-fade-in">
                  {angkatanList.map((period) => (
                    <a 
                      key={period} 
                      onClick={() => navigateAngkatan(period)} 
                      className="text-gray-600 hover:bg-red-50 hover:text-red-800 block px-4 py-2 rounded-lg text-base font-medium cursor-pointer transition-all duration-300"
                    >
                      Angkatan {period}
                    </a>
                  ))}
                </div>
              )}
            </div>
            
            <a 
              onClick={() => navigate('events')} 
              className="text-gray-700 hover:bg-red-50 hover:text-red-800 block px-4 py-3 rounded-lg text-base font-medium cursor-pointer transition-all duration-300"
            >
              Events
            </a>

            <a 
              onClick={() => navigate('latihan')} 
              className="text-gray-700 hover:bg-red-50 hover:text-red-800 block px-4 py-3 rounded-lg text-base font-medium cursor-pointer transition-all duration-300"
            >
              Latihan
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
