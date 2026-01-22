'use client';

import React from 'react';
import Link from 'next/link';

const PERIODS = [32, 31, 30, 29];

// Mapping from period number to year for image paths
const PERIOD_TO_YEAR_FOR_IMAGES: Record<number, number> = {
  32: 2025,
  31: 2024,
  30: 2023,
  29: 2022,
};

const PeriodeIndexPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Arsip Kepengurusan Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Mathematical background elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 text-5xl font-playfair">∇</div>
          <div className="absolute bottom-10 right-20 text-6xl font-playfair">π</div>
          <div className="absolute top-1/2 left-1/3 text-7xl font-playfair">∞</div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="text-base text-red-700 font-semibold tracking-wide uppercase bg-red-50 px-4 py-2 rounded-full border-2 border-red-200">
                Arsip Kepengurusan
              </span>
            </div>
            <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-gray-900 mb-4">
              Jelajahi Setiap Angkatan
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Lihat struktur kepengurusan dari setiap angkatan MOSAEC STELK
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {PERIODS.map((period, index) => {
              const year = PERIOD_TO_YEAR_FOR_IMAGES[period];
              return (
                <Link
                  key={period}
                  href={`/periode/${period}`}
                  className="group relative rounded-xl overflow-hidden shadow-xl cursor-pointer h-64 transform hover:scale-110 hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-red-200 animate-fade-in block"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <img
                    src={`/assets/periode/${year}/tim${year}.jpg`}
                    alt={`Arsip Angkatan ${period}`}
                    className="w-full h-full object-cover transform group-hover:scale-125 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 flex items-center justify-center group-hover:bg-gradient-to-t group-hover:from-black/70 group-hover:via-black/30 group-hover:to-black/10 transition-all duration-500">
                    <div className="text-center">
                      <span className="text-sm text-red-200 font-playfair italic mb-1 block">Angkatan</span>
                      <h3 className="text-white text-4xl md:text-5xl font-playfair font-bold transform group-hover:scale-110 transition-transform duration-300">
                        {period}
                      </h3>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PeriodeIndexPage;
