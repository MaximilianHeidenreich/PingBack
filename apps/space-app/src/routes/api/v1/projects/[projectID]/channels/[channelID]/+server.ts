import { db_projects } from "$lib/server/deta";
import { buildResponse, respondInternalError, respondNotFound } from "$lib/server/responseHelper";
import type { IProject } from "@pingback/shared";
import { sanitizeProjectIdInternal } from "$lib/utils/sanitizers";
import type { RequestHandler } from "./$types";

export const DELETE = (async ({ params }) => {
    const { projectID, channelID } = params;

    let project: IProject | null;
    try {
        project = await db_projects.get(sanitizeProjectIdInternal(projectID));
    } catch (err) {
        console.error(err);
        return respondInternalError("Could not get project!");
    }

    if (!project) {
        return respondNotFound(`Project ${projectID} not found!`);
    }
    if (!project.channels.find((e) => e.id === channelID)) {
        return respondNotFound(`Channel ${channelID} not found!`);
    }

    project.channels = project.channels.filter((e) => e.id !== channelID);

    try {
        await db_projects.update(project, project.key);
    } catch (err) {
        console.error(err);
        return respondInternalError("Could not update project to delete channel!");
    }

    return buildResponse().status(200).statusText("OK").json({}).build();
}) satisfies RequestHandler;
