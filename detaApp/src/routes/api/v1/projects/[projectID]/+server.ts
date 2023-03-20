import { db_projects } from "$lib/server/deta";
import { buildResponse, respondInternalError } from "$lib/server/responseHelper";
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

    return buildResponse()
        .status(200)
        .statusText("OK")
        .json(project || {})
        .build();
}) satisfies RequestHandler;

export const DELETE = (async ({ params }) => {
    const { projectID } = params;

    try {
        db_projects.delete(sanitizeProjectIdInternal(projectID));
    } catch (err) {
        console.error(err);
        return respondInternalError("Could not delete project!");
    }

    return buildResponse().status(200).statusText("OK").json({}).build();
}) satisfies RequestHandler;
