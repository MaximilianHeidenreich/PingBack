/**
 * DB Doc which holds global system configuration & stats.
 */
export interface ISystemDoc {
    createdAt: number;
    updatedAt: number;

    contentHash: string; // "Hash"/randomv alue -> Change inavlidates client cache for all events.
    latestEventTimestamp: number;
    vistedWelcomePage: boolean;

    // STATS
    totalEvents: number;
}
export const DEFAULT_SYSTEM_DOC = (): ISystemDoc => {
    return {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        contentHash: crypto.randomUUID(),
        latestEventTimestamp: Date.now(),
        vistedWelcomePage: false,
        totalEvents: 0
    };
};
