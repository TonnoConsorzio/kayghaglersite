import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import aboutData from '../data/about.json';

export default function About() {
  const { language } = useLanguage();
  const content = aboutData[language];

  return (
    <section id="about" className="py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <div className="reveal">
                <h2 className="font-display text-4xl md:text-5xl font-bold uppercase mb-8">{content.title}</h2>
                <div className="space-y-6 text-white/60 text-sm leading-relaxed border-l-2 border-brand pl-4">
                    <p>{content.description}</p>
                </div>
            </div>

            {/* Image Composition */}
            <div className="reveal delay-100 relative">
                <div className="absolute -top-4 -right-4 w-24 h-48 bg-brand rounded-r-2xl z-0"></div>
                <div className="relative z-10 rounded-2xl overflow-hidden h-[500px]">
                    <img 
                      src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=2000&auto=format&fit=crop" 
                      alt="About Us" 
                      className="cursor-pointer w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                    />
                </div>
            </div>
        </div>
    </section>
  );
}
