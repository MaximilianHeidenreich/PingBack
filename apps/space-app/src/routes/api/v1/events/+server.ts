import { DetaBaseError, Invalid, InvalidSystemState, InvalidZod, NotFound } from "$lib/errors/core";
import { validateApiKey } from "$lib/server/apiKey";
import { db_events } from "$lib/server/deta";
import { server_createEvent } from "$lib/server/event";
import { sendPushNotificationToAllClients } from "$lib/server/pushNotifications";
import { buildResponse, respondBadRequest, respondInternalError, respondNotFound } from "$lib/server/responseHelper";
import type { RequestHandler } from "./$types";

export const GET = (async ({ url }) => {
    const queryRaw = url.searchParams.get("query") || undefined;
    const limit = url.searchParams.get("limit") || undefined;
    const last = url.searchParams.get("lastKey") || undefined;

    // Unpack query
    let query: Record<string, unknown> | Record<string, unknown>[] | undefined;
    if (queryRaw) {
        try {
            query = JSON.parse(Buffer.from(queryRaw, "base64").toString());
        } catch (err) {
            console.error(err);
            return respondBadRequest(`Invalid query: ${queryRaw}`);
        }
    }

    const queryOptions: { [key: string]: unknown } = {};
    if (limit) queryOptions["limit"] = Number(limit);
    if (last) queryOptions["last"] = last;

    let result;
    try {
        result = await db_events.fetch(query || {}, queryOptions);
    } catch (err) {
        console.error(err);
        return respondInternalError("Failed to fetch events from database!");
    }

    return buildResponse().status(200).statusText("OK").json(result).build();
}) satisfies RequestHandler;

export const POST = (async ({ request }) => {
    const reqBody = await request.json();

    // TODO: Validate API KEY
    const validationRes = await validateApiKey(request, reqBody.project || "");
    if (!validationRes.valid) {
        return validationRes.response;
    }

    let newEvent;
    try {
        newEvent = await server_createEvent(reqBody);
    }
    catch (e) {
        console.error(e);
        if (e instanceof NotFound) return respondNotFound(e.message);
        else if (e instanceof InvalidZod) return respondBadRequest(e.zodError);
        else if (e instanceof Invalid) return respondBadRequest(e.message);
        else if (e instanceof InvalidSystemState) return respondInternalError(e.message);
        else if (e instanceof DetaBaseError) return respondInternalError(e.message);

        console.error(e);
        return respondInternalError("Internal error");
    }

    sendPushNotificationToAllClients({
        title: `${newEvent.icon} ${newEvent.title}`,
        body: newEvent.parser === "text" ? newEvent.description as string : "(Tap to view description).",
        timestamp: newEvent.createdAt,
        //icon: "https://icons-for-free.com/download-icon-coloured+128px+Media+Coloured+128px+whatsapp-1320568367672628520_256.png"
    });

    return buildResponse().status(200).statusText("OK").json(newEvent).build();
}) satisfies RequestHandler;
