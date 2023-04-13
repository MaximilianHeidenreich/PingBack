import { NotFound } from "$lib/errors/core";
import type { TFetcher } from "$lib/types/fetcher";
import type { ITimeFrame } from "$lib/types/ITimeFrame";
import { VERSION } from "$lib/utils/version";
import dayjs from "dayjs";
import { cache_GetFrame, cache_SetFrame } from "./cache";

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
    frameEnd: number,
    useCache: boolean = true
): Promise<{ cached: boolean, frame: ITimeFrame } | null> { // TODO: Can return null?
    console.debug(`[TimeFrame] Requested frame ${frameEnd} (${dayjs(frameEnd).format()}) (useCache: ${useCache})`);
    if (useCache) {
        const cached = await cache_GetFrame(frameEnd);
        if (cached && cached.frame) {
            console.debug(`[TimeFrame] Cache HIT for frame ${frameEnd} (${dayjs(frameEnd).format()})`);
            return { cached: true, frame: cached.frame };
        }
    }
    if (useCache) console.debug(`[TimeFrame] Cache MISS for frame ${frameEnd} (${dayjs(frameEnd).format()})`);

    const url = new URL(`/api/v${VERSION.major}/timeframes/${frameEnd}`, window.location.origin);
    const res = await fetch(url, {
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

    if (useCache) {
        cache_SetFrame(frameEnd, { frame: data }, false); // PERF: no await.?
        /*const cached = await cache_GetFrame(frameEnd);
        if (cached) {
            if (!cached.frame) cached.frame = data;
        }
        else await cache_SetFrame(frameEnd, { frame: data });*/
    }

    return { cached: false, frame: data as ITimeFrame };
}
