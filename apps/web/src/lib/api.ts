const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function request<T>(
  path: string,
  options: RequestInit & { token?: string; guestToken?: string } = {},
): Promise<T> {
  const { token, guestToken, ...init } = options

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string>),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  if (guestToken) {
    headers['x-guest-token'] = guestToken
  }

  const res = await fetch(`${API_URL}${path}`, { ...init, headers })

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: 'Unknown error' }))
    throw new ApiError(res.status, body.error ?? `HTTP ${res.status}`)
  }

  return res.json() as Promise<T>
}

export const api = {
  get: <T>(path: string, token?: string, guestToken?: string) =>
    request<T>(path, { method: 'GET', token, guestToken }),

  post: <T>(path: string, body: unknown, token?: string, guestToken?: string) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body), token, guestToken }),

  patch: <T>(path: string, body: unknown, token?: string, guestToken?: string) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body), token, guestToken }),

  del: <T>(path: string, token?: string) =>
    request<T>(path, { method: 'DELETE', token }),
}
