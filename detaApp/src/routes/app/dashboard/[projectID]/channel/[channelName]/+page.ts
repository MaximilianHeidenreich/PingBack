import { fetchAllEvents } from "$lib/api/apiEvents";
import { sanitizeProjectIdInternal } from "$lib/utils/sanitizers";

import type { PageLoad } from "./$types";

export const load = (async ({ params, fetch }) => {
    const events = await fetchAllEvents(
        { project: params.projectID, channel: params.channelName },
        fetch
    );

    return {
        projectId: sanitizeProjectIdInternal(params.projectID),
        channelName: sanitizeProjectIdInternal(params.channelName),
        events
    };
}) satisfies PageLoad;
