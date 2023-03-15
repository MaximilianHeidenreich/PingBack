/**
 * DB Doc which holds global system configuration & stats.
 */
export interface ISystemDoc {
    createdAt: number;
    updatedAt: number;

    // STATS
    totalEvents: number;
}