import { db_apiKeys, db_projects } from "$lib/server/deta";
import type { PageServerLoad } from "./$types";

export const load = (async ({ depends }) => {
    depends("/app/settings");

    const [projectsRes, apiKeysRes] = await Promise.all([
        db_projects.fetch({}, {}),
        db_apiKeys.fetch({}, {})
    ]);

    return {
        projects: projectsRes.items,
        apiKeys: apiKeysRes.items
    };
}) satisfies PageServerLoad;