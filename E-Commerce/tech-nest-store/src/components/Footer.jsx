import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  // GLOBALIZED PULL: Connecting native layout metadata instantly to shared absolute workspace theme triggers
  const { isDarkMode } = useCart();

  const playPremiumBeep = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (err) {}
  };

  return (
    <footer className={`pt-32 pb-12 px-6 md:px-10 border-t mt-40 relative overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-[#121212] border-white/10' : 'bg-white border-gray-100'}`} aria-label="Site Footer">
      {/* LUXURY BACKGROUND PATTERN */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-30"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* TOP SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-16 mb-24 text-left">
          
          {/* BRAND BLOCK */}
          <div className="lg:col-span-1 space-y-8">
            <Link to="/" onClick={playPremiumBeep} className={`inline-block text-5xl font-black tracking-tighter italic leading-none text-inherit hover:opacity-80 transition-opacity ${isDarkMode ? 'text-white' : 'text-black'}`}>
              TERABYTE<span className="text-[#D4AF37]">.</span>
            </Link>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] leading-relaxed max-w-[250px]">
              The global benchmark for premium electronics and aerospace-grade precision engineering.
            </p>
            
            {/* FUNCTIONAL SOCIAL MEDIA LINKS */}
            <div className="flex gap-6 text-[10px] font-black tracking-widest uppercase">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Follow us on Instagram"
                className={`hover:text-[#D4AF37] transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-black'}`}
              >
                Instagram
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Follow us on Twitter"
                className={`hover:text-[#D4AF37] transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-black'}`}
              >
                Twitter
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Connect with us on LinkedIn"
                className={`hover:text-[#D4AF37] transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-black'}`}
              >
                LinkedIn
              </a>
            </div>
          </div>

          {/* INFORMATION MATRIX */}
          <div className={`lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-12 border-l md:pl-16 ${isDarkMode ? 'border-white/10' : 'border-gray-50'}`}>
            <div className="space-y-6">
              <h3 className="text-[9px] font-black text-[#D4AF37] tracking-[0.5em] uppercase border-b border-[#D4AF37]/20 pb-2 w-fit">Support</h3>
              <div className="space-y-4">
                <a 
                  href="mailto:support@terabyte.in" 
                  className={`block text-sm font-bold uppercase tracking-tight hover:text-[#D4AF37] transition-colors ${isDarkMode ? 'text-white' : 'text-black'}`}
                >
                  support@terabyte.in
                </a>
                <a 
                  href="tel:+919876543210" 
                  className={`block text-sm font-bold uppercase tracking-tight hover:text-[#D4AF37] transition-colors ${isDarkMode ? 'text-white' : 'text-black'}`}
                >
                  +91 98765 43210
                </a>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-[9px] font-black text-[#D4AF37] tracking-[0.5em] uppercase border-b border-[#D4AF37]/20 pb-2 w-fit">Quick Links</h3>
              <ul className="space-y-3 text-[11px] font-black tracking-widest uppercase text-gray-500">
                <li>
                  <Link to="/products" onClick={playPremiumBeep} className={`transition-all block ${isDarkMode ? 'hover:text-white' : 'hover:text-black'}`}>Store Archive</Link>
                </li>
                <li>
                  <Link to="/contact" onClick={playPremiumBeep} className={`transition-all block ${isDarkMode ? 'hover:text-white' : 'hover:text-black'}`}>Tech Labs</Link>
                </li>
                <li>
                  <Link to="/" onClick={playPremiumBeep} className={`transition-all block ${isDarkMode ? 'hover:text-white' : 'hover:text-black'}`}>Our Heritage</Link>
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <h3 className="text-[9px] font-black text-[#D4AF37] tracking-[0.5em] uppercase border-b border-[#D4AF37]/20 pb-2 w-fit">Location</h3>
              <p className="text-[11px] font-bold text-gray-500 uppercase leading-relaxed tracking-widest">
                Terabyte HQ, Indiranagar<br />
                100ft Road, Bangalore<br />
                India
              </p>
            </div>
          </div>
        </div>

        {/* MIDDLE SECTION: THE LUXURY LINE */}
        <div className={`border-y py-16 flex flex-col md:flex-row justify-between items-center group ${isDarkMode ? 'border-white/10' : 'border-gray-50'}`}>
          <div className="text-center md:text-left">
              <p className={`text-4xl font-black tracking-tighter uppercase italic opacity-10 group-hover:opacity-100 transition-opacity duration-1000 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                Arul Hardware Standards
              </p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
              <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse" aria-hidden="true"></div>
              <p className="text-[9px] font-black tracking-[0.4em] uppercase text-gray-500">Active Global Network</p>
          </div>
        </div>

        {/* BOTTOM SECTION: CREDITS */}
        <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div className="flex items-center gap-8">
            <p className="text-[9px] font-black text-gray-500 tracking-[0.4em] uppercase">
              © {currentYear} Terabyte Intl.
            </p>
          </div>

          {/* SIGNATURE */}
          <div className="group cursor-default">
            <p className={`text-[10px] font-black tracking-[1em] uppercase pl-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
              Architected By <span className="text-[#D4AF37]">Arul</span>
            </p>
          </div>

          <div className="flex gap-6">
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest italic">Ed. 2.0.26</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;