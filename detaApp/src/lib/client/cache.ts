import { browser } from "$app/environment";
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
let cache: PouchDB.Database | null;
s_sysContentHash.subscribe(async (hash) => {
    if (!browser) return;
    console.info(`[Cache] Detected new system content hash ${hash}, destroying old cache...`);
    cache && await cache.destroy();
    console.info(`[Cache] Creating new cache...`);
    cache_GetCache();
});

export function cache_GetCache(): PouchDB.Database | null {
    if (!browser) return null;
    if (!cache) {
        cache = _createCache();
    }
    return cache;
}

export async function cache_Clear() {
    cache && await cache.destroy();
    cache_GetCache();
}

export async function cache_GetDbInfo(): Promise<PouchDB.Core.DatabaseInfo | null> {
    try {
        const dbInfo = await cache.info();
        return dbInfo;
    } catch (err) {
        console.log(err);
        return null;
    }
}

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
