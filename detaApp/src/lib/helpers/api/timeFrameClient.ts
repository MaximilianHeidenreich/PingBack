import type { TFetcher } from "$lib/types/fetcher";
import type { ITimeFrame } from "$lib/types/ITimeFrame";
import { VERSION } from "$lib/utils/version";
import { cacheGetTimeFrame, cacheSetTimeFrame, type ICachedTimeFrame } from "../cache";

export async function clientQueryTimeFramesRaw(
    fetcher: TFetcher,
    query:
        | (Partial<ITimeFrame> & { [key: string]: unknown })
        | (Partial<ITimeFrame> & { [key: string]: unknown })[],
    lastKey?: string,
    limit?: number
): Promise<{ items: ITimeFrame[]; count: number; last?: string }> {
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
    if (!res.ok) throw res; // TODO: Err handling like rust
    const data = await res.json();
    return data;
}

export async function clientGetTimeFrame(
    fetcher: TFetcher,
    frameEnd: number,
    useCache: boolean = true
): Promise<ITimeFrame | ICachedTimeFrame | null> {
    /*if (useCache) {
        const cached = await cacheGetTimeFrame(frameEnd);
        if (cached) return cached;
    }*/

    const url = new URL(`/api/v${VERSION.major}/timeframes/${frameEnd}`, window.location.origin);

    const res = await fetcher(url, {
        method: "GET",
        headers: {
            "Accept": "application/json",
        }
    });
    if (!res.ok) {
        if (res.status === 404) return null;
        else throw res; // TODO: Err handling like rust
    }
    const data = await res.json();

    return data as ITimeFrame;
}

