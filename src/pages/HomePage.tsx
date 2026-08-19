import Hero from '../components/Hero';
import Features from '../components/Features';
import About from '../components/About';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import ProductGrid from '../components/ProductGrid';
import { useCatalog } from '../hooks/useCatalog';
import { getLatestProducts } from '../services/ecwidClient';
import siteConfig from '../config/site.json';
import { useLanguage } from '../i18n/LanguageContext';

export default function HomePage() {
  const catalog = useCatalog();
  const { language } = useLanguage();
  const featured = siteConfig.homepage.featuredProducts.enabled
    ? getLatestProducts(catalog.products, siteConfig.homepage.featuredProducts.limit)
    : [];

  return (
    <div className="page-shell">
      <Navbar />
      <main id="main-content" className="page-content">
        <Hero product={featured[0]} />
        <section id="catalogue" className="catalogue-section">
          <div className="section-heading reveal">
            <div><p className="eyebrow">{siteConfig.homepage.featuredProducts.eyebrow[language]}</p><h2>{siteConfig.homepage.featuredProducts.title[language]}</h2></div>
            <p>{siteConfig.homepage.featuredProducts.description[language]}</p>
          </div>
          <ProductGrid products={featured} loading={catalog.loading} error={catalog.error} onRetry={catalog.retry} />
        </section>
        <Features />
        <About />
      </main>
      <Footer />
    </div>
  );
}
