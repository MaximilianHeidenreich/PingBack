import type { IChannel } from "./IChannel";

/**
 * Projects are used to group events and channels.
 */
export interface IProject {
    // META
    key: string; // Unique ID
    createdAt: number; // Unix timestamp

    // SYSTEM META -> read only OR know what you're doing!
    firstEventTimestamp: number; // Unix timestamp of first event in project -> query know when to stop
    latestEventTimestamp: number; // Unix timestamp of latest event in project -> efficient query by starting at latest
    largestEventTimestampRange: number; // Largest difference between events in project -> efficient query by maximixing query range for less queries
    eventSpecifiers: Record<string, number>; // Map of event names to number of events of its kind -> user filter ux

    // PAYLOAD
    displayName: string; // Displayname of project
    channels: IChannel[];
}
