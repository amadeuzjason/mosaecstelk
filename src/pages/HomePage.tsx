import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="bg-red-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">MOSAEC STELK</h1>
          <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-red-100">
            Management of Science and Education SMK Telkom Makassar
          </p>
          <a
            href="#about"
            className="mt-8 inline-block bg-white text-red-800 font-bold py-3 px-8 rounded-full hover:bg-gray-200 transition duration-300"
          >
            Selengkapnya
          </a>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-red-700 font-semibold tracking-wide uppercase">Tentang Kami</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Wadah Aspirasi dan Kreativitas Siswa
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              MOSAEC STELK adalah organisasi siswa di SMK Telkom Makassar yang berfungsi sebagai jembatan antara siswa
              dan pihak sekolah, menyalurkan aspirasi, serta mengembangkan potensi siswa melalui berbagai program kerja.
            </p>
          </div>
        </div>
      </section>

      {/* Visi Misi Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h3 className="text-3xl font-extrabold text-gray-900 mb-4">Visi & Misi</h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-bold text-red-800">Visi</h4>
                <p className="mt-2 text-gray-600">
                  Menjadikan MOSAEC STELK sebagai organisasi yang unggul, inovatif, dan inspiratif, serta mampu
                  mewujudkan siswa SMK Telkom Makassar yang berkarakter, berprestasi, dan berwawasan global.
                </p>
              </div>
              <div>
                <h4 className="text-xl font-bold text-red-800">Misi</h4>
                <ul className="mt-2 list-disc list-inside text-gray-600 space-y-2">
                  <li>Meningkatkan keimanan dan ketaqwaan terhadap Tuhan Yang Maha Esa.</li>
                  <li>Mengoptimalkan peran MOSAEC sebagai wadah aspirasi siswa.</li>
                  <li>Mengadakan program kerja yang edukatif, kreatif, dan bermanfaat.</li>
                  <li>Membangun hubungan yang harmonis dengan seluruh warga sekolah.</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <img
              src="https://placehold.co/600x400/991b1b/ffffff?text=MOSAEC+STELK"
              alt="Tim MOSAEC STELK"
              className="rounded-lg shadow-xl"
              onError={(e) => {
                (e.target as HTMLImageElement).onerror = null;
                (e.target as HTMLImageElement).src =
                  'https://placehold.co/600x400/cccccc/ffffff?text=Image+Not+Found';
              }}
            />
          </div>
        </div>
      </section>

      {/* Struktur Organisasi Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-base text-red-700 font-semibold tracking-wide uppercase">Struktur Organisasi</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Pilar Penggerak Kami
            </p>
          </div>
          <div className="relative">
            <img
              src="https://placehold.co/1200x600/f3f4f6/374151?text=Bagan+Struktur+Organisasi"
              alt="Struktur Organisasi MOSAEC"
              className="rounded-lg shadow-lg w-full"
              onError={(e) => {
                (e.target as HTMLImageElement).onerror = null;
                (e.target as HTMLImageElement).src =
                  'https://placehold.co/1200x600/cccccc/ffffff?text=Image+Not+Found';
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
