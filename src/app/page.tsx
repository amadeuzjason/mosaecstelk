'use client';

import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HomePage from '../pages/HomePage';
import PeriodePage from '../pages/PeriodePage';
import EventsPage from '../pages/EventsPage';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('home');

const renderPage = () => {
  if (currentPage.startsWith('periode-')) {
    const year = parseInt(currentPage.split('-')[1], 10);
    return <PeriodePage year={year} />;
  }

  switch (currentPage) {
    case 'home':
      return <HomePage setCurrentPage={setCurrentPage} />;
    case 'events':
      return <EventsPage />;
    default:
      return <HomePage setCurrentPage={setCurrentPage} />;
  }
};

  return (
    <div className="font-sans bg-gray-100">
      {/* CSS Global untuk animasi */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
      `}</style>

      <Navbar setCurrentPage={setCurrentPage} />
      <main className="min-h-screen">{renderPage()}</main>
      <Footer />
    </div>
  );
};


export default App;
