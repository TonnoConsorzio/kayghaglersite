export type Language = 'it' | 'en';

export type LocalizedText = Partial<Record<Language | string, string>>;

export type ProductOverride = {
  language?: Language;
  title?: LocalizedText;
  description?: LocalizedText;
  price?: number;
  compareToPrice?: number;
  currency?: string;
  images?: string[];
};

export interface Product {
  id: string;
  language?: Language;
  title: LocalizedText;
  description: LocalizedText;
  price?: number;
  compareToPrice?: number;
  currency: string;
  images: string[];
  category?: string;
  url?: string;
  inStock?: boolean;
  quantity?: number;
  unlimited?: boolean;
  created?: string;
  updated?: string;
  sku?: string;
  isHidden?: boolean;
  isFixedOnHome?: boolean;
  source: 'ecwid' | 'local';
  ecwidStoreId?: string;
}

export interface CatalogState {
  products: Product[];
  loading: boolean;
  error: string | null;
  retry: () => void;
}
