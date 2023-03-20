import { browser } from "$app/environment";
import toast from "svelte-french-toast";
import toastOptions from "./toast";

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