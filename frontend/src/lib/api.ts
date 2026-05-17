const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9090';

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  userId: string;
  email: string;
  roles: string[];
}

export interface ShortUrl {
  shortCode: string;
  shortUrl: string;
  originalUrl: string;
  createdAt: string;
  expiresAt: string | null;
  hits: number;
  preview: boolean;
}

export class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new ApiError(res.status, err.message || 'Request failed');
  }
  return res.json();
}

function authHeaders(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}` };
}

function jsonHeaders(token?: string): HeadersInit {
  return {
    'Content-Type': 'application/json',
    ...(token ? authHeaders(token) : {})
  };
}

export const api = {
  login: (email: string, password: string) =>
    fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: jsonHeaders(),
      body: JSON.stringify({ email, password })
    }).then<AuthResponse>(handle),

  register: (email: string, password: string) =>
    fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: jsonHeaders(),
      body: JSON.stringify({ email, password })
    }).then<AuthResponse>(handle),

  shorten: (token: string | null, urls: { url: string; expiresAt?: string }[]) =>
    fetch(`${API}/api/shorten`, {
      method: 'POST',
      headers: jsonHeaders(token ?? undefined),
      body: JSON.stringify({ urls })
    }).then<ShortUrl[]>(handle),

  myUrls: (token: string) =>
    fetch(`${API}/api/urls`, {
      headers: authHeaders(token)
    }).then<ShortUrl[]>(handle),

  analytics: (token: string, code: string) =>
    fetch(`${API}/api/analytics/${encodeURIComponent(code)}`, {
      headers: authHeaders(token)
    }).then<{ shortCode: string; hits: number; originalUrl: string }>(handle),

  deleteUrl: (token: string, shortCode: string) =>
    fetch(`${API}/api/urls/${encodeURIComponent(shortCode)}`, {
      method: 'DELETE',
      headers: authHeaders(token)
    }).then(res => {
      if (!res.ok) throw new ApiError(res.status, 'Failed to delete');
    })
};
