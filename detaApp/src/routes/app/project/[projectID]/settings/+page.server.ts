import { db_apiKeys } from "$lib/server/deta";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params }) => {
    const { projectID } = params;

    //depends("app:projectID");
    const apiKeys = (await db_apiKeys.fetch({
        project: projectID
    }, {})).items;

    return {
        apiKeys
    };
}) satisfies PageServerLoad;
