import { db_system, DB_SYS_KEY } from "$lib/server/deta";
import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load = (async ({  }) => {
    const sysdoc = await db_system.get(DB_SYS_KEY);
    // TOOD: handle no sysdoc
    if (!sysdoc) throw "nosysdoc";

    if (!sysdoc.finishedWelcomeTour) {
        throw redirect(303, "/welcome");
    }

    return {};
}) satisfies LayoutServerLoad;
