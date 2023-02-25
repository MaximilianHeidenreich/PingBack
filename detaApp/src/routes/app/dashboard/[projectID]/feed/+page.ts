import { fetchAllEvents } from "$lib/api/apiEvents";
import { sanitizeProjectIdInternal } from "$lib/utils/sanitizers";
import type { PageLoad } from "./$types";

export const load = (async ({ params, depends }) => {   
    const events = await fetchAllEvents({ project: params.projectID });

    return {
        projectId: sanitizeProjectIdInternal(params.projectID),
        events
    };
}) satisfies PageLoad;