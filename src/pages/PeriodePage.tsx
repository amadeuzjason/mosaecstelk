import React from 'react';
import MemberCard from '../components/MemberCard';

interface Member {
  name: string;
  photo: string;
}

interface PeriodeData {
  ketua: Member;
  wakil: Member;
  sekretaris: Member;
  bendahara: Member;
}

interface PeriodePageProps {
  year: number;
}

const PeriodePage: React.FC<PeriodePageProps> = ({ year }) => {
  const data: Record<number, PeriodeData> = {
    2023: {
      ketua: { name: 'Ahmad Dahlan', photo: 'https://placehold.co/400x400/991b1b/ffffff?text=AD' },
      wakil: { name: 'Budi Santoso', photo: 'https://placehold.co/400x400/4b5563/ffffff?text=BS' },
      sekretaris: { name: 'Citra Lestari', photo: 'https://placehold.co/400x400/4b5563/ffffff?text=CL' },
      bendahara: { name: 'Dewi Anggraini', photo: 'https://placehold.co/400x400/4b5563/ffffff?text=DA' },
    },
    2024: {
      ketua: { name: 'Eka Prasetya', photo: 'https://placehold.co/400x400/991b1b/ffffff?text=EP' },
      wakil: { name: 'Fitriani Rahayu', photo: 'https://placehold.co/400x400/4b5563/ffffff?text=FR' },
      sekretaris: { name: 'Gilang Ramadhan', photo: 'https://placehold.co/400x400/4b5563/ffffff?text=GR' },
      bendahara: { name: 'Hana Yuliana', photo: 'https://placehold.co/400x400/4b5563/ffffff?text=HY' },
    },
    2025: {
      ketua: { name: 'Indra Wijaya', photo: 'https://placehold.co/400x400/991b1b/ffffff?text=IW' },
      wakil: { name: 'Joko Susilo', photo: 'https://placehold.co/400x400/4b5563/ffffff?text=JS' },
      sekretaris: { name: 'Kartika Sari', photo: 'https://placehold.co/400x400/4b5563/ffffff?text=KS' },
      bendahara: { name: 'Laras Prameswari', photo: 'https://placehold.co/400x400/4b5563/ffffff?text=LP' },
    },
  };

  const currentData = data[year] || data[2024];

  return (
    <div className="bg-white animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-red-800">Struktur Kepengurusan</h1>
          <p className="mt-3 text-2xl font-semibold text-gray-700">Periode {year}</p>
        </div>

        {/* Ketua & Wakil */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-12 md:gap-20 mb-16">
          <MemberCard name={currentData.ketua.name} position="Ketua Umum" photo={currentData.ketua.photo} isPrimary />
          <MemberCard name={currentData.wakil.name} position="Wakil Ketua" photo={currentData.wakil.photo} />
        </div>

        {/* Sekretaris & Bendahara */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-12 md:gap-20">
          <MemberCard name={currentData.sekretaris.name} position="Sekretaris" photo={currentData.sekretaris.photo} />
          <MemberCard name={currentData.bendahara.name} position="Bendahara" photo={currentData.bendahara.photo} />
        </div>
      </div>
    </div>
  );
};

export default PeriodePage;
