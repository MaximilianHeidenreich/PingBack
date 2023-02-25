import { storeActiveDialog } from "$lib/stores/storeActiveDialog";
import type { SvelteComponent } from "svelte";

export function openDialog(dialog: SvelteComponent) {
    storeActiveDialog.set(dialog);
}