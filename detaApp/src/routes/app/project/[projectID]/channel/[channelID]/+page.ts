import { sanitizeChannelID } from "$lib/utils/sanitizers";

import type { PageLoad } from "./$types";

export const load = (async ({ params }) => {
    const { channelID } = params;

    //depends("app:projectID");

    return {
        channelID: sanitizeChannelID(channelID)
    };
}) satisfies PageLoad;
