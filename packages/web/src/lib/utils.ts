import { clsx, type ClassValue } from 'clsx';

// ─── Class name merger ────────────────────────────────────────────────────────

/**
 * Merges class names using clsx.
 * Falsy values, undefined, and empty strings are automatically filtered out.
 *
 * @example
 * cn('px-4', isActive && 'bg-primary', undefined) // → 'px-4 bg-primary'
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(...inputs);
}

// ─── Address helpers ──────────────────────────────────────────────────────────

/**
 * Truncates a blockchain address to a readable short form.
 *
 * @param addr  Full address string (e.g. '0xAbCd…1234')
 * @param chars Number of leading characters to keep (default: 6)
 * @returns     e.g. '0xAbCd…1234' → '0xAbCd...1234'
 */
export function truncateAddress(addr: string, chars = 6): string {
  if (!addr) return '';
  if (addr.length <= chars + 4) return addr;
  return `${addr.slice(0, chars)}...${addr.slice(-4)}`;
}

// ─── Amount formatting ────────────────────────────────────────────────────────

/**
 * Converts a micro-unit amount string to a human-readable decimal string.
 *
 * @param microUnits  Raw amount as a string of integer micro-units (e.g. '1000000')
 * @param decimals    Number of decimal places to divide by (default: 6, i.e. ÷ 10^6)
 * @returns           Formatted string with 4 decimal places (e.g. '1.0000')
 */
export function formatAmount(microUnits: string, decimals = 6): string {
  const raw = parseFloat(microUnits);
  if (isNaN(raw)) return '0.0000';
  const divisor = Math.pow(10, decimals);
  return (raw / divisor).toFixed(4);
}

// ─── Clipboard ────────────────────────────────────────────────────────────────

/**
 * Copies `text` to the system clipboard.
 * Falls back to the legacy `execCommand` API when the Clipboard API is unavailable.
 */
export async function copyToClipboard(text: string): Promise<void> {
  if (navigator?.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  // Legacy fallback
  const el = document.createElement('textarea');
  el.value = text;
  el.style.position = 'fixed';
  el.style.opacity = '0';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}

// ─── Date & time helpers ──────────────────────────────────────────────────────

/**
 * Returns a human-friendly relative time string from an ISO date string.
 *
 * @example
 * timeAgo('2026-09-29T21:00:00Z') // → '23 minutes ago'
 */
export function timeAgo(isoDate: string): string {
  const now  = Date.now();
  const then = new Date(isoDate).getTime();
  const diffMs = now - then;

  if (isNaN(then)) return 'unknown time ago';

  const seconds = Math.floor(diffMs / 1_000);
  const minutes = Math.floor(seconds / 60);
  const hours   = Math.floor(minutes / 60);
  const days    = Math.floor(hours   / 24);
  const weeks   = Math.floor(days    / 7);
  const months  = Math.floor(days    / 30);
  const years   = Math.floor(days    / 365);

  if (seconds < 5)   return 'just now';
  if (seconds < 60)  return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
  if (minutes < 60)  return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  if (hours   < 24)  return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  if (days    < 7)   return `${days} day${days !== 1 ? 's' : ''} ago`;
  if (weeks   < 5)   return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
  if (months  < 12)  return `${months} month${months !== 1 ? 's' : ''} ago`;
  return `${years} year${years !== 1 ? 's' : ''} ago`;
}

/**
 * Formats an ISO date string as a readable date like 'Sep 29, 2026'.
 *
 * @param isoDate  ISO 8601 date string
 * @returns        Formatted string using the user's locale (en-US)
 */
export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return 'Invalid date';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day:   'numeric',
    year:  'numeric',
  });
}
