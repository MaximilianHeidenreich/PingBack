import type { IProject } from "$lib/types/IProject";
import { writable } from "svelte/store";

export const storeActiveProjectID = writable<string | undefined>(undefined);
export const storeActiveProject = writable<IProject | undefined>(undefined);
