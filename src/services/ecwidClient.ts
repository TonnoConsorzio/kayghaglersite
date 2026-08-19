import siteConfig from '../config/site.json';
import type { Language, LocalizedText, Product } from '../types/catalog';

type EcwidProduct = {
  id: number | string;
  name?: string;
  nameTranslated?: Record<string, string>;
  description?: string;
  descriptionTranslated?: Record<string, string>;
  price?: number;
  priceInProductList?: number;
  compareToPrice?: number;
  currency?: string;
  thumbnailUrl?: string;
  imageUrl?: string;
  originalImageUrl?: string;
  galleryImages?: Array<{ url?: string; originalUrl?: string; thumbnailUrl?: string }>;
  productUrl?: string;
  categoryIds?: Array<number | string>;
  categories?: Array<{ name?: string; nameTranslated?: Record<string, string> }>;
  inStock?: boolean;
  quantity?: number;
  unlimited?: boolean;
  created?: string;
  updated?: string;
  sku?: string;
  enabled?: boolean;
  customSlug?: string;
};

type EcwidResponse = { items?: EcwidProduct[] };

const localModules = import.meta.glob('../data/products/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, Record<string, unknown>>;

const config = siteConfig as typeof siteConfig & {
  ecwid: { storeId: string; publicToken: string; catalogPath: string };
};

const ecwid = {
  storeId: import.meta.env.VITE_ECWID_STORE_ID || config.ecwid.storeId,
  publicToken: import.meta.env.VITE_ECWID_PUBLIC_TOKEN || config.ecwid.publicToken,
  catalogPath: import.meta.env.VITE_ECWID_CATALOG_PATH || config.ecwid.catalogPath,
};

let catalogRequest: Promise<Product[]> | null = null;

function textMap(value?: string, translated?: Record<string, string>): LocalizedText {
  return { ...(translated ?? {}), ...(value ? { en: value } : {}) };
}

function normalizeProduct(product: EcwidProduct): Product {
  const gallery = (product.galleryImages ?? []).flatMap((image) => [
    image.originalUrl,
    image.url,
    image.thumbnailUrl,
  ]).filter((image): image is string => Boolean(image));
  const images = [...new Set([
    product.originalImageUrl,
    product.imageUrl,
    product.thumbnailUrl,
    ...gallery,
  ].filter((image): image is string => Boolean(image)))];
  const category = product.categories?.[0];

  return {
    id: String(product.id),
    title: textMap(product.name, product.nameTranslated),
    description: textMap(product.description, product.descriptionTranslated),
    price: product.priceInProductList ?? product.price,
    compareToPrice: product.compareToPrice,
    currency: product.currency ?? config.site.currency,
    images,
    category: category?.nameTranslated?.en ?? category?.name,
    url: product.productUrl,
    inStock: product.inStock,
    quantity: product.quantity,
    unlimited: product.unlimited,
    created: product.created,
    updated: product.updated,
    sku: product.sku,
    isHidden: product.enabled === false,
    source: 'ecwid',
    ecwidStoreId: ecwid.storeId,
  };
}

function getLocalProducts(): Product[] {
  return Object.values(localModules).map((product) => ({
    ...(product as unknown as Product),
    currency: (product.currency as string | undefined) ?? config.site.currency,
    source: 'local' as const,
  }));
}

async function fetchEcwidProducts(): Promise<Product[]> {
  const { storeId, publicToken, catalogPath } = ecwid;
  if (!storeId || !publicToken) return [];

  const params = new URLSearchParams({
    limit: '100',
    responseFields: 'id,name,nameTranslated,description,descriptionTranslated,price,priceInProductList,compareToPrice,currency,thumbnailUrl,imageUrl,originalImageUrl,galleryImages,productUrl,categoryIds,categories,inStock,quantity,unlimited,created,updated,sku,enabled',
  });
  const response = await fetch(`${catalogPath}/${encodeURIComponent(storeId)}/products?${params}`, {
    headers: { Authorization: `Bearer ${publicToken}` },
  });
  if (!response.ok) throw new Error(`Ecwid catalog request failed: ${response.status}`);
  const data = await response.json() as EcwidResponse;
  return (data.items ?? []).map(normalizeProduct);
}

export function getCatalogProducts(force = false): Promise<Product[]> {
  if (force || !catalogRequest) {
    catalogRequest = fetchEcwidProducts().then((products) => products.length ? products : getLocalProducts()).catch(() => getLocalProducts());
  }
  return catalogRequest;
}

export function getLatestProducts(products: Product[], limit: number): Product[] {
  return [...products]
    .filter((product) => !product.isHidden)
    .sort((a, b) => {
      const aTime = Date.parse(a.created ?? a.updated ?? '') || 0;
      const bTime = Date.parse(b.created ?? b.updated ?? '') || 0;
      return bTime - aTime;
    })
    .slice(0, limit);
}

export function getLocalizedValue(value: LocalizedText | undefined, language: Language): string {
  if (!value) return '';
  return value[language] ?? value.en ?? Object.values(value)[0] ?? '';
}

export function formatPrice(price: number | undefined, currency: string, language: Language): string {
  if (price === undefined) return '';
  return new Intl.NumberFormat(language === 'it' ? 'it-IT' : 'en-GB', {
    style: 'currency',
    currency,
  }).format(price);
}

export function resetCatalogCache() {
  catalogRequest = null;
}
