import { ArrowUp } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import translations from '../data/translations.json';
import siteConfig from '../config/site.json';
import { Link } from 'react-router-dom';
import LiquidImage from './LiquidImage';

export default function Footer() {
  const { language } = useLanguage();

  return (
    <footer className="site-footer">
        <div className="footer-main">
          <div>
            <LiquidImage src={siteConfig.site.logo} alt={siteConfig.site.name} width={150} height={32} />
            <p>{siteConfig.site.tagline[language]}</p>
          </div>
          <div className="footer-links">
            <a href={`mailto:${siteConfig.footer.contactEmail}`}>{language === 'it' ? 'Contatti' : 'Contact'}</a>
            <Link to="/?section=introduction">{translations[language].nav.introduction}</Link>
            <Link to="/privacy">{language === 'it' ? 'Privacy' : 'Privacy policy'}</Link>
            <Link to="/terms">{language === 'it' ? 'Termini' : 'Terms'}</Link>
          </div>
          <button type="button" className="back-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label={language === 'it' ? 'Torna all’inizio' : 'Back to top'}><ArrowUp size={17} aria-hidden="true" /></button>
        </div>
        <div className="footer-bottom"><p>{siteConfig.footer.copyright[language]}</p><p><a href="https://alessiobellan.it" target="_blank" rel="noopener noreferrer">{siteConfig.footer.credit[language]}</a></p></div>
    </footer>
  );
}
