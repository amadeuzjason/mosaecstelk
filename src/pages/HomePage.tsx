import React from 'react';

// constants.ts (opsional), atau di file App.tsx/HomePage.tsx
export const PERIODS = [
  { key: 2025, display: "2024/2025" },
  { key: 2024, display: "2024" },
  { key: 2023, display: "2023/2024" },
  { key: 2022, display: "2022/2023" },
];


interface HomePageProps {
  setCurrentPage: (page: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ setCurrentPage }) => {
  const periods: number[] = [2025, 2024, 2023, 2022];
  

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="bg-red-800 text-white min-h-screen flex flex-col items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight uppercase">MOSAEC STELK</h1>
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
              Management of Science and Education
            </p>
            <p className="mt-4 max-w-3xl text-xl text-gray-600 lg:mx-auto">
              MOSAEC adalah ekstrakurikuler untuk meningkatkan kemampuan, pemahaman, dan logika pemecahan masalah dalam bidang matematika dan sains serta memberikan kesempatan untuk berpartisipasi dalam kompetisi di bidang tersebut.
            </p>
          </div>
        </div>
      </section>

      {/* Visi Misi Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-extrabold text-gray-900 mb-4">Visi & Misi</h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-bold text-red-800">Visi</h4>
                <p className="mt-2 text-gray-600">
                  Menjadikan MOSAEC sebagai pusat unggulan pengembangan potensi, prestasi, dan kreativitas siswa/i SMK Telkom Makassar dalam bidang matematika dan sains, dengan menanamkan pemahaman yang mendalam serta membangun generasi yang kompeten, inovatif, dan berdaya saing global di era digital.
                </p>
              </div>
              <div>
                <h4 className="text-xl font-bold text-red-800">Misi</h4>
                <ul className="mt-2 list-disc list-inside text-gray-600 space-y-2">
                  <li>Meningkatkan Minat dan Pemahaman Matematika dan Sains.</li>
                  <li>Mengoptimalkan peran MOSAEC sebagai wadah aspirasi siswa.</li>
                  <li>Mengembangkan Keterampilan Berpikir Tingkat Tinggi (HOTS).</li>
                  <li>Mempersiapkan Kompetisi Matematika dan Sains.</li>
                </ul>
              </div>
            </div>
          </div>
          <div>
            <img
            //   src="https://placehold.co/600x400/991b1b/ffffff?text=Visi+%26+Misi"
              src="/assets/events/10feb23.jpg"
              alt="Ilustrasi Visi dan Misi MOSAEC"
              className="rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </section>

{/* Arsip Kepengurusan Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-base text-red-700 font-semibold tracking-wide uppercase">Arsip Kepengurusan</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Jelajahi Setiap Periode
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {PERIODS.map(({ key, display }) => (
              <div
                key={key}
                onClick={() => setCurrentPage(`periode-${key}`)}
                className="group relative rounded-lg overflow-hidden shadow-lg cursor-pointer h-64 transform hover:scale-105 transition-transform duration-300"
              >
                <img
                  src={`/assets/periode/${key}/tim${key}.jpg`}
                //   src={`https://placehold.co/500x500/1f2937/ffffff?text=Periode+${display}`}
                  alt={`Arsip Periode ${display}`}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 flex bg-[rgba(0,0,0,0.5)] items-center justify-center">
                  <h3 className="text-white text-3xl font-bold">{display}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
