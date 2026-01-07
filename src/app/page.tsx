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
    const period = parseInt(currentPage.split('-')[1], 10);
    return <PeriodePage period={period} />;
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
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes titleReveal {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
            filter: blur(4px);
          }
          50% {
            opacity: 0.5;
            transform: translateY(15px) scale(0.98);
            filter: blur(2px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }
        
        @keyframes fadeInDelay1 {
          0% {
            opacity: 0;
            transform: translateY(15px);
          }
          100% {
            opacity: 0.8;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInDelay2 {
          0% {
            opacity: 0;
            transform: translateY(15px);
          }
          100% {
            opacity: 0.8;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInDelay3 {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInDelay4 {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.9);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        .animate-title-reveal {
          animation: titleReveal 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        
        .animate-fade-in-delay-1 {
          animation: fadeInDelay1 0.9s cubic-bezier(0.4, 0, 0.2, 1) 0.3s forwards;
          opacity: 0;
        }
        
        .animate-fade-in-delay-2 {
          animation: fadeInDelay2 0.9s cubic-bezier(0.4, 0, 0.2, 1) 0.6s forwards;
          opacity: 0;
        }
        
        .animate-fade-in-delay-3 {
          animation: fadeInDelay3 1s cubic-bezier(0.4, 0, 0.2, 1) 0.9s forwards;
          opacity: 0;
        }
        
        .animate-fade-in-delay-4 {
          animation: fadeInDelay4 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 1.2s forwards;
          opacity: 0;
        }
        
        @keyframes float1 {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        
        @keyframes float2 {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(-5deg);
          }
        }
        
        @keyframes float3 {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-25px) rotate(3deg);
          }
        }
        
        @keyframes float4 {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-18px) rotate(-3deg);
          }
        }
        
        @keyframes float5 {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-22px) rotate(4deg);
          }
        }
        
        .animate-float-1 {
          animation: float1 6s ease-in-out infinite;
        }
        
        .animate-float-2 {
          animation: float2 7s ease-in-out infinite 0.5s;
        }
        
        .animate-float-3 {
          animation: float3 8s ease-in-out infinite 1s;
        }
        
        .animate-float-4 {
          animation: float4 6.5s ease-in-out infinite 1.5s;
        }
        
        .animate-float-5 {
          animation: float5 7.5s ease-in-out infinite 0.8s;
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-scale-in {
          animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>

      <Navbar setCurrentPage={setCurrentPage} />
      <main className="min-h-screen">{renderPage()}</main>
      <Footer />
    </div>
  );
};


export default App;
