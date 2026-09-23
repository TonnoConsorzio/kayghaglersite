import { useEffect, useState } from 'react';
import { Globe, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import translations from '../data/translations.json';
import siteConfig from '../config/site.json';
import LiquidImage from './LiquidImage';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const location = useLocation();
  const t = translations[language];
  const section = new URLSearchParams(location.search).get('section');
  const isHome = location.pathname === '/';
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => closeMenu(), [location.pathname, location.search]);

  return <header className={`site-header ${scrolled ? 'site-header-scrolled' : ''}`}>
    <nav className="site-nav" aria-label="Primary navigation">
      <Link to="/" className="brand-mark" aria-label={siteConfig.site.name} onClick={closeMenu}>
        <LiquidImage src={siteConfig.site.logo} alt={siteConfig.site.name} width={150} height={32} loading="eager" />
      </Link>
      <div id="site-navigation" className={`nav-links ${menuOpen ? 'nav-links-open' : ''}`}>
        <Link to="/" onClick={closeMenu} className={isHome && !section ? 'nav-link-active' : ''} aria-current={isHome && !section ? 'page' : undefined}>{t.nav.home ?? 'Home'}</Link>
        <Link to="/?section=catalogue" onClick={closeMenu} className={isHome && section === 'catalogue' ? 'nav-link-active' : ''} aria-current={isHome && section === 'catalogue' ? 'location' : undefined}>{t.nav.catalogue ?? 'Catalogue'}</Link>
        <Link to="/?section=introduction" onClick={closeMenu} className={isHome && section === 'introduction' ? 'nav-link-active' : ''} aria-current={isHome && section === 'introduction' ? 'location' : undefined}>{t.nav.introduction}</Link>
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
