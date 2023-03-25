import { db_system, DB_SYS_KEY } from "$lib/server/deta";
import { buildResponse, respondInternalError, respondNotFound } from "$lib/server/responseHelper";
import type { ISystemDoc } from "$lib/types/ISystemDoc";
import type { RequestHandler } from "./$types";

export const GET = (async () => {
    let sysdoc: ISystemDoc | null;
    try {
        sysdoc = await db_system.get(DB_SYS_KEY);
    } catch (err) {
        console.error(err);
        return respondInternalError("Could not get sysdoc!");
    }

    if (!sysdoc) {
        return respondNotFound(`SysDoc not found probably fatal!`);
    }

    return buildResponse().status(200).statusText("OK").json(sysdoc).build();
}) satisfies RequestHandler;