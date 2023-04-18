import { browser } from "$app/environment";
import { NotFound } from "$lib/errors/core";
import type { IEvent } from "$lib/types/IEvent";
import { TIME_FRAME_OFFSET_UNIT } from "$lib/types/ITimeFrame";
import { VERSION } from "$lib/utils/version";
import dayjs from "dayjs";
import { generatePalette } from "emoji-palette";
import { cache_GetFrame, cache_SetFrame } from "./cache";

/**
 * Extracts the main color from an emoji.
 * @param icon The unicode icon / icon code (:pizza:)
 * @returns The main color of the icon at 12% opacity.
 */
export function client_GetEventIconColor(icon: string): string {
    if (!browser) return "#ffffff";
    const iconPalette = generatePalette(icon);
    return `${iconPalette[0]}22`;
}

/**
 * Deletes an event. There is no feedback if the event was actually deleted or not.
 * @param eventKey
 * @throws NotFound When the event does not exist. // TODO: Does it rly? just listen to 500?
 */
export async function client_DeleteEvent(eventKey: string): Promise<void> {
    const url = new URL(`/api/v${VERSION.major}/events/${eventKey}`, window.location.origin);
    const res = await fetch(url, {
        method: "DELETE",
        headers: {
            "Accept": "application/json"
        }
    });
    if (!res.ok) {
        if (res.status === 404) throw new NotFound(res.statusText);
        throw res;  // TODO Handle.
    }
}

/**
 * Queries events based on args.
 * NOTE: Does not use cache.
 *
 * @param query
 * @param limit
 * @param lastKey
 * @returns
 * @throws Error When query is invalid / db request failed on server.
 */
export async function client_QueryEvents(
    query: (Partial<IEvent> & { [key: string]: unknown }) | (Partial<IEvent> & { [key: string]: unknown })[],
    limit?: number,
    lastKey?: string
): Promise<{ items: IEvent[], count: number, last?: string }> {
    const url = new URL(`/api/v${VERSION.major}/events`, window.location.origin);
    url.searchParams.set("query", btoa(JSON.stringify(query))); // NOTE: btoa is not deprecated in browser!
    if (lastKey) url.searchParams.set("lastKey", lastKey);
    if (limit) url.searchParams.set("limit", limit.toString());

    const res = await fetch(url, {
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    });
    if (!res.ok) {
        if (res.status === 400) throw new Error(res.statusText);
        if (res.status === 500) throw new Error(res.statusText);
        throw res;  // TODO Handle.
    }
    return await res.json();
}

/**
 * Same as client_QueryEvents but does not return until all events are fetched.
 * NOTE: Does not use cache.
 *
 * @param query
 * @param limit
 * @param lastKey
 * @throws Error When query is invalid / db request failed on server.
 */
export async function client_QueryEventsAll(
    query: (Partial<IEvent> & { [key: string]: unknown }) | (Partial<IEvent> & { [key: string]: unknown })[],
    limit?: number
): Promise<{ items: IEvent[], count: number }> {
    let lastKey: string | undefined;
    let events: IEvent[];

    // Initial fetch
    let res = await client_QueryEvents(query, limit);
    events = res.items;
    lastKey = res.last;
    if (limit && events.length >= limit) return { items: events, count: events.length };    // Should always match arg length, no need to trim.

    // Subsequent fetches until no more events.
    while (lastKey) {
        res = await client_QueryEvents(query, limit, lastKey); // TODO: Find out what this shit was in old codebase -> astKey === "" ? undefined : lastKey
        events.push(...res.items);
        lastKey = res.last;
    }
    return { items: events, count: events.length };
}

// client_QueryEventsInFrame

/**
 * Queries all events inside the given timeFrame.
 * NOTE: Uses cache.
 *
 * @param frameEnd
 * @param query
 * @param useCache
 * @returns
 */
export async function client_QueryEventsInFrameAll(
    frameEnd: number,
    query: (Partial<IEvent> & { [key: string]: unknown }) | (Partial<IEvent> & { [key: string]: unknown })[],
    useCache: boolean = true
): Promise<{ cached: boolean, items: IEvent[], count: number }> {
    console.debug(`[Events] Requested events for frame ${frameEnd} (${dayjs(frameEnd).format()}) (useCache: ${useCache})`);
    frameEnd = dayjs(frameEnd).endOf(TIME_FRAME_OFFSET_UNIT).valueOf();

    if (useCache && Object.keys(query).length === 0 ) { // TODO !: Remove query disable
        // NOTE: A non-empty cached value indicates the cached frame contains ALL events from itself.
        // We can safely query / return this data.
        const cached = await cache_GetFrame(frameEnd);
        let events: IEvent[];
        if (cached && cached.events !== null) {
            console.debug(`[Events] Cache HIT for frame ${frameEnd} (${dayjs(frameEnd).format()})`);
            events = Object.keys(cached.events).map(k => cached.events![k]).flat();
            if (Object.keys(query).length !== 0) {
                // TODO: APPLY PERFORM QUERY
            }
            return { cached: true, items: events, count: events.length } // Cached
        }
    }

    if (useCache) console.debug(`[Events] Cache MISS for frame ${frameEnd} (${dayjs(frameEnd).format()})`);

    let res;
    try {
        res = await client_QueryEventsAll({ // FIX: Type check if arrray add multiple
            ...query,
            "createdAt?r": [
                dayjs(frameEnd).startOf(TIME_FRAME_OFFSET_UNIT).valueOf(),
                dayjs(frameEnd).endOf(TIME_FRAME_OFFSET_UNIT).valueOf()
            ]
        });
    } catch (e) { throw e }

    // NOTE: We only set the cache if it does not exist & no query is given.
    // This ensures that we don't miss events which are not included by the query.
    if (useCache && Object.keys(query).length === 0) {
        cache_SetFrame(frameEnd, { events: res.items }, false); // PERF: no await.?
        //const cached = await cache_GetFrame(frameEnd);
        /*if (cached) {
            if (!cached.events) cached.events = res.items
        }*/

        /*if (Object.keys(query).length !== 0) {
            await cache_SetFrame(frameEnd, {
                events: res.items
            }); // FIX: Do we need to await?
        }*/
    }

    return { cached: false, ...res };
}
