/**
 * Enums representing status states
 */
export enum ProductStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED'
}

/**
 * Task 3: Database Schema - Stores
 */
export interface StoreConfig {
  id: string;
  name: string;
  subdomain: string; // New: Multi-tenancy identifier
  plan: 'FREE' | 'PRO' | 'ENTERPRISE'; // New: SaaS Tier
  description: string;
  currency: string;
  email: string;
  address: string;
  enableAi: boolean; // New: User control for AI features
  // geminiApiKey removed: Managed via process.env.API_KEY
  theme: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    heroHeadline: string;
  };
  legal?: {
    privacyPolicy: string;
    termsOfService: string;
    shippingPolicy: string;
  }
}

/**
 * Task 3: Database Schema - Products
 */
export interface Product {
  id: string;
  storeId: string;
  title: string;
  slug: string;
  descriptionHtml: string;
  price: number;
  compareAtPrice?: number;
  images: string[]; // Base64 or URLs
  status: ProductStatus;
  
  // SEO Metadata (AI Generated)
  seoTitle: string;
  seoDescription: string;
  tags: string[];
  
  // Meta Ads specific
  adCopy?: string;
  
  createdAt: string;
  updatedAt: string;
}

/**
 * Task 3: Database Schema - AI Logs (Simplified)
 */
export interface AiLog {
  id: string;
  action: 'VISION_TO_LISTING' | 'PROMPT_TO_STORE' | 'GENERATE_LEGAL';
  tokensUsed: number;
  timestamp: string;
  status: 'SUCCESS' | 'FAILURE';
}

export interface VisionResult {
  title: string;
  descriptionHtml: string;
  seoTitle: string;
  seoDescription: string;
  tags: string[];
  estimatedPrice: number;
  suggestedAdCopy: string;
}

export interface Order {
  id: string;
  customer: string;
  total: number;
  status: 'PAID' | 'PENDING' | 'SHIPPED';
  date: string;
  items: number;

  // Extended fields for checkout flow (optional for backward compat)
  email?: string;
  paymentStatus?: 'PAID' | 'PENDING' | 'FAILED' | 'REFUNDED';
  fulfillmentStatus?: 'UNFULFILLED' | 'FULFILLED' | 'PARTIALLY_FULFILLED' | 'CANCELLED';
  shippingAddress?: {
    name: string;
    address1: string;
    address2?: string;
    city: string;
    province?: string;
    country: string;
    zip: string;
    phone?: string;
  };
  lineItems?: Array<{
    productId: string;
    title: string;
    price: number;
    quantity: number;
    image?: string;
    slug?: string;
  }>;
}

// --- NEW MODULES ---

export interface Email {
  id: string;
  from: string;
  subject: string;
  body: string;
  date: string;
  isRead: boolean;
  status: 'PENDING' | 'REPLIED';
  replyDraft?: string;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  customer: string;
  rating: number; // 1-5
  comment: string;
  date: string;
  status: 'PENDING' | 'APPROVED' | 'SPAM';
  reply?: string;
}

/**
 * Public, customer-facing reviews (demo-friendly).
 * IMPORTANT: These can be demo-generated; don't present them as verified purchases unless true.
 */
export interface PublicReview {
  id: string;
  productId: string;
  authorName: string;
  rating: number; // 1-5
  title: string;
  body: string;
  createdAt: string; // ISO
  source: 'DEMO' | 'REAL';
  visibility?: 'VISIBLE' | 'HIDDEN';
}

export interface Workflow {
  id: string;
  name: string;
  trigger: 'NEW_REVIEW' | 'NEW_ORDER' | 'LOW_STOCK';
  condition: string; // Simple description for UI, e.g., "Rating >= 4"
  action: 'AUTO_REPLY' | 'SEND_EMAIL' | 'NOTIFY_ADMIN';
  isActive: boolean;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  totalSpent: number;
  ordersCount: number;
  lastOrderDate: string;
  tags: string[]; // e.g. "VIP", "New", "At Risk"
  aiInsights?: string; // AI generated summary
}

export type AuthRole = 'SUPER_ADMIN' | 'MERCHANT_OWNER' | 'MERCHANT_STAFF';

export interface AuthUser {
  id: string;
  email: string;
  passwordHash: string;
  storeKey: string;
  role: AuthRole;
  createdAt: string;
}
