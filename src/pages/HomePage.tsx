import Hero from '../components/Hero';
import Footer from '../components/Footer';
import Introduction from '../components/Introduction';
import Navbar from '../components/Navbar';
import ProductCarousel from '../components/ProductCarousel';
import { useCatalog } from '../hooks/useCatalog';
import { getLatestProducts } from '../services/ecwidClient';
import siteConfig from '../config/site.json';

export default function HomePage() {
  const catalog = useCatalog();
  const featured = siteConfig.homepage.featuredProducts.enabled
    ? getLatestProducts(catalog.products, 1)
    : [];
  const catalogue = getLatestProducts(catalog.products, catalog.products.length);

  return (
    <div className="page-shell">
      <Navbar />
      <main id="main-content" className="page-content">
        <Hero product={featured[0]} loading={catalog.loading} />
        <Introduction product={featured[0]} />
        <ProductCarousel products={catalogue} loading={catalog.loading} error={catalog.error} onRetry={catalog.retry} />
      </main>
      <Footer />
    </div>
  );
}
