import { fetchAllEvents } from "$lib/api/apiEvents";
import { getProject } from "$lib/api/apiProjects";
import { sanitizeProjectIdInternal } from "$lib/utils/sanitizers";

import type { PageLoad } from "./$types";

export const load = (async ({ params, fetch }) => {
    const projectId = sanitizeProjectIdInternal(params.projectID);
    // TODO: proomise.all
    const events = await fetchAllEvents({ project: params.projectID }, fetch);
    const project = await getProject(projectId);

    return {
        projectId,
        project,
        events
    };
}) satisfies PageLoad;
