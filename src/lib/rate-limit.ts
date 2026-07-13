/**
 * In-memory sliding-window rate limiter.
 * Suitable for single-server deployments (Docker, Vercel serverless).
 *
 * Note: In serverless environments (Vercel), state resets on cold starts.
 * For production with high traffic, replace with Redis-based limiter or
 * use Vercel's built-in rate limiting.
 */

interface Window {
  timestamps: number[];
}

const store = new Map<string, Window>();

/** Clean up stale entries periodically (every 60 seconds). */
let lastCleanup = Date.now();
function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < 60_000) return;
  lastCleanup = now;
  for (const [key, window] of store) {
    window.timestamps = window.timestamps.filter((t) => t > now);
    if (window.timestamps.length === 0) store.delete(key);
  }
}

/**
 * Returns `true` if the request should be rate-limited.
 *
 * @param key      Unique identifier (e.g. IP, user ID, or endpoint+IP)
 * @param maxReqs  Maximum requests allowed in the window
 * @param windowMs Sliding window duration in milliseconds
 */
export function checkRateLimit(
  key: string,
  maxReqs: number,
  windowMs: number
): { limited: true; retryAfter: number } | { limited: false } {
  cleanup();
  const now = Date.now();

  let w = store.get(key);
  if (!w) {
    w = { timestamps: [] };
    store.set(key, w);
  }

  // Remove timestamps outside the window
  w.timestamps = w.timestamps.filter((t) => t > now - windowMs);

  if (w.timestamps.length >= maxReqs) {
    const oldest = w.timestamps[0];
    const retryAfter = Math.ceil((oldest + windowMs - now) / 1000);
    return { limited: true, retryAfter };
  }

  w.timestamps.push(now);
  return { limited: false };
}

/** Rate limit presets for different endpoint types. */
export const RATE_LIMITS = {
  /** AI suggestions — expensive, strict limit */
  ai: { maxReqs: 10, windowMs: 60_000 },
  /** File uploads — moderate limit */
  upload: { maxReqs: 30, windowMs: 60_000 },
  /** General API — permissive limit */
  api: { maxReqs: 100, windowMs: 60_000 },
} as const;
