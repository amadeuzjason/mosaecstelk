'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Period {
  id: number;
  period: number;
  year: number;
  image: string | null;
}

const ITEMS_PER_PAGE = 8;

const PeriodeIndexPage: React.FC = () => {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchPeriods = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/periods');
        if (response.ok) {
          const data: Period[] = await response.json();
          // Sort descending by period number (largest first)
          const sorted = [...data].sort((a, b) => b.period - a.period);
          setPeriods(sorted);
        }
      } catch (error) {
        console.error('Failed to fetch periods', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPeriods();
  }, []);

  const totalPages = Math.ceil(periods.length / ITEMS_PER_PAGE);
  const indexOfLast = currentPage * ITEMS_PER_PAGE;
  const indexOfFirst = indexOfLast - ITEMS_PER_PAGE;
  const currentPeriods = periods.slice(indexOfFirst, indexOfLast);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      <section className="py-20 relative overflow-hidden">
        {/* Mathematical background elements */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
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

          {/* Loading skeleton */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl overflow-hidden shadow-xl h-64 bg-gray-200 animate-pulse"
                />
              ))}
            </div>
          )}

          {!loading && periods.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">Belum ada data angkatan.</p>
            </div>
          )}

          {!loading && periods.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {currentPeriods.map((periodItem, index) => {
                  const { period, year, image } = periodItem;
                  let src = `/assets/periode/${year}/tim${year}.jpg`;
                  if (image) {
                    src = image.startsWith('http') ? image : `/assets/periode/${year}/${image}`;
                  }

                  return (
                    <Link
                      key={period}
                      href={`/periode/${period}`}
                      className="group relative rounded-xl overflow-hidden shadow-xl cursor-pointer h-64 transform hover:scale-105 hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-red-200 animate-fade-in block"
                      style={{ animationDelay: `${index * 0.08}s` }}
                    >
                      <img
                        src={src}
                        alt={`Arsip Angkatan ${period}`}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          (e.target as HTMLImageElement).onerror = null;
                          (e.target as HTMLImageElement).src =
                            'https://placehold.co/400x300/991b1b/ffffff?text=Angkatan+' + period;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 flex items-center justify-center transition-all duration-500">
                        <div className="text-center">
                          <span className="text-sm text-red-200 font-playfair italic mb-1 block">Angkatan</span>
                          <h3 className="text-white text-4xl md:text-5xl font-playfair font-bold transform group-hover:scale-110 transition-transform duration-300">
                            {period}
                          </h3>
                          <span className="text-gray-300 text-sm mt-1 block opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {year}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-12 gap-2">
                  <button
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-red-50 hover:border-red-200 hover:text-red-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Sebelumnya
                  </button>

                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                      <button
                        key={num}
                        onClick={() => paginate(num)}
                        className={`w-10 h-10 rounded-lg border text-sm font-semibold transition-all ${
                          currentPage === num
                            ? 'bg-red-800 text-white border-red-800 shadow-md'
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-800'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-red-50 hover:border-red-200 hover:text-red-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    Selanjutnya
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default PeriodeIndexPage;
