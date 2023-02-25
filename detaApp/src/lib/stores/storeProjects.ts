import { fetchAllProjects } from "$lib/api/apiProjects";
import type { IProject } from "$lib/types/IProject";
import toastOptions from "$lib/utils/toast";
import toast from "svelte-french-toast";
import { get, writable } from "svelte/store";
import { storeActiveProject } from "./storeActiveProject";

export const storeProjectLoading = writable<boolean>(false);
export const storeProjects = writable<IProject[]>([]);
storeProjects.subscribe((projects) => {
	if (projects.filter((p) => p.id === get(storeActiveProject)?.id).length <= 0) {
		storeActiveProject.set(undefined);
	} else {
		const newProjectVersion = projects.find((p) => p.id === get(storeActiveProject)?.id);
		storeActiveProject.set(newProjectVersion);
	}
});

export async function store_fetchAllProjects() {
	storeProjectLoading.set(true);
	try {
		let projects = await fetchAllProjects();

		storeProjects.set(projects);
		storeProjectLoading.set(false);
	} catch (err) {
		console.error(err);
		toast.error("Failed to fetch projects!", toastOptions());
	}
}

// TODO: impl fetch one and splice into storeProjects
export async function store_fetchSingleProject() {}
