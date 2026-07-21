import React, { useState, useEffect } from 'react';
import IntroOverlay from './components/IntroOverlay';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import About from './components/About';
import Footer from './components/Footer';

export default function App() {
  const [introComplete, setIntroComplete] = useState(false);

  useEffect(() => {
    if (!introComplete) return;

    // Scroll Reveal Animation logic
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    const setupReveal = () => {
      const revealElements = document.querySelectorAll('.reveal');
      revealElements.forEach(el => observer.observe(el));

      // Initial Load Animation check
      setTimeout(() => {
        document.querySelectorAll('.reveal').forEach((el, index) => {
          if (el.getBoundingClientRect().top < window.innerHeight) {
            setTimeout(() => {
              el.classList.add('active');
            }, index * 100);
          }
        });
      }, 100);
    };

    // Small delay to ensure DOM is fully rendered after intro finishes
    setTimeout(setupReveal, 50);

    return () => observer.disconnect();
  }, [introComplete]);

  return (
    <div className="selection:bg-brand-500 selection:text-white text-[#f5f5f5]">
      {!introComplete && (
        <IntroOverlay onComplete={() => setIntroComplete(true)} />
      )}
      
      {/* We always render the main layout but can hide scrollbar when intro is active if needed, or it's just underneath */}
      <div className={!introComplete ? 'h-screen overflow-hidden' : ''}>
        <Navbar />
        
        <main className="w-full max-w-[1600px] mx-auto pt-24 pb-12 px-4 md:px-8 selection:bg-brand-500 selection:text-white">
          <Hero />
          <Features />
          <About />
        </main>

        <Footer />
      </div>
    </div>
  );
}
