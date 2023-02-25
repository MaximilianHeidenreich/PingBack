import { writable } from "svelte/store";

export type TStoreFeedStyle = "compact-list" | "card";
export const storeFeedStyle = writable<TStoreFeedStyle>("compact-list");

// TODO: store & load from localStorage
