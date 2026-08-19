import { useCallback, useEffect, useState } from 'react';
import { getCatalogProducts } from '../services/ecwidClient';
import type { CatalogState, Product } from '../types/catalog';

export function useCatalog(): CatalogState {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getCatalogProducts(attempt > 0).then((nextProducts) => {
      if (!active) return;
      setProducts(nextProducts);
      setError(null);
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
