import { readFile } from 'node:fs/promises';

const storeId = process.env.VITE_ECWID_STORE_ID;
const publicToken = process.env.VITE_ECWID_PUBLIC_TOKEN;
const catalogPath = process.env.VITE_ECWID_CATALOG_PATH || 'https://app.ecwid.com/api/v3';

if (publicToken && /secret/i.test(publicToken)) {
  throw new Error('VITE_ECWID_PUBLIC_TOKEN contains a secret token. Stop.');
}

JSON.parse(await readFile(new URL('../src/data/product-overrides.json', import.meta.url), 'utf8'));

if (!storeId || !publicToken) {
  console.log('Ecwid live check skipped: set VITE_ECWID_STORE_ID and VITE_ECWID_PUBLIC_TOKEN.');
  console.log('Ecwid-only mode ready: no local product fixtures remain.');
  process.exit(0);
}

const params = new URLSearchParams({
  limit: '1',
  visibleInStorefront: 'true',
  responseFields: 'total,items(id,name,price)',
});
const response = await fetch(`${catalogPath}/${encodeURIComponent(storeId)}/products?${params}`, {
  headers: { Authorization: `Bearer ${publicToken}` },
});

if (!response.ok) throw new Error(`Ecwid request failed: HTTP ${response.status}`);
const data = await response.json();
if (!Array.isArray(data.items)) throw new Error('Ecwid response missing items array.');

console.log(`Ecwid live check passed: ${data.items.length} product returned.`);
