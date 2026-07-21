import React, { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

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
            
            {/* Links Left */}
            <div className="hidden md:flex items-center gap-8 text-xs font-medium tracking-widest uppercase text-white/60">
                <a href="#" className="hover:text-brand transition-colors">Home</a>
                <a href="#" className="hover:text-brand transition-colors text-white">Products</a>
            </div>

            {/* Logo Center - Intentionally empty as per original code */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
            </div>

            {/* Icons Right */}
            <div className="flex items-center gap-6">
                <button className="md:hidden text-white">
                    <Menu className="w-6 h-6" />
                </button>
            </div>
        </div>
    </nav>
  );
}
