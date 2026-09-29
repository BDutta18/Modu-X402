/**
 * api.ts
 * Typed API client for the Modu x402 control plane.
 * Uses native fetch + EventSource only — no external libraries.
 */

import { CONTROL_PLANE_URL } from './config';

// ---------------------------------------------------------------------------
// Storage key
// ---------------------------------------------------------------------------

const API_KEY_STORAGE_KEY = 'modu_api_key';

// ---------------------------------------------------------------------------
// Types — Auth
// ---------------------------------------------------------------------------

export interface CliTokenResponse {
  token: string;
  authUrl: string;
  pollUrl: string;
}

export interface ClaimResponse {
  success: boolean;
  accountId: string;
}

export type PollStatus = 'pending' | 'claimed' | 'expired';

export interface PollResponse {
  status: PollStatus;
  apiKey?: string;
  payoutAddress?: string;
}

// ---------------------------------------------------------------------------
// Types — Account
// ---------------------------------------------------------------------------

export interface AccountMe {
  id: string;
  email: string;
  payoutAddress: string;
}

export interface UpdatePayoutAddressResponse {
  success: boolean;
  payoutAddress: string;
}

// ---------------------------------------------------------------------------
// Types — Endpoints
// ---------------------------------------------------------------------------

export interface CreateEndpointRequest {
  originUrl: string;
  price: string;
  asset: string;
  path?: string;
}

export interface CreatedEndpoint {
  endpointId: string;
  slug: string;
  proxyUrl: string;
  originUrl: string;
  price: string;
  asset: string;
  payoutAddress: string;
}

export interface EndpointListItem {
  id: string;
  slug: string;
  proxyUrl: string;
  originUrl: string;
  price: string;
  asset: string;
  requestsToday: number;
  revenueToday: string;
  isActive: boolean;
}

export interface DeleteEndpointResponse {
  success: boolean;
  endpointId: string;
  status: string;
}

// ---------------------------------------------------------------------------
// Types — Logs
// ---------------------------------------------------------------------------

export interface LogEntry {
  id?: string;
  endpointId?: string;
  timestamp: string;
  payerAddress?: string;
  txid?: string;
  amount?: string;
  status?: number;        // HTTP status code
  latencyMs?: number;
  // legacy / flexible
  message?: string;
  level?: string;
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Types — Stats
// ---------------------------------------------------------------------------

export interface RevenueByDay {
  date: string;
  amount: string;
  requests: number;
}

export interface TopPayer {
  address: string;
  requests: number;
  totalAmount: string;
}

export interface EndpointStats {
  endpointId: string;
  totalRequests: number;
  paidRequests: number;
  totalRevenue: string;
  revenueToday: string;
  requestsToday: number;
  revenueByDay: RevenueByDay[];
  topPayers: TopPayer[];
}

// ---------------------------------------------------------------------------
// Types — Generic error
// ---------------------------------------------------------------------------

export interface ApiError {
  status: number;
  message: string;
  raw?: unknown;
}

// ---------------------------------------------------------------------------
// Helpers — localStorage
// ---------------------------------------------------------------------------

/** Read the stored API key (Bearer token) from localStorage. */
export function getStoredApiKey(): string | null {
  try {
    return localStorage.getItem(API_KEY_STORAGE_KEY);
  } catch {
    return null;
  }
}

/** Persist an API key to localStorage. */
export function setStoredApiKey(apiKey: string): void {
  try {
    localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
  } catch {
    // Silently ignore write failures (e.g. private-browsing quota)
  }
}

/** Remove the stored API key (logout). */
export function clearStoredApiKey(): void {
  try {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
  } catch {
    // Ignore
  }
}

// ---------------------------------------------------------------------------
// Core — apiFetch
// ---------------------------------------------------------------------------

/**
 * Base fetch wrapper.
 *
 * - Reads the API key from localStorage and attaches a Bearer Authorization header.
 * - Accepts an optional `overrideApiKey` to use instead of localStorage (useful
 *   for routes like /auth/poll that are called before the key is persisted).
 * - Retries once on 5xx responses.
 * - Throws an `ApiError`-shaped object on non-2xx responses.
 */
async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  overrideApiKey?: string,
): Promise<T> {
  const apiKey = overrideApiKey ?? getStoredApiKey();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };

  if (apiKey) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${apiKey}`;
  }

  const url = `${CONTROL_PLANE_URL}${path}`;
  const init: RequestInit = { ...options, headers };

  const attempt = async (): Promise<Response> => fetch(url, init);

  let response: Response;

  try {
    response = await attempt();
  } catch (networkErr) {
    throw {
      status: 0,
      message: 'Network error — could not reach the control plane.',
      raw: networkErr,
    } satisfies ApiError;
  }

  // Retry once on server errors
  if (response.status >= 500) {
    try {
      response = await attempt();
    } catch (networkErr) {
      throw {
        status: 0,
        message: 'Network error on retry — could not reach the control plane.',
        raw: networkErr,
      } satisfies ApiError;
    }
  }

  if (!response.ok) {
    let raw: unknown;
    try {
      raw = await response.json();
    } catch {
      raw = await response.text().catch(() => null);
    }

    const message =
      (raw && typeof raw === 'object' && 'message' in raw
        ? String((raw as Record<string, unknown>).message)
        : null) ??
      (raw && typeof raw === 'object' && 'error' in raw
        ? String((raw as Record<string, unknown>).error)
        : null) ??
      response.statusText ??
      'Unknown error';

    throw { status: response.status, message, raw } satisfies ApiError;
  }

  // 204 No Content
  if (response.status === 204) {
    return undefined as unknown as T;
  }

  return response.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Auth routes
// ---------------------------------------------------------------------------

/**
 * POST /api/auth/cli-token
 * Initiates a CLI authentication flow.
 * Returns a short-lived token, a browser auth URL, and a poll URL.
 */
export async function createCliToken(): Promise<CliTokenResponse> {
  return apiFetch<CliTokenResponse>('/api/auth/cli-token', { method: 'POST' });
}

/**
 * POST /api/auth/claim
 * Claims a pending CLI token after the user has authenticated in the browser.
 * @param token - The short-lived token returned by createCliToken()
 */
export async function claimCliToken(token: string): Promise<ClaimResponse> {
  return apiFetch<ClaimResponse>('/api/auth/claim', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
}

/**
 * GET /api/auth/poll?token=...
 * Polls the status of a CLI auth token.
 * Use this from the CLI to wait until the user completes browser auth.
 *
 * @param token    - The short-lived token to poll.
 * @param apiKey   - Optional override (the key is not yet in localStorage at
 *                   this point in the flow).
 */
export async function pollCliToken(
  token: string,
  apiKey?: string,
): Promise<PollResponse> {
  const params = new URLSearchParams({ token });
  return apiFetch<PollResponse>(
    `/api/auth/poll?${params.toString()}`,
    { method: 'GET' },
    apiKey,
  );
}

// ---------------------------------------------------------------------------
// Account routes
// ---------------------------------------------------------------------------

/**
 * GET /api/account/me
 * Returns the authenticated user's account details.
 */
export async function getMe(): Promise<AccountMe> {
  return apiFetch<AccountMe>('/api/account/me', { method: 'GET' });
}

/**
 * POST /api/account/payout-address
 * Updates the authenticated user's payout address.
 *
 * @param payoutAddress - Blockchain address to receive revenue.
 */
export async function updatePayoutAddress(
  payoutAddress: string,
): Promise<UpdatePayoutAddressResponse> {
  return apiFetch<UpdatePayoutAddressResponse>('/api/account/payout-address', {
    method: 'POST',
    body: JSON.stringify({ payoutAddress }),
  });
}

// ---------------------------------------------------------------------------
// Endpoint routes
// ---------------------------------------------------------------------------

/**
 * POST /api/endpoints
 * Registers a new monetised proxy endpoint.
 *
 * @param payload.originUrl - The upstream URL to proxy to.
 * @param payload.price     - Price per request (as a string, e.g. "0.001").
 * @param payload.asset     - Asset ticker / contract (e.g. "USDC").
 * @param payload.path      - Optional path prefix override.
 */
export async function createEndpoint(
  payload: CreateEndpointRequest,
): Promise<CreatedEndpoint> {
  return apiFetch<CreatedEndpoint>('/api/endpoints', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * GET /api/endpoints
 * Lists all endpoints belonging to the authenticated account.
 */
export async function listEndpoints(): Promise<EndpointListItem[]> {
  return apiFetch<EndpointListItem[]>('/api/endpoints', { method: 'GET' });
}

/**
 * DELETE /api/endpoints/:id
 * Deactivates (soft-deletes) an endpoint.
 *
 * @param endpointId - The endpoint UUID to delete.
 */
export async function deleteEndpoint(
  endpointId: string,
): Promise<DeleteEndpointResponse> {
  return apiFetch<DeleteEndpointResponse>(`/api/endpoints/${endpointId}`, {
    method: 'DELETE',
  });
}

// ---------------------------------------------------------------------------
// Log routes
// ---------------------------------------------------------------------------

/**
 * GET /api/endpoints/:id/logs?limit=N
 * Fetches a historical snapshot of log entries for an endpoint.
 *
 * @param endpointId - The endpoint UUID.
 * @param limit      - Maximum number of log entries to return (default 50).
 */
export async function getEndpointLogs(
  endpointId: string,
  limit = 50,
): Promise<LogEntry[]> {
  const params = new URLSearchParams({ limit: String(limit) });
  return apiFetch<LogEntry[]>(
    `/api/endpoints/${endpointId}/logs?${params.toString()}`,
    { method: 'GET' },
  );
}

/**
 * GET /api/endpoints/:id/logs?follow=true  (SSE stream)
 * Opens a Server-Sent Events stream that emits log entries in real time.
 *
 * The EventSource is returned so the caller can close it when done.
 *
 * @param endpointId - The endpoint UUID.
 * @param onLog      - Callback invoked with each parsed LogEntry.
 * @param onError    - Optional callback for stream errors.
 * @param apiKey     - Optional API key override (falls back to localStorage).
 * @returns The EventSource instance — call `.close()` to unsubscribe.
 *
 * NOTE: The native EventSource API does not support custom headers.
 *       The API key is therefore passed as a query parameter `apiKey` so
 *       the server can authenticate SSE connections without needing CORS
 *       credentials. Ensure the server accepts this query param as a
 *       fallback auth mechanism for SSE routes.
 */
export function subscribeToLogs(
  endpointId: string,
  onLog: (entry: LogEntry) => void,
  onError?: (event: Event) => void,
  apiKey?: string,
): EventSource {
  const key = apiKey ?? getStoredApiKey() ?? '';
  const params = new URLSearchParams({ follow: 'true' });

  if (key) {
    // Pass the key as a query param — SSE/EventSource cannot send headers.
    params.set('apiKey', key);
  }

  const url = `${CONTROL_PLANE_URL}/api/endpoints/${endpointId}/logs?${params.toString()}`;
  const source = new EventSource(url);

  source.onmessage = (event: MessageEvent) => {
    try {
      const entry = JSON.parse(event.data as string) as LogEntry;
      onLog(entry);
    } catch {
      // Non-JSON message (e.g. keep-alive ping) — ignore silently.
    }
  };

  if (onError) {
    source.onerror = onError;
  }

  return source;
}

// ---------------------------------------------------------------------------
// Stats routes
// ---------------------------------------------------------------------------

/**
 * GET /api/endpoints/:id/stats
 * Returns aggregated request and revenue statistics for an endpoint.
 *
 * @param endpointId - The endpoint UUID.
 */
export async function getEndpointStats(
  endpointId: string,
): Promise<EndpointStats> {
  return apiFetch<EndpointStats>(`/api/endpoints/${endpointId}/stats`, {
    method: 'GET',
  });
}
