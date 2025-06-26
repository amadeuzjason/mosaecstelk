import React from 'react';
import { InstagramIcon } from '../components/icons';

interface Member {
  name: string;
  ig: string;
  image?: string;
}

interface PeriodeData {
  [key: string]: Member;
}

interface AllPeriodeData {
  [year: number]: PeriodeData;
}

interface PeriodePageProps {
  year: number;
}

interface MemberCardProps {
  name: string;
  position: string;
  ig: string;
  image?: string;
  year?: number;
}

interface TopMemberLayoutProps extends MemberCardProps {
  imageAlign: 'left' | 'right';
}

const data: AllPeriodeData = {
  2022: {
    pembina: { name: "CHAERUNNISA DARWIS S.PD", ig: "nisaadarwis25" },
    ketua: { name: "ANDI RIZKY ALYA ANUGRAH", ig: "aandialyaa", image: "alya" },
    wakil: { name: "NURAZIZAH DWI PUTRI", ig: "nrazzh_0829", image: "chica" },
  },
  2023: {
    pembina: { name: "MUH ADE SYAM AGUNG S.PD", ig: "adesyamagung.muh", image: "MUH ADE SYAM AGUNG" },
    ketua: { name: "SHAQUILLE RASHAUN SAHL TAMRIN", ig: "shaqy9", image: "SHAQUILLE RASHAUN SAHL TAMRIN" },
    wakil: { name: "NURAINI NAFISA ZAHIRA", ig: "tyiiaaa", image: "NURAINI NAFISA ZAHIRA" },
    sekretaris: { name: "NUR ASYSYAMDINI.S", ig: "diniysss_s", image: "NUR ASYSYAMDINI.S" },
    bendahara: { name: "RAHMATHIA RAMADHANI", ig: "nnafisaz", image: "RAHMATHIA RAMADHANI" },
  },
  2024: {
    pembina: { name: "MUH ADE SYAM AGUNG S.PD", ig: "adesyamagung.muh", image: "MUH ADE SYAM AGUNG" },
    ketua: { name: "SASMITA PRATAMA", ig: "ssmitaa_a", image: "SASMITA PRATAMA" },
    wakil: { name: "NABILAH HASRIL SALSABILAH", ig: "nbilaslsbila__" },
    sekretaris: { name: "JASON DARYL AMADEUS", ig: "jasondeuz" },
    bendahara: { name: "NURUL RIFDA MUSTOFA", ig: "nurull1008_" },
  },
  2025: {
    pembina: { name: "DEWI S.PD", ig: "dewif4834" },
    ketua: { name: "JASON DARYL AMADEUS", ig: "jasondeuz" },
    wakil: { name: "NABILAH HASRIL SALSABILAH", ig: "nbilaslsbila__" },
    sekretaris: { name: "TAQAVI DERASKYAN ALI", ig: "derakhsyan_09" },
    wakil_sekretaris: { name: "SALWA FAIQAH", ig: "slwaafaiqhh" },
    bendahara: { name: "NURUL RIFDA MUSTOFA", ig: "nurull1008_" },
  }
};

const PERIODS: Record<number, string> = {
  2025: "2024/2025",
  2024: "2024",
  2023: "2023/2024",
  2022: "2022/2023"
};

const MemberCard: React.FC<MemberCardProps> = ({ name, position, ig, image, year }) => {
  const src = image
    ? `/assets/periode/${year}/${image}.jpg`
    : `https://placehold.co/400x600/4b5563/ffffff?text=${name.substring(0, 2)}`;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 w-full max-w-[280px]">
      <img
        src={src}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = `https://placehold.co/400x600/4b5563/ffffff?text=${name.substring(0,2)}`;
        }}
        alt={`Foto ${name}`}
        className="w-full h-auto object-cover aspect-[2/3]"
      />
      <div className="p-4 text-center">
        <h4 className="text-lg font-bold text-gray-800 capitalize tracking-wide">{name.toLowerCase()}</h4>
        <p className="text-gray-600 font-semibold capitalize">{position.replace(/_/g, ' ')}</p>
        <a href={`https://instagram.com/${ig}`} target="_blank" rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-2 text-gray-500 hover:text-red-700 transition-colors">
          <InstagramIcon />
          <span className="text-sm">@{ig}</span>
        </a>
      </div>
    </div>
  );
};

const TopMemberLayout: React.FC<TopMemberLayoutProps> = ({ name, position, ig, imageAlign, image, year }) => {
  const src = image
    ? `/assets/periode/${year}/${image}.jpg`
    : `https://placehold.co/400x600/ffffff/111827?text=${name.substring(0,2)}`;

  const imageContent = (
    <div className="flex-shrink-0 w-full max-w-[220px] sm:max-w-[240px]">
      <img
        src={src}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = `https://placehold.co/400x600/ffffff/111827?text=${name.substring(0,2)}`;
        }}
        alt={`Foto ${name}`}
        className="w-full h-auto object-cover rounded-2xl shadow-xl aspect-[2/3] hover:scale-110 transition-transform duration-500"
      />
    </div>
  );

  const textContent = (
    <div className="flex-1 text-center md:text-left">
      <h3 className="text-3xl lg:text-4xl font-bold text-white">{name}</h3>
      <p className="text-lg lg:text-xl font-semibold text-red-200">{position}</p>
      <a href={`https://instagram.com/${ig}`} target="_blank" rel="noopener noreferrer"
        className="mt-2 inline-flex items-center gap-2 text-red-100 hover:text-white transition-colors">
        <InstagramIcon />
        <span>@{ig}</span>
      </a>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full max-w-4xl mx-auto">
      {imageAlign === 'left' ? imageContent : textContent}
      {imageAlign === 'left' ? textContent : imageContent}
    </div>
  );
};

const PeriodePage: React.FC<PeriodePageProps> = ({ year }) => {
  const currentData = data[year] || data[2024];
  const otherMembers = Object.entries(currentData).filter(([key]) => key !== 'pembina' && key !== 'ketua');

  return (
    <div className="animate-fade-in">
      <div className="text-center pt-20 pb-12 bg-white">
        <h1 className="text-4xl md:text-5xl font-extrabold text-red-800">Struktur Kepengurusan</h1>
        <p className="mt-3 text-2xl font-semibold text-gray-700">Periode {PERIODS[year] || year}</p>
      </div>

      <div className="mb-12 bg-white">
        <img
          src={`/assets/periode/${year}/tim${year}.jpg`}
          alt={`Foto tim periode ${year}`}
          className="w-full h-228 object-cover shadow-lg"
        />
      </div>

      <section className="bg-red-800 py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {currentData.pembina && (
            <TopMemberLayout
              name={currentData.pembina.name}
              position="Pembina"
              ig={currentData.pembina.ig}
              image={currentData.pembina.image}
              imageAlign="left"
              year={year}
            />
          )}
          {currentData.ketua && (
            <TopMemberLayout
              name={currentData.ketua.name}
              position="Ketua"
              ig={currentData.ketua.ig}
              image={currentData.ketua.image}
              imageAlign="right"
              year={year}
            />
          )}
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-8">
            {otherMembers.map(([pos, member]) => (
              <MemberCard
                key={pos}
                name={member.name}
                position={pos}
                ig={member.ig}
                image={member.image}
                year={year}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PeriodePage;
