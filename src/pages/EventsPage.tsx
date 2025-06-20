import React from 'react';
import { ArrowRightIcon } from 'lucide-react'; // atau ganti dengan ikon SVG sendiri jika tidak pakai lucide

interface EventItem {
  title: string;
  date: string;
  description: string;
  image: string;
}

const EventsPage: React.FC = () => {
  const events: EventItem[] = [
    {
      title: 'MOSAEC Fest 2024',
      date: '15 - 17 Agustus 2024',
      description:
        'Festival tahunan yang menampilkan bakat siswa di bidang seni, musik, dan teknologi. Dimeriahkan dengan berbagai lomba dan bazaar.',
      image: 'https://placehold.co/600x400/b91c1c/ffffff?text=MOSAEC+Fest',
    },
    {
      title: 'LDKS (Latihan Dasar Kepemimpinan Siswa)',
      date: '20 - 22 September 2024',
      description:
        'Program pelatihan untuk calon pengurus organisasi, bertujuan untuk membangun karakter pemimpin yang tangguh dan bertanggung jawab.',
      image: 'https://placehold.co/600x400/7f1d1d/ffffff?text=LDKS',
    },
    {
      title: "Webinar Teknologi 'Future-Ready'",
      date: '5 Oktober 2024',
      description:
        'Webinar inspiratif bersama praktisi industri IT, membahas tren teknologi terbaru dan persiapan karir di dunia digital.',
      image: 'https://placehold.co/600x400/991b1b/ffffff?text=Webinar+Tech',
    },
    {
      title: 'Peringatan Hari Guru Nasional',
      date: '25 November 2024',
      description:
        'Acara spesial untuk mengapresiasi jasa para guru di SMK Telkom Makassar. Termasuk upacara, persembahan siswa, dan games seru.',
      image: 'https://placehold.co/600x400/7f1d1d/ffffff?text=Hari+Guru',
    },
  ];

  const EventCard: React.FC<EventItem> = ({ title, date, description, image }) => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transform hover:-translate-y-2 transition-transform duration-300">
      <img
        src={image}
        alt={`Gambar untuk ${title}`}
        className="w-full h-56 object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).onerror = null;
          (e.target as HTMLImageElement).src =
            'https://placehold.co/600x400/cccccc/ffffff?text=Image+Not+Found';
        }}
      />
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        <p className="mt-2 text-sm font-semibold text-red-700">{date}</p>
        <p className="mt-3 text-gray-600 flex-grow">{description}</p>
        <a href="#" className="mt-4 inline-flex items-center text-red-800 font-semibold hover:text-red-900">
          Baca Selengkapnya <ArrowRightIcon className="ml-2 w-4 h-4" />
        </a>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-100 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-red-800">Agenda & Kegiatan</h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-600">
            Jelajahi berbagai acara menarik yang kami selenggarakan untuk seluruh siswa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {events.map((event, index) => (
            <EventCard key={index} {...event} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
