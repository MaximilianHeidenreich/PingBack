import { db_projects } from "$lib/server/deta";
import { server_DeleteProject } from "$lib/server/project";
import { buildResponse, respondInternalError, respondNotFound } from "$lib/server/responseHelper";
import { sanitizeProjectIdInternal } from "$lib/utils/sanitizers";
import type { RequestHandler } from "./$types";

export const GET = (async ({ params }) => {
    const { projectID } = params;

    // TOOD: Validate

    let project;
    try {
        project = await db_projects.get(sanitizeProjectIdInternal(projectID));
    } catch (err) {
        console.error(err);
        return respondInternalError("Could not get project!");
    }
    if (!project) return respondNotFound(`Project ${sanitizeProjectIdInternal(projectID)} not found!`);

    return buildResponse()
        .status(200)
        .statusText("OK")
        .json(project)
        .build();
}) satisfies RequestHandler;

export const DELETE = (async ({ params }) => {
    const { projectID } = params;

    try {
        await server_DeleteProject(sanitizeProjectIdInternal(projectID));
    } catch (e) {
        console.error(e);
        return respondInternalError(`Could not perform delete of project ${sanitizeProjectIdInternal(projectID)}!`);
    }

    return buildResponse()
        .status(200)
        .statusText("OK")
        .json({})
        .build();
}) satisfies RequestHandler;
