import { fetchAllEvents } from "$lib/api/apiEvents";
import type { IEvent } from "$lib/types/IEvent";
import { sanitizeProjectIdInternal } from "$lib/utils/sanitizers";
import toastOptions from "$lib/utils/toast";
import toast from "svelte-french-toast";
import { writable } from "svelte/store";

export type TStoreEvents = Record<string, Record<string, IEvent[]>>; // <projectName, <channelName, IEvent>>

export const storeEvents = writable<TStoreEvents>({});
export const storeEventsLoading = writable<boolean>(false);

export interface IFetchEventArgs {
	channelFilter?: string;
	timeFilter?: [number, number];
}
export async function store_fetchEvents(
	projectId: string,
	filters?: IFetchEventArgs,
	reset: boolean = false
) {
	projectId = sanitizeProjectIdInternal(projectId);
	storeEventsLoading.set(true);
	try {
		let query: any = { project: projectId };
		if (filters?.channelFilter) query["channel"] = filters.channelFilter;
		if (filters?.timeFilter) query["createdAt?r"] = [filters.timeFilter[0], filters.timeFilter[1]];

		const events = await fetchAllEvents(query);

		storeEvents.update((value) => {
			if (reset) value[projectId] = {};
			if (!value[projectId]) value[projectId] = {};
			events.forEach((event) => {
				if (!value[projectId][event.channel]) value[projectId][event.channel] = [];
				value[projectId][event.channel].push(event);
			});
			Object.keys(value[projectId]).forEach((channel) => {
				value[projectId][channel].sort((a, b) => a.createdAt - b.createdAt);
			});
			return value;
		});
		storeEventsLoading.set(false);
	} catch (err) {
		console.error(err);
		toast.error("Failed to fetch events!", toastOptions());
	}
}
