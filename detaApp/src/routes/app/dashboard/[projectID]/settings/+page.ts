
import { sanitizeProjectIdInternal } from "$lib/utils/sanitizers";
import type { PageLoad } from "./$types";

export const load = (async ({ params }) => {   
    return {
        projectId: sanitizeProjectIdInternal(params.projectID),
    };
}) satisfies PageLoad;