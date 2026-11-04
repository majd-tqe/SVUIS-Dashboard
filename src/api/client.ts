import type { ApiResponse } from '@/types';

export class UnauthorizedError extends Error {
  constructor() {
    super('Unauthorized');
    this.name = 'UnauthorizedError';
  }
}

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api/v1').replace(/\/+$/, '');

export function apiUrl(path: string): string {
  return `${BASE_URL}${path}`;
}

let onUnauthorized: (() => void) | null = null;

export function setOnUnauthorized(cb: () => void) {
  onUnauthorized = cb;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = apiUrl(path);

  const { headers, ...restOptions } = options || {};
  const res = await fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...restOptions,
  });

  if (res.status === 401) {
    if (path === '/auth/login') {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || 'Invalid username or password');
    }
    onUnauthorized?.();
    throw new UnauthorizedError();
  }

  if (!res.ok) {
    try {
      const json: ApiResponse<T> = await res.json();
      throw new Error(json.error || `Request failed (${res.status})`);
    } catch (err) {
      if (err instanceof SyntaxError) {
        throw new Error(`Request failed (${res.status})`);
      }
      throw err;
    }
  }

  const json: ApiResponse<T> = await res.json();

  if (!json.success) {
    throw new Error(json.error || 'Request failed');
  }

  return json.data as T;
}

export async function apiGet<T>(path: string): Promise<T> {
  return request<T>(path);
}

export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function apiGetBlob(path: string): Promise<Blob> {
  const url = apiUrl(path);
  const res = await fetch(url, {
    credentials: 'include',
  });

  if (res.status === 401) {
    onUnauthorized?.();
    throw new UnauthorizedError();
  }

  if (!res.ok) {
    throw new Error('Failed to fetch blob');
  }

  return res.blob();
}
