import type { IResponse } from "$lib/api/IResponse";
import { deta } from "$lib/server/deta";
import type { IChannel, IProject } from "$lib/types/IProject";
import { error } from "@sveltejs/kit";

import type { RequestHandler } from "./$types";

const db_projects = deta.Base("projects");

export const POST = (async ({ params, request }) => {
    const { projectID } = params;
    const reqBody = await request.json();

    let project: IProject;
    try {
        // @ts-ignore -> Deta SDK shitting itself but we good :)
        project = (await db_projects.get(projectID)) as IProject;
    } catch (err) {
        console.error(err);
        throw error(404, "Project does not exist!");
    }

    if (project.channels.findIndex((e) => e.name === reqBody.name) !== -1) {
        throw error(400, "Channel name already taken!");
    }

    // TODO: zod validate reqBody
    // TODO: Check project already exists

    let pendingChannel: IChannel = {
        name: reqBody.name,
        notify: reqBody.notify
    };

    project.channels.push(pendingChannel);

    try {
        // @ts-ignore -> Deta SDK shitting itself but we good :)
        delete project.key;
        // @ts-ignore -> Deta SDK shitting itself but we good :)
        await db_projects.update(project, project.id);
    } catch (err) {
        console.error(err);
        throw error(500, "Internal error!");
    }

    const response = new Response(JSON.stringify({ ok: true } as IResponse), {
        headers: {
            "content-type": "application/json"
        }
    });

    return response;
}) satisfies RequestHandler;
