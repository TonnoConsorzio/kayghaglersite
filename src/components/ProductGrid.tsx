import { RefreshCw } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import ProductCard from './ProductCard';
import type { Product } from '../types/catalog';

type Props = { products: Product[]; loading?: boolean; error?: string | null; onRetry?: () => void };

export default function ProductGrid({ products, loading, error, onRetry }: Props) {
  const { language } = useLanguage();
  if (loading) return <div className="catalog-state" aria-live="polite">{language === 'it' ? 'Caricamento catalogo…' : 'Loading catalogue…'}</div>;
  if (error && !products.length) return (
    <div className="catalog-state catalog-state-error" role="alert">
      <p>{language === 'it' ? 'Il catalogo non è disponibile.' : 'The catalogue is unavailable.'}</p>
      <button type="button" className="button button-quiet" onClick={onRetry}><RefreshCw size={15} aria-hidden="true" /> {language === 'it' ? 'Riprova' : 'Try again'}</button>
    </div>
  );
  if (!products.length) return <div className="catalog-state">{language === 'it' ? 'Nessun prodotto disponibile.' : 'No products available.'}</div>;
  return <div className="product-grid">{products.map((product) => <div className="product-grid-item" key={product.id}><ProductCard product={product} /></div>)}</div>;
}
