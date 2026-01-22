import React, { useState, useEffect } from 'react';
import { ArrowRight, X } from 'lucide-react';

interface EventItem {
  title: string;
  date: string;
  description: string;
  image: string;
  details?: string;
  location?: string;
  participants?: string;
}

const EventsPage: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        if (response.ok) {
          const data = await response.json();
          setEvents(data);
        } else {
          console.error('Failed to fetch events');
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const EventCard: React.FC<EventItem & { onClick: () => void }> = ({ title, date, description, image, onClick }) => (
    <div 
      className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transform hover:-translate-y-3 hover:shadow-2xl transition-all duration-500 cursor-pointer border-2 border-transparent hover:border-red-200 group"
      onClick={onClick}
    >
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={`Gambar untuk ${title}`}
          className="w-full h-56 object-cover bg-red-800 transform group-hover:scale-110 transition-transform duration-700"
          onError={(e) => {
            (e.target as HTMLImageElement).onerror = null;
            (e.target as HTMLImageElement).src =
              'https://placehold.co/600x400/cccccc/ffffff?text=Image+Not+Found';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="p-6 flex-grow flex flex-col bg-gradient-to-b from-white to-gray-50">
        <h3 className="text-xl font-playfair font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm font-semibold text-red-700 mb-3 flex items-center gap-2">
          <span className="text-lg">📅</span> {date}
        </p>
        <p className="text-gray-600 flex-grow mb-4 line-clamp-3">{description}</p>
        <button className="mt-auto inline-flex items-center text-red-800 font-semibold hover:text-red-900 group-hover:gap-3 transition-all duration-300">
          Baca Selengkapnya <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="bg-gradient-to-b from-gray-100 to-white animate-fade-in relative overflow-hidden min-h-screen">
        {/* Mathematical background elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 text-6xl font-playfair animate-float-1">∑</div>
          <div className="absolute top-40 right-20 text-5xl font-playfair animate-float-2">∫</div>
          <div className="absolute bottom-32 left-1/4 text-7xl font-playfair animate-float-3">∞</div>
          <div className="absolute bottom-20 right-1/3 text-6xl font-playfair animate-float-4">∂</div>
          <div className="absolute top-1/2 left-1/3 text-5xl font-playfair animate-float-5">∇</div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-playfair font-bold text-red-800 mb-4">
              Agenda & Kegiatan
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-600 font-playfair">
              Jelajahi berbagai acara menarik yang kami selenggarakan untuk seluruh siswa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {events.map((event, index) => (
              <div 
                key={index}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <EventCard {...event} onClick={() => setSelectedEvent(event)} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div 
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedEvent(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transform animate-scale-in relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 z-10 bg-red-800 text-white rounded-full p-2 hover:bg-red-900 transition-colors duration-300 hover:scale-110"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="relative">
              <img
                src={selectedEvent.image}
                alt={selectedEvent.title}
                className="w-full h-64 md:h-80 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).onerror = null;
                  (e.target as HTMLImageElement).src =
                    'https://placehold.co/800x400/cccccc/ffffff?text=Image+Not+Found';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-2">
                  {selectedEvent.title}
                </h2>
                <p className="text-lg text-red-200">{selectedEvent.date}</p>
              </div>
            </div>
            
            <div className="p-6 md:p-8">
              <div className="space-y-4 mb-6">
                {selectedEvent.location && (
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📍</span>
                    <div>
                      <p className="font-semibold text-gray-900">Lokasi</p>
                      <p className="text-gray-600">{selectedEvent.location}</p>
                    </div>
                  </div>
                )}
                {selectedEvent.participants && (
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">👥</span>
                    <div>
                      <p className="font-semibold text-gray-900">Peserta</p>
                      <p className="text-gray-600">{selectedEvent.participants}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="border-t pt-6">
                <h3 className="text-xl font-playfair font-bold text-gray-900 mb-3">Deskripsi</h3>
                <p className="text-gray-600 leading-relaxed mb-4">{selectedEvent.description}</p>
                {selectedEvent.details && (
                  <>
                    <h3 className="text-xl font-playfair font-bold text-gray-900 mb-3">Detail Kegiatan</h3>
                    <p className="text-gray-600 leading-relaxed">{selectedEvent.details}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EventsPage;
