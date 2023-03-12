import type { IResponse } from "$lib/api/IResponse";
import { deta } from "$lib/server/deta";
import type { IProject } from "$lib/types/IProject";
import { error } from "@sveltejs/kit";

import type { RequestHandler } from "./$types";

const db_projects = deta.Base("projects");

export const GET = (async ({ url, params }) => {
    const projectID = params.projectID;

    let result: IProject | null;
    try {
        //@ts-ignore - Deta SDK is shitting itself but we good :)
        result = await db_projects.get(projectID);
    } catch (err) {
        console.error(err);
        throw error(500, "Internal error!");
    }
    // TODO: 404 if not found

    const response = new Response(JSON.stringify({ ok: true, data: result } as IResponse), {
        headers: {
            "content-type": "application/json"
        }
    });

    return response;
}) satisfies RequestHandler;