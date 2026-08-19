import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, RefreshCw } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import ProductCard from './ProductCard';
import type { Product } from '../types/catalog';

type Props = { products: Product[]; loading?: boolean; error?: string | null; onRetry?: () => void };

export default function ProductCarousel({ products, loading, error, onRetry }: Props) {
  const { language } = useLanguage();
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion || products.length < 2) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % products.length), 4200);
    return () => window.clearInterval(timer);
  }, [paused, reducedMotion, products.length]);

  useEffect(() => {
    const track = trackRef.current;
    const card = track?.children[index] as HTMLElement | undefined;
    if (!track || !card) return;
    track.scrollTo({ left: card.offsetLeft, behavior: reducedMotion ? 'auto' : 'smooth' });
  }, [index, reducedMotion]);

  const move = (direction: -1 | 1) => {
    if (!products.length) return;
    setIndex((current) => (current + direction + products.length) % products.length);
  };

  if (loading && !products.length) return <section id="catalogue" className="catalogue-section"><div className="catalog-state">{language === 'it' ? 'Caricamento catalogo…' : 'Loading catalogue…'}</div></section>;
  if (error && !products.length) return <section id="catalogue" className="catalogue-section"><div className="catalog-state catalog-state-error"><p>{language === 'it' ? 'Catalogo non disponibile.' : 'Catalogue unavailable.'}</p><button type="button" className="button button-quiet" onClick={onRetry}><RefreshCw size={15} aria-hidden="true" /> {language === 'it' ? 'Riprova' : 'Try again'}</button></div></section>;
  if (!products.length) return <section id="catalogue" className="catalogue-section"><div className="catalog-state">{language === 'it' ? 'Nessun titolo disponibile.' : 'No titles available.'}</div></section>;

  return <section id="catalogue" className="catalogue-section" aria-label={language === 'it' ? 'Catalogo prodotti' : 'Product catalogue'} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
    <div className="carousel-heading">
      <h2>{language === 'it' ? 'Dal catalogo' : 'From the catalogue'}</h2>
      <div className="carousel-controls">
        <button type="button" className="carousel-control" onClick={() => move(-1)} aria-label={language === 'it' ? 'Prodotto precedente' : 'Previous product'}><ArrowLeft size={17} aria-hidden="true" /></button>
        <button type="button" className="carousel-control" onClick={() => move(1)} aria-label={language === 'it' ? 'Prodotto successivo' : 'Next product'}><ArrowRight size={17} aria-hidden="true" /></button>
      </div>
    </div>
    <div ref={trackRef} className="product-carousel" tabIndex={0} aria-live="polite">
      {products.map((product) => <div className="product-carousel-item" key={product.id}><ProductCard product={product} /></div>)}
    </div>
  </section>;
}
