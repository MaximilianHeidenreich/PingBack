import { fetchAllEvents, fetchEvent } from "$lib/api/apiEvents";
import type { IEvent } from "$lib/types/IEvent";
import { sanitizeProjectIdInternal } from "$lib/utils/sanitizers";
import { marked } from "marked";
import type { PageLoad } from "./$types";

export const load = (async ({ params, fetch }) => {   
    const event: IEvent | null = await fetchEvent(params.eventID, fetch);
    
    let compiledDescription;
    if (event?.parser === "markdown") {
        // TODO!!!: Sanitizes this shit, otherwise people can inject code into your backend when u expose an endpoint.
        compiledDescription = marked.parse(event.description, {});
    }

    return {
        projectId: sanitizeProjectIdInternal(params.projectID),
        eventId: params.eventID,
        event,
        compiledDescription
    };
}) satisfies PageLoad;