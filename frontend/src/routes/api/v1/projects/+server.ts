import { Invalid, InvalidZod } from "$lib/errors/core";
import { db_projects } from "$lib/server/deta";
import { server_CreateProject } from "$lib/server/project";
import { buildResponse, respondBadRequest, respondInternalError } from "$lib/server/responseHelper";
import type { IProject } from "$lib/types/IProject";
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
        result = await db_projects.fetch(query || {}, queryOptions);
    } catch (err) {
        console.error(err);
        return respondInternalError("Failed to fetch projects from database!");
    }

    return buildResponse().status(200).statusText("OK").json(result).build();
}) satisfies RequestHandler;

export const POST = (async ({ request }) => {
    const reqBody = await request.json();
    const displayName = reqBody.displayName.trim();


    let newProject: IProject;
    try {
        newProject = await server_CreateProject(reqBody);
    } catch (e) {
        if (e instanceof InvalidZod) return respondBadRequest(e);
        if (e instanceof Invalid) return respondBadRequest(e); // TODO: better response
        console.error(e)
        return respondInternalError(e as string);
    }


    /*let pendingProject: Omit<IProject, "key"> = {
        createdAt: Date.now(),
        contentHash: crypto.randomUUID(),
        latestEventTimestamp: Date.now(),
        eventSpecifiers: { "_internal" : 0 },
        displayName,
        channels: []
    };

    try {
        await db_projects.insert(pendingProject as IProject, key);
    } catch (err) {
        // TODO: only handle duplicate key error
        return respondBadRequest("Project key already exists!");
    }*/

    return buildResponse()
        .status(200)
        .statusText("OK")
        .json(newProject)
        .build();
}) satisfies RequestHandler;
