import React, { useMemo } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import translations from '../data/translations.json';
import { Link } from 'react-router-dom';

const productsModules = import.meta.glob('../data/products/*.json', { eager: true });

export default function Hero() {
  const { language } = useLanguage();
  const t = translations[language].hero;

  const heroProduct = useMemo(() => {
    // Get products
    const activeProducts = Object.values(productsModules).map((module: any) => module.default || module)
      .filter(p => !p.isHidden);
    const fixed = activeProducts.find(p => p.isFixedOnHome);
    if (fixed) return fixed;
    return activeProducts[activeProducts.length - 1];
  }, []);

  if (!heroProduct) return null;

  const title = heroProduct.title[language] || heroProduct.title['en'];
  const description = heroProduct.description[language] || heroProduct.description['en'];
  const imageUrl = heroProduct.images?.[0] || '';

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 min-h-[600px] md:h-[80vh] max-h-[900px]">
        {/* Left Hero Card */}
        <div className="reveal lg:col-span-5 md:p-12 lg:p-16 flex flex-col overflow-hidden group bg-[#3a3532] rounded-[2rem] p-8 relative justify-center">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] pointer-events-none"></div>
            
            <div className="relative z-10">
                <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold uppercase leading-[1] tracking-wide mb-8">
                    {title}
                </h1>
                <p className="text-white/60 text-sm max-w-sm leading-relaxed mb-10">
                    {description}
                </p>
                
                <Link to={`/product/${heroProduct.id}`} className="inline-block bg-brand hover:bg-white hover:scale-105 text-black font-semibold text-sm uppercase tracking-wide px-8 py-4 rounded-full transition-all duration-300 shadow-[0_10px_30px_rgba(224,168,126,0.3)] w-fit">
                    {t.button}
                </Link>
            </div>
        </div>

        {/* Right Hero Image */}
        <div className="reveal delay-100 lg:col-span-7 relative rounded-[2rem] overflow-hidden group h-[500px] lg:h-auto cursor-pointer" onClick={() => window.location.href = `/product/${heroProduct.id}`}>
            <img 
              src={imageUrl} 
              alt={title} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            />
            
            <div className="bg-gradient-to-t from-black/60 to-transparent absolute inset-0 pointer-events-none"></div>

            {/* Floating Controls */}
            <div className="absolute top-8 right-8">
                <Link to={`/product/${heroProduct.id}`} className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 hover:bg-white hover:text-black transition-all duration-300 group/btn">
                    <ArrowUpRight className="w-5 h-5 group-hover/btn:rotate-45 transition-transform" />
                </Link>
            </div>
        </div>
    </section>
  );
}
