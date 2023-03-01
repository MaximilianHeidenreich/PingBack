import { browser } from "$app/environment";
import { storeActiveDialog } from "$lib/stores/storeActiveDialog";
import type { SvelteComponent } from "svelte";
import toast from "svelte-french-toast";
import toastOptions from "./toast";

export function openDialog(dialog: SvelteComponent) {
    storeActiveDialog.set(dialog);
}

export async function copyToClipboard(text: string) {
    if (!browser) return;
    //const data = [new ClipboardItem({ "text/plain": new Blob([text], { type: "text/plain" }) })];
    try {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard!", toastOptions());
    }
    catch (err) {
        toast.error("Unable to copy to clipboard.", toastOptions());
    }
}
