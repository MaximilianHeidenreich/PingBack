import { VERSION } from "$lib/utils/version";
import { generateVAPIDKeys } from "web-push";

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
    publicVapidKey: string; // Key generated on first run, used for push notifications.
    privateVapidKey: string; // Key generated on first run, used for push notifications.

    // STATS
    totalEvents: number;
}
export const DEFAULT_SYSTEM_DOC = (): ISystemDoc => {
    const vapidKeys = generateVAPIDKeys();
    vapidKeys.publicKey
    
    return {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        contentHash: crypto.randomUUID(),
        latestEventTimestamp: -1,
        finishedWelcomeTour: false,
        latestAppVersion: VERSION.semver!.version,
        publicVapidKey: vapidKeys.publicKey,
        privateVapidKey: vapidKeys.privateKey,
        totalEvents: 0
    };
};
