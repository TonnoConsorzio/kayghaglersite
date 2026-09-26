import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import siteConfig from '../config/site.json';
import Navbar from './Navbar';
import Footer from './Footer';

type LocalizedCopy = { en: string; it: string };
type LegalDocument = {
  title: LocalizedCopy;
  intro: LocalizedCopy;
  sections: Array<{ heading: LocalizedCopy; paragraphs: Record<'en' | 'it', string[]> }>;
};

type LegalDocumentPageProps = {
  documents: LegalDocument[];
};

function fill(text: string): string {
  const { seller } = siteConfig.legal;
  return text
    .replaceAll('{{sellerName}}', seller.name)
    .replaceAll('{{sellerAddress}}', seller.address)
    .replaceAll('{{sellerEmail}}', seller.email);
}

export default function LegalDocumentPage({ documents }: LegalDocumentPageProps) {
  const { language } = useLanguage();

  return <div className="page-shell">
    <Navbar />
    <main id="main-content" className="page-content legal-page">
      <Link to="/" className="back-link">{language === 'it' ? 'Torna alla home' : 'Back home'}</Link>
      <article className="legal-document">
        {documents.map((document) => <section className="legal-document-block" key={document.title.en}>
          {documents.length === 1 ? <h1>{document.title[language]}</h1> : <h2>{document.title[language]}</h2>}
          {document.intro[language].split(/\n\n+/).map((paragraph) => <p className="legal-document-intro" key={paragraph}>{paragraph}</p>)}
          {document.sections.map((section) => <section key={section.heading.en}>
            <h2>{section.heading[language]}</h2>
            {section.paragraphs[language].map((paragraph) => <p key={paragraph}>{fill(paragraph)}</p>)}
          </section>)}
        </section>)}
      </article>
    </main>
    <Footer />
  </div>;
}
