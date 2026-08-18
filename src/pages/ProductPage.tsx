import React, { useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLanguage } from '../i18n/LanguageContext';

const productsModules = import.meta.glob('../data/products/*.json', { eager: true });

export default function ProductPage() {
  const { id } = useParams();
  const { language } = useLanguage();

  const product = useMemo(() => {
    for (const path in productsModules) {
      const p = (productsModules[path] as any).default || productsModules[path];
      if (p.id === id) {
        return p;
      }
    }
    return null;
  }, [id]);

  useEffect(() => {
    if (product && product.ecwidStoreId) {
      const scriptId = 'ecwid-script';
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.dataset.cfasync = "false";
        script.src = `https://app.ecwid.com/script.js?${product.ecwidStoreId}&data_platform=code`;
        script.charset = "utf-8";
        document.body.appendChild(script);

        const initScript = document.createElement('script');
        initScript.innerHTML = `
          if (typeof xProductBrowser === 'function') {
            xProductBrowser("id=my-store-${product.ecwidStoreId}");
          } else {
            window.ecwid_script_defer = true;
            window.ecwid_dynamic_widgets = true;
            window.ecwid_window_load = function() {
              if (typeof xProductBrowser === 'function') {
                xProductBrowser("id=my-store-${product.ecwidStoreId}");
              }
            };
          }
        `;
        document.body.appendChild(initScript);
      }
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <Navbar />
        <h1 className="text-2xl font-bold">Product not found</h1>
      </div>
    );
  }

  const title = product.title[language] || product.title['en'];
  const description = product.description[language] || product.description['en'];
  const price = product.price;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-brand selection:text-black">
      <Navbar />
      
      <main className="w-full max-w-[1600px] mx-auto pt-32 pb-12 px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-white/5 relative">
              <img 
                src={product.images[0]} 
                alt={title} 
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.slice(1).map((img: string, index: number) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden bg-white/5 cursor-pointer hover:ring-2 hover:ring-brand transition-all">
                    <img src={img} alt={`${title} ${index + 2}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col pt-8">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold uppercase mb-4">{title}</h1>
            <p className="text-2xl font-bold text-brand mb-8">€{price.toFixed(2)}</p>
            
            <div className="text-white/70 text-lg leading-relaxed mb-12">
              <p>{description}</p>
            </div>
            
            {/* Ecwid Widget Container */}
            <div id={`my-store-${product.ecwidStoreId}`} className="mt-8 bg-white/5 rounded-2xl p-6 min-h-[300px]">
              {/* Ecwid widget will render here */}
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
