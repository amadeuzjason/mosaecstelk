import React from 'react';
import Link from 'next/link';

// constants.ts (opsional), atau di file App.tsx/HomePage.tsx
export const PERIODS = [32, 31, 30, 29];


interface HomePageProps {
  setCurrentPage?: (page: string) => void;
}

// Mapping from period number to year for image paths only (since image folders are named by year)
const PERIOD_TO_YEAR_FOR_IMAGES: Record<number, number> = {
  32: 2025,
  31: 2024,
  30: 2023,
  29: 2022,
};

const HomePage: React.FC<HomePageProps> = ({ setCurrentPage }) => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="bg-red-800 text-white min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
        {/* Mathematical background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 text-6xl font-playfair animate-float-1">∑</div>
          <div className="absolute top-40 right-20 text-5xl font-playfair animate-float-2">∫</div>
          <div className="absolute bottom-32 left-1/4 text-7xl font-playfair animate-float-3">∞</div>
          <div className="absolute bottom-20 right-1/3 text-6xl font-playfair animate-float-4">∂</div>
          <div className="absolute top-1/2 left-1/3 text-5xl font-playfair animate-float-5">∇</div>
        </div>
        
        <div className="text-center px-4 relative z-10">
          <div className="mb-2 text-2xl md:text-4xl font-playfair text-red-200 opacity-80 animate-fade-in-delay-1">
            <span className="italic">f(x) = </span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-playfair font-bold tracking-wide mb-2 animate-title-reveal">
            <span className="inline-block transform hover:scale-105 transition-transform duration-500">
              <span className="text-red-200">M</span>
              <span className="text-white">OSAEC</span>
            </span>
            <br />
            <span className="inline-block transform hover:scale-105 transition-transform duration-500 delay-100 text-3xl md:text-5xl lg:text-6xl">
              <span className="text-red-200">STELK</span>
            </span>
          </h1>
          <div className="mt-2 text-xl md:text-3xl font-playfair text-red-200 opacity-80 animate-fade-in-delay-2">
            <span className="italic">∀x ∈ ℝ</span>
          </div>
          <p className="mt-6 text-lg md:text-xl max-w-3xl mx-auto text-red-100 animate-fade-in-delay-3">
            Management of Science and Education SMK Telkom Makassar
          </p>
          <a
            href="#about"
            className="mt-8 inline-block bg-white text-red-800 font-bold py-3 px-8 rounded-full hover:bg-gray-200 transition-all duration-300 hover:scale-105 shadow-lg animate-fade-in-delay-4"
          >
            Selengkapnya
          </a>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
        {/* Mathematical background elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 text-6xl font-playfair animate-float-1">∑</div>
          <div className="absolute top-40 right-20 text-5xl font-playfair animate-float-2">∫</div>
          <div className="absolute bottom-32 left-1/4 text-7xl font-playfair animate-float-3">∞</div>
          <div className="absolute bottom-20 right-1/3 text-6xl font-playfair animate-float-4">∂</div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:text-center">
            <div className="inline-block mb-4">
              <span className="text-base text-red-700 font-semibold tracking-wide uppercase bg-red-50 px-4 py-2 rounded-full border-2 border-red-200">
                Tentang Kami
              </span>
            </div>
            <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-gray-900 mb-6">
              Management of Science and Education
            </h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-xl md:text-2xl text-gray-700 leading-relaxed bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border-2 border-gray-100">
                MOSAEC adalah ekstrakurikuler untuk meningkatkan kemampuan, pemahaman, dan logika pemecahan masalah dalam bidang matematika dan sains serta memberikan kesempatan untuk berpartisipasi dalam kompetisi di bidang tersebut.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Visi Misi Section */}
      <section className="bg-gradient-to-br from-red-800 via-red-900 to-red-800 py-20 text-white relative overflow-hidden">
        {/* Mathematical background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 text-6xl font-playfair animate-float-1">∑</div>
          <div className="absolute top-40 right-20 text-5xl font-playfair animate-float-2">∫</div>
          <div className="absolute bottom-32 left-1/4 text-7xl font-playfair animate-float-3">∞</div>
          <div className="absolute bottom-20 right-1/3 text-6xl font-playfair animate-float-4">∂</div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border-2 border-white/20 shadow-2xl">
            <div className="inline-block mb-6">
              <span className="text-base font-semibold tracking-wide uppercase bg-white/20 px-4 py-2 rounded-full border-2 border-white/30">
                Visi & Misi
              </span>
            </div>
            <h3 className="text-3xl md:text-4xl font-playfair font-bold mb-6">Visi & Misi</h3>
            <div className="space-y-8">
              <div className="bg-white/5 p-6 rounded-xl border-l-4 border-red-200">
                <h4 className="text-xl md:text-2xl font-playfair font-bold text-red-200 mb-3 flex items-center gap-2">
                  <span className="text-2xl">🎯</span> Visi
                </h4>
                <p className="text-red-100 leading-relaxed text-lg">
                  Menjadikan MOSAEC sebagai pusat unggulan pengembangan potensi, prestasi, dan kreativitas siswa/i SMK Telkom Makassar dalam bidang matematika dan sains, dengan menanamkan pemahaman yang mendalam serta membangun generasi yang kompeten, inovatif, dan berdaya saing global di era digital.
                </p>
              </div>
              <div className="bg-white/5 p-6 rounded-xl border-l-4 border-red-200">
                <h4 className="text-xl md:text-2xl font-playfair font-bold text-red-200 mb-3 flex items-center gap-2">
                  <span className="text-2xl">📋</span> Misi
                </h4>
                <ul className="text-red-100 space-y-3 text-lg">
                  <li className="flex items-start gap-3">
                    <span className="text-red-300 mt-1">•</span>
                    <span>Meningkatkan Minat dan Pemahaman Matematika dan Sains.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-300 mt-1">•</span>
                    <span>Mengoptimalkan peran MOSAEC sebagai wadah aspirasi siswa.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-300 mt-1">•</span>
                    <span>Mengembangkan Keterampilan Berpikir Tingkat Tinggi (HOTS).</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-300 mt-1">•</span>
                    <span>Mempersiapkan Kompetisi Matematika dan Sains.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-transparent rounded-2xl blur-xl"></div>
            <img
              src="/assets/events/10feb23.jpg"
              alt="Ilustrasi Visi dan Misi MOSAEC"
              className="relative rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500 border-4 border-white/20"
            />
          </div>
        </div>
      </section>

{/* Arsip Kepengurusan Section */}
      <section className="py-20 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
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

export default HomePage;
