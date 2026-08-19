import { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, useSearchParams } from 'react-router-dom';
import IntroOverlay from './components/IntroOverlay';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import LegalDocumentPage from './components/LegalDocument';
import siteConfig from './config/site.json';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function ScrollToSection({ ready }: { ready: boolean }) {
  const [searchParams] = useSearchParams();
  const section = searchParams.get('section') ?? new URLSearchParams(window.location.search).get('section');

  useEffect(() => {
    if (!ready || !section) return;
    const timer = window.setTimeout(() => {
      const target = document.getElementById(section);
      if (!target) return;
      const top = target.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top, behavior: 'auto' });
    }, 120);
    return () => window.clearTimeout(timer);
  }, [ready, section]);

  return null;
}

export default function App() {
  const linkedSection = new URLSearchParams(window.location.search).has('section') || new URLSearchParams(window.location.hash.split('?')[1] ?? '').has('section');
  const [introComplete, setIntroComplete] = useState(!siteConfig.intro.enabled || linkedSection);

  useEffect(() => {
    if (!introComplete) return;

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

    setTimeout(setupReveal, 50);

    return () => observer.disconnect();
  }, [introComplete]);

  return (
    <Router>
      <ScrollToTop />
      <ScrollToSection ready={introComplete} />
      <div className="selection:bg-brand-500 selection:text-white">
        <a className="skip-link" href="#main-content">Skip to content</a>
        {!introComplete && (
          <IntroOverlay onComplete={() => setIntroComplete(true)} />
        )}
        
        <div className={!introComplete ? 'h-screen overflow-hidden' : ''}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/privacy" element={<LegalDocumentPage document={siteConfig.legal.privacy} />} />
            <Route path="/terms" element={<LegalDocumentPage document={siteConfig.legal.terms} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
