import './globals.css';
import { Inter } from 'next/font/google';
import React from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'MOSAEC STELK - Official Website',
  description: 'Website resmi MOSAEC STELK.',
  icons: {
    icon: "assets/logo/mosaec.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${inter.className} bg-gray-100 text-gray-800`}>
        {children}
      </body>
    </html>
  );
}
