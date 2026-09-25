import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { Link } from 'react-router-dom';
import siteConfig from '../config/site.json';
import { getLocalizedValue, stripHtml } from '../services/ecwidClient';
import type { Product } from '../types/catalog';
import LiquidImage from './LiquidImage';

export default function Hero({ product, loading = false }: { product?: Product; loading?: boolean }) {
  const { language } = useLanguage();
  const [imageFailed, setImageFailed] = useState(false);
  if (!product) return <section className={`hero hero-empty ${loading ? 'hero-loading' : ''}`} aria-live="polite"><p>{loading ? (language === 'it' ? 'Caricamento libro…' : 'Loading book…') : (language === 'it' ? 'Nessun libro disponibile.' : 'No book available.')}</p></section>;
  const title = stripHtml(getLocalizedValue(product.title, language));
  const imageUrl = product.images[0];
  const heroCopy = siteConfig.homepage.hero;
  const description = heroCopy.description[language];

  return (
    <section className="hero">
      <div className="hero-copy">
        <h1>{title}</h1>
        <div className="hero-description">
          {description.split(/\n\n+/).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
        <Link to={`/product/${product.id}`} className="button button-primary">{heroCopy.button[language]} <ArrowUpRight size={17} aria-hidden="true" /></Link>
      </div>
      <Link to={`/product/${product.id}`} className="hero-image" aria-label={`${title} — ${heroCopy.button[language]}`}>
        {imageUrl && !imageFailed ? <LiquidImage src={imageUrl} alt={title} width={1200} height={1400} fetchPriority="high" onError={() => setImageFailed(true)} /> : <div className="product-image-fallback" aria-hidden="true" />}
        <span className="hero-image-label"><ArrowUpRight size={17} aria-hidden="true" /></span>
      </Link>
    </section>
  );
}
