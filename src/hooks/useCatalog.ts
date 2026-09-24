import { useCallback, useEffect, useState } from 'react';
import { getCachedCatalogProducts, getCatalogProducts } from '../services/ecwidClient';
import type { CatalogState, Product } from '../types/catalog';

export function useCatalog(): CatalogState {
  const [products, setProducts] = useState<Product[]>(() => getCachedCatalogProducts());
  const [loading, setLoading] = useState(() => getCachedCatalogProducts().length === 0);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(products.length === 0);
    getCatalogProducts(attempt > 0).then((nextProducts) => {
      if (!active) return;
      setProducts(nextProducts);
      setError(nextProducts.length ? null : 'catalog-unavailable');
    }).catch(() => {
      if (active) setError('catalog-unavailable');
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [attempt]);

  const retry = useCallback(() => setAttempt((value) => value + 1), []);
  return { products, loading, error, retry };
}
