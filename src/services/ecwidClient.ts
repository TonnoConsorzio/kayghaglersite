import siteConfig from '../config/site.json';
import productOverrides from '../data/product-overrides.json';
import type { Language, LocalizedText, Product, ProductOverride } from '../types/catalog';

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
  galleryImages?: Array<{
    orderBy?: number;
    url?: string;
    originalUrl?: string;
    originalImageUrl?: string;
    imageUrl?: string;
    thumbnailUrl?: string;
  }>;
  url?: string;
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
  originalImage?: { url?: string };
  media?: {
    images?: Array<{
      orderBy?: number;
      imageOriginalUrl?: string;
      image1500pxUrl?: string;
      image800pxUrl?: string;
    }>;
  };
};

type EcwidResponse = { items?: EcwidProduct[] };

const localModules = import.meta.glob('../data/products/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, Record<string, unknown>>;

const config = siteConfig as typeof siteConfig & {
  ecwid: { storeId: string; catalogPath: string };
};

const ecwid = {
  storeId: import.meta.env.VITE_ECWID_STORE_ID || config.ecwid.storeId,
  publicToken: import.meta.env.VITE_ECWID_PUBLIC_TOKEN,
  catalogPath: import.meta.env.VITE_ECWID_CATALOG_PATH || config.ecwid.catalogPath,
};

const overrides = productOverrides as Record<string, ProductOverride>;

let catalogRequest: Promise<Product[]> | null = null;

function textMap(value?: string, translated?: Record<string, string>): LocalizedText {
  return { ...(translated ?? {}), ...(value ? { en: value } : {}) };
}

function applyOverride(product: Product): Product {
  const override = overrides[product.id];
  if (!override) return product;
  return {
    ...product,
    title: { ...product.title, ...override.title },
    description: { ...product.description, ...override.description },
    price: override.price ?? product.price,
    compareToPrice: override.compareToPrice ?? product.compareToPrice,
    currency: override.currency ?? product.currency,
    images: override.images?.length ? override.images : product.images,
  };
}

function uniqueImages(images: Array<string | undefined>): string[] {
  return [...new Set(images.filter((image): image is string => Boolean(image)))];
}

function normalizeProduct(product: EcwidProduct): Product {
  const mediaImages = [...(product.media?.images ?? [])]
    .sort((a, b) => (a.orderBy ?? 0) - (b.orderBy ?? 0))
    .map((image) => image.imageOriginalUrl ?? image.image1500pxUrl ?? image.image800pxUrl);
  const galleryImages = [...(product.galleryImages ?? [])]
    .sort((a, b) => (a.orderBy ?? 0) - (b.orderBy ?? 0))
    .map((image) => image.originalImageUrl ?? image.originalUrl ?? image.url ?? image.imageUrl);
  const images = uniqueImages(mediaImages.length ? mediaImages : [
    product.originalImage?.url ?? product.originalImageUrl,
    ...galleryImages,
  ]);
  const category = product.categories?.[0];

  return applyOverride({
    id: String(product.id),
    title: textMap(product.name, product.nameTranslated),
    description: textMap(product.description, product.descriptionTranslated),
    price: product.priceInProductList ?? product.price,
    compareToPrice: product.compareToPrice,
    currency: product.currency ?? config.site.currency,
    images,
    category: category?.nameTranslated?.en ?? category?.name,
    url: product.url ?? product.productUrl,
    inStock: product.inStock,
    quantity: product.quantity,
    unlimited: product.unlimited,
    created: product.created,
    updated: product.updated,
    sku: product.sku,
    isHidden: product.enabled === false,
    source: 'ecwid',
    ecwidStoreId: ecwid.storeId,
  });
}

function getLocalProducts(): Product[] {
  return Object.values(localModules).map((product) => applyOverride({
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
    visibleInStorefront: 'true',
    responseFields: 'total,items(id,name,nameTranslated,description,descriptionTranslated,price,priceInProductList,compareToPrice,currency,thumbnailUrl,imageUrl,originalImageUrl,originalImage,galleryImages,media,url,productUrl,categoryIds,categories,inStock,quantity,unlimited,created,updated,sku,enabled)',
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
