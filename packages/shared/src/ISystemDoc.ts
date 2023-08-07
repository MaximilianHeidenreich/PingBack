//import { VERSION } from "$lib/utils/version";
import webPush from "web-push";

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
export const DEFAULT_SYSTEM_DOC = (version: any): ISystemDoc => { // todo!!!: Fix version type.
    const vapidKeys = webPush.generateVAPIDKeys();

    return {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        contentHash: crypto.randomUUID(),
        latestEventTimestamp: -1,
        finishedWelcomeTour: false,
        latestAppVersion: version.semver!.version,
        publicVapidKey: vapidKeys.publicKey,
        privateVapidKey: vapidKeys.privateKey,
        totalEvents: 0
    };
};
