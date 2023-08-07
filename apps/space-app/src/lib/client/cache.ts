/**
 * We cache a "ICachedTimeFrame" which contains the actual time frame
 * data and ALL events inside it. The ICachedTimeFrame is split into "2 steps".
 * The 'frame' and 'events' can both be set or null.
 * If one / both is null, it indicates that the source which set the cache only
 * had access to one piece of data at that time so subsequent code might still
 * have to fetch the other half.
 */

import { browser } from "$app/environment";
import { mapEventProjectsIntoRecord } from "$lib/shared/event";
import { s_sysContentHash } from "$lib/stores/s_sysContentHash";
import type { IEvent } from "@pingback/shared";
import type { ITimeFrame } from "$lib/types/ITimeFrame";
import { get } from "svelte/store";

export interface ICachedTimeFrame {
    _id: string; // ID is frame end used by pouchdb.
    _rev?: string; // Revision used by pouchdb.
    frame: ITimeFrame | null,   // Cached time frame or null if not yet set
    events: Record<string, IEvent[]> | null, // Events split by project or null if not yet set.
}

const _createCache = () => new PouchDB<ICachedTimeFrame>(`${get(s_sysContentHash)}_eventFrameCache`);
// const _createCache = () => new PouchDB<ICachedTimeFrame>(`DEV_eventFrameCache`);
let cache: PouchDB.Database | null;
s_sysContentHash.subscribe(async (hash) => {
    if (!browser) return;
    console.info(`[Cache] Detected new system content hash ${hash}, destroying old cache...`);
    //cache && await cache.close();
    cache && await cache.destroy();
    console.info(`[Cache] Creating new cache (${hash})...`);
    cache = _createCache();
});

export function cache_GetCache(): PouchDB.Database | null {
    if (!browser) return null;
    if (!cache) {
        cache = _createCache();
    }
    return cache;
}

export async function cache_Clear() {
    const rask = get(s_sysContentHash);
    s_sysContentHash.set("oof");
    s_sysContentHash.set(rask);
}

export async function cache_GetDbInfo(): Promise<PouchDB.Core.DatabaseInfo | null> {
    const c = cache_GetCache();
    if (!c) return null;
    try {
        const dbInfo = await c.info();
        return dbInfo;
    } catch (err) {
        console.log(err);
        return null;
    }
}

export async function cache_GetFrame(frameEnd: number): Promise<ICachedTimeFrame | null> {
    const c = cache_GetCache();
    if (!c) return null;
    try { return await c.get(frameEnd.toString()); }
    catch (e) { return null; }
}

export async function cache_SetFrame(
    frameEnd: number,
    data: { frame?: ITimeFrame, events?: IEvent[] },
    override: boolean = false
) {
    if (!data.frame && !data.events) {
        console.warn(`[Cache] Trying to SetFrame ${frameEnd} with no data!`);
        return;
    }
    const c = cache_GetCache();
    if (!c) return null;

    const cached = await cache_GetFrame(frameEnd);
    if (cached) {
        if (override) {
            if (data.frame) cached.frame = data.frame;
            if (data.events) cached.events = mapEventProjectsIntoRecord(data.events);
        }
        else {
            if (!cached.frame && data.frame) cached.frame = data.frame;
            if (!cached.events && data.events) cached.events = mapEventProjectsIntoRecord(data.events);
        }
        await c.put(cached);
        return;
    }
    else {  // Insert new
        const pendingCached: Partial<ICachedTimeFrame> = {
            _id: frameEnd.toString(),
        }
        if (data.frame) pendingCached.frame = data.frame;
        else pendingCached.frame = null;
        if (data.events) pendingCached.events = mapEventProjectsIntoRecord(data.events);
        else pendingCached.events = null;
        await c.put(pendingCached); // TODO: Do we really need to await?
    }
}
