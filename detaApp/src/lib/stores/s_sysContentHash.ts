import { clientGetSysDoc } from "$lib/helpers/api/systemClient";
import { writable } from "svelte/store";

export const s_sysContentHash = writable<string>("rand");

export async function updateCurrentSysContentHash() {
    const sysDoc = await clientGetSysDoc(fetch);
    if (!sysDoc) {
        alert("FATA: No sysDoc found!"); // TODO: Handle
    }
    s_sysContentHash.set(sysDoc.contentHash);
}