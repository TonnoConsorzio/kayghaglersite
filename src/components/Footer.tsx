import React from 'react';
import { ArrowUp } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="pb-8 px-4 md:px-8 mt-12">
        <div className="max-w-[1600px] mx-auto bg-[#1a1a1a] border border-white/10 rounded-[2rem] p-8 md:p-12 relative shadow-2xl">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
                {/* Brand */}
                <div>
                    <span className="font-display text-2xl font-bold tracking-widest uppercase text-white">Kay G. Hagler</span>
                </div>

                {/* Links */}
                <div className="flex flex-wrap justify-center gap-6 text-xs uppercase tracking-wider text-white/70">
                    <a href="#" className="hover:text-brand transition-colors">Contacts</a>
                    <a href="#" className="hover:text-brand transition-colors">Privacy</a>
                    <a href="#" className="hover:text-brand transition-colors">Terms</a>
                    <a href="#" className="hover:text-brand transition-colors">How it's made</a>
                </div>

                <button 
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand hover:text-black transition-all" 
                  onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
                >
                    <ArrowUp className="w-5 h-5" />
                </button>
            </div>

            <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-white/40">
                <p>Copyright © 2024 Kay G. Hagler. All Rights Reserved.</p>
                <p className="flex items-center gap-1">
                    Made with <span className="text-sm">❤️</span> & <span className="text-sm">🍕</span> by <a href="https://alessiobellan.it" target="_blank" rel="noopener noreferrer" className="text-brand hover:text-white transition-colors">Alessio Bellan</a>
                </p>
            </div>
        </div>
    </footer>
  );
}
