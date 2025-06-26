import React from 'react';
import { InstagramIcon } from './icons';

const Footer: React.FC = () => (
  <footer className="bg-gray-800 text-white">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-center md:text-left">
            <div>
                <h3 className="font-bold uppercase">Contact Us</h3>
                <p className="mt-2 text-gray-300">
                    Jl. A. P. Pettarani No.4, Gn. Sari, Kec. Rappocini, Kota Makassar, Sulawesi Selatan 90222
                </p>
            </div>
            <div className="md:text-right">
                <h3 className="font-bold uppercase">Follow Us</h3>
                 <a href="https://instagram.com/mosaecstelk" target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                    <InstagramIcon />
                    <span>@mosaecstelk</span>
                </a>
            </div>
        </div>
        <div className="mt-8 border-t border-gray-700 py-6 text-center">
            <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} MOSAEC STELK. All rights reserved.</p>
        </div>
  </footer>
);

export default Footer;
