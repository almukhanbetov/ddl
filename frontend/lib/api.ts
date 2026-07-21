import type { Category, Subcategory, Product, ProductDetail, SiteContent, Review } from './data';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8082';

// Product/category/content photos may be either a full external URL (seed
// data on picsum.photos) or a relative /uploads/... path produced by our own
// upload endpoint — those need the API origin prefixed before rendering.
export function resolveImageUrl(url: string): string {
  if (!url) return url;
  if (/^https?:\/\//i.test(url)) return url;
  return `${API_URL}${url}`;
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  });

  if (!res.ok) {
    let message = `Запрос ${path} завершился ошибкой ${res.status}`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // response had no JSON body
    }
    throw new ApiError(res.status, message);
  }

  return res.json() as Promise<T>;
}

export async function getSiteContent(): Promise<SiteContent> {
  return apiFetch<SiteContent>('/api/site-content');
}

export async function getCategories(): Promise<Category[]> {
  const data = await apiFetch<{ items: Category[] }>('/api/categories');
  return data.items;
}

export async function getSubcategories(categoryId: string): Promise<Subcategory[]> {
  const data = await apiFetch<{ items: Subcategory[] }>(`/api/categories/${categoryId}/subcategories`);
  return data.items;
}

export async function getProducts(params: {
  category?: string;
  subcategory?: string;
  limit?: number;
}): Promise<{ items: Product[]; total: number }> {
  const qs = new URLSearchParams();
  if (params.category) qs.set('category', params.category);
  if (params.subcategory) qs.set('subcategory', params.subcategory);
  if (params.limit) qs.set('limit', String(params.limit));
  const query = qs.toString();
  return apiFetch(`/api/products${query ? `?${query}` : ''}`);
}

export async function getProductDetail(id: string): Promise<{ product: ProductDetail; related: Product[] } | null> {
  try {
    return await apiFetch(`/api/products/${id}`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

export type PhoneChannel = 'telegram' | 'whatsapp' | 'sms';

export async function sendPhoneCode(phone: string, channel: PhoneChannel) {
  return apiFetch<{ sent: boolean; expiresInSeconds: number; debugCode: string }>('/api/phone/send', {
    method: 'POST',
    body: JSON.stringify({ phone, channel }),
  });
}

export async function verifyPhoneCode(phone: string, code: string) {
  return apiFetch<{ verified: boolean; token: string }>('/api/phone/verify', {
    method: 'POST',
    body: JSON.stringify({ phone, code }),
  });
}

export type CartItemInput = { productId: string; qty: number };

export type QuoteItem = {
  productId: string;
  qty: number;
  priceDay: number;
  lineTotal: number;
  availableStock: number;
  inStock: boolean;
};

export type Quote = {
  days: number;
  itemsTotal: number;
  deliveryCost: number;
  total: number;
  items: QuoteItem[];
};

export async function quoteCart(payload: {
  items: CartItemInput[];
  rentalStart: string;
  rentalEnd: string;
  deliveryMethod: 'delivery' | 'pickup';
}): Promise<Quote> {
  return apiFetch('/api/cart/quote', { method: 'POST', body: JSON.stringify(payload) });
}

export type OrderItem = {
  productId: string;
  productName: string;
  qty: number;
  priceDay: number;
  lineTotal: number;
};

export type Order = {
  id: number;
  publicId: string;
  rentalStart: string;
  rentalEnd: string;
  rentalDays: number;
  deliveryMethod: 'delivery' | 'pickup';
  address?: string;
  contactName: string;
  contactPhone: string;
  phoneVerified: boolean;
  comment: string;
  itemsTotal: number;
  deliveryCost: number;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
};

export async function getReviews(): Promise<Review[]> {
  const data = await apiFetch<{ items: Review[] }>('/api/reviews');
  return data.items;
}

export async function createReview(payload: { authorName: string; text: string; photos: File[] }): Promise<Review> {
  const form = new FormData();
  form.set('authorName', payload.authorName);
  form.set('text', payload.text);
  for (const file of payload.photos) form.append('photos', file);

  const res = await fetch(`${API_URL}/api/reviews`, { method: 'POST', body: form });
  if (!res.ok) {
    let message = `Запрос /api/reviews завершился ошибкой ${res.status}`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // response had no JSON body
    }
    throw new ApiError(res.status, message);
  }
  return res.json() as Promise<Review>;
}

export async function createOrder(payload: {
  items: CartItemInput[];
  rentalStart: string;
  rentalEnd: string;
  deliveryMethod: 'delivery' | 'pickup';
  address?: string;
  contactName: string;
  contactPhone: string;
  comment?: string;
  phoneToken?: string;
}): Promise<Order> {
  const data = await apiFetch<{ order: Order }>('/api/orders', { method: 'POST', body: JSON.stringify(payload) });
  return data.order;
}
