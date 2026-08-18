import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import About from '../components/About';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-brand selection:text-black">
      <Navbar />
      <Hero />
      
      <main className="px-4 md:px-8 max-w-[1600px] mx-auto">
        <Features />
        <About />
      </main>

      <Footer />
    </div>
  );
}
