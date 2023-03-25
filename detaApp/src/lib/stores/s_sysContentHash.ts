import { writable } from "svelte/store";

export const s_sysContentHash = writable<string>("rand");

function fetchCurrentSysContentHash() {
    // TODO: Fetch
    // TODO: s_sysContentHash.set("rand");
}