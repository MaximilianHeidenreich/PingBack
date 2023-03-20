import { db_projects } from "$lib/server/deta";
import { buildResponse, respondInternalError, respondNotFound } from "$lib/server/responseHelper";
import type { IChannel } from "$lib/types/IChannel";
import type { IProject } from "$lib/types/IProject";
import { sanitizeProjectIdInternal } from "$lib/utils/sanitizers";
import type { RequestHandler } from "./$types";

export const POST = (async ({ request, params }) => {
    const { projectID } = params;
    const reqBody = await request.json();

    let project: IProject | null;
    try {
         project = await db_projects.get(sanitizeProjectIdInternal(projectID));
    }
    catch (err) {
        console.error(err);
        return respondInternalError("Could not get project!");
    }

    if (!project) {
        return respondNotFound(`Project ${projectID} not found!`);
    }

    // Check if channel already exists
    // TODO: 409

    const pendingChannel: IChannel = {
        id: reqBody.id,
        latestEventTimestamp: Date.now(),
        notify: reqBody.notify || true,
    }

    project.channels.push(pendingChannel);

    try {
        await db_projects.update(project, project.key);
    }
    catch (err) {
        console.error(err);
        return respondInternalError("Could not update project to create channel!");
    }

    return buildResponse()
        .status(200)
        .statusText("OK")
        .json(pendingChannel)
        .build();

}) satisfies RequestHandler;