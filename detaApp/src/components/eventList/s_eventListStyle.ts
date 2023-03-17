import { writable } from "svelte/store";

export const s_eventListStyle = writable<"compact" | "card">("compact");