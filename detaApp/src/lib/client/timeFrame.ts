import { NotFound } from "$lib/errors/core";
import type { TFetcher } from "$lib/types/fetcher";
import type { ITimeFrame } from "$lib/types/ITimeFrame";
import { VERSION } from "$lib/utils/version";
import { cache_GetFrame, type ICachedTimeFrame } from "./cache";

/**
 * Raw query timeframes.
 *
 * @param fetcher
 * @param query
 * @param lastKey
 * @param limit
 * @returns
 * @throws NotFound
 */
export async function client_QueryTimeFrames(
    fetcher: TFetcher,
    query:
        | (Partial<ITimeFrame> & { [key: string]: unknown })
        | (Partial<ITimeFrame> & { [key: string]: unknown })[],
    lastKey?: string,
    limit?: number
): Promise<{ items: ITimeFrame[], count: number, last?: string }> {
    const url = new URL(`/api/v${VERSION.major}/timeframes`, window.location.origin);
    url.searchParams.set("query", btoa(JSON.stringify(query)));
    if (lastKey) url.searchParams.set("lastKey", lastKey);
    if (limit) url.searchParams.set("limit", limit.toString());

    const res = await fetcher(url, {
        method: "GET",
        headers: {
            "Accept": "application/json",
        }
    });
    if (!res.ok) {
        if (res.status === 404) throw new NotFound(res.statusText);
        throw res;
    }
    const data = await res.json();
    return data;
}

export async function client_GetTimeFrame(
    fetcher: TFetcher,
    frameEnd: number,
    useCache: boolean = true
): Promise<ITimeFrame | ICachedTimeFrame | null> {
    console.debug(`[TimeFrame] Getting frame ${frameEnd} | cache: ${useCache}`);
    if (useCache) {
        const cached = await cache_GetFrame(frameEnd);
        if (cached) return cached;
    }

    const url = new URL(`/api/v${VERSION.major}/timeframes/${frameEnd}`, window.location.origin);
    const res = await fetcher(url, {
        method: "GET",
        headers: {
            "Accept": "application/json",
        }
    });
    if (!res.ok) {
        if (res.status === 404) throw new NotFound(res.statusText);
        else throw res; // TODO: Err handling like rust
    }
    const data = await res.json();

    return data as ITimeFrame;
}