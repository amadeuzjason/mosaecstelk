// File: app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'MOSAEC STELK - Official Website',
  description: 'Website resmi MOSAEC STELK.',
  icons: {
    icon: "assets/logo/mosaec.png", // ganti ke nama file kamu jika berbeda
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${inter.className} bg-gray-100 text-gray-800`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
