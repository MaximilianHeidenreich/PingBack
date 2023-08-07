import { sanitizeProjectIdInternal } from "$lib/utils/sanitizers";
import { z } from "zod";
import type { IChannel } from "./IChannel";

/**
 * Projects are used to group events and channels.
 */
export interface IProject {
    // META
    key: string; // Unique ID
    createdAt: number; // Unix timestamp
    contentHash: string; // "Hash" of project -> Change inavlidates client cahces

    // SYSTEM META -> read only OR know what you're doing!
    latestEventTimestamp: number; // Unix timestamp of latest event in project -> efficient query by starting at latest
    eventSpecifiers: Record<string, number>; // Map of event names to number of events of its kind -> user filter ux

    // PAYLOAD
    displayName: string; // Displayname of project
    channels: IChannel[];
}

export const ZProjectKey = z
    .string()
    .min(1)
    .max(50)
    .transform((s) => sanitizeProjectIdInternal(s));
export const ZProjectDisplayName = z.string().min(1).max(50);
export const ZProjectEventSpecifiers = z.record(z.string());
