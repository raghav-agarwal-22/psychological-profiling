export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('innermind_token')
}

export function setToken(token: string): void {
  localStorage.setItem('innermind_token', token)
}

export function clearToken(): void {
  localStorage.removeItem('innermind_token')
}
