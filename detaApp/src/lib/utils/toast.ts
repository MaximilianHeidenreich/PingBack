import type { ToastOptions } from "svelte-french-toast";

export default function toastOptions(options?: Partial<ToastOptions>): ToastOptions {
    if (!options) options = {};
    const defaults: Partial<ToastOptions> = {
        position: "bottom-right",
        duration: 4000,
    }
    return {...options, ...defaults}
}