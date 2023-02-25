export interface IChannel {
	name: string; // Channel name, only lowercase letters, numbers and dashes and underscores
	notify: boolean; // Whether to notify clients when an event is created
}

export interface IProject {
	// META
	id: string;
	createdAt: number;
	latestEventTimestamp: number;

	// PAYLOAD
	name: string; // Project name, only lowercase letters, numbers and dashes and underscores
	channels: IChannel[];
}
