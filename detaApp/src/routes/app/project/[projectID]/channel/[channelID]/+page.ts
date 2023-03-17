import { sanitizeChannelName } from "$lib/utils/sanitizers";

import type { PageLoad } from "./$types";

export const load = (async ({ params }) => {
    const { channelID } = params;

    //depends("app:projectID");

    return {
        channelID: sanitizeChannelName(channelID),
    };
}) satisfies PageLoad;
