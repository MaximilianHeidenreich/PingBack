import type { TFetcher } from "$lib/types/fetcher";
import type { IEvent } from "$lib/types/IEvent";
import { VERSION } from "$lib/utils/version";
import dayjs from "dayjs";

/**
 * Raw fetch of events based on query, lastKey, and limit.
 * @param fetcher SvelteKit fetch or default fetch.
 * @param query
 * @param lastKey
 * @param limit
 * @returns
 * @throws Fetch error.
 */
export async function clientFetchProjectEventsRaw(
    fetcher: TFetcher,
    projectId: string,
    query:
        | (Partial<IEvent> & { [key: string]: unknown })
        | (Partial<IEvent> & { [key: string]: unknown })[],
    lastKey?: string,
    limit?: number
): Promise<{ items: IEvent[], count: number, last?: string }> {
    // @ts-ignore -> TODO: better typing
    query["project"] = projectId;

    const url = new URL(`/api/v${VERSION.major}/events`, window.location.origin);
    url.searchParams.set("query", btoa(JSON.stringify(query)));
    if (lastKey) url.searchParams.set("lastKey", lastKey);
    if (limit) url.searchParams.set("limit", limit.toString());

    const res = await fetcher(url, { method: "GET" });
    if (!res.ok) throw res;
    const data = await res.json();
    return data;
}

// TODO: Remvoe
export async function* clientFetchProjectEventsChronological(
    fetcher: TFetcher,
    projectId: string,
    beginEventTimestamp: number,
    projectLargestEventTimestampRange: number,
    query:
        | (Partial<IEvent> & { [key: string]: unknown })
        | (Partial<IEvent> & { [key: string]: unknown })[],
    limit?: number
) {
    let lastKey: string | undefined = undefined;

    query = {
        ...query,
        "createdAt?r": [dayjs(beginEventTimestamp).add(10, "seconds")]
    };

    const fetchEvents = (
        query:
            | (Partial<IEvent> & { [key: string]: unknown })
            | (Partial<IEvent> & { [key: string]: unknown })[],
        lastKey: string | undefined,
        limit?: number
    ) => {
        return clientFetchProjectEventsRaw(fetcher, projectId, query, lastKey, limit);
    };

    yield await fetchEvents(query, lastKey, limit);
}