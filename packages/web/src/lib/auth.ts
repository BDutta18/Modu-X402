/** localStorage key used to persist the API key across sessions. */
const STORAGE_KEY = 'modu_api_key';

/**
 * Reads the API key from localStorage.
 * Returns `null` when no key has been saved yet.
 */
export function getApiKey(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    // localStorage may be unavailable in certain environments (e.g. SSR, private mode)
    return null;
  }
}

/**
 * Persists an API key to localStorage.
 * Call this after the user registers or logs in.
 */
export function setApiKey(key: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, key);
  } catch {
    console.warn('[auth] Unable to persist API key to localStorage.');
  }
}

/**
 * Removes the API key from localStorage.
 * Call this when the user logs out or revokes their key.
 */
export function clearApiKey(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    console.warn('[auth] Unable to clear API key from localStorage.');
  }
}

/**
 * Returns `true` when a non-empty API key is present in localStorage.
 */
export function isAuthenticated(): boolean {
  const key = getApiKey();
  return key !== null && key.trim().length > 0;
}
