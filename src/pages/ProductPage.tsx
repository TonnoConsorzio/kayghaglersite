import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowUpRight, RefreshCw } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLanguage } from '../i18n/LanguageContext';
import { useCatalog } from '../hooks/useCatalog';
import { formatPrice, getCheckoutUrl, getLocalizedValue, sanitizeRichText, stripHtml } from '../services/ecwidClient';
import siteConfig from '../config/site.json';
import LiquidImage from '../components/LiquidImage';

export default function ProductPage() {
  const { id } = useParams();
  const { language } = useLanguage();
  const { products, loading, error, retry } = useCatalog();
  const product = useMemo(() => products.find((item) => item.id === id), [products, id]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setSelectedImage(0);
    setImageFailed(false);
    if (!product) return;
    const title = stripHtml(getLocalizedValue(product.title, language));
    document.title = `${title} · ${siteConfig.site.name}`;
    const structuredData = document.createElement('script');
    structuredData.type = 'application/ld+json';
    structuredData.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: title,
      description: stripHtml(getLocalizedValue(product.description, language)),
      image: product.images,
      sku: product.sku,
      offers: product.price === undefined ? undefined : { '@type': 'Offer', price: product.price, priceCurrency: product.currency, availability: product.inStock === false ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock' },
    });
    document.head.appendChild(structuredData);
    return () => structuredData.remove();
  }, [product, language]);

  const title = product ? stripHtml(getLocalizedValue(product.title, language)) : '';
  const richDescription = product ? sanitizeRichText(getLocalizedValue(product.description, language)) : '';
  const purchaseUrl = product ? getCheckoutUrl(product.id) : undefined;
  const backLabel = language === 'it' ? 'Torna alla home' : 'Back home';
  const editions = products.filter((item) => item.language);

  return <div className="page-shell">
    <Navbar />
    <main id="main-content" className="page-content product-page">
      {loading && <div className="catalog-state">{language === 'it' ? 'Caricamento prodotto…' : 'Loading product…'}</div>}
      {!loading && error && !product && <div className="catalog-state catalog-state-error" role="alert"><p>{language === 'it' ? 'Impossibile caricare il prodotto.' : 'Could not load this product.'}</p><button type="button" className="button button-quiet" onClick={retry}><RefreshCw size={15} aria-hidden="true" /> {language === 'it' ? 'Riprova' : 'Try again'}</button></div>}
      {!loading && !error && !product && <div className="catalog-state"><p>{language === 'it' ? 'Prodotto non trovato.' : 'Product not found.'}</p><Link to="/" className="text-link"><ArrowLeft size={15} aria-hidden="true" /> {backLabel}</Link></div>}
      {product && <>
        <Link to="/" className="back-link"><ArrowLeft size={15} aria-hidden="true" /> {backLabel}</Link>
        <div className="product-detail">
          <div className="product-gallery">
            <div className="product-main-image">{product.images[selectedImage] && !imageFailed ? <LiquidImage src={product.images[selectedImage]} alt={title} width={1000} height={1250} fetchPriority="high" onError={() => setImageFailed(true)} /> : <div className="product-image-fallback" aria-hidden="true" />}</div>
            {product.images.length > 1 && <div className="product-thumbnails">{product.images.map((image, index) => <button type="button" key={image} className={selectedImage === index ? 'thumbnail thumbnail-active' : 'thumbnail'} onClick={() => { setSelectedImage(index); setImageFailed(false); }} aria-label={`${title} ${index + 1}`} aria-pressed={selectedImage === index}><LiquidImage src={image} alt="" width={180} height={220} /></button>)}</div>}
          </div>
          <div className="product-detail-copy">
            <h1>{title}</h1>
            <p className="product-detail-price">{formatPrice(product.price, product.currency, language) || 'Price on request'}</p>
            {richDescription && <div className="product-description" dangerouslySetInnerHTML={{ __html: richDescription }} />}
            {purchaseUrl ? <a href={purchaseUrl} className="button button-primary" target="_blank" rel="noopener noreferrer">{language === 'it' ? 'Vai al pagamento' : 'Go to checkout'} <ArrowUpRight size={17} aria-hidden="true" /></a> : <p className="product-note">{language === 'it' ? 'Acquisto online in arrivo.' : 'Online checkout coming soon.'}</p>}
            {editions.length > 1 && <div className="edition-switch" aria-label={language === 'it' ? 'Scegli edizione' : 'Choose edition'}>
              {(['en', 'it'] as const).map((editionLanguage) => {
                const edition = editions.find((item) => item.language === editionLanguage);
                if (!edition) return null;
                const editionTitle = stripHtml(getLocalizedValue(edition.title, editionLanguage));
                const active = edition.id === product.id;
                return <Link key={edition.id} to={`/product/${edition.id}`} className={`edition-card${active ? ' edition-card-active' : ''}`} aria-current={active ? 'page' : undefined}>
                  <span className="edition-code">{editionLanguage.toUpperCase()}</span>
                  <span className="edition-title">{editionTitle}</span>
                  <ArrowUpRight size={16} aria-hidden="true" />
                </Link>;
              })}
            </div>}
            {product.inStock === false && <p className="product-note">{language === 'it' ? 'Al momento non disponibile.' : 'Currently unavailable.'}</p>}
          </div>
        </div>
      </>}
    </main>
    <Footer />
  </div>;
}
