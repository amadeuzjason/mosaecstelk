import React from 'react';
import { InstagramIcon } from './icons';

const Footer: React.FC = () => (
  <footer className="bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 text-white relative overflow-hidden">
    {/* Mathematical background elements */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-10 left-10 text-5xl font-playfair animate-float-1">∑</div>
      <div className="absolute top-20 right-20 text-4xl font-playfair animate-float-2">∫</div>
      <div className="absolute bottom-20 left-1/4 text-6xl font-playfair animate-float-3">∞</div>
      <div className="absolute bottom-10 right-1/3 text-5xl font-playfair animate-float-4">∂</div>
      <div className="absolute top-1/2 left-1/3 text-4xl font-playfair animate-float-5">∇</div>
    </div>
    
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-center md:text-left">
        <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
          <h3 className="font-playfair font-bold text-2xl uppercase mb-4 text-red-200">Contact Us</h3>
          <p className="text-gray-300 leading-relaxed text-lg">
            Jl. A. P. Pettarani No.4, Gn. Sari, Kec. Rappocini, Kota Makassar, Sulawesi Selatan 90222
          </p>
        </div>
        
        <div className="md:text-right bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
          <h3 className="font-playfair font-bold text-2xl uppercase mb-4 text-red-200">Follow Us</h3>
          <a 
            href="https://instagram.com/mosaecstelk" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="mt-2 inline-flex items-center gap-3 text-gray-300 hover:text-white transition-all duration-300 hover:scale-110 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-lg"
          >
            <InstagramIcon />
            <span className="font-medium">@mosaecstelk</span>
          </a>
        </div>
      </div>
      
      <div className="mt-12 border-t border-white/20 py-6 text-center">
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-gray-400 font-playfair">
            &copy; {new Date().getFullYear()} <span className="text-red-200 font-bold">MOSAEC STELK</span>. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="font-playfair italic">f(x) = Excellence</span>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
