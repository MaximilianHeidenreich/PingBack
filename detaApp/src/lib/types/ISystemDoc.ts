/**
 * DB Doc which holds global system configuration & stats.
 */
export interface ISystemDoc {
    createdAt: number;
    updatedAt: number;

    // STATS
    totalEvents: number;
}
export const DEFAULT_SYSTEM_DOC = () => {
    return {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        totalEvents: 0
    } as ISystemDoc;;
};
