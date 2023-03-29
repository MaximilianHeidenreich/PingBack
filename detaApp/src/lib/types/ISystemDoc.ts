import { VERSION } from "$lib/utils/version";

/**
 * DB Doc which holds global system configuration & stats.
 */
export interface ISystemDoc {
    createdAt: number;
    updatedAt: number;

    contentHash: string; // "Hash"/randomv alue -> Change inavlidates client cache for all events.
    latestEventTimestamp: number;
    finishedWelcomeTour: boolean;
    latestAppVersion: string; // Store latest version at root layout run of app. -> Handle updates.

    // STATS
    totalEvents: number;
}
export const DEFAULT_SYSTEM_DOC = (): ISystemDoc => {
    return {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        contentHash: crypto.randomUUID(),
        latestEventTimestamp: Date.now(),
        finishedWelcomeTour: false,
        latestAppVersion: VERSION.semver!.version,
        totalEvents: 0
    };
};
