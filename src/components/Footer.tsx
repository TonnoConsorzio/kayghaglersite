import { ArrowUp } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import translations from '../data/translations.json';
import siteConfig from '../config/site.json';

export default function Footer() {
  const { language } = useLanguage();
  const t = translations[language].footer;

  return (
    <footer className="site-footer">
        <div className="footer-main">
          <div>
            <img src={siteConfig.site.logo} alt={siteConfig.site.name} width="150" height="32" loading="lazy" />
            <p>{siteConfig.site.tagline[language]}</p>
          </div>
          <div className="footer-links"><a href="mailto:hello@kayghagler.com">{t.contact ?? 'Contact'}</a><a href="/#about">{translations[language].nav.about}</a></div>
          <button type="button" className="back-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label={language === 'it' ? 'Torna all’inizio' : 'Back to top'}><ArrowUp size={17} aria-hidden="true" /></button>
        </div>
        <div className="footer-bottom"><p>{t.copyright}</p><p><a href="https://alessiobellan.it" target="_blank" rel="noopener noreferrer">Alessio Bellan</a></p></div>
    </footer>
  );
}
