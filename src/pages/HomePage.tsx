import { ArrowUpRight, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { useCatalog } from '../hooks/useCatalog';
import { formatPrice, getLatestProducts, getLocalizedValue, stripHtml } from '../services/ecwidClient';
import { useLanguage } from '../i18n/LanguageContext';
import LiquidImage from '../components/LiquidImage';

export default function HomePage() {
  const catalog = useCatalog();
  const { language } = useLanguage();
  const featured = getLatestProducts(catalog.products, 1, language);
  const editions = getLatestProducts(catalog.products, catalog.products.length);

  return (
    <div className="page-shell">
      <Navbar />
      <main id="main-content" className="page-content">
        <Hero product={featured[0]} loading={catalog.loading} />
        {catalog.error && !catalog.products.length && <div className="catalog-state catalog-state-error" role="alert"><p>{language === 'it' ? 'Il catalogo non è disponibile.' : 'The catalogue is unavailable.'}</p><button type="button" className="button button-quiet" onClick={catalog.retry}><RefreshCw size={15} aria-hidden="true" /> {language === 'it' ? 'Riprova' : 'Try again'}</button></div>}
        {!catalog.loading && editions.length > 0 && <section className="home-editions" aria-label={language === 'it' ? 'Edizioni disponibili' : 'Available editions'}>
          <div className="home-editions-heading"><span>{language === 'it' ? 'Edizioni' : 'Editions'}</span><span>{editions.length} {language === 'it' ? 'titoli' : 'titles'}</span></div>
          <div className="home-editions-grid">
            {editions.map((edition) => {
              const editionLanguage = edition.language ?? language;
              const title = stripHtml(getLocalizedValue(edition.title, editionLanguage));
              return <Link key={edition.id} to={`/product/${edition.id}`} className={`home-edition-card${editionLanguage === language ? ' home-edition-card-active' : ''}`}>
                <div className="home-edition-media">{edition.images[0] ? <LiquidImage src={edition.images[0]} alt="" width={180} height={230} loading="lazy" /> : <div className="product-image-fallback" aria-hidden="true" />}</div>
                <div className="home-edition-copy"><span className="edition-code">{editionLanguage.toUpperCase()}</span><h2>{title}</h2><span className="home-edition-price">{formatPrice(edition.price, edition.currency, language)}</span></div>
                <ArrowUpRight size={17} aria-hidden="true" />
              </Link>;
            })}
          </div>
        </section>}
      </main>
      <Footer />
    </div>
  );
}
