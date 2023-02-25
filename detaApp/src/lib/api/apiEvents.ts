import type { IEvent } from "$lib/types/IEvent";


export async function singleFetchEvents(query?: unknown, limit?: number, lastKey?: string): Promise<{ ok: boolean, data?: { count: number, last?: string, items: IEvent[] }, error?: unknown }> {
    /*const url = new URL("/api/events", "http://foo");
    if (limit) url.searchParams.append("limit", limit.toString());
    if (lastKey) url.searchParams.append("last", lastKey.toString());
    if (query) url.searchParams.append("query", btoa(JSON.stringify(query)));*/
    if (!limit) limit = 20;
    let uri = `/api/events?limit=${limit}`
    if (lastKey) uri += `&last=${lastKey}`;
    if (query) uri += `&query=${btoa(JSON.stringify(query))}`;

    const response = await fetch(uri, {
        method: "GET",
        headers: {
            "Accept": "application/json",
        }
    });
    const body = await response.json();
    return body;
}

/**
 * Generator to fetch events.
 * @param limit Max number of events to fetch at once
 */
export async function *fetchEvents(limit: number = 20, query: unknown, useFetch?: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>) {
    let last = undefined;
    const request = async (lastKey: string | undefined, query: unknown | undefined): Promise<{ count: number, last: string | undefined, items: IEvent[] }> => {
        if (!useFetch) useFetch = fetch;
        // TODO: Use built-in URL class
        let uri = `/api/events?limit=${limit}`
        if (lastKey) uri += `&last=${lastKey}`;
        if (query) uri += `&query=${btoa(JSON.stringify(query))}`;
        
        const response = await useFetch(uri, {
            method: "GET"
        });
        const json = await response.json();
        
        last = json.data.last;
        return json.data;
    }

    yield await request(last, query);
    while (last) {
        yield await request(last, query);
    }
}
export async function fetchAllEvents(query?: unknown, useFetch?: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>) {
    const events: IEvent[] = [];
    for await (const res of fetchEvents(100, query, useFetch)) {
        events.push(...res.items);
    }
    return events;
     // TODO: REMOVE timeout dev only!
    const p = new Promise<IEvent[]>((resolve, reject) => {
        setTimeout(() => {
            resolve(events);
        }, 1000)
    })
    return p;
}

export async function fetchEvent(eventId: string, useFetch?: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>) {
    if (!useFetch) useFetch = fetch;
    const response = await useFetch(`/api/events/${eventId}`, {
        method: "GET"
    });
    const json = await response.json();
    return json.data;
}