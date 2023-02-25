import { sanitizeProjectIdInternal } from "$lib/utils/sanitizers";
import type { PageLoad } from "./$types";

export const load = (({ params, depends }) => {   
    depends("app:projectID"); 
    return {
        projectId: sanitizeProjectIdInternal(params.projectID)
    };
}) satisfies PageLoad;