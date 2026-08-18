import React from 'react';
import { BookOpen, Truck, ShieldCheck, Brain } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import translations from '../data/translations.json';

export default function Features() {
  const { language } = useLanguage();
  const t = translations[language].features;

  const features = [
    { icon: <BookOpen className="w-5 h-5" />, label: t.content },
    { icon: <Truck className="w-5 h-5" />, label: t.shipping },
    { icon: <Brain className="w-5 h-5" />, label: t.knowledge },
    { icon: <ShieldCheck className="w-5 h-5" />, label: t.secure }
  ];

  return (
    <section className="reveal delay-200 py-16 px-6 border-b border-white/5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {features.map((feature, i) => (
                <div key={i} className="flex flex-col items-center justify-center text-center gap-4 group">
                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-black transition-all duration-300">
                        {feature.icon}
                    </div>
                    <span className="text-xs font-medium uppercase tracking-wider text-white/70 text-center">{feature.label}</span>
                </div>
            ))}
        </div>
    </section>
  );
}
