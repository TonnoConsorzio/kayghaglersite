import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import siteConfig from '../config/site.json';
import { getLocalizedValue } from '../services/ecwidClient';
import type { Product } from '../types/catalog';

function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export default function Introduction({ product }: { product?: Product }) {
  const { language } = useLanguage();
  const config = siteConfig.homepage.introduction;
  const description = product ? stripHtml(getLocalizedValue(product.description, language)) : config.fallback[language];

  return <section id="introduction" className="introduction-section">
    <div className="introduction-heading reveal">
      <h2>{config.title[language]}</h2>
    </div>
    <div className="introduction-body reveal delay-100">
      <p>{description || config.fallback[language]}</p>
      {product && <Link to={`/product/${product.id}`} className="text-link">{language === 'it' ? 'Entra nel libro' : 'Enter the book'} <ArrowUpRight size={15} aria-hidden="true" /></Link>}
    </div>
  </section>;
}
