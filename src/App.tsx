import { useState, useEffect, useCallback } from 'react';
import { HashRouter as Router, Navigate, Routes, Route, useLocation } from 'react-router-dom';
import IntroOverlay from './components/IntroOverlay';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import LegalDocumentPage from './components/LegalDocument';
import siteConfig from './config/site.json';

const legalDocuments = [siteConfig.legal.privacy, siteConfig.legal.terms];

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [introComplete, setIntroComplete] = useState(() => {
    if (!siteConfig.intro.enabled) return true;

    try {
      return sessionStorage.getItem('kgh-intro-seen') === '1';
    } catch {
      return false;
    }
  });

  const completeIntro = useCallback(() => {
    try {
      sessionStorage.setItem('kgh-intro-seen', '1');
    } catch {
      // Storage can be unavailable in private browsing; the intro still completes.
    }
    setIntroComplete(true);
  }, []);

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
          <IntroOverlay onComplete={completeIntro} />
        )}
        
        <div className={!introComplete ? 'h-screen overflow-hidden' : ''}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/legal" element={<LegalDocumentPage documents={legalDocuments} />} />
            <Route path="/privacy" element={<Navigate to="/legal" replace />} />
            <Route path="/terms" element={<Navigate to="/legal" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
