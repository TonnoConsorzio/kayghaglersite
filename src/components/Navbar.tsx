import React, { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import translations from '../data/translations.json';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 glass-nav transition-all duration-300 ${scrolled ? 'shadow-lg' : ''}`}>
        <div className="md:px-12 flex h-20 max-w-[1600px] mx-auto px-6 items-center justify-between">
            
            {/* Logo Left */}
            <div className="flex items-center">
                <img src="/Logo.svg" alt="Logo" className="h-8" />
            </div>

            {/* Links Center */}
            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8 text-xs font-medium tracking-widest uppercase text-white/60">
                <a href="#" className="hover:text-brand transition-colors">Home</a>
                <a href="#about" className="hover:text-brand transition-colors text-white">{t.nav.about}</a>
            </div>

            {/* Icons Right */}
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 text-lg cursor-pointer select-none">
                    <span 
                      className={`transition-opacity ${language === 'it' ? 'opacity-100 grayscale-0' : 'opacity-40 grayscale'}`} 
                      onClick={() => setLanguage('it')}
                      title="Italiano"
                    >
                      🇮🇹
                    </span>
                    <span 
                      className={`transition-opacity ${language === 'en' ? 'opacity-100 grayscale-0' : 'opacity-40 grayscale'}`} 
                      onClick={() => setLanguage('en')}
                      title="English"
                    >
                      🇬🇧
                    </span>
                </div>
                <button className="md:hidden text-white">
                    <Menu className="w-6 h-6" />
                </button>
            </div>
        </div>
    </nav>
  );
}
