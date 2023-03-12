export interface IChannel {
    name: string; // Channel name, only lowercase letters, numbers and dashes and underscores
    notify: boolean; // Whether to notify clients when an event is created
}

export interface IProject {
    // META
    id: string;
    createdAt: number;

    // META - SYSTEM — Dont modify or shit will break ;)
    latestEventTimestamp: number;   // Stores the last timestamp at which an event was added -> Used for efficient query in frontend
    eventSpecifiers: Record<string, number>;    // Stores all different event specifiers and their count -> Used for efficient query & filtering in frontend


    // PAYLOAD
    name: string; // Project name, only lowercase letters, numbers and dashes and underscores
    channels: IChannel[];
}
