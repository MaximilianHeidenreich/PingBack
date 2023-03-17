import { db_projects } from "$lib/server/deta";
import { buildResponse, respondBadRequest, respondInternalError } from "$lib/server/responseHelper";
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

    return buildResponse()
        .status(200)
        .statusText("OK")
        .json(result)
        .build();

}) satisfies RequestHandler;