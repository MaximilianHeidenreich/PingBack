import { db_apiKeys, db_projects } from "$lib/server/deta";
import { buildResponse, respondBadRequest, respondInternalError, respondNotFound } from "$lib/server/responseHelper";
import { ZApiKeyDisplayName, type IApiKey } from "$lib/types/IApiKey";
import { ZProjectDisplayName } from "@pingback/shared";
import { z } from "zod";
import type { RequestHandler } from "./$types";

const ZPostBody = z.object({
    project: ZProjectDisplayName,
    displayName: ZApiKeyDisplayName
});

export const POST = (async ({ request }) => {
    const reqBody = await request.json();

    // TODO; Validate
    const parseRes = ZPostBody.safeParse(reqBody);
    if (!parseRes.success) {
        // TODO: Prettify errror
        return respondBadRequest(parseRes.error);
    }
    const { data } = parseRes;

    // Check project
    try {
        const project = db_projects.get(data.project);
        if (!project) return respondNotFound("Project ${data.project} not found!");
    } catch (e) {
        console.error(e);
        return respondInternalError("Could not get project to validate request.");
    }

    const pendingKey: IApiKey = {
        key: crypto.randomUUID(),
        createdAt: Date.now(),
        project: data.project,
        displayName: data.displayName
    };

    let newKey;
    try {
        newKey = await db_apiKeys.put(pendingKey, pendingKey.key);
    }
    catch (e) {
        // if (e instanceof NotFound) return respondNotFound(e.message);
        // else if (e instanceof InvalidZod) return respondBadRequest(e.zodError);
        // else if (e instanceof Invalid) return respondBadRequest(e.message);
        // else if (e instanceof DetaBaseError) return respondInternalError(e.message);
        //
        console.error(e);
        return respondInternalError("Internal error");
    }

    return buildResponse().status(200).statusText("OK").json(newKey).build();
}) satisfies RequestHandler;
