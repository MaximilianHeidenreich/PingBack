import type { SvelteComponent } from "svelte";
import { writable } from "svelte/store";

export const storeActiveDialog = writable<SvelteComponentConstructor<any, any> | undefined>(undefined);