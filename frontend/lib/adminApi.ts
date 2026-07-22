import type { Product, LocalizedSiteContent, Category, Subcategory } from './data';
import type { Order } from './api';
import { ApiError } from './api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8082';

async function adminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    cache: 'no-store',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  });

  if (!res.ok) {
    let message = `Запрос ${path} завершился ошибкой ${res.status}`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // no JSON body
    }
    throw new ApiError(res.status, message);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export type AdminUser = { id: number; email: string; name: string; createdAt?: string };

export async function adminLogin(email: string, password: string): Promise<AdminUser> {
  const data = await adminFetch<{ user: AdminUser }>('/api/admin/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  return data.user;
}

export async function adminLogout(): Promise<void> {
  await adminFetch('/api/admin/auth/logout', { method: 'POST' });
}

export async function adminMe(): Promise<AdminUser | null> {
  try {
    const data = await adminFetch<{ user: AdminUser }>('/api/admin/auth/me');
    return data.user;
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) return null;
    throw err;
  }
}

export type ProductInput = {
  categoryId: string;
  subcategoryId: string;
  name: string;
  article: string;
  stock: number;
  priceDay: number;
  damageCost: number;
  imageUrl: string;
  description: string;
};

export async function adminListProducts(): Promise<Product[]> {
  const data = await adminFetch<{ items: Product[] }>('/api/admin/products');
  return data.items;
}

export async function adminCreateProduct(input: ProductInput): Promise<Product> {
  const data = await adminFetch<{ product: Product }>('/api/admin/products', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return data.product;
}

export async function adminUpdateProduct(id: string, input: ProductInput): Promise<Product> {
  const data = await adminFetch<{ product: Product }>(`/api/admin/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  });
  return data.product;
}

export async function adminDeleteProduct(id: string): Promise<void> {
  await adminFetch(`/api/admin/products/${id}`, { method: 'DELETE' });
}

export type CategoryInput = { name: string; imageUrl: string; itemCount: number };
export type SubcategoryInput = { name: string; itemCount: number };

export async function adminCreateCategory(input: CategoryInput): Promise<Category> {
  const data = await adminFetch<{ category: Category }>('/api/admin/categories', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return data.category;
}

export async function adminUpdateCategory(categoryId: string, input: CategoryInput): Promise<Category> {
  const data = await adminFetch<{ category: Category }>(`/api/admin/categories/${categoryId}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  });
  return data.category;
}

export async function adminDeleteCategory(categoryId: string): Promise<void> {
  await adminFetch(`/api/admin/categories/${categoryId}`, { method: 'DELETE' });
}

export async function adminCreateSubcategory(categoryId: string, input: SubcategoryInput): Promise<Subcategory> {
  const data = await adminFetch<{ subcategory: Subcategory }>(`/api/admin/categories/${categoryId}/subcategories`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return data.subcategory;
}

export async function adminUpdateSubcategory(categoryId: string, subcategoryId: string, input: SubcategoryInput): Promise<Subcategory> {
  const data = await adminFetch<{ subcategory: Subcategory }>(`/api/admin/categories/${categoryId}/subcategories/${subcategoryId}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  });
  return data.subcategory;
}

export async function adminDeleteSubcategory(categoryId: string, subcategoryId: string): Promise<void> {
  await adminFetch(`/api/admin/categories/${categoryId}/subcategories/${subcategoryId}`, { method: 'DELETE' });
}

export async function adminListOrders(status?: string): Promise<Order[]> {
  const qs = status ? `?status=${status}` : '';
  const data = await adminFetch<{ items: Order[] }>(`/api/admin/orders${qs}`);
  return data.items;
}

export async function adminUpdateOrderStatus(publicId: string, status: string): Promise<Order> {
  const data = await adminFetch<{ order: Order }>(`/api/admin/orders/${publicId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
  return data.order;
}

export async function adminListUsers(): Promise<AdminUser[]> {
  const data = await adminFetch<{ items: AdminUser[] }>('/api/admin/users');
  return data.items;
}

export async function adminCreateUser(input: { email: string; name: string; password: string }): Promise<AdminUser> {
  const data = await adminFetch<{ user: AdminUser }>('/api/admin/users', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return data.user;
}

export async function adminUploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.set('file', file);

  const res = await fetch(`${API_URL}/api/admin/uploads`, { method: 'POST', credentials: 'include', body: form });
  if (!res.ok) {
    let message = `Запрос /api/admin/uploads завершился ошибкой ${res.status}`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // no JSON body
    }
    throw new ApiError(res.status, message);
  }
  const data = (await res.json()) as { url: string };
  return data.url;
}

export async function adminGetSiteContent(): Promise<LocalizedSiteContent> {
  return adminFetch<LocalizedSiteContent>('/api/admin/site-content');
}

export async function adminUpdateSiteContent(content: LocalizedSiteContent): Promise<LocalizedSiteContent> {
  return adminFetch<LocalizedSiteContent>('/api/admin/site-content', {
    method: 'PUT',
    body: JSON.stringify(content),
  });
}

export { ApiError };
