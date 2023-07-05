import { buildResponse } from "$lib/server/responseHelper";
import type { RequestHandler } from "./$types";

export const GET = (async ({ request }) => {
    return buildResponse()
        .status(200)
        .statusText("OK")
        .json({
            actions: [
                {
                    name: "list_events",
                    title: "List Events",
                    path: "/actions/list_events",
                    output: "@deta/list"
                },
                {
                    name: "live_feed",
                    title: "Live Feed",
                    path: "/actions/list_events",
                    output: "/actions/live_feed"
                }
            ]
        })
        .build();
}) satisfies RequestHandler;
