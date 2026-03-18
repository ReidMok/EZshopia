import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { Product, ProductStatus, PublicReview, StoreConfig } from '../types';

export type DbShape = {
  storeConfig: StoreConfig;
  products: Product[];
  publicReviews?: Record<string, PublicReview[]>;
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
      publicReviews: parsed.publicReviews || {},
    };
  } catch {
    const init: DbShape = { storeConfig: DEFAULT_CONFIG, products: [], publicReviews: {} };
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

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(input: string) {
  const h = crypto.createHash('sha256').update(input).digest();
  return h.readUInt32LE(0);
}

function pick<T>(rng: () => number, arr: T[]) {
  return arr[Math.floor(rng() * arr.length)];
}

function daysAgoIso(days: number) {
  const d = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return d.toISOString();
}

function generateDemoReviews(product: Product, count: number): PublicReview[] {
  const seed = hashSeed(product.id + product.slug);
  const rng = mulberry32(seed);

  const firstNames = ['Ava', 'Mia', 'Noah', 'Liam', 'Emma', 'Olivia', 'Ethan', 'Sophia', 'Lucas', 'Amelia', 'Leo', 'Chloe'];
  const lastInitials = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const titles = [
    'Beautiful craftsmanship',
    'Looks even better in person',
    'Great gift idea',
    'Worth the price',
    'Exactly what I wanted',
    'Impressive quality',
    'Super fast shipping',
    'Stunning details',
  ];
  const bodies = [
    'Packaging was solid and everything arrived safely. The finish looks premium and the product matches the photos.',
    'The colors and details are gorgeous. I’ve had it on display for a week and friends keep asking where it’s from.',
    'Bought this as a gift and it was a huge hit. The build quality is excellent and it feels very durable.',
    'Quality exceeded expectations. It feels thoughtfully made and the overall design is really tasteful.',
    'Arrived quickly and looks fantastic. Easy to set up and the size is perfect for my space.',
    'The materials feel high-end and the workmanship is clean. I’m genuinely impressed.',
  ];

  const keyword = (product.tags?.[0] || '').toLowerCase();
  const boostedBody =
    keyword && keyword.length > 2
      ? `Love the ${keyword} vibe — ` + pick(rng, bodies).toLowerCase()
      : pick(rng, bodies);

  const reviews: PublicReview[] = [];
  for (let i = 0; i < count; i++) {
    const ratingRoll = rng();
    const rating = ratingRoll < 0.75 ? 5 : ratingRoll < 0.92 ? 4 : 3;
    const name = `${pick(rng, firstNames)} ${pick(rng, lastInitials)}.`;
    const createdAt = daysAgoIso(Math.floor(rng() * 60) + 2);
    reviews.push({
      id: crypto.randomBytes(6).toString('hex'),
      productId: product.id,
      authorName: name,
      rating,
      title: pick(rng, titles),
      body: i === 0 ? boostedBody : pick(rng, bodies),
      createdAt,
      source: 'DEMO',
    });
  }
  return reviews;
}

export async function getOrCreatePublicReviews(productId: string) {
  const db = await readDb();
  db.publicReviews = db.publicReviews || {};
  const existing = db.publicReviews[productId];
  if (existing && existing.length > 0) return existing;

  const product = db.products.find((p) => p.id === productId);
  if (!product) return [];

  const count = Math.min(12, Math.max(5, Math.floor((product.title.length % 8) + 5)));
  const generated = generateDemoReviews(product, count);
  db.publicReviews[productId] = generated;
  await writeDb(db);
  return generated;
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

