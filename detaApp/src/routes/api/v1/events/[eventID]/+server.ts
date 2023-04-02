import { DetaBaseError, NotFound } from "$lib/errors/core";
import { server_deleteEvent } from "$lib/server/event";
import { buildResponse, respondInternalError, respondNotFound } from "$lib/server/responseHelper";
import type { RequestHandler } from "./$types";

export const DELETE = (async ({ params }) => {
    const { eventID } = params;

    // TODO: Check auth?

    try {
        await server_deleteEvent(eventID);
    }
    catch (e) {
        if (e instanceof NotFound) return respondNotFound(e.message);
        else if (e instanceof DetaBaseError) return respondInternalError(e.message);

        console.error(e);
        return respondInternalError("Internal error");
    }

    return buildResponse().status(200).statusText("OK").json({}).build();
}) satisfies RequestHandler;
