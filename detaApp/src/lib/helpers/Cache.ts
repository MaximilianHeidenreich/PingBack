import { s_sysContentHash } from "$lib/stores/s_sysContentHash";
import { MD5 } from "$lib/utils/hash";
import { get } from "svelte/store";
import type { IEvent } from "../types/IEvent";
//import PouchDB from "pouchdb";   // -> fucks with sveltekit :/ we import it straight in html head...

export interface ICachedTimeFrame {
    _id: string; // ID is frame end
    events: IEvent[];
    nextFrame: number;
    previousFrame: number;
}

/*const caches: Map<string, PouchDB.Database<ICachedEventFrame>> = new Map();
export function getCache(projectID: string) {
    const key = `eventFrameCache_${projectID}`;
    if (!caches.has(key)) {
        caches.set(key, new PouchDB<ICachedEventFrame>(key));
    }
    return caches.get(key)!;
}*/
const cache = new PouchDB<ICachedTimeFrame>(`${get(s_sysContentHash)}_eventFrameCache`);

export function cacheSetTimeFrame(
    frameEnd: number,
    nextFrame: number,
    previousFrame: number,
    events: IEvent[],
) {
    cache.put({
        _id: frameEnd.toString(),
        events,
        nextFrame,
        previousFrame
    })
    /*const queryHash = MD5(JSON.stringify(query));
    const key = `${frameEnd}_${queryHash}`;
    return getCache(projectID).put({
        _id: key,
        events,
        more
    });*/
}
export async function cacheGetTimeFrame(
    frameEnd: number
) {
    try {
        return cache.get(frameEnd.toString());
    }
    catch (e) {
        return null;
    }
    /*const queryHash = MD5(JSON.stringify(query));
    const key = `${frameEnd}_${queryHash}`;
    try {
        return await getCache(projectID).get(key);
    } catch {
        return null;
    }*/
}
export function cacheInvalidateProject() { // TODO: Fix _> Invalidate on store update
    return cache.destroy();
}
