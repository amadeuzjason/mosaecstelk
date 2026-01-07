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
  [period: number]: PeriodeData;
}

interface PeriodePageProps {
  period: number;
}

interface MemberCardProps {
  name: string;
  position: string;
  ig: string;
  image?: string;
  period?: number;
}

interface TopMemberLayoutProps extends MemberCardProps {
  imageAlign: 'left' | 'right';
}

const data: AllPeriodeData = {
  32: {
    pembina: { name: "DEWI S.PD", ig: "dewif4834", image: "DEWI" },
    ketua: { name: "JASON DARYL AMADEUS", ig: "jasondeuz", image: "JASON DARYL AMADEUS" },
    wakil: { name: "NABILAH HASRIL SALSABILAH", ig: "nbilaslsbila__" },
    sekretaris: { name: "TAQAVI DERASKYAN ALI", ig: "derakhsyan_09" },
    wakil_sekretaris: { name: "SALWA FAIQAH", ig: "slwaafaiqhh" },
    bendahara: { name: "NURUL RIFDA MUSTOFA", ig: "nurull1008_" },
  },
  31: {
    pembina: { name: "MUH ADE SYAM AGUNG S.PD", ig: "adesyamagung.muh", image: "MUH ADE SYAM AGUNG" },
    ketua: { name: "SASMITA PRATAMA", ig: "ssmitaa_a", image: "SASMITA PRATAMA" },
    wakil: { name: "NABILAH HASRIL SALSABILAH", ig: "nbilaslsbila__" },
    sekretaris: { name: "JASON DARYL AMADEUS", ig: "jasondeuz" },
    bendahara: { name: "NURUL RIFDA MUSTOFA", ig: "nurull1008_" },
  },
  30: {
    pembina: { name: "CHAERUNNISA DARWIS S.PD", ig: "nisaadarwis25", image: "Chaerunnisa Darwis"},
    ketua: { name: "SHAQUILLE RASHAUN SAHL TAMRIN", ig: "shaqy9", image: "SHAQUILLE RASHAUN SAHL TAMRIN" },
    wakil: { name: "RAHMATHIA RAMADHANI", ig: "tyiiaaa", image: "RAHMATHIA RAMADHANI" },
    sekretaris: { name: "NUR ASYSYAMDINI.S", ig: "diniysss_s", image: "NUR ASYSYAMDINI.S" },
    bendahara: { name: "NURAINI NAFISA ZAHIRA", ig: "nnafisaz", image: "NURAINI NAFISA ZAHIRA" },
  },
  29: {
    pembina: { name: "CHAERUNNISA DARWIS S.PD", ig: "nisaadarwis25", image: "Chaerunnisa Darwis"},
    ketua: { name: "ANDI RIZKY ALYA ANUGRAH", ig: "aandialyaa", image: "alya" },
    wakil: { name: "NURAZIZAH DWI PUTRI", ig: "nrazzh_0829", image: "chica" },
  }
};

// Mapping only for image paths (since image folders are still named by year)
const PERIOD_TO_YEAR_FOR_IMAGES: Record<number, number> = {
  32: 2025,
  31: 2024,
  30: 2023,
  29: 2022
};

const MemberCard: React.FC<MemberCardProps> = ({ name, position, ig, image, period }) => {
  const year = period ? PERIOD_TO_YEAR_FOR_IMAGES[period] : undefined;
  const src = image && year
    ? `/assets/periode/${year}/${image}.jpg`
    : `https://placehold.co/400x600/4b5563/ffffff?text=${name.substring(0, 2)}`;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-110 hover:shadow-2xl transition-all duration-500 w-full max-w-[280px] border-2 border-transparent hover:border-red-200">
      <div className="relative overflow-hidden">
        <img
          src={src}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = `https://placehold.co/400x600/4b5563/ffffff?text=${name.substring(0,2)}`;
          }}
          alt={`Foto ${name}`}
          className="w-full h-auto object-cover aspect-[2/3] transform hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="p-5 text-center bg-gradient-to-b from-white to-gray-50">
        <h4 className="text-lg font-bold text-gray-800 capitalize tracking-wide mb-1">{name.toLowerCase()}</h4>
        <p className="text-red-700 font-semibold capitalize mb-3">{position.replace(/_/g, ' ')}</p>
        <a href={`https://instagram.com/${ig}`} target="_blank" rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-2 text-gray-500 hover:text-red-700 transition-all duration-300 hover:scale-110">
          <InstagramIcon />
          <span className="text-sm">@{ig}</span>
        </a>
      </div>
    </div>
  );
};

const TopMemberLayout: React.FC<TopMemberLayoutProps> = ({ name, position, ig, imageAlign, image, period }) => {
  const year = period ? PERIOD_TO_YEAR_FOR_IMAGES[period] : undefined;
  const src = image && year
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
        className="w-full h-auto object-cover rounded-2xl shadow-2xl aspect-[2/3] hover:scale-110 transition-transform duration-700 border-4 border-white/20"
      />
    </div>
  );

  const textContent = (
    <div className="flex-1 text-center md:text-left">
      <h3 className="text-3xl lg:text-5xl font-playfair font-bold text-white mb-2">{name}</h3>
      <p className="text-lg lg:text-2xl font-playfair font-semibold text-red-200 mb-4">{position}</p>
      <a href={`https://instagram.com/${ig}`} target="_blank" rel="noopener noreferrer"
        className="mt-2 inline-flex items-center gap-2 text-red-100 hover:text-white transition-all duration-300 hover:scale-110 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg">
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

const PeriodePage: React.FC<PeriodePageProps> = ({ period }) => {
  const currentData = data[period] || data[31];
  const otherMembers = Object.entries(currentData).filter(([key]) => key !== 'pembina' && key !== 'ketua');
  const year = PERIOD_TO_YEAR_FOR_IMAGES[period];

  return (
    <div className="animate-fade-in">
      <div className="text-center pt-20 pb-12 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
        {/* Mathematical background elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 text-6xl font-playfair">∑</div>
          <div className="absolute top-20 right-20 text-5xl font-playfair">∫</div>
          <div className="absolute bottom-10 left-1/4 text-7xl font-playfair">∞</div>
          <div className="absolute bottom-20 right-1/3 text-6xl font-playfair">∂</div>
        </div>
        
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-playfair font-bold text-red-800 mb-2">
            Struktur Kepengurusan
          </h1>
          <div className="mt-4 flex items-center justify-center gap-3">
            <span className="text-xl md:text-2xl font-playfair italic text-gray-600">Angkatan</span>
            <span className="text-4xl md:text-6xl font-playfair font-bold text-red-800 bg-red-50 px-6 py-2 rounded-lg border-2 border-red-200">
              {period}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-12 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-800/10 to-transparent z-10 pointer-events-none"></div>
        <img
          src={`/assets/periode/${year}/tim${year}.jpg`}
          alt={`Foto tim angkatan ${period}`}
          className="w-full lg:h-228 md:h-full object-cover shadow-2xl transform hover:scale-105 transition-transform duration-700"
        />
      </div>

      <section className="bg-gradient-to-br from-red-800 via-red-900 to-red-800 py-20 text-white relative overflow-hidden">
        {/* Mathematical background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 text-6xl font-playfair animate-float-1">∑</div>
          <div className="absolute top-40 right-20 text-5xl font-playfair animate-float-2">∫</div>
          <div className="absolute bottom-32 left-1/4 text-7xl font-playfair animate-float-3">∞</div>
          <div className="absolute bottom-20 right-1/3 text-6xl font-playfair animate-float-4">∂</div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
          {currentData.pembina && (
            <div className="transform hover:scale-105 transition-transform duration-500">
              <TopMemberLayout
                name={currentData.pembina.name}
                position="Pembina"
                ig={currentData.pembina.ig}
                image={currentData.pembina.image}
                imageAlign="left"
                period={period}
              />
            </div>
          )}
          {currentData.ketua && (
            <div className="transform hover:scale-105 transition-transform duration-500">
              <TopMemberLayout
                name={currentData.ketua.name}
                position="Ketua"
                ig={currentData.ketua.ig}
                image={currentData.ketua.image}
                imageAlign="right"
                period={period}
              />
            </div>
          )}
        </div>
      </section>

      <section className="bg-gradient-to-b from-gray-50 to-white py-20 relative overflow-hidden">
        {/* Mathematical background elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 text-5xl font-playfair">∇</div>
          <div className="absolute bottom-10 right-20 text-6xl font-playfair">π</div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-center text-gray-900 mb-12">
            Anggota Kepengurusan
          </h2>
          <div className="flex flex-wrap justify-center gap-8">
            {otherMembers.map(([pos, member], index) => (
              <div 
                key={pos}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <MemberCard
                  name={member.name}
                  position={pos}
                  ig={member.ig}
                  image={member.image}
                  period={period}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PeriodePage;
