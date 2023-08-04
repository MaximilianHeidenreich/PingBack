import { db_timeFrames } from "$lib/server/deta";
import { buildResponse, respondInternalError, respondNotFound } from "$lib/server/responseHelper";
import type { ITimeFrame } from "$lib/types/ITimeFrame";
import type { RequestHandler } from "./$types";

export const GET = (async ({ params }) => {
    const { key } = params;

    let timeFrame: ITimeFrame | null;
    try {
        timeFrame = await db_timeFrames.get(key);
    } catch (err) {
        console.error(err);
        return respondInternalError("Could not get timeFrame!");
    }

    if (!timeFrame) {
        return respondNotFound(`TimeFrame ${key} not found!`);
    }

    return buildResponse().status(200).statusText("OK").json(timeFrame).build();
}) satisfies RequestHandler;