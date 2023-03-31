import type { IProject } from "$lib/types/IProject";
import { writable } from "svelte/store";

export const s_projectSidebarActiveProject = writable<IProject | null>(undefined);
