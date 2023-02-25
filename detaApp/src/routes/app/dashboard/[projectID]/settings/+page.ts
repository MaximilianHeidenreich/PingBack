import { fetchAllApiKeys } from "$lib/api/apiApiKeys";
import { sanitizeProjectIdInternal } from "$lib/utils/sanitizers";

import type { PageLoad } from "./$types";

export const load = (async ({ params, depends }) => {
    depends("apiKeys");
    const projectId = sanitizeProjectIdInternal(params.projectID);
    const apiKeys = await fetchAllApiKeys({ project: projectId });

    return {
        projectId,
        apiKeys
    };
}) satisfies PageLoad;
