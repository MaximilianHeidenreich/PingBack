import { db_events } from "$lib/server/deta";

import type { PageServerLoad } from "./$types";

export const load = (async ({ params }) => {
    const { eventID } = params;

    //depends("app:projectID");
    const event = await db_events.get(eventID);

    // TODO: Compole description & emoji color?

    return {
        eventID,
        event
    };
}) satisfies PageServerLoad;
