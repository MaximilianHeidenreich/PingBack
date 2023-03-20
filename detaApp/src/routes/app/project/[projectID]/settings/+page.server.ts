import { db_apiKeys, db_projects } from "$lib/server/deta";
import type { PageServerLoad } from "../event/[eventID]/$types";

export const load = (async ({ params, depends }) => {
    depends("project:settings");
    const { projectID } = params;

    const p_apiKeys = db_apiKeys.fetch(
        {
            project: projectID
        },
        {}
    );
    const p_project = db_projects.get(projectID);

    const [apiKeysResult, project] = await Promise.all([p_apiKeys, p_project]);

    return {
        apiKeys: apiKeysResult.items,
        project
    };
}) satisfies PageServerLoad;
