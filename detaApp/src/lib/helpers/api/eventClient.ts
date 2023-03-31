import type { TFetcher } from "$lib/types/fetcher";
import type { IEvent } from "$lib/types/IEvent";
import { TIME_FRAME_OFFSET_SCALAR, TIME_FRAME_OFFSET_UNIT } from "$lib/types/ITimeFrame";
import { VERSION } from "$lib/utils/version";
import dayjs, { type ManipulateType } from "dayjs";

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

export async function clientFetchEventsRaw(
    fetcher: TFetcher,
    query:
        | (Partial<IEvent> & { [key: string]: unknown })
        | (Partial<IEvent> & { [key: string]: unknown })[],
    lastKey?: string,
    limit?: number
): Promise<{ items: IEvent[]; count: number; last?: string }> {
    const url = new URL(`/api/v${VERSION.major}/events`, window.location.origin);
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

export async function clientFetchAllEvents(
    fetcher: TFetcher,
    query:
        | (Partial<IEvent> & { [key: string]: unknown })
        | (Partial<IEvent> & { [key: string]: unknown })[]
): Promise<{ items: IEvent[], count: number }> {
    let lastKey: string | undefined;
    let events: IEvent[] = [];

    // Initial fetch.
    let res: any = await clientFetchEventsRaw(fetcher, query, undefined); // TODO: Fix any type
    events = events.concat(res.items);
    lastKey = res.last;

    while (lastKey) {
        let res: any = await clientFetchEventsRaw(fetcher, query, lastKey === "" ? undefined : lastKey); // TODO: Fix any type
        events = events.concat(res.items);
        lastKey = res.last;
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
export async function clientFetchAllEventsInFrame(
    fetcher: TFetcher,
    frameEnd: number,
    query:
        | (Partial<IEvent> & { [key: string]: unknown })
        | (Partial<IEvent> & { [key: string]: unknown })[],
    useCache: boolean = true
): Promise<{ items: IEvent[]; count: number }> { // TODO: remove [] OR -> Cannot query -> if necessary query after fetch
    frameEnd = dayjs(frameEnd).endOf(TIME_FRAME_OFFSET_UNIT).valueOf(); // Make sure we use the end of hour as frame end
    console.debug(
        `Requested event frame for ${frameEnd} (${dayjs(
            frameEnd
        ).format()}) (useCache: ${useCache})`
    );

    /*if (useCache) {
        const cacheHit = await cacheGetEventFrame(projectID, frameEnd, query);
        if (cacheHit) {
            console.debug(`Cache hit for event frame ${frameEnd} (${dayjs(frameEnd).format()})`);
            const { events, more } = cacheHit;
            return [{ items: events, count: events.length }, more];
        }
    }*/

    console.debug(`Cache miss! Fetching event frame for ${frameEnd} (${dayjs(frameEnd).format()})...`);

    const res = await clientFetchAllEvents(
        fetcher,
        {
            ...query,
            "createdAt?r": [
                dayjs(frameEnd).startOf(TIME_FRAME_OFFSET_UNIT).valueOf(),
                dayjs(frameEnd).endOf(TIME_FRAME_OFFSET_UNIT).valueOf()
            ]
        }
    );
    return res;
    /*const p_moreEvents = clientFetchEventsRaw(
        fetcher,
        {
            ...query,
            "createdAt?lt": dayjs(frameEnd)
                .endOf(TIME_FRAME_OFFSET_UNIT)
                .subtract(TIME_FRAME_OFFSET_SCALAR, TIME_FRAME_OFFSET_UNIT as ManipulateType)
                .endOf(TIME_FRAME_OFFSET_UNIT)
                .valueOf()
        },
        undefined,
        1
    ); // Try to fetch 1 previous event -> if none -> no more events
    let [fetchRes, moreEventsRes] = await Promise.all([p_fetchEvents, p_moreEvents]);*/   // TODO: Handle reject

    if (useCache) {
        //cacheSetEventFrame(projectID, frameEnd, fetchRes.items, query, moreEventsRes.count >= 1);
    }

    //return [fetchRes, moreEventsRes.count >= 1];
}

export async function clientDeleteEvent(
    fetcher: TFetcher,
    eventID: string
): Promise<void> {
    const url = new URL(`/api/v${VERSION.major}/events/${eventID}`, window.location.origin);

    const res = await fetcher(url, {
        method: "DELETE",
        headers: {
            "Accept": "application/json",
        }
    });
    if (!res.ok) throw res; // TODO: Err handling like rust
    const data = await res.json();
    return data;
}