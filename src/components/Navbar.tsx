'use client';

import React, { useState } from 'react';
import { MenuIcon, CloseIcon } from './Icon';

interface NavbarProps {
  setCurrentPage: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ setCurrentPage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPeriodeOpen, setIsPeriodeOpen] = useState(false);

  const navigate = (page: string) => {
    setCurrentPage(page);
    setIsOpen(false);
    setIsPeriodeOpen(false);
  };

  const navigatePeriode = (year: number) => {
    setCurrentPage(`periode-${year}`);
    setIsOpen(false);
    setIsPeriodeOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a onClick={() => navigate('home')} className="text-2xl font-bold text-red-800 cursor-pointer">
              MOSAEC STELK
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a onClick={() => navigate('home')} className="text-gray-600 hover:bg-red-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium cursor-pointer">
                Home
              </a>
              <div className="relative">
                <button
                  onClick={() => setIsPeriodeOpen(!isPeriodeOpen)}
                  className="text-gray-600 hover:bg-red-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  Periode
                  <svg
                    className={`w-4 h-4 ml-1 transition-transform duration-200 ${isPeriodeOpen ? 'transform rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isPeriodeOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                    {[2023, 2024, 2025].map((year) => (
                      <a
                        key={year}
                        onClick={() => navigatePeriode(year)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      >
                        Periode {year}
                      </a>
                    ))}
                  </div>
                )}
              </div>
              <a onClick={() => navigate('events')} className="text-gray-600 hover:bg-red-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium cursor-pointer">
                Events
              </a>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-red-800 inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-red-900 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a onClick={() => navigate('home')} className="text-gray-600 hover:bg-red-800 hover:text-white block px-3 py-2 rounded-md text-base font-medium cursor-pointer">
              Home
            </a>
            <div className="relative">
              <button
                onClick={() => setIsPeriodeOpen(!isPeriodeOpen)}
                className="w-full text-left text-gray-600 hover:bg-red-800 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                Periode
              </button>
              {isPeriodeOpen && (
                <div className="pl-4">
                  {[2023, 2024, 2025].map((year) => (
                    <a
                      key={year}
                      onClick={() => navigatePeriode(year)}
                      className="text-gray-500 hover:bg-gray-200 block px-3 py-2 rounded-md text-base font-medium cursor-pointer"
                    >
                      Periode {year}
                    </a>
                  ))}
                </div>
              )}
            </div>
            <a onClick={() => navigate('events')} className="text-gray-600 hover:bg-red-800 hover:text-white block px-3 py-2 rounded-md text-base font-medium cursor-pointer">
              Events
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
