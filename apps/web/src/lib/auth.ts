export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('innermind_token')
}

export function clearToken(): void {
  localStorage.removeItem('innermind_token')
}
