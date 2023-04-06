/**
 * Channels are used to group events together.
 */
export interface IChannel {
    id: string; // Unique id
    notify: boolean; // Whether to notify clients of events in channel -> can be overridden by event
    latestEventTimestamp: number; // Unix timestamp of latest event in project -> efficient query by starting at latest TODO: IMPL
}
