import type { TFetcher } from "$lib/types/fetcher";
import type { IEvent } from "$lib/types/IEvent";
import { VERSION } from "$lib/utils/version";
import dayjs from "dayjs";
import { cacheGetEventFrame, cacheSetEventFrame } from "../cache";

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
    projectID: string,
    query:
        | (Partial<IEvent> & { [key: string]: unknown })
        | (Partial<IEvent> & { [key: string]: unknown })[],
    lastKey?: string,
    limit?: number
): Promise<{ items: IEvent[]; count: number; last?: string }> {
    // @ts-ignore -> TODO: better typing
    query["project"] = projectID;

    const url = new URL(`/api/v${VERSION.major}/events`, window.location.origin);
    url.searchParams.set("query", btoa(JSON.stringify(query)));
    if (lastKey) url.searchParams.set("lastKey", lastKey);
    if (limit) url.searchParams.set("limit", limit.toString());

    const res = await fetcher(url, { method: "GET" });
    if (!res.ok) throw res;
    const data = await res.json();
    return data;
}

export async function clientFetchProjectEventsRawAll(
    fetcher: TFetcher,
    projectID: string,
    query:
        | (Partial<IEvent> & { [key: string]: unknown })
        | (Partial<IEvent> & { [key: string]: unknown })[],
    lastKey?: string,
    limit?: number
): Promise<{ items: IEvent[]; count: number; last?: string }> {
    // @ts-ignore -> TODO: better typing
    query["project"] = projectID;

    let events: IEvent[] = [];
    let res = await clientFetchProjectEventsRaw(fetcher, projectID, query, lastKey, limit);
    events = events.concat(res.items);
    lastKey = res.last;
    if (lastKey) {
        res = await clientFetchProjectEventsRawAll(fetcher, projectID, query, lastKey);
        events = events.concat(res.items);
    }

    return { items: events, count: events.length };
}

/**
 * Fetches all events (up to 1MB at a time) inside the given timeframe.
 * @param fetcher
 * @param projectID
 * @param frameEnd
 * @param query
 * @param lastKey
 * @param limit
 * @returns [events fetch result, more events available in some previous frame]
 */
export async function clientFetchProjectEventFrame(
    fetcher: TFetcher,
    projectID: string,
    frameEnd: number,
    query:
        | (Partial<IEvent> & { [key: string]: unknown })
        | (Partial<IEvent> & { [key: string]: unknown })[],
    useCache: boolean = true,
    lastKey?: string,
    limit?: number
): Promise<[{ items: IEvent[]; count: number; last?: string }, boolean]> {
    frameEnd = dayjs(frameEnd).endOf("hour").valueOf(); // Make sure we use the end of hour as frame end
    console.debug(
        `Requested event frame from ${frameEnd} (${dayjs(
            frameEnd
        ).format()}) (useCache: ${useCache})`
    );

    if (useCache) {
        const cacheHit = await cacheGetEventFrame(projectID, frameEnd, query);
        if (cacheHit) {
            console.debug(`Cache hit for event frame ${frameEnd} (${dayjs(frameEnd).format()})`);
            const { events, more } = cacheHit;
            return [{ items: events, count: events.length }, more];
        }
    }

    console.debug(`Cache miss! Fetching event frame ${frameEnd} (${dayjs(frameEnd).format()})...`);
    // TODO: FETCH ALL TO CACHE them!
    const p_fetchEvents = clientFetchProjectEventsRawAll(
        fetcher,
        projectID,
        {
            ...query,
            "createdAt?r": [
                dayjs(frameEnd).startOf("hour").valueOf(),
                dayjs(frameEnd).endOf("hour").valueOf()
            ]
        },
        lastKey,
        limit
    );
    const p_moreEvents = clientFetchProjectEventsRaw(
        fetcher,
        projectID,
        {
            ...query,
            "createdAt?lt": dayjs(frameEnd)
                .startOf("hour")
                .subtract(1, "hour")
                .endOf("hour")
                .valueOf()
        },
        undefined,
        1
    ); // Try to fetch 1 previous event -> if none -> no more events
    let [fetchRes, moreEventsRes] = await Promise.all([p_fetchEvents, p_moreEvents]);

    if (useCache) {
        cacheSetEventFrame(projectID, frameEnd, fetchRes.items, query, moreEventsRes.count >= 1);
    }

    return [fetchRes, moreEventsRes.count >= 1];
}
