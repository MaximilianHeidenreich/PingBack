import { s_sysContentHash } from "$lib/stores/s_sysContentHash";
import type { IEvent } from "$lib/types/IEvent";
import type { ITimeFrame } from "$lib/types/ITimeFrame";
import { get } from "svelte/store";

export interface ICachedTimeFrame extends ITimeFrame {
    _id: string; // ID is frame end used by pouchdb
    cached: boolean;    // ALWAYS true for cached items
    events: Record<string, IEvent[]>, // Events split by project
}

const _createCache = () => new PouchDB<ICachedTimeFrame>(`${get(s_sysContentHash)}_eventFrameCache`);
let cache = _createCache();
s_sysContentHash.subscribe(async (hash) => {
    console.info(`[Cache] Detected new system content hash ${hash}, destroying old cache...`);
    await cache.destroy();
    console.info(`[Cache] Creating new cache...`);
    cache = _createCache();
});

export async function cache_GetFrame(frameEnd: number): Promise<ICachedTimeFrame | null> {
    try { return await cache.get(frameEnd.toString()); }
    catch (e) { return null; }
}

export async function cache_SetFrame(
    frame: ITimeFrame,
    events: IEvent[],
) {
    //const projects = new Set<string>();
    //const channels = new Set<string>();
    const eventMap = new Map<string, IEvent[]>();
    events.forEach(e => {
        //projects.add(e.project);
        //channels.add(`${e.project}#${e.channel}`);
        if (!eventMap.has(e.project)) {
            eventMap.set(e.project, []);
        }
        eventMap.get(e.project)!.push(e);
    });
    const pendingCached = {
        _id: frame.frameEnd.toString(),
        cached: true,
        events: Object.fromEntries(eventMap),
        ...frame
    };
    await cache.put(pendingCached); // TODO: do we rly need to await?
}
