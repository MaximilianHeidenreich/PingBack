import type { IEvent } from "../types/IEvent";
import { MD5 } from "$lib/utils/hash";
//import PouchDB from "pouchdb";    -> fucks with sveltekit :/ we import it straight in html head...

export interface ICachedEventFrame {
    _id: string;    // ID is frame end
    events: IEvent[];
    more: boolean;  // Whether there are previous event frames available
}

const caches: Map<string, PouchDB.Database<ICachedEventFrame>> = new Map();
export function getCache(projectID: string) {
    const key = `eventFrameCache_${projectID}`;
    if (!caches.has(key)) {
        caches.set(key, new PouchDB<ICachedEventFrame>(key));
    }
    return caches.get(key)!;
}

export function cacheSetEventFrame(projectID: string, frameEnd: number, events: IEvent[], query: Record<string, any> | Record<string, any>[], more: boolean) {
    const queryHash = MD5(JSON.stringify(query));
    const key = `${frameEnd}_${queryHash}`;
    return getCache(projectID).put({
        _id: key,
        events,
        more
    });
}
export async function cacheGetEventFrame(projectID: string, frameEnd: number, query: Record<string, any>) {
    const queryHash = MD5(JSON.stringify(query));
    const key = `${frameEnd}_${queryHash}`;
    try {
        return await getCache(projectID).get(key);
    }
    catch {
        return null;
    }
}