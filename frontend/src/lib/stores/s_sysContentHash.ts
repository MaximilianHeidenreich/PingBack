import { clientGetSysDoc } from "$lib/helpers/api/systemClient";
import { get } from "svelte/store";
import { storedWritable } from "./storedWritable";

export const s_sysContentHash = storedWritable<string>("pb_contentHash", "initial");

// TODO: IMPL
export async function fetchSysContentHash() {
    const sysDoc = await clientGetSysDoc(fetch);
    if (!sysDoc) {
        alert("FATA: No sysDoc found!"); // TODO: Handle
    }
    if (sysDoc.contentHash !== get(s_sysContentHash))
        s_sysContentHash.set(sysDoc.contentHash);
}
