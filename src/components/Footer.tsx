import React from 'react';
import { ArrowUp } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import translations from '../data/translations.json';

export default function Footer() {
  const { language } = useLanguage();
  const t = translations[language].footer;

  return (
    <footer className="pb-8 px-4 md:px-8 mt-12">
        <div className="max-w-[1600px] mx-auto bg-[#1a1a1a] border border-white/10 rounded-[2rem] p-8 md:p-12 relative shadow-2xl">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
                {/* Brand */}
                <div>
                    <img src="/Logo.svg" alt="Logo" className="h-8 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
                </div>

                {/* Links */}
                <div className="flex flex-wrap justify-center gap-6 text-xs uppercase tracking-wider text-white/70">
                    <a href="#" className="hover:text-brand transition-colors">Contacts</a>
                    <a href="#" className="hover:text-brand transition-colors">Privacy</a>
                    <a href="#" className="hover:text-brand transition-colors">Terms</a>
                </div>

                <button 
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand hover:text-black transition-all" 
                  onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
                >
                    <ArrowUp className="w-5 h-5" />
                </button>
            </div>

            <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-white/40">
                <p>{t.copyright}</p>
                <p className="flex items-center gap-1">
                    Made with <span className="text-sm">❤️</span> & <span className="text-sm">🍕</span> by <a href="https://alessiobellan.it" target="_blank" rel="noopener noreferrer" className="text-brand hover:text-white transition-colors">Alessio Bellan</a>
                </p>
            </div>
        </div>
    </footer>
  );
}
