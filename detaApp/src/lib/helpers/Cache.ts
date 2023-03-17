import type { IEvent } from "../types/IEvent";

export interface ICachedEventBucket {
    project: string;
    bucketTimestampEnd: number;
    events: IEvent[];
}

export interface IEventBucketCache {

}
// TODO: finish dis

const cache = new Map<string, Map<number, IEvent[]>>();
export function isBucketCached(project: string, bucketTimestampEnd: number): boolean {
    if (!cache.has(project)) return false;
    return cache.get(project)!.has(bucketTimestampEnd);
}

export function getBucket(project: string, bucketTimestampEnd: number): IEvent[] | undefined {
    return cache.get(project)?.get(bucketTimestampEnd);
}

export function setBucket(project: string, bucketTimestampEnd: number, events: IEvent[]): void {
    if (!cache.has(project)) cache.set(project, new Map());
    cache.get(project)!.set(bucketTimestampEnd, events);
}