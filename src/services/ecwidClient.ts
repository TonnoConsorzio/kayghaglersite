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
let catalogProducts: Product[] = [];

function textMap(value?: string, translated?: Record<string, string>): LocalizedText {
  return { ...(value ? { en: value } : {}), ...(translated ?? {}) };
}

function applyOverride(product: Product): Product {
  const override = overrides[product.id];
  if (!override) return product;
  return {
    ...product,
    language: override.language ?? product.language,
    title: { ...product.title, ...override.title },
    description: { ...product.description, ...override.description },
    price: override.price ?? product.price,
    compareToPrice: override.compareToPrice ?? product.compareToPrice,
    currency: config.site.currency,
    images: override.images?.length ? override.images : product.images,
  };
}

function uniqueImages(images: Array<string | undefined>): string[] {
  return [...new Set(images.filter((image): image is string => Boolean(image && isSafeImageUrl(image))))];
}

function isSafeImageUrl(value: string): boolean {
  if (value.startsWith('/') && !value.startsWith('//')) return true;
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

function isSafeProductUrl(value?: string): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.toString() : undefined;
  } catch {
    return undefined;
  }
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
    currency: config.site.currency,
    images,
    category: category?.nameTranslated?.en ?? category?.name,
    url: isSafeProductUrl(product.url ?? product.productUrl),
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
    currency: config.site.currency,
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
    catalogRequest = fetchEcwidProducts()
      .then((products) => products.length ? products : getLocalProducts())
      .then((products) => {
        catalogProducts = products;
        return products;
      })
      .catch(() => {
        const localProducts = getLocalProducts();
        catalogProducts = localProducts;
        if (!localProducts.length) catalogRequest = null;
        return localProducts;
      });
  }
  return catalogRequest;
}
export function getCachedCatalogProducts(): Product[] {
  return catalogProducts;
}



export function getLatestProducts(products: Product[], limit: number, language?: Language): Product[] {
  return [...products]
    .filter((product) => !product.isHidden && (!language || !product.language || product.language === language))
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

export function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export function sanitizeRichText(value: string): string {
  if (typeof DOMParser === 'undefined') return stripHtml(value);
  const document = new DOMParser().parseFromString(`<div>${value}</div>`, 'text/html');
  const allowedTags = new Set(['DIV', 'P', 'STRONG', 'EM', 'BR', 'UL', 'OL', 'LI']);
  document.body.querySelectorAll('script, style, iframe, object, embed, form').forEach((node) => node.remove());
  document.body.querySelectorAll('*').forEach((node) => {
    if (!allowedTags.has(node.tagName)) {
      node.replaceWith(...Array.from(node.childNodes));
      return;
    }
    Array.from(node.attributes).forEach((attribute) => node.removeAttribute(attribute.name));
  });
  return document.body.firstElementChild?.innerHTML ?? '';
}

export function formatPrice(price: number | undefined, currency: string, language: Language): string {
  if (price === undefined) return '';
  return new Intl.NumberFormat(language === 'it' ? 'it-IT' : 'en-GB', {
    style: 'currency',
    currency,
  }).format(price);
}

export function getCheckoutUrl(productId: string): string | undefined {
  const id = Number(productId);
  if (!Number.isSafeInteger(id) || id <= 0 || typeof window === 'undefined') return undefined;

  const pathname = window.location.pathname;
  const directory = pathname.endsWith('/')
    ? pathname
    : pathname.endsWith('.html')
      ? pathname.slice(0, pathname.lastIndexOf('/') + 1)
      : `${pathname}/`;
  const storePage = new URL(`${directory}store.html`, window.location.origin).toString();
  const cart = encodeURIComponent(JSON.stringify({ gotoCheckout: true, products: [{ id, quantity: 1 }] }));
  return `${storePage}#!/~/cart/create=${cart}`;
}

export function resetCatalogCache() {
  catalogRequest = null;
  catalogProducts = [];
}
