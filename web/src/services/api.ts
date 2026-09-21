const API_BASE = '/api';

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  // FormData bodies need the browser to set the multipart boundary itself.
  const isFormData = init?.body instanceof FormData;
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}
