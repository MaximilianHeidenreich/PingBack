import { writable } from "svelte/store";

export type TStoreFeedStyle = "compact-list" | "card";
export const storeFeedStyle = writable<TStoreFeedStyle>("card");