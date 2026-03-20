import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { AuthUser, Order, Product, ProductStatus, PublicReview, StoreConfig } from '../types';
import type { Customer } from '../types';

export type StoreData = {
  storeConfig: StoreConfig;
  products: Product[];
  orders: Order[];
  customers: Customer[];
};

export type DbShape = {
  // Multi-tenant stores keyed by storeKey (subdomain)
  stores?: Record<string, StoreData>;
  // Reviews keyed by productId (globally unique per DB)
  publicReviews?: Record<string, PublicReview[]>;

  // Simple SaaS accounts (demo auth)
  users?: AuthUser[];

  // Legacy single-store fields (kept for backward compatibility)
  storeConfig?: StoreConfig;
  products?: Product[];
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
  customDomains: [],
  theme: {
    primaryColor: '#3b82f6',
    secondaryColor: '#1e293b',
    fontFamily: 'Inter',
    heroHeadline: 'Welcome to the Future of Commerce',
  },
};

const DEFAULT_SUPER_ADMIN_EMAIL = 'super@ezshopia.com';
const DEFAULT_SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD || 'password';

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
    const legacyStoreConfig = (parsed as any).storeConfig as StoreConfig | undefined;
    const legacyProducts = Array.isArray((parsed as any).products) ? ((parsed as any).products as Product[]) : [];

    const stores = parsed.stores || {};
    // Migrate legacy root fields into demo store if no stores exist yet
    if (Object.keys(stores).length === 0) {
      stores.demo = {
        storeConfig: legacyStoreConfig || DEFAULT_CONFIG,
        products: legacyProducts,
        orders: [],
        customers: [],
      };
    }

    const db: DbShape = {
      stores,
      publicReviews: parsed.publicReviews || {},
      users: (parsed.users as AuthUser[] | undefined) || [],
      storeConfig: legacyStoreConfig,
      products: legacyProducts,
    };

    const changed = ensureSuperAdminUser(db);
    if (changed) await writeDb(db);

    return db;
  } catch {
    const init: DbShape = {
      stores: { demo: { storeConfig: DEFAULT_CONFIG, products: [], orders: [], customers: [] } },
      publicReviews: {},
      users: [],
      storeConfig: DEFAULT_CONFIG,
      products: [],
    };
    const changed = ensureSuperAdminUser(init);
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

function titleCase(input: string) {
  return input
    .split(/[-_ ]+/g)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

async function ensureStore(db: DbShape, storeKey: string) {
  db.stores = db.stores || {};
  if (db.stores[storeKey]) return db.stores[storeKey];

  const base = DEFAULT_CONFIG;
  const created: StoreData = {
    storeConfig: {
      ...base,
      id: `store_${storeKey}`,
      // Keep demo branding consistent even when store is auto-provisioned.
      name: storeKey === 'demo' ? base.name : `${titleCase(storeKey)} Store`,
      subdomain: storeKey,
      customDomains: base.customDomains || [],
    },
    products: [],
    orders: [],
    customers: [],
  };
  db.stores[storeKey] = created;
  // legacy mirror for demo
  if (storeKey === 'demo') {
    db.storeConfig = created.storeConfig;
    db.products = created.products;
  }
  await writeDb(db);
  return created;
}

function normalizeHostname(hostname: string) {
  return (hostname || '').trim().toLowerCase().split(':')[0];
}

// Resolve storeKey by custom domain (host header).
export async function getStoreKeyByHostname(hostname: string): Promise<string | null> {
  const host = normalizeHostname(hostname);
  if (!host) return null;

  const db = await readDb();
  const stores = db.stores || {};

  for (const [storeKey, storeData] of Object.entries(stores)) {
    const domains = (storeData.storeConfig.customDomains || []).map(normalizeHostname);
    if (domains.includes(host)) return storeKey;
  }
  return null;
}

export async function getBootstrap() {
  const db = await readDb();
  const demo = (db.stores?.demo) || (await ensureStore(db, 'demo'));
  return {
    storeConfig: demo?.storeConfig || DEFAULT_CONFIG,
    products: demo?.products || [],
  };
}

export async function getStoreBootstrap(storeKey: string) {
  const db = await readDb();
  const store = await ensureStore(db, storeKey);
  return store;
}

export async function getStoreConfig() {
  const db = await readDb();
  const demo = db.stores?.demo;
  return demo?.storeConfig || DEFAULT_CONFIG;
}

export async function getStoreConfigByKey(storeKey: string) {
  const db = await readDb();
  const store = await ensureStore(db, storeKey);
  return store.storeConfig;
}

export async function updateStoreConfig(patch: Partial<StoreConfig>) {
  const db = await readDb();
  db.stores = db.stores || {};
  db.stores.demo = db.stores.demo || { storeConfig: DEFAULT_CONFIG, products: [] };
  const prev = db.stores.demo.storeConfig;
  db.stores.demo.storeConfig = { ...prev, ...patch, theme: { ...prev.theme, ...(patch.theme || {}) } };
  // keep legacy mirror
  db.storeConfig = db.stores.demo.storeConfig;
  await writeDb(db);
  return db.stores.demo.storeConfig;
}

export async function updateStoreConfigByKey(storeKey: string, patch: Partial<StoreConfig>) {
  const db = await readDb();
  const existing = await ensureStore(db, storeKey);
  const prev = existing.storeConfig;
  existing.storeConfig = { ...prev, ...patch, theme: { ...prev.theme, ...(patch.theme || {}) } };
  db.stores[storeKey] = existing;
  // If demo store, keep legacy mirror
  if (storeKey === 'demo') db.storeConfig = existing.storeConfig;
  await writeDb(db);
  return existing.storeConfig;
}

function ensureSuperAdminUser(db: DbShape) {
  db.users = db.users || [];
  const has = db.users.some((u) => u.role === 'SUPER_ADMIN');
  if (has) return false;

  const id = authUserIdFromEmail(DEFAULT_SUPER_ADMIN_EMAIL);
  const user: AuthUser = {
    id,
    email: DEFAULT_SUPER_ADMIN_EMAIL,
    passwordHash: hashPassword(DEFAULT_SUPER_ADMIN_PASSWORD),
    storeKey: '',
    role: 'SUPER_ADMIN',
    createdAt: new Date().toISOString(),
  };

  db.users.push(user);
  return true;
}

function authUserIdFromEmail(email: string) {
  return crypto.createHash('sha256').update(email.trim().toLowerCase()).digest('hex').slice(0, 16);
}

function hashPassword(password: string) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function createMerchantOwnerUser(input: {
  email: string;
  password: string;
  storeKey: string;
  storeName?: string;
}): Promise<AuthUser> {
  const db = await readDb();
  const normalizedEmail = input.email.trim().toLowerCase();
  const userId = authUserIdFromEmail(normalizedEmail);

  db.users = db.users || [];
  const exists = db.users.some((u) => u.email.toLowerCase() === normalizedEmail);
  if (exists) {
    const existingUser = db.users.find((u) => u.email.toLowerCase() === normalizedEmail) || null;
    throw new Error(`Account already exists for ${existingUser?.email || normalizedEmail}`);
  }

  await ensureStore(db, input.storeKey);
  // Create user
  const user: AuthUser = {
    id: userId,
    email: normalizedEmail,
    passwordHash: hashPassword(input.password),
    storeKey: input.storeKey,
    role: 'MERCHANT_OWNER',
    createdAt: new Date().toISOString(),
  };
  db.users.push(user);

  // Optionally update store name
  if (input.storeName && input.storeName.trim()) {
    const store = db.stores?.[input.storeKey];
    if (store) {
      store.storeConfig.name = input.storeName.trim();
      db.stores[input.storeKey] = store;
      if (input.storeKey === 'demo') db.storeConfig = store.storeConfig;
    }
  }

  await writeDb(db);
  return user;
}

export async function authenticateUser(input: {
  email: string;
  password: string;
}): Promise<{ user: AuthUser; storeConfig: StoreConfig | null }> {
  const db = await readDb();
  const normalizedEmail = input.email.trim().toLowerCase();

  const user = (db.users || []).find((u) => u.email.toLowerCase() === normalizedEmail);
  if (!user) throw new Error('Invalid email or password');
  const candidateHash = hashPassword(input.password);
  if (candidateHash !== user.passwordHash) throw new Error('Invalid email or password');

  if (user.role === 'SUPER_ADMIN') return { user, storeConfig: null };

  const storeConfig = (await getStoreConfigByKey(user.storeKey)) as StoreConfig;
  return { user, storeConfig };
}

// Backward-compatible alias for the previous merchant-only login.
export async function authenticateMerchantOwnerUser(input: {
  email: string;
  password: string;
}): Promise<{ user: AuthUser; storeConfig: StoreConfig }> {
  const { user, storeConfig } = await authenticateUser(input);
  if (!storeConfig) throw new Error('Invalid email or password');
  return { user, storeConfig };
}

export async function listProducts() {
  const db = await readDb();
  return db.stores?.demo?.products || [];
}

export async function listProductsForStore(storeKey: string) {
  const db = await readDb();
  const store = await ensureStore(db, storeKey);
  return store.products;
}

export async function getProductById(id: string) {
  const db = await readDb();
  const stores = db.stores || {};
  for (const key of Object.keys(stores)) {
    const found = stores[key].products.find((p) => p.id === id);
    if (found) return found;
  }
  return null;
}

export async function getProductBySlug(slug: string) {
  const db = await readDb();
  return db.stores?.demo?.products.find((p) => p.slug === slug) || null;
}

export async function getProductBySlugForStore(storeKey: string, slug: string) {
  const db = await readDb();
  const store = await ensureStore(db, storeKey);
  return store.products.find((p) => p.slug === slug) || null;
}

async function ensureUniqueSlug(base: string) {
  const db = await readDb();
  const existing = new Set((db.stores?.demo?.products || []).map((p) => p.slug));
  if (!existing.has(base)) return base;
  let i = 2;
  while (existing.has(`${base}-${i}`)) i += 1;
  return `${base}-${i}`;
}

export async function createProduct(partial: Partial<Product>) {
  return createProductForStore('demo', partial);
}

async function ensureUniqueSlugForStore(storeKey: string, base: string) {
  const db = await readDb();
  const existing = new Set((db.stores?.[storeKey]?.products || []).map((p) => p.slug));
  if (!existing.has(base)) return base;
  let i = 2;
  while (existing.has(`${base}-${i}`)) i += 1;
  return `${base}-${i}`;
}

export async function createProductForStore(storeKey: string, partial: Partial<Product>) {
  const db = await readDb();
  const store = await ensureStore(db, storeKey);

  const now = new Date().toISOString();
  const title = (partial.title || 'Untitled').toString();
  const baseSlug = slugify(partial.slug || title);
  const slug = await ensureUniqueSlugForStore(storeKey, baseSlug);

  const product: Product = {
    id: crypto.randomBytes(6).toString('hex'),
    storeId: store.storeConfig.id,
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

  store.products = [product, ...store.products];
  db.stores[storeKey] = store;
  if (storeKey === 'demo') db.products = store.products; // legacy mirror
  await writeDb(db);
  return product;
}

export async function listOrdersForStore(storeKey: string) {
  const db = await readDb();
  const store = await ensureStore(db, storeKey);
  return store.orders;
}

function randomFrom<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function createTestOrderForStore(storeKey: string) {
  const db = await readDb();
  const store = await ensureStore(db, storeKey);

  const customerNames = ['Alice Wong', 'Bob Smith', 'Emily Clark', 'Noah Johnson', 'Sophia Martinez', 'Liam Chen'];
  const id = `#ORD-${Math.floor(1000 + Math.random() * 9000)}`;
  const items = Math.floor(1 + Math.random() * 4);
  const total = Number((Math.random() * 200 + 25).toFixed(2));
  const order: Order = {
    id,
    customer: randomFrom(customerNames),
    total,
    status: 'PENDING',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    items,
  };

  store.orders = [order, ...(store.orders || [])];
  db.stores = db.stores || {};
  db.stores[storeKey] = store;
  await writeDb(db);
  return order;
}

export async function updateOrderStatusForStore(storeKey: string, orderId: string, status: Order['status']) {
  const db = await readDb();
  const store = await ensureStore(db, storeKey);
  const idx = (store.orders || []).findIndex((o) => o.id === orderId);
  if (idx < 0) return null;
  const updated: Order = { ...store.orders[idx], status };
  store.orders[idx] = updated;
  db.stores = db.stores || {};
  db.stores[storeKey] = store;
  await writeDb(db);
  return updated;
}

export async function createOrderFromCheckout(
  storeKey: string,
  input: {
    email: string;
    customerName: string;
    shippingAddress: NonNullable<Order['shippingAddress']>;
    items: Array<{ productId: string; quantity: number }>;
  }
) {
  const db = await readDb();
  const store = await ensureStore(db, storeKey);

  const productMap = new Map(store.products.map((p) => [p.id, p]));
  const lineItems: NonNullable<Order['lineItems']> = [];
  for (const it of input.items || []) {
    const p = productMap.get(it.productId);
    if (!p) continue;
    const qty = Math.max(1, Math.min(99, Number(it.quantity) || 1));
    lineItems.push({
      productId: p.id,
      title: p.title,
      price: p.price,
      quantity: qty,
      image: p.images?.[0],
      slug: p.slug,
    });
  }

  if (lineItems.length === 0) {
    return { error: 'empty_cart' as const };
  }

  const total = Number(lineItems.reduce((sum, li) => sum + li.price * li.quantity, 0).toFixed(2));
  const id = `#ORD-${Math.floor(1000 + Math.random() * 9000)}`;
  const order: Order = {
    id,
    customer: input.customerName || 'Customer',
    email: input.email,
    total,
    status: 'PAID',
    paymentStatus: 'PAID',
    fulfillmentStatus: 'UNFULFILLED',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    items: lineItems.reduce((sum, li) => sum + li.quantity, 0),
    shippingAddress: input.shippingAddress,
    lineItems,
  };

  store.orders = [order, ...(store.orders || [])];
  db.stores = db.stores || {};
  db.stores[storeKey] = store;
  await writeDb(db);

  // Auto-create/update customer record from checkout
  await ensureCustomerFromOrder(storeKey, order as any);

  return order;
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
      visibility: 'VISIBLE',
    });
  }
  return reviews;
}

export async function listCustomersForStore(storeKey: string) {
  const db = await readDb();
  const store = await ensureStore(db, storeKey);
  store.customers = store.customers || [];
  return store.customers;
}

export async function upsertCustomerForStore(storeKey: string, customer: Customer) {
  const db = await readDb();
  const store = await ensureStore(db, storeKey);
  store.customers = store.customers || [];
  const idx = store.customers.findIndex((c) => c.id === customer.id);
  if (idx >= 0) store.customers[idx] = customer;
  else store.customers = [customer, ...store.customers];
  db.stores = db.stores || {};
  db.stores[storeKey] = store;
  await writeDb(db);
  return customer;
}

function customerIdFromEmail(email: string) {
  return crypto.createHash('sha256').update(email.trim().toLowerCase()).digest('hex').slice(0, 12);
}

export async function ensureCustomerFromOrder(storeKey: string, order: Order & any) {
  const db = await readDb();
  const store = await ensureStore(db, storeKey);
  store.customers = store.customers || [];
  const email = (order?.email || '').toString().trim().toLowerCase();
  if (!email) return null;
  const id = customerIdFromEmail(email);
  const existing = store.customers.find((c) => c.id === id);
  const totalSpent = Number(order.total || 0);
  const next: Customer = {
    id,
    name: (order.customer || 'Customer').toString(),
    email,
    totalSpent: existing ? existing.totalSpent + totalSpent : totalSpent,
    ordersCount: existing ? existing.ordersCount + 1 : 1,
    lastOrderDate: new Date().toISOString().slice(0, 10),
    tags: existing?.tags || [],
    aiInsights: existing?.aiInsights,
  };
  const idx = store.customers.findIndex((c) => c.id === id);
  if (idx >= 0) store.customers[idx] = next;
  else store.customers = [next, ...store.customers];
  db.stores = db.stores || {};
  db.stores[storeKey] = store;
  await writeDb(db);
  return next;
}

export async function listPublicReviewsForStore(storeKey: string) {
  const db = await readDb();
  const store = await ensureStore(db, storeKey);
  const products = store.products || [];
  const reviewMap = db.publicReviews || {};
  const out: Array<PublicReview & { productTitle: string; productSlug: string }> = [];
  for (const p of products) {
    const rs = reviewMap[p.id] || [];
    for (const r of rs) out.push({ ...r, productTitle: p.title, productSlug: p.slug });
  }
  out.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return out;
}

export async function setReviewVisibility(productId: string, reviewId: string, visibility: 'VISIBLE' | 'HIDDEN') {
  const db = await readDb();
  db.publicReviews = db.publicReviews || {};
  const rs = db.publicReviews[productId] || [];
  const idx = rs.findIndex((r) => r.id === reviewId);
  if (idx < 0) return null;
  rs[idx] = { ...rs[idx], visibility };
  db.publicReviews[productId] = rs;
  await writeDb(db);
  return rs[idx];
}

export async function getOrCreatePublicReviews(productId: string) {
  const db = await readDb();
  db.publicReviews = db.publicReviews || {};
  const existing = db.publicReviews[productId];
  if (existing && existing.length > 0) return existing;

  const product = await getProductById(productId);
  if (!product) return [];

  const count = Math.min(12, Math.max(5, Math.floor((product.title.length % 8) + 5)));
  const generated = generateDemoReviews(product, count);
  db.publicReviews[productId] = generated;
  await writeDb(db);
  return generated;
}

export async function updateProductById(id: string, patch: Partial<Product>) {
  const db = await readDb();
  const stores = db.stores || {};
  for (const key of Object.keys(stores)) {
    const idx = stores[key].products.findIndex((p) => p.id === id);
    if (idx < 0) continue;

    const prev = stores[key].products[idx];
    const next: Product = {
      ...prev,
      ...patch,
      updatedAt: new Date().toISOString(),
    };

    if (patch.slug && patch.slug !== prev.slug) {
      const baseSlug = slugify(patch.slug);
      next.slug = await ensureUniqueSlugForStore(key, baseSlug);
    } else {
      next.slug = prev.slug;
    }

    stores[key].products[idx] = next;
    db.stores = stores;
    if (key === 'demo') db.products = stores[key].products; // legacy mirror
    await writeDb(db);
    return next;
  }
  return null;
}

