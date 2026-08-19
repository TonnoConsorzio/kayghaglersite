import { useEffect, useState } from 'react';
import { Globe, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import translations from '../data/translations.json';
import siteConfig from '../config/site.json';
import LiquidImage from './LiquidImage';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return <header className={`site-header ${scrolled ? 'site-header-scrolled' : ''}`}>
    <nav className="site-nav" aria-label="Primary navigation">
      <Link to="/" className="brand-mark" aria-label={siteConfig.site.name} onClick={() => setMenuOpen(false)}>
        <LiquidImage src={siteConfig.site.logo} alt={siteConfig.site.name} width={150} height={32} loading="eager" />
      </Link>
      <div id="site-navigation" className={`nav-links ${menuOpen ? 'nav-links-open' : ''}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>{t.nav.home ?? 'Home'}</Link>
        <Link to="/?section=catalogue" onClick={() => setMenuOpen(false)}>{t.nav.catalogue ?? 'Catalogue'}</Link>
        <Link to="/?section=introduction" onClick={() => setMenuOpen(false)}>{t.nav.introduction}</Link>
      </div>
      <div className="nav-actions">
        <div className="language-switcher" aria-label="Language">
          <Globe size={15} aria-hidden="true" />
          <button type="button" className={language === 'it' ? 'language-active' : ''} onClick={() => setLanguage('it')} aria-label="Italiano">IT</button>
          <span aria-hidden="true">/</span>
          <button type="button" className={language === 'en' ? 'language-active' : ''} onClick={() => setLanguage('en')} aria-label="English">EN</button>
        </div>
        <button type="button" className="menu-toggle" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-controls="site-navigation" aria-label={menuOpen ? 'Close menu' : 'Open menu'}>
          {menuOpen ? <X size={21} aria-hidden="true" /> : <Menu size={21} aria-hidden="true" />}
        </button>
      </div>
    </nav>
  </header>;
}
