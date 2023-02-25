import type { IResponse } from "$lib/api/IResponse";
import { deta } from "$lib/server/deta";
import type { IApiKey } from "$lib/types/IApiKey";
import type { IEvent } from "$lib/types/IEvent";
import { error } from "@sveltejs/kit";
import type { FetchResponse } from "deta/dist/types/types/base/response";
import type { RequestHandler } from "../$types";

const db_apikeys = deta.Base("apiKeys");

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
        result = await db_apikeys.fetch(query, queryOptions);
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
    // TODO: Check project exists
    // TODO: Check channel exists

    let pendingApiKey: IApiKey = {
        apiKey: crypto.randomUUID(),
        createdAt: Date.now(),
        name: reqBody.name,
        project: reqBody.project,
    }

    try {
        // @ts-ignore -> Deta SDK shitting itself but we good :)
        await db_apikeys.put(pendingApiKey, pendingApiKey.apiKey);
    }
    catch (err) {
        console.error(err);
        throw error(500, "Internal error!");
    }

    const response = new Response(JSON.stringify({ ok: true, data: pendingApiKey } as IResponse), {
        headers: {
            "content-type": "application/json",
        }
    });

    return response;
}) satisfies RequestHandler;
