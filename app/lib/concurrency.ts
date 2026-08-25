/**
 * Simple worker-pool with a concurrency limit, no external dependencies.
 *
 * Runs `worker` over every item in `items`, never allowing more than `limit`
 * calls to `worker` to be in flight at once. `worker` is expected to handle
 * its own errors (e.g. via withRetry from ./retry) — a thrown error inside
 * `worker` will reject the whole `runWithConcurrency` call, so callers that
 * want "one failure shouldn't kill the batch" semantics must catch inside
 * `worker` itself and record the failure instead of throwing.
 *
 * Used by the batch creative generator in app/dashboard/page.tsx so a lote
 * of up to 100 creatives doesn't fire 100 simultaneous requests at the
 * Gemini API.
 */
export async function runWithConcurrency<T>(
    items: T[],
    worker: (item: T, index: number) => Promise<void>,
    limit: number
): Promise<void> {
    if (items.length === 0) return;
    const boundedLimit = Math.max(1, Math.min(limit, items.length));
    let cursor = 0;

    const runOne = async (): Promise<void> => {
        while (cursor < items.length) {
            const currentIndex = cursor;
            cursor += 1;
            await worker(items[currentIndex], currentIndex);
        }
    };

    const workers = Array.from({ length: boundedLimit }, () => runOne());
    await Promise.all(workers);
}
