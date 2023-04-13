import { get } from "svelte/store";
import { storedWritable } from "./storedWritable";
import { client_GetSysDoc } from "$lib/client/sysdoc";

export const s_sysContentHash = storedWritable<string>("pb_contentHash", "initial");

// TODO: IMPL
export async function fetchSysContentHash() {
    const sysDoc = await client_GetSysDoc(); // TODO: ERROR
    if (!sysDoc) {
        alert("FATA: No sysDoc found!"); // TODO: Handle
    }
    if (sysDoc.contentHash !== get(s_sysContentHash))
        s_sysContentHash.set(sysDoc.contentHash);
}
