import { db_events, db_projects, db_system, DB_SYS_KEY } from "$lib/server/deta";
import { buildResponse, respondBadRequest, respondInternalError, respondNotFound } from "$lib/server/responseHelper";
import type { IEvent } from "$lib/types/IEvent";
import { VERSION } from "$lib/utils/version";
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
    const projectID = reqBody.project;

    // TODO: Validate API KEY
    //Todo impl.
    const p_project = db_projects.get(projectID);
    const p_sysdoc = db_system.get(DB_SYS_KEY);

    const [project, sysdoc] = await Promise.all([p_project, p_sysdoc]);

    if (!sysdoc) {
        console.error("FATAL: System document not found! This should never happen! Please seek support!");
        return respondNotFound("System document not found! This should never happen!");
    }
    if (!project) return respondNotFound("Project not found!");
    if (!project.channels.find((c) => c.id === reqBody.channel)) return respondNotFound("Channel not found!");

    let pendingEvent: IEvent = {
        key: crypto.randomUUID(),
        v: VERSION.major,
        createdAt: Date.now(),

        project: projectID,
        channel: reqBody.channel,
        eventName: reqBody.eventName,
        notify: reqBody.notify || true,
        icon: reqBody.icon || "🔔",
        parser: reqBody.parser || "text",

        title: reqBody.title,
        description: reqBody.description || "",
        tags: reqBody.tags || {}
    }

    // Update project & system meta.
    project.latestEventTimestamp = pendingEvent.createdAt;
    project.channels.find((c) => c.id === reqBody.channel)!.latestEventTimestamp = pendingEvent.createdAt;
    if (!Object.keys(project.eventSpecifiers).includes(pendingEvent.eventName))
        project.eventSpecifiers[pendingEvent.eventName] = 1;
    else project.eventSpecifiers[pendingEvent.eventName] += 1;

    sysdoc.totalEvents += 1;
    sysdoc.updatedAt = Date.now();

    try {
        await db_projects.update(project, project.key);
    }
    catch (err) {
        console.error(err);
        return respondInternalError("Failed to update project!");
    }

    let newEvent;
    try {
        newEvent = await db_events.put(pendingEvent, pendingEvent.key); // TODO: Revert project on err?
    }
    catch (err) {
        console.error(err);
        return respondInternalError("Failed to create event!");
    }

    return buildResponse().status(200).statusText("OK").json(newEvent).build();
}) satisfies RequestHandler;
