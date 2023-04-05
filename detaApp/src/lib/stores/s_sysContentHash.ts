import { clientGetSysDoc } from "$lib/helpers/api/systemClient";
import { get } from "svelte/store";
import { localStorable } from "./localStorable";

export const s_sysContentHash = localStorable<string>("initial", "pb_contentHash");

// TODO: IMPL
export async function fetchSysContentHash() {
    const sysDoc = await clientGetSysDoc(fetch);
    if (!sysDoc) {
        alert("FATA: No sysDoc found!"); // TODO: Handle
    }
    if (sysDoc.contentHash !== get(s_sysContentHash))
        s_sysContentHash.set(sysDoc.contentHash);
}