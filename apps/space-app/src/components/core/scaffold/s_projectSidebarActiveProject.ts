import type { IProject } from "@pingback/shared";
import { writable } from "svelte/store";

export const s_projectSidebarActiveProject = writable<IProject | null>(undefined);
