import { db_apiKeys, db_projects } from "$lib/server/deta";
import type { IApiKey } from "$lib/types/IApiKey";
import type { IProject } from "$lib/types/IProject";
import type { PageServerLoad } from "./$types";

export const load = (async () => {

    let projects: IProject[] | null;
    try {
        projects = (await db_projects.fetch({}, {})).items; // TODO: Switch to fetchAll
    } catch (err) {
        console.error(err);
        projects = null;
    }

    let apiKeys: IApiKey[] | null;
    try {
        apiKeys = (await db_apiKeys.fetch({}, {})).items; // TODO: Switch to fetchAll
    } catch (err) {
        console.error(err);
        apiKeys = null;
    }

    return {
        projects,
        apiKeys
    };
}) satisfies PageServerLoad;