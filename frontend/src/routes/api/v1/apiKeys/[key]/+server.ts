import { db_apiKeys } from "$lib/server/deta";
import { buildResponse, respondInternalError, respondNotFound } from "$lib/server/responseHelper";
import type { RequestHandler } from "./$types";

export const DELETE = (async ({ params }) => {
    const { key } = params;

    // TODO: Check auth?

    try {
        await db_apiKeys.delete(key);
    }
    catch (e) {
        //if (e instanceof NotFound) return respondNotFound(e.message);
        //else if (e instanceof DetaBaseError) return respondInternalError(e.message);

        console.error(e);
        return respondInternalError("Internal error");
    }

    return buildResponse().status(200).statusText("OK").json({}).build();
}) satisfies RequestHandler;
