import { useState } from 'react';
import { ArrowUpRight, CircleAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { formatPrice, getLocalizedValue } from '../services/ecwidClient';
import type { Product } from '../types/catalog';

function ImageFallback() {
  return <div className="product-image-fallback" aria-hidden="true"><CircleAlert size={22} /></div>;
}

export default function ProductCard({ product }: { product: Product }) {
  const { language } = useLanguage();
  const [imageFailed, setImageFailed] = useState(false);
  const title = getLocalizedValue(product.title, language);
  const soldOut = product.inStock === false || (product.quantity === 0 && !product.unlimited);

  return (
    <article className="product-card reveal">
      <Link to={`/product/${product.id}`} className="product-card-image" aria-label={`${title} — ${language === 'it' ? 'apri prodotto' : 'view product'}`}>
        {product.images[0] && !imageFailed ? <img src={product.images[0]} alt="" width="800" height="1000" loading="lazy" onError={() => setImageFailed(true)} /> : <ImageFallback />}
        {soldOut && <span className="product-badge">{language === 'it' ? 'Esaurito' : 'Sold out'}</span>}
        {!soldOut && product.compareToPrice && product.price && product.compareToPrice > product.price && (
          <span className="product-badge product-badge-accent">{language === 'it' ? 'In offerta' : 'On sale'}</span>
        )}
        <span className="product-card-arrow" aria-hidden="true"><ArrowUpRight size={18} /></span>
      </Link>
      <div className="product-card-content">
        <div className="product-card-heading">
          <div className="min-w-0">
            {product.category && <p className="eyebrow product-category">{product.category}</p>}
            <h3 className="product-card-title">{title}</h3>
          </div>
          <p className="product-price">{formatPrice(product.price, product.currency, language) || '—'}</p>
        </div>
        <Link to={`/product/${product.id}`} className="text-link">{language === 'it' ? 'Scopri il prodotto' : 'View product'} <ArrowUpRight size={15} aria-hidden="true" /></Link>
      </div>
    </article>
  );
}
