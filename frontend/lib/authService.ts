const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';

export interface AuthUser {
  id: number;
  name: string | null;
  email: string;
  avatar_url: string | null;
  provider: string | null;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const response = await fetch(`${apiBaseUrl}/api/auth/me`, {
    credentials: 'include',
    cache: 'no-store',
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error('Unable to verify authentication session.');
  }

  return response.json() as Promise<AuthUser>;
}

async function postAuth(path: string, body: unknown): Promise<AuthUser> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.detail ?? 'Authentication request failed.');
  }
  return payload as AuthUser;
}

export function loginWithCredentials(email: string, password: string): Promise<AuthUser> {
  return postAuth('/api/auth/login', { email, password });
}

export function registerWithCredentials(name: string, email: string, password: string): Promise<AuthUser> {
  return postAuth('/api/auth/register', { name, email, password });
}

export function startOAuthLogin(provider: 'google' | 'github'): void {
  window.location.href = `${apiBaseUrl}/api/auth/${provider}`;
}

export async function logout(): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/api/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Unable to log out.');
  }
}
