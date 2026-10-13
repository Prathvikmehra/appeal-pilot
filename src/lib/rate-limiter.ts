interface RateLimitEntry {
  timestamps: number[];
}

const windowMs = 60 * 1000; // 1 minute sliding window
const maxRequests = 10;     // 10 requests per minute
const ipStore = new Map<string, RateLimitEntry>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetMs: number;
}

/**
 * In-memory sliding-window rate limiter per IP address.
 * Limits users to 10 requests per minute to prevent accidental spam or quota exhaustion.
 */
export function checkRateLimit(ip: string): RateLimitResult {
  const now = Date.now();
  const entry = ipStore.get(ip) || { timestamps: [] };

  // Retain only timestamps within the active sliding window
  const validTimestamps = entry.timestamps.filter((ts) => now - ts < windowMs);

  if (validTimestamps.length >= maxRequests) {
    const oldestTimestamp = validTimestamps[0];
    const resetMs = windowMs - (now - oldestTimestamp);
    return {
      allowed: false,
      remaining: 0,
      resetMs: Math.max(0, resetMs),
    };
  }

  validTimestamps.push(now);
  ipStore.set(ip, { timestamps: validTimestamps });

  return {
    allowed: true,
    remaining: maxRequests - validTimestamps.length,
    resetMs: windowMs,
  };
}
