import { clientGetSysDoc } from "$lib/helpers/api/systemClient";
import { localStorable } from "./localStorable";

export const s_sysContentHash = localStorable<string>("rand", "pb_contentHash");

export async function updateCurrentSysContentHash() {
    const sysDoc = await clientGetSysDoc(fetch);
    if (!sysDoc) {
        alert("FATA: No sysDoc found!"); // TODO: Handle
    }
    s_sysContentHash.set(sysDoc.contentHash);
}