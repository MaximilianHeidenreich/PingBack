import { clientFetchProjectsRaw } from "$lib/helpers/api/projectsClient";
import type { IProject } from "@pingback/shared";
import { writable } from "svelte/store";

export const s_appSidebarProjects = writable<IProject[] | []>([]);
export const s_appSidebarProjectsLoading = writable(false);

export async function s_appSidebarFetchAllProjects() {
    s_appSidebarProjectsLoading.set(true);
    const res = await clientFetchProjectsRaw(fetch, {}, undefined, undefined);
    s_appSidebarProjects.set(res.items);
    s_appSidebarProjectsLoading.set(false);
}
