import React, { useMemo } from 'react';
import { ArrowUpRight, ArrowUp, ArrowDown } from 'lucide-react';
import productsData from '../data/products.json';

export default function Hero() {
  const heroProduct = useMemo(() => {
    // Find fixed on home product, fallback to last product if none is fixed
    const activeProducts = productsData.filter(p => !p.isHidden);
    const fixed = activeProducts.find(p => p.isFixedOnHome);
    if (fixed) return fixed;
    return activeProducts[activeProducts.length - 1];
  }, []);

  if (!heroProduct) return null;

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 min-h-[600px] md:h-[80vh] max-h-[900px]">
        {/* Left Hero Card */}
        <div className="reveal lg:col-span-5 md:p-12 lg:p-16 flex flex-col overflow-hidden group bg-[#3a3532] rounded-[2rem] p-8 relative justify-center">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] pointer-events-none"></div>
            
            <div className="relative z-10">
                <h1 className="font-sport text-5xl md:text-6xl lg:text-7xl font-bold uppercase leading-[1] tracking-wide mb-8">
                    {heroProduct.title}
                </h1>
                <p className="text-white/60 text-sm max-w-sm leading-relaxed mb-10">
                    {heroProduct.description}
                </p>
                
                <a href={heroProduct.purchaseUrl} className="inline-block bg-brand hover:bg-white hover:scale-105 text-black font-semibold text-sm uppercase tracking-wide px-8 py-4 rounded-full transition-all duration-300 shadow-[0_10px_30px_rgba(224,168,126,0.3)] w-fit">
                    Explore More
                </a>
            </div>
        </div>

        {/* Right Hero Image */}
        <div className="reveal delay-100 lg:col-span-7 relative rounded-[2rem] overflow-hidden group h-[500px] lg:h-auto">
            <img 
              src={heroProduct.imageUrl} 
              alt={heroProduct.title} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            />
            
            <div className="bg-gradient-to-t from-black/60 to-transparent absolute inset-0"></div>

            {/* Floating Controls */}
            <div className="absolute top-8 right-8">
                <a href={heroProduct.purchaseUrl} className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 hover:bg-white hover:text-black transition-all duration-300 group/btn">
                    <ArrowUpRight className="w-5 h-5 group-hover/btn:rotate-45 transition-transform" />
                </a>
            </div>

            <div className="absolute bottom-8 right-8 flex flex-col gap-3">
                <button className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform">
                    <ArrowUp className="w-4 h-4" />
                </button>
                <button className="w-10 h-10 rounded-full bg-black/50 backdrop-blur text-white flex items-center justify-center border border-white/10 hover:bg-brand hover:border-brand transition-colors">
                    <ArrowDown className="w-4 h-4" />
                </button>
            </div>

            {/* Pagination Dots */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-2">
                <div className="w-1.5 h-6 bg-white rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-white/30 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-white/30 rounded-full"></div>
            </div>
        </div>
    </section>
  );
}
