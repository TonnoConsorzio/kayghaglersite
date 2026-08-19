import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { Link } from 'react-router-dom';
import siteConfig from '../config/site.json';
import { getLocalizedValue } from '../services/ecwidClient';
import type { Product } from '../types/catalog';

export default function Hero({ product }: { product?: Product }) {
  const { language } = useLanguage();
  const [imageFailed, setImageFailed] = useState(false);
  if (!product) return <section className="hero hero-empty"><p>{language === 'it' ? 'Il catalogo sta arrivando.' : 'The catalogue is on its way.'}</p></section>;
  const title = getLocalizedValue(product.title, language);
  const description = getLocalizedValue(product.description, language);
  const imageUrl = product.images[0];
  const heroCopy = siteConfig.homepage.hero;

  return (
    <section className="hero">
      <div className="hero-copy reveal">
        <p className="eyebrow">{heroCopy.eyebrow[language]}</p>
        <h1>{title}</h1>
        <p className="hero-description">{description}</p>
        <Link to={`/product/${product.id}`} className="button button-primary">{heroCopy.button[language]} <ArrowUpRight size={17} aria-hidden="true" /></Link>
        <p className="hero-note">{siteConfig.site.tagline[language]}</p>
      </div>
      <Link to={`/product/${product.id}`} className="hero-image reveal delay-100" aria-label={`${title} — ${heroCopy.button[language]}`}>
        {imageUrl && !imageFailed ? <img src={imageUrl} alt="" width="1200" height="1400" fetchPriority="high" onError={() => setImageFailed(true)} /> : <div className="product-image-fallback" aria-hidden="true" />}
        <span className="hero-image-label">{product.category ?? 'Kay G. Hagler'} <ArrowUpRight size={17} aria-hidden="true" /></span>
      </Link>
    </section>
  );
}
