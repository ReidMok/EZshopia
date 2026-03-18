import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { Product, ProductStatus, StoreConfig } from '../types';

export type DbShape = {
  storeConfig: StoreConfig;
  products: Product[];
};

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'ezshopia-db.json');

const DEFAULT_CONFIG: StoreConfig = {
  id: 'store_1',
  name: 'Ezshopia Demo Store',
  subdomain: 'demo',
  plan: 'PRO',
  description: 'A next-gen AI store.',
  currency: 'USD',
  email: 'admin@ezshopia.com',
  address: '',
  enableAi: true,
  theme: {
    primaryColor: '#3b82f6',
    secondaryColor: '#1e293b',
    fontFamily: 'Inter',
    heroHeadline: 'Welcome to the Future of Commerce',
  },
};

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'product';
}

async function readDb(): Promise<DbShape> {
  await ensureDataDir();
  try {
    const raw = await fs.readFile(DB_PATH, 'utf8');
    const parsed = JSON.parse(raw) as Partial<DbShape>;
    return {
      storeConfig: parsed.storeConfig || DEFAULT_CONFIG,
      products: Array.isArray(parsed.products) ? (parsed.products as Product[]) : [],
    };
  } catch {
    const init: DbShape = { storeConfig: DEFAULT_CONFIG, products: [] };
    await writeDb(init);
    return init;
  }
}

async function writeDb(db: DbShape) {
  await ensureDataDir();
  const tmp = `${DB_PATH}.${crypto.randomBytes(6).toString('hex')}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(db, null, 2), 'utf8');
  await fs.rename(tmp, DB_PATH);
}

export async function getBootstrap() {
  const db = await readDb();
  return db;
}

export async function getStoreConfig() {
  const db = await readDb();
  return db.storeConfig;
}

export async function updateStoreConfig(patch: Partial<StoreConfig>) {
  const db = await readDb();
  db.storeConfig = { ...db.storeConfig, ...patch, theme: { ...db.storeConfig.theme, ...(patch.theme || {}) } };
  await writeDb(db);
  return db.storeConfig;
}

export async function listProducts() {
  const db = await readDb();
  return db.products;
}

export async function getProductById(id: string) {
  const db = await readDb();
  return db.products.find((p) => p.id === id) || null;
}

export async function getProductBySlug(slug: string) {
  const db = await readDb();
  return db.products.find((p) => p.slug === slug) || null;
}

async function ensureUniqueSlug(base: string) {
  const db = await readDb();
  const existing = new Set(db.products.map((p) => p.slug));
  if (!existing.has(base)) return base;
  let i = 2;
  while (existing.has(`${base}-${i}`)) i += 1;
  return `${base}-${i}`;
}

export async function createProduct(partial: Partial<Product>) {
  const db = await readDb();
  const now = new Date().toISOString();
  const title = (partial.title || 'Untitled').toString();
  const baseSlug = slugify(partial.slug || title);
  const slug = await ensureUniqueSlug(baseSlug);

  const product: Product = {
    id: crypto.randomBytes(6).toString('hex'),
    storeId: db.storeConfig.id,
    title,
    slug,
    descriptionHtml: partial.descriptionHtml || '',
    price: typeof partial.price === 'number' ? partial.price : 0,
    images: Array.isArray(partial.images) ? partial.images : [],
    status: partial.status || ProductStatus.ACTIVE,
    seoTitle: partial.seoTitle || '',
    seoDescription: partial.seoDescription || '',
    tags: Array.isArray(partial.tags) ? partial.tags : [],
    adCopy: partial.adCopy,
    createdAt: now,
    updatedAt: now,
  };

  db.products = [product, ...db.products];
  await writeDb(db);
  return product;
}

export async function updateProductById(id: string, patch: Partial<Product>) {
  const db = await readDb();
  const idx = db.products.findIndex((p) => p.id === id);
  if (idx < 0) return null;

  const prev = db.products[idx];
  const next: Product = {
    ...prev,
    ...patch,
    updatedAt: new Date().toISOString(),
  };

  // Keep slug stable unless explicitly provided; if provided, ensure uniqueness
  if (patch.slug && patch.slug !== prev.slug) {
    const baseSlug = slugify(patch.slug);
    next.slug = await ensureUniqueSlug(baseSlug);
  } else {
    next.slug = prev.slug;
  }

  db.products[idx] = next;
  await writeDb(db);
  return next;
}

