'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Period {
  id: number;
  period: number;
  year: number;
  image: string | null;
}

const PeriodeIndexPage: React.FC = () => {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchPeriods = async () => {
      try {
        const response = await fetch('/api/periods');
        if (response.ok) {
          const data = await response.json();
          setPeriods(data);
        }
      } catch (error) {
        console.error('Failed to fetch periods', error);
      }
    };
    fetchPeriods();
  }, []);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPeriods = periods.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(periods.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-linear-to-b from-white via-gray-50 to-white">
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
            {currentPeriods.map((periodItem, index) => {
              const { period, year, image } = periodItem;
              let src = `/assets/periode/${year}/tim${year}.jpg`;
              if (image) {
                if (image.startsWith('http')) {
                  src = image;
                } else {
                  src = `/assets/periode/${year}/${image}`;
                }
              }

              return (
                <Link
                  key={period}
                  href={`/periode/${period}`}
                  className="group relative rounded-xl overflow-hidden shadow-xl cursor-pointer h-64 transform hover:scale-110 hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-red-200 animate-fade-in block"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <img
                    src={src}
                    alt={`Arsip Angkatan ${period}`}
                    className="w-full h-full object-cover transform group-hover:scale-125 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/20 flex items-center justify-center group-hover:bg-linear-to-t group-hover:from-black/70 group-hover:via-black/30 group-hover:to-black/10 transition-all duration-500">
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12 space-x-2">
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg border ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-red-800 hover:bg-red-50 border-red-200'
                } transition-colors duration-200`}
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`w-10 h-10 rounded-lg border ${
                    currentPage === number
                      ? 'bg-red-800 text-white border-red-800'
                      : 'bg-white text-gray-700 hover:bg-red-50 border-gray-200'
                  } transition-colors duration-200 font-medium`}
                >
                  {number}
                </button>
              ))}

              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg border ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-red-800 hover:bg-red-50 border-red-200'
                } transition-colors duration-200`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default PeriodeIndexPage;
