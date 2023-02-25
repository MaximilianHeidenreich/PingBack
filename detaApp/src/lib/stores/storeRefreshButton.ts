import { writable } from "svelte/store";

export const storeRefreshButton = writable<boolean>(false);
export const storeRefreshing = writable<boolean>(false);

export function callRefresh() {
    storeRefreshButton.update((value) => !value);
    storeRefreshing.set(true);
}
