import { db_projects } from "$lib/server/deta";
import { buildResponse, respondBadRequest, respondInternalError } from "$lib/server/responseHelper";
import type { IProject } from "$lib/types/IProject";
import { sanitizeProjectIdInternal } from "$lib/utils/sanitizers";
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

    // TOOD: Validate

    const displayName = reqBody.displayName.trim();
    const key = sanitizeProjectIdInternal(reqBody.key);

    let pendingProject: Omit<IProject, "key"> = {
        createdAt: Date.now(),
        contentHash: crypto.randomUUID(),
        latestEventTimestamp: Date.now(),
        eventSpecifiers: {},
        displayName,
        channels: []
    };

    try {
        await db_projects.insert(pendingProject as IProject, key);
    } catch (err) {
        // TODO: only handle duplicate key error
        return respondBadRequest("Project key already exists!");
    }

    return buildResponse()
        .status(200)
        .statusText("OK")
        .json({ ...pendingProject, key })
        .build();
}) satisfies RequestHandler;
