import { db_system, DB_SYS_KEY } from "$lib/server/deta";
import { DEFAULT_SYSTEM_DOC } from "$lib/types/ISystemDoc";
import type { LayoutServerLoad } from "./$types";

export const load = (async ({  }) => {
    const sysdoc = await db_system.get(DB_SYS_KEY);
    if (!sysdoc) {
        console.log("SYSDOC not found! Creating default one!");
        await db_system.put(DEFAULT_SYSTEM_DOC(), DB_SYS_KEY);
    }

    return {};
}) satisfies LayoutServerLoad;