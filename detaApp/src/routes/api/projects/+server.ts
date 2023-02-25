import type { IResponse } from "$lib/api/IResponse";
import { deta } from "$lib/server/deta";
import type { IProject } from "$lib/types/IProject";
import { sanitizeProjectIdInternal } from "$lib/utils/sanitizers";
import { error } from "@sveltejs/kit";
import type { FetchResponse } from "deta/dist/types/types/base/response";
import type { RequestHandler } from "../$types";

const db_projects = deta.Base("projects");

export const GET = (async ({ url }) => {
    const queryRaw = url.searchParams.get("query") || undefined;
    const limit = url.searchParams.get("limit") || 50;
    const last = url.searchParams.get("last") || undefined;

    let query: Record<string, unknown> | Record<string | number | symbol, never> = {};
    if (queryRaw) {
        try {
            query = JSON.parse(Buffer.from(queryRaw, "base64").toString());//atob(queryRaw));
        }
        catch (err) {
            console.error(err);
            throw error(400, "Invalid query!");
        }
    }
    
    const queryOptions: { [key: string]: unknown } = {};
    if (limit) queryOptions["limit"] = Number(limit);
    if (last) queryOptions["last"] = last;

    let result: FetchResponse;
    try {
        //@ts-ignore - Deta SDK is shitting itself but we good :)
        result = await db_projects.fetch(query, queryOptions);
    }
    catch (err) {
        console.error(err);
        throw error(500, "Internal error!");
    }

    const response = new Response(JSON.stringify({ ok: true, data: result } as IResponse), {
        headers: {
            "content-type": "application/json",
        }
    });

    return response;
}) satisfies RequestHandler;

export const POST = (async ({ url, request }) => {
    const reqBody = await request.json();

    // TODO: zod validate reqBody

    const name = sanitizeProjectIdInternal(reqBody.name);

    // TODO: Check project already exists

    let pendingProject: IProject = {
        id: name,   // TODO: Look into removing internal id prop in obj -> onyly if query by key is possible
        createdAt: Date.now(),

        name: name,
        channels: [],
    }

    try {
        // @ts-ignore -> Deta SDK shitting itself but we good :)
        await db_projects.put(pendingProject, name);
    }
    catch (err) {
        console.error(err);
        throw error(500, "Internal error!");
    }

    const response = new Response(JSON.stringify({ ok: true } as IResponse), {
        headers: {
            "content-type": "application/json",
        }
    });

    return response;
}) satisfies RequestHandler;
