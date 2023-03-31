import { db_events } from "$lib/server/deta";

import type { PageServerLoad } from "./$types";

export const load = (async ({ params }) => {
    const { eventKey } = params;

    //depends("app:projectID");
    const event = await db_events.get(eventKey);

    // TODO: Compole description & emoji color?

    return {
        eventKey,
        event
    };
}) satisfies PageServerLoad;
