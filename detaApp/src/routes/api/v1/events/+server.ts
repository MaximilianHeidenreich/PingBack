import { DetaBaseError, Invalid, InvalidZod, NotFound } from "$lib/errors/core";
import { db_events } from "$lib/server/deta";
import { server_createEvent } from "$lib/server/event";
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
            return respondBadRequest("Invalid query!");
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
    //Todo impl.

    let newEvent;
    try {
        newEvent = await server_createEvent(reqBody);
    }
    catch (e) {
        if (e instanceof NotFound) return respondNotFound(e.message);
        else if (e instanceof InvalidZod) return respondBadRequest(e.zodError);
        else if (e instanceof Invalid) return respondBadRequest(e.message);
        else if (e instanceof DetaBaseError) return respondInternalError(e.message);

        console.error(e);
        return respondInternalError("Internal error");
    }

    /*const project = await db_projects.get(projectID);
    if (!project) return respondNotFound(`Project ${projectID} not found!`);

    const pendingEvent: Omit<IEvent, "key" | "createdAt" | "v"> = {
        project: reqBody.project,
        channel: reqBody.channel,
        eventName: reqBody.eventName,
        notify: reqBody.notify || true,
        icon: reqBody.icon || "🔔",
        parser: reqBody.parser || "text",

        title: reqBody.title,
        description: reqBody.description || "",
        tags: reqBody.tags || {}
    }

    const createRes = await serverCreateEvent(pendingEvent, project);
    if (!createRes) return respondInternalError("Failed to create event!");*/


    return buildResponse().status(200).statusText("OK").json(newEvent).build();
}) satisfies RequestHandler;
