import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load = (async ({  }) => {
    throw redirect(303, "/app/feed");
    return {};
}) satisfies LayoutServerLoad;