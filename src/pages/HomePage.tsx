import Hero from '../components/Hero';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { useCatalog } from '../hooks/useCatalog';
import { getLatestProducts } from '../services/ecwidClient';
import { useLanguage } from '../i18n/LanguageContext';

export default function HomePage() {
  const catalog = useCatalog();
  const { language } = useLanguage();
  const featured = getLatestProducts(catalog.products, 1, language);

  return (
    <div className="page-shell">
      <Navbar />
      <main id="main-content" className="page-content">
        <Hero product={featured[0]} loading={catalog.loading} />
      </main>
      <Footer />
    </div>
  );
}
