import { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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

export default function App() {
  const [introComplete, setIntroComplete] = useState(!siteConfig.intro.enabled);

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
