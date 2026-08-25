/**
 * Retry helper with exponential backoff + jitter, aware of HTTP 429 /
 * Retry-After semantics. Used to wrap individual Gemini/API calls inside a
 * batch so a transient rate-limit or network error on ONE creative doesn't
 * take down the rest of the batch — the caller decides what to do once
 * retries are exhausted (withRetry rethrows the last error).
 */

export class RetryableHttpError extends Error {
    status: number;
    retryAfterMs?: number;

    constructor(message: string, status: number, retryAfterMs?: number) {
        super(message);
        this.name = "RetryableHttpError";
        this.status = status;
        this.retryAfterMs = retryAfterMs;
    }
}

/** Parses a fetch Response's Retry-After header (seconds or HTTP-date) into ms, if present. */
export function parseRetryAfterMs(res: Response): number | undefined {
    const header = res.headers?.get?.("Retry-After");
    if (!header) return undefined;
    const asSeconds = Number(header);
    if (!Number.isNaN(asSeconds)) return asSeconds * 1000;
    const asDate = Date.parse(header);
    if (!Number.isNaN(asDate)) return Math.max(0, asDate - Date.now());
    return undefined;
}

/** Decide whether an error/status is worth retrying: 429 and 5xx/network errors, not other 4xx. */
export function isRetryableStatus(status: number): boolean {
    return status === 429 || status >= 500;
}

export interface WithRetryOptions {
    maxRetries?: number;
    baseDelayMs?: number;
    maxDelayMs?: number;
    onRetry?: (attempt: number, error: unknown) => void;
}

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Runs `fn`, retrying on failure with exponential backoff + jitter.
 * `fn` should throw a RetryableHttpError (with the parsed Retry-After, if any)
 * for retryable HTTP failures, or a plain Error for network failures — both
 * are retried; a non-RetryableHttpError thrown deliberately as "do not retry"
 * (e.g. a validation error) should be a different Error subtype if that
 * distinction is ever needed, but today all thrown errors are retried up to
 * maxRetries since the only structured signal we have is RetryableHttpError.
 */
export async function withRetry<T>(fn: () => Promise<T>, options: WithRetryOptions = {}): Promise<T> {
    const { maxRetries = 3, baseDelayMs = 1500, maxDelayMs = 20000, onRetry } = options;

    let lastError: unknown;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (err) {
            lastError = err;
            if (attempt === maxRetries) break;

            let delay = Math.min(maxDelayMs, baseDelayMs * Math.pow(2, attempt));
            if (err instanceof RetryableHttpError && err.retryAfterMs) {
                delay = Math.max(delay, err.retryAfterMs);
            }
            delay += Math.random() * 500; // jitter

            onRetry?.(attempt + 1, err);
            await sleep(delay);
        }
    }
    throw lastError;
}
