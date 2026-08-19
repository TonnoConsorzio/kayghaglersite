import { useLanguage } from '../i18n/LanguageContext';
import aboutData from '../data/about.json';
import siteConfig from '../config/site.json';

export default function About() {
  const { language } = useLanguage();
  const content = aboutData[language];

  return (
    <section id="about" className="about-section">
        <div className="about-copy reveal">
                <p className="eyebrow">{language === 'it' ? 'Dietro i libri' : 'Behind the books'}</p>
                <h2>{content.title}</h2>
                <div className="about-body">
                    <p>{content.description}</p>
                </div>
        </div>
        <div className="about-image reveal delay-100">
                    <img 
                      src={siteConfig.homepage.about.image}
                      alt=""
                      width="900"
                      height="1100"
                      loading="lazy"
                    />
        </div>
    </section>
  );
}
