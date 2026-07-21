import { API_URL, ApiError } from './api';

async function customerFetch<T>(path: string, init?: RequestInit): Promise<T> {
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

export type Customer = { id: number; email: string; name: string };

export async function customerRegister(input: { name: string; email: string; password: string }): Promise<Customer> {
  const data = await customerFetch<{ user: Customer }>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return data.user;
}

export async function customerLogin(email: string, password: string): Promise<Customer> {
  const data = await customerFetch<{ user: Customer }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  return data.user;
}

export async function customerLogout(): Promise<void> {
  await customerFetch('/api/auth/logout', { method: 'POST' });
}

export async function customerMe(): Promise<Customer | null> {
  try {
    const data = await customerFetch<{ user: Customer }>('/api/auth/me');
    return data.user;
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) return null;
    throw err;
  }
}

export { ApiError };
